# Frontend - Task Portal UI

React application with Tailwind CSS and AI integration.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Configure Gemini API key in `src/App.jsx`:
```javascript
const GEMINI_API_KEY = 'YOUR_API_KEY_HERE';
```

3. Run development server:
```bash
npm run dev
```

Visit: http://localhost:5173

## Features

### Authentication
- Login/Register forms with validation
- JWT token storage in localStorage
- Automatic authentication on page load

### Task Management
- Create, read, update, delete tasks
- Kanban board with 3 columns (TODO, IN_PROGRESS, DONE)
- Status change with button clicks
- Priority badges (HIGH, MEDIUM, LOW)
- Estimated time display

### AI Integration
- Click "AI Assist" button when creating a task
- Generates description, priority, and estimated time
- Graceful fallback on API failure
- Uses Google Gemini 2.0 Flash model

### Blockchain Display
- Shows mocked blockchain hash on each task card
- Truncated display for better UI
- Updates on task modification

## Components Structure

```
App.jsx
├── Authentication Screen
│   ├── Login Form
│   └── Register Form
├── Main Dashboard
│   ├── Header (with logout)
│   ├── Kanban Board
│   │   ├── TODO Column
│   │   ├── IN_PROGRESS Column
│   │   └── DONE Column
│   └── Task Card
│       ├── Title
│       ├── Description
│       ├── Priority Badge
│       ├── Time Estimate
│       ├── Blockchain Hash
│       └── Action Buttons
└── Task Modal
    ├── Form Fields
    ├── AI Assist Button
    └── Submit/Cancel Buttons
```

## API Integration

All API calls use the base URL: `http://localhost:8080/api`

### Authentication
```javascript
// Register
fetch(`${API_BASE}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, email, password })
})

// Login
fetch(`${API_BASE}/auth/login`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ username, password })
})
```

### Tasks
```javascript
// All task requests include JWT token
headers: {
  'Authorization': `Bearer ${token}`
}
```

## Styling

Uses Tailwind CSS utility classes:
- Responsive grid layout
- Gradient backgrounds
- Shadow effects
- Hover transitions
- Color-coded priority badges

## AI Configuration

### Get Gemini API Key
1. Visit: https://makersuite.google.com/app/apikey
2. Create new API key
3. Copy and paste into `App.jsx`

### AI Prompt Structure
```javascript
const prompt = `Given a task title: "${taskForm.title}", generate a JSON response with:
- description: A detailed task description (2-3 sentences)
- priority: Either "LOW", "MEDIUM", or "HIGH"
- estimatedTime: Estimated time in minutes (number only)

Respond ONLY with valid JSON in this exact format:
{"description":"...","priority":"...","estimatedTime":...}`;
```

## Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## Environment Variables (Optional)

Create `.env` file:
```env
VITE_API_BASE=http://localhost:8080/api
VITE_GEMINI_API_KEY=your_key_here
```

Then update App.jsx:
```javascript
const API_BASE = import.meta.env.VITE_API_BASE;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
```

## Icons

Uses Lucide React for icons:
- Plus (New Task)
- LogOut (Logout)
- Sparkles (AI Assist)
- Clock (Time Estimate)
- Hash (Blockchain)
- Trash2 (Delete)
- Edit (Edit Task)
- CheckCircle, Circle, AlertCircle (Status icons)
