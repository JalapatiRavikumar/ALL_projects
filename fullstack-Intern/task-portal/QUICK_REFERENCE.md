# ⚡ Quick Reference Card - AI Task Portal

## 🚀 Quick Start Commands

### Database Setup
```bash
# Start PostgreSQL
# Windows: Services → Start PostgreSQL
# Mac: brew services start postgresql
# Linux: sudo service postgresql start

# Create database
psql -U postgres
CREATE DATABASE taskportal;
\q
```

### Backend (Terminal 1)
```bash
cd backend
mvn spring-boot:run
# Backend runs on: http://localhost:8080
```

### Frontend (Terminal 2)
```bash
cd frontend
npm install  # First time only
npm run dev
# Frontend runs on: http://localhost:5173
```

---

## 🔑 Important Configuration

### Database Credentials
**File**: `backend/src/main/resources/application.properties`
```properties
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Gemini API Key
**File**: `frontend/src/components/CreateTaskModal.jsx` (Line 11)
```javascript
const GEMINI_API_KEY = 'YOUR_ACTUAL_API_KEY';
```
Get key: https://makersuite.google.com/app/apikey

---

## 📡 API Endpoints

### Authentication (No JWT Required)
```bash
POST /api/auth/register
POST /api/auth/login
```

### Tasks (JWT Required in Authorization Header)
```bash
GET    /api/tasks          # Get all user tasks
GET    /api/tasks/{id}     # Get specific task
POST   /api/tasks          # Create task
PUT    /api/tasks/{id}     # Update task
DELETE /api/tasks/{id}     # Delete task
```

---

## 🧪 Test with cURL

### Register User
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@test.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### Create Task (Replace TOKEN)
```bash
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"title":"Test","priority":"HIGH","status":"TODO"}'
```

---

## 🐛 Common Errors & Fixes

| Error | Solution |
|-------|----------|
| **Port 8080 in use** | Kill process: `netstat -ano \| findstr :8080` then `taskkill /PID xxx /F` |
| **PostgreSQL not found** | Start service in Windows Services or `brew services start postgresql` |
| **JWT parsing error** | Clear browser localStorage and re-login |
| **CORS error** | Check SecurityConfig.java allows `http://localhost:5173` |
| **AI Assist fails** | Verify Gemini API key is valid and internet is connected |
| **Module not found** | Run `cd frontend && npm install` |

---

## 📂 Key Files to Know

### Backend
- `TaskPortalApplication.java` - Main entry point
- `SecurityConfig.java` - CORS & JWT configuration
- `TaskService.java` - Blockchain hash generation
- `application.properties` - Database & JWT settings

### Frontend
- `App.jsx` - Main component with auth routing
- `CreateTaskModal.jsx` - AI integration here
- `KanbanBoard.jsx` - Main task board
- `package.json` - Dependencies

---

## 🎨 UI Features

### Login/Register
- Login: Username + Password
- Register: Username + Email + Password
- Auto-redirect to board on success

### Kanban Board
- 3 Columns: TODO, IN_PROGRESS, DONE
- Move tasks with arrow buttons
- Delete with trash icon
- Blockchain hash displayed on each card

### Create Task Modal
- Fill title
- Click "AI Assist" for auto-generation
- Description, priority, time auto-filled
- Submit to create

---

## 🔐 Security Features

- JWT authentication (24-hour expiration)
- BCrypt password hashing
- User isolation (can only see own tasks)
- CORS protection
- Input validation (@Valid, @NotBlank)

---

## 🎯 Evaluation Checklist

Before demo:
- [ ] Backend starts without errors (port 8080)
- [ ] Frontend starts without errors (port 5173)
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Can create task
- [ ] AI Assist generates suggestions
- [ ] Can move tasks between columns
- [ ] Can delete tasks
- [ ] Blockchain hash shows on cards
- [ ] JWT token in localStorage
- [ ] No console errors

---

## 💾 Database Access

### View Users
```sql
psql -U postgres -d taskportal
SELECT * FROM users;
```

### View Tasks
```sql
SELECT id, title, status, priority, blockchain_hash, user_id FROM tasks;
```

### Reset Database
```sql
DROP DATABASE taskportal;
CREATE DATABASE taskportal;
```

---

## 📦 Dependencies

### Backend (pom.xml)
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- PostgreSQL Driver
- JJWT (JWT library 0.11.5)
- Lombok

### Frontend (package.json)
- react, react-dom
- vite
- tailwindcss
- lucide-react (icons)

---

## 🎓 Architecture Overview

```
User Browser (React)
    ↓
    ↓ HTTP + JWT
    ↓
Spring Boot Backend
    ↓
    ├─ JwtAuthenticationFilter (validates token)
    ├─ Controller (REST endpoints)
    ├─ Service (business logic + blockchain)
    ├─ Repository (JPA)
    ↓
PostgreSQL Database
```

---

## 🤖 AI Integration

**Model**: gemini-2.0-flash-exp

**Prompt Structure**:
```
Given task title: "..."
Generate: description, priority, estimatedTime
Return JSON only: {"description": "...", "priority": "...", "estimatedTime": "..."}
```

**Fallback**: Manual input if API fails

---

## 📊 Project Stats

- **Backend Lines**: ~1,500 (Java)
- **Frontend Lines**: ~800 (React/JSX)
- **Total Files**: ~30
- **API Endpoints**: 7
- **Database Tables**: 2 (users, tasks)
- **Components**: 5 (Login, Register, Board, Card, Modal)

---

## 🏆 Key Features Implemented

✅ JWT Authentication  
✅ RESTful API with Spring Boot  
✅ Kanban Board UI  
✅ AI Task Generation (Gemini)  
✅ Blockchain Hash Tracking  
✅ User Isolation  
✅ Input Validation  
✅ Exception Handling  
✅ Responsive Design  
✅ CORS Configuration  

---

## 📞 Support

If issues persist:
1. Check backend logs in terminal
2. Check browser DevTools console
3. Verify PostgreSQL is running
4. Confirm ports 8080 & 5173 are free
5. Review SETUP_GUIDE.md for detailed steps

---

**Built with ❤️ for Full Stack Internship Application**
