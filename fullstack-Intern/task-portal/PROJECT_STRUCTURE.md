# 📂 Complete Project Structure

```
fullstack-Intern/
│
├── 📁 backend/                          # Spring Boot Backend
│   ├── 📁 src/
│   │   ├── 📁 main/
│   │   │   ├── 📁 java/com/taskportal/
│   │   │   │   ├── 📄 TaskPortalApplication.java    # Main Spring Boot entry point
│   │   │   │   │
│   │   │   │   ├── 📁 controller/                   # REST API Controllers
│   │   │   │   │   ├── 📄 AuthController.java       # /api/auth/register, /api/auth/login
│   │   │   │   │   └── 📄 TaskController.java       # /api/tasks/** CRUD endpoints
│   │   │   │   │
│   │   │   │   ├── 📁 entity/                       # JPA Entities (Database Models)
│   │   │   │   │   ├── 📄 User.java                 # User table (id, username, email, password)
│   │   │   │   │   └── 📄 Task.java                 # Task table (id, title, description, status, priority, estimatedTime, blockchainHash)
│   │   │   │   │
│   │   │   │   ├── 📁 repository/                   # Data Access Layer (JPA Repositories)
│   │   │   │   │   ├── 📄 UserRepository.java       # User CRUD operations
│   │   │   │   │   └── 📄 TaskRepository.java       # Task CRUD operations (findByUserId, etc.)
│   │   │   │   │
│   │   │   │   ├── 📁 service/                      # Business Logic Layer
│   │   │   │   │   ├── 📄 TaskService.java          # Task business logic (blockchain hash generation)
│   │   │   │   │   └── 📄 CustomUserDetailsService.java  # Spring Security user loading
│   │   │   │   │
│   │   │   │   ├── 📁 security/                     # JWT & Security Configuration
│   │   │   │   │   ├── 📄 JwtUtil.java              # JWT token generation & validation
│   │   │   │   │   ├── 📄 JwtAuthenticationFilter.java  # Intercepts requests, validates Bearer token
│   │   │   │   │   └── 📄 SecurityConfig.java       # Spring Security config (CORS, CSRF, endpoints)
│   │   │   │   │
│   │   │   │   ├── 📁 dto/                          # Data Transfer Objects
│   │   │   │   │   ├── 📄 AuthRequest.java          # Login request (username, password)
│   │   │   │   │   ├── 📄 AuthResponse.java         # Login/Register response (token, username, email)
│   │   │   │   │   ├── 📄 RegisterRequest.java      # Registration request (username, email, password)
│   │   │   │   │   ├── 📄 TaskRequest.java          # Task creation/update request
│   │   │   │   │   └── 📄 TaskResponse.java         # Task response with all fields
│   │   │   │   │
│   │   │   │   └── 📁 exception/                    # Global Exception Handling
│   │   │   │       └── 📄 GlobalExceptionHandler.java  # Handles validation & runtime exceptions
│   │   │   │
│   │   │   └── 📁 resources/
│   │   │       └── 📄 application.properties        # Database, JWT, server configuration
│   │   │
│   │   └── 📁 test/
│   │       └── 📁 java/com/taskportal/
│   │           └── 📄 TaskPortalApplicationTests.java  # Basic Spring Boot test
│   │
│   └── 📄 pom.xml                                   # Maven dependencies (Spring Boot, JWT, PostgreSQL, Lombok)
│
├── 📁 frontend/                         # React + Vite Frontend
│   ├── 📁 src/
│   │   ├── 📁 components/                          # React Components
│   │   │   ├── 📄 Login.jsx                        # Login form component
│   │   │   ├── 📄 Register.jsx                     # Registration form component
│   │   │   ├── 📄 KanbanBoard.jsx                  # Main Kanban board with 3 columns
│   │   │   ├── 📄 TaskCard.jsx                     # Individual task card with move/delete
│   │   │   └── 📄 CreateTaskModal.jsx              # Task creation modal with AI Assist
│   │   │
│   │   ├── 📄 App.jsx                              # Main app component (auth routing)
│   │   ├── 📄 main.jsx                             # React entry point
│   │   └── 📄 index.css                            # Tailwind CSS imports + custom styles
│   │
│   ├── 📄 index.html                               # HTML entry point
│   ├── 📄 package.json                             # NPM dependencies (React, Vite, Tailwind, Lucide)
│   ├── 📄 vite.config.js                           # Vite configuration
│   ├── 📄 tailwind.config.js                       # Tailwind CSS configuration
│   └── 📄 postcss.config.js                        # PostCSS configuration
│
├── 📄 README.md                                    # Project overview & features
├── 📄 SETUP_GUIDE.md                               # Step-by-step installation instructions
├── 📄 PROJECT_STRUCTURE.md                         # This file - complete directory tree
├── 📄 QUICKSTART.md                                # Quick reference guide
└── 📄 .gitignore                                   # Git ignore rules

```

---

## 🗂 Key File Descriptions

### Backend Files

| File | Purpose | Key Features |
|------|---------|-------------|
| **TaskPortalApplication.java** | Spring Boot entry point | Starts embedded Tomcat server |
| **AuthController.java** | Authentication API | Register & Login endpoints, returns JWT |
| **TaskController.java** | Task management API | CRUD operations with JWT auth |
| **User.java** | User database entity | 1:N relationship with Tasks |
| **Task.java** | Task database entity | Contains blockchain hash field |
| **TaskService.java** | Business logic | Generates SHA-256 blockchain hash |
| **JwtUtil.java** | JWT utility | Token generation using JJWT library |
| **JwtAuthenticationFilter.java** | Request interceptor | Validates Bearer token, sets SecurityContext |
| **SecurityConfig.java** | Security configuration | Disables CSRF, enables CORS for localhost:5173 |
| **application.properties** | App configuration | Database URL, JWT secret, server port |

### Frontend Files

| File | Purpose | Key Features |
|------|---------|-------------|
| **App.jsx** | Main application | Auth state management, routing |
| **Login.jsx** | Login UI | Calls /api/auth/login, stores JWT |
| **Register.jsx** | Registration UI | Calls /api/auth/register |
| **KanbanBoard.jsx** | Task board | Displays 3 columns (TODO, IN_PROGRESS, DONE) |
| **TaskCard.jsx** | Task item | Move left/right, delete, shows blockchain hash |
| **CreateTaskModal.jsx** | Task creation | AI Assist with Gemini API integration |
| **index.css** | Styles | Tailwind imports + gradient background |
| **package.json** | Dependencies | React, Vite, Tailwind, Lucide icons |

---

## 🔗 Data Flow

### Authentication Flow
```
User → Login.jsx → POST /api/auth/login → AuthController 
→ JwtUtil.generateToken() → JWT returned → localStorage 
→ All subsequent requests include Bearer token
```

### Task Creation Flow
```
User → CreateTaskModal → Click "AI Assist" → Gemini API 
→ Auto-fill form → POST /api/tasks → TaskController 
→ TaskService.generateBlockchainHash() → Save to DB 
→ Return task with hash → Display on KanbanBoard
```

### Task Status Update Flow
```
User → Click arrow on TaskCard → PUT /api/tasks/{id} 
→ JwtAuthenticationFilter validates token 
→ TaskController.updateTask() → TaskService.updateTask() 
→ Regenerate blockchain hash → Update DB → Return updated task
```

---

## 🎯 Architecture Highlights

### Backend Architecture (3-Layer)
1. **Controller Layer**: Handles HTTP requests/responses
2. **Service Layer**: Business logic & blockchain hash generation
3. **Repository Layer**: Database operations via Spring Data JPA

### Frontend Architecture (Component-Based)
1. **Authentication Components**: Login, Register
2. **Board Components**: KanbanBoard, TaskCard
3. **Modal Components**: CreateTaskModal with AI integration

### Security Architecture
- **JWT-based authentication**: Stateless token validation
- **Spring Security**: Method-level security with @PreAuthorize
- **CORS**: Configured for frontend origin (localhost:5173)
- **Password Encryption**: BCrypt hashing

### Database Schema
```sql
users (
  id BIGSERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

tasks (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL,
  priority VARCHAR(10) NOT NULL,
  estimated_time VARCHAR(50),
  blockchain_hash VARCHAR(255) UNIQUE,
  user_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

---

## 📊 Technology Stack Summary

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React |
| **Backend** | Spring Boot 3, Spring Security, Spring Data JPA |
| **Database** | PostgreSQL 14+ |
| **Authentication** | JWT (JJWT 0.11.5) |
| **AI Integration** | Google Gemini API (gemini-2.0-flash-exp) |
| **Build Tools** | Maven (Backend), NPM (Frontend) |
| **Java Version** | Java 17 |
| **Node Version** | Node 18+ |

---

## 🚀 Quick Navigation

- **Start Backend**: `cd backend && mvn spring-boot:run`
- **Start Frontend**: `cd frontend && npm run dev`
- **Build Backend**: `cd backend && mvn clean package`
- **Build Frontend**: `cd frontend && npm run build`
- **Test Backend**: `cd backend && mvn test`

---

## 📝 Notes

- All backend endpoints require JWT authentication except `/api/auth/**`
- Frontend stores JWT in localStorage
- Blockchain hash is regenerated on every task update
- AI Assist requires valid Gemini API key
- Database is auto-created by Hibernate (ddl-auto=update)
- CORS is configured for localhost:5173 only

---

**This structure follows industry best practices for full-stack Java/React applications!** 🎉
