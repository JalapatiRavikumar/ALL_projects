// Intercept fetch calls to backend and fallback to localStorage if backend is down or if not running on localhost.

const originalFetch = window.fetch;

// Helper to check if the backend is running
let isBackendAvailable = true;

// Determine if we are running locally
const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

// Function to generate a mock 64-char hex string matching SHA-256 style
const generateMockHash = () => {
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
};

// Check database initialization
if (!localStorage.getItem('mock_users')) {
  localStorage.setItem('mock_users', JSON.stringify([]));
}
if (!localStorage.getItem('mock_tasks')) {
  localStorage.setItem('mock_tasks', JSON.stringify([]));
}

const getMockUsers = () => JSON.parse(localStorage.getItem('mock_users'));
const saveMockUsers = (users) => localStorage.setItem('mock_users', JSON.stringify(users));

const getMockTasks = () => JSON.parse(localStorage.getItem('mock_tasks'));
const saveMockTasks = (tasks) => localStorage.setItem('mock_tasks', JSON.stringify(tasks));

// Helper to verify JWT token and get user
const getUserByToken = (headers) => {
  const authHeader = headers['Authorization'] || headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(' ')[1];
  if (!token.startsWith('mock-jwt-token-for-')) return null;
  const username = token.replace('mock-jwt-token-for-', '');
  const users = getMockUsers();
  return users.find(u => u.username === username);
};

// Intercept window.fetch
window.fetch = async function (input, init) {
  const url = typeof input === 'string' ? input : (input.url || '');
  
  // Only intercept task portal backend API calls
  if (url.includes(':8080/api/')) {
    // If not local or if we previously detected backend is down, run mock
    if (!isLocal || !isBackendAvailable) {
      return handleMockRequest(url, init);
    }
    
    // Otherwise, try the real fetch
    try {
      const response = await originalFetch(input, init);
      return response;
    } catch (error) {
      console.warn("Real backend is unreachable. Falling back to local storage mock API.", error);
      isBackendAvailable = false;
      
      // Notify user visually about running in demo mode
      showDemoModeToast();
      
      return handleMockRequest(url, init);
    }
  }
  
  // For other requests (like OpenRouter, etc.), use original fetch
  return originalFetch(input, init);
};

// Toast notification
function showDemoModeToast() {
  if (document.getElementById('demo-mode-toast')) return;
  const toast = document.createElement('div');
  toast.id = 'demo-mode-toast';
  toast.className = 'fixed bottom-4 right-4 bg-yellow-600 text-white px-4 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2 border border-yellow-500 font-medium animate-bounce';
  toast.innerHTML = `
    <span>⚠️ Running in Demo Mode (Local Storage)</span>
    <button onclick="this.parentElement.remove()" class="hover:bg-yellow-700 rounded p-1 ml-2 font-bold">&times;</button>
  `;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.classList.remove('animate-bounce');
  }, 3000);
}

// Check on initial load if we are not on localhost, display the demo mode badge
if (!isLocal) {
  window.addEventListener('DOMContentLoaded', () => {
    showDemoModeToast();
  });
}

// Simulates the backend routes
async function handleMockRequest(url, init = {}) {
  const method = (init.method || 'GET').toUpperCase();
  const headers = init.headers || {};
  const body = init.body ? JSON.parse(init.body) : null;
  
  // Custom Response helpers
  const jsonResponse = (data, status = 200) => {
    return new Response(JSON.stringify(data), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };
  
  const textResponse = (text, status = 200) => {
    // If text is already a string but we want JSON compatibility or just raw text response:
    return new Response(JSON.stringify(text), {
      status,
      headers: { 'Content-Type': 'application/json' }
    });
  };

  // 1. Authentication routes
  if (url.endsWith('/api/auth/register')) {
    const { username, email, password } = body;
    const users = getMockUsers();
    
    if (users.find(u => u.username === username)) {
      return textResponse("Username is already taken", 400);
    }
    if (users.find(u => u.email === email)) {
      return textResponse("Email is already registered", 400);
    }
    
    const newUser = { id: Date.now(), username, email, password };
    users.push(newUser);
    saveMockUsers(users);
    
    return jsonResponse({
      token: `mock-jwt-token-for-${username}`,
      username,
      email
    }, 200);
  }
  
  if (url.endsWith('/api/auth/login')) {
    const { username, password } = body;
    const users = getMockUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
      return textResponse("Invalid username or password", 401);
    }
    
    return jsonResponse({
      token: `mock-jwt-token-for-${username}`,
      username,
      email: user.email
    }, 200);
  }
  
  // 2. Task routes (require auth)
  const currentUser = getUserByToken(headers);
  if (!currentUser) {
    return textResponse("Unauthorized", 401);
  }
  
  // GET /api/tasks
  if (url.endsWith('/api/tasks') && method === 'GET') {
    const tasks = getMockTasks().filter(t => t.userId === currentUser.id);
    return jsonResponse(tasks, 200);
  }
  
  // POST /api/tasks
  if (url.endsWith('/api/tasks') && method === 'POST') {
    const { title, description, priority, estimatedTime } = body;
    const tasks = getMockTasks();
    const newTask = {
      id: Date.now(),
      title,
      description,
      status: 'TODO',
      priority: priority || 'MEDIUM',
      estimatedTime,
      blockchainHash: generateMockHash(),
      userId: currentUser.id
    };
    tasks.push(newTask);
    saveMockTasks(tasks);
    return jsonResponse(newTask, 200);
  }
  
  // PUT /api/tasks/{id} or DELETE /api/tasks/{id}
  const taskMatch = url.match(/\/api\/tasks\/(\d+)$/);
  if (taskMatch) {
    const taskId = parseInt(taskMatch[1]);
    const tasks = getMockTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId && t.userId === currentUser.id);
    
    if (taskIndex === -1) {
      return textResponse("Task not found", 404);
    }
    
    if (method === 'PUT') {
      const { title, description, status, priority, estimatedTime } = body;
      tasks[taskIndex] = {
        ...tasks[taskIndex],
        title,
        description,
        status,
        priority,
        estimatedTime,
        blockchainHash: generateMockHash() // Regenerate hash on update
      };
      saveMockTasks(tasks);
      return jsonResponse(tasks[taskIndex], 200);
    }
    
    if (method === 'DELETE') {
      tasks.splice(taskIndex, 1);
      saveMockTasks(tasks);
      return jsonResponse({ success: true }, 200);
    }
  }
  
  return textResponse("Not Found", 404);
}
