# ⚡ Quick Run Commands

## 🗄️ Database Setup (One-Time)

```bash
# Start PostgreSQL (Windows)
# Go to Services → Find PostgreSQL → Click Start

# OR via command line (if configured)
net start postgresql-x64-14

# Create database
psql -U postgres
CREATE DATABASE taskportal;
\q
```

---

## 🔧 Backend Commands

### First Time Setup
```bash
cd task-portal/backend
mvn clean install
```

### Run Backend
```bash
cd task-portal/backend
mvn spring-boot:run
```

**Expected Output:**
```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2026-06-04 INFO  TaskPortalApplication : Started TaskPortalApplication in 3.456 seconds
```

**Backend is ready at**: `http://localhost:8080`

### Build JAR
```bash
cd task-portal/backend
mvn clean package
java -jar target/task-management-portal-1.0.0.jar
```

---

## 💻 Frontend Commands

### First Time Setup
```bash
cd task-portal/frontend
npm install
```

### Run Frontend (Development)
```bash
cd task-portal/frontend
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

**Frontend is ready at**: `http://localhost:5173`

### Build Frontend (Production)
```bash
cd task-portal/frontend
npm run build
npm run preview
```

---

## 🚀 Complete Startup (Two Terminals)

### Terminal 1 (Backend)
```bash
cd task-portal/backend
mvn spring-boot:run
```
**Wait for**: "Started TaskPortalApplication"

### Terminal 2 (Frontend)
```bash
cd task-portal/frontend
npm run dev
```
**Wait for**: "VITE ready"

### Open Browser
Navigate to: `http://localhost:5173`

---

## 🧪 Test the Application

### 1. Register New User
- Click "Register here"
- Username: `testuser`
- Email: `test@test.com`
- Password: `password123`
- Click "Register"

### 2. Create Task
- Click "New Task"
- Title: `Build authentication system`
- Click "AI Assist" (wait 2-3 seconds)
- Review auto-generated description
- Click "Create Task"

### 3. Manage Task
- Move task using arrow buttons
- View blockchain hash (starts with random hex)
- Delete task using trash icon

---

## 🐛 Stop Servers

### Stop Backend
Press `Ctrl + C` in terminal

### Stop Frontend
Press `Ctrl + C` in terminal

---

## 🔄 Restart After Code Changes

### Backend Changes
```bash
# Stop backend (Ctrl+C)
cd task-portal/backend
mvn clean install
mvn spring-boot:run
```

### Frontend Changes
Frontend auto-reloads on save (Hot Module Replacement)

---

## 📊 Check Status

### Check if Backend is Running
```bash
curl http://localhost:8080/api/auth/login
# Should return: {"timestamp":"...","status":400,...}
```

### Check if Frontend is Running
Open browser: `http://localhost:5173`

### Check if Database is Running
```bash
psql -U postgres -c "SELECT 1;"
```

---

## 🔍 View Logs

### Backend Logs
Available in the terminal where you ran `mvn spring-boot:run`

### Frontend Logs
- Terminal: Build/server logs
- Browser Console (F12): Runtime logs

### Database Logs
```bash
psql -U postgres -d taskportal
SELECT * FROM users;
SELECT * FROM tasks;
```

---

## 🧹 Clean & Rebuild

### Backend Clean Build
```bash
cd task-portal/backend
mvn clean
mvn clean install
mvn spring-boot:run
```

### Frontend Clean Build
```bash
cd task-portal/frontend
rm -rf node_modules
rm package-lock.json
npm install
npm run dev
```

### Reset Database
```bash
psql -U postgres
DROP DATABASE taskportal;
CREATE DATABASE taskportal;
\q
```

---

## 📦 Installation Commands

### Install Java 17
```bash
# Windows: Download from oracle.com or adoptium.net
# Mac: brew install openjdk@17
# Linux: sudo apt install openjdk-17-jdk
```

### Install Maven
```bash
# Windows: Download from maven.apache.org
# Mac: brew install maven
# Linux: sudo apt install maven
```

### Install Node.js
```bash
# Windows: Download from nodejs.org
# Mac: brew install node
# Linux: sudo apt install nodejs npm
```

### Install PostgreSQL
```bash
# Windows: Download from postgresql.org
# Mac: brew install postgresql@14
# Linux: sudo apt install postgresql
```

---

## 🎯 Production Deployment

### Build Backend JAR
```bash
cd task-portal/backend
mvn clean package -DskipTests
# Output: target/task-management-portal-1.0.0.jar
```

### Build Frontend Static Files
```bash
cd task-portal/frontend
npm run build
# Output: dist/ folder
```

### Run Production
```bash
# Backend
java -jar task-portal/backend/target/task-management-portal-1.0.0.jar

# Frontend (serve dist folder with nginx or any web server)
```

---

## ⚙️ Configuration Updates

### Change Database Password
Edit: `task-portal/backend/src/main/resources/application.properties`
```properties
spring.datasource.password=NEW_PASSWORD
```

### Change Ports
**Backend Port** (default 8080):
```properties
# application.properties
server.port=9090
```

**Frontend Port** (default 5173):
```javascript
// vite.config.js
export default defineConfig({
  server: { port: 3000 }
})
```

### Add Gemini API Key
Edit: `task-portal/frontend/src/components/CreateTaskModal.jsx`
```javascript
const GEMINI_API_KEY = 'YOUR_ACTUAL_KEY_HERE';
```

---

## 📞 Troubleshooting Commands

### Port Already in Use

**Windows:**
```bash
# Find process on port 8080
netstat -ano | findstr :8080
# Kill process
taskkill /PID <PID_NUMBER> /F
```

**Mac/Linux:**
```bash
# Find and kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Check Java Version
```bash
java -version
# Should show: openjdk version "17.x.x"
```

### Check Maven Version
```bash
mvn -version
# Should show: Apache Maven 3.8+
```

### Check Node Version
```bash
node -v
# Should show: v18.x.x or higher

npm -v
# Should show: 9.x.x or higher
```

### Check PostgreSQL Status
```bash
# Windows
sc query postgresql-x64-14

# Mac
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql
```

---

## 🎉 Success Indicators

✅ Backend running: Console shows "Started TaskPortalApplication"  
✅ Frontend running: Browser loads at localhost:5173  
✅ Database connected: No connection errors in backend logs  
✅ API working: Can register and login users  
✅ AI working: "AI Assist" generates task details  

---

**All set! Your application is running! 🚀**
