# 🚀 Simple Commands to Run the Project

## ⚠️ PREREQUISITES

### 1. Install Maven (Required for Backend)
Since `mvn` command is not found, you need to install Maven:

**Option A: Using Chocolatey (Recommended for Windows)**
```powershell
# Open PowerShell as Administrator
choco install maven -y
```

**Option B: Manual Installation**
1. Download Maven from: https://maven.apache.org/download.cgi
2. Extract to `C:\Program Files\Apache\maven`
3. Add to PATH:
   - Go to System Properties → Environment Variables
   - Add `C:\Program Files\Apache\maven\bin` to PATH
4. Restart PowerShell and verify: `mvn -version`

### 2. Install PostgreSQL (Required for Database)
1. Download from: https://www.postgresql.org/download/windows/
2. During installation, set password as `password` (or update `application.properties`)
3. Create database:
   ```sql
   psql -U postgres
   CREATE DATABASE taskportal;
   \q
   ```

### 3. Verify Java 17 is Active
```powershell
java -version
# Should show: openjdk 17.0.11
```

**If it shows Java 21 or 25, set JAVA_HOME:**
```powershell
# Find Java 17 path (usually in C:\Program Files\Eclipse Adoptium\jdk-17...)
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.0.11.9-hotspot"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"
```

---

## 🎯 BACKEND COMMANDS (Spring Boot)

### Navigate to backend folder:
```powershell
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\backend
```

### 1️⃣ Clean and Build (First Time)
```powershell
mvn clean install -DskipTests
```

### 2️⃣ Run the Backend Server
```powershell
mvn spring-boot:run
```

✅ **Backend will start on:** http://localhost:8080

---

## 🎨 FRONTEND COMMANDS (React + Vite)

### Navigate to frontend folder:
```powershell
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\frontend
```

### 1️⃣ Install Dependencies (First Time Only)
```powershell
npm install
```

### 2️⃣ Run the Frontend Server
```powershell
npm run dev
```

✅ **Frontend will start on:** http://localhost:5173

---

## 🔥 QUICK START (After Prerequisites)

### Terminal 1 - Backend:
```powershell
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\backend
mvn spring-boot:run
```

### Terminal 2 - Frontend:
```powershell
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\frontend
npm run dev
```

### Open Browser:
```
http://localhost:5173
```

---

## 🛠️ TROUBLESHOOTING

### Problem: `mvn: command not found`
**Solution:** Install Maven using instructions above

### Problem: Backend fails with "database does not exist"
**Solution:**
```sql
psql -U postgres
CREATE DATABASE taskportal;
\q
```

### Problem: "Connection refused to localhost:5432"
**Solution:** Start PostgreSQL service:
```powershell
# Windows Services
net start postgresql-x64-15
```

### Problem: Java version mismatch
**Solution:** Set JAVA_HOME to Java 17 path (see Prerequisites section)

### Problem: Frontend shows "Network error"
**Solution:** Make sure backend is running on http://localhost:8080

---

## 📋 VERIFICATION CHECKLIST

- [ ] Maven installed: `mvn -version`
- [ ] Java 17 active: `java -version` shows 17.x.x
- [ ] PostgreSQL running and database `taskportal` created
- [ ] Backend dependencies downloaded: `mvn clean install`
- [ ] Backend running: http://localhost:8080
- [ ] Frontend dependencies installed: `npm install`
- [ ] Frontend running: http://localhost:5173

---

## 🎓 TESTING THE APPLICATION

1. Open http://localhost:5173
2. Click "Register here"
3. Create account with:
   - Username: `testuser`
   - Email: `test@example.com`
   - Password: `password123`
4. You'll be logged in and see the Kanban board
5. Click "Create Task" to add a new task
6. Use "AI Assist" button to generate task details with Gemini API

---

## 📦 BUILD FOR PRODUCTION

### Backend JAR:
```powershell
cd backend
mvn clean package -DskipTests
# JAR file: target/task-management-portal-1.0.0.jar
# Run: java -jar target/task-management-portal-1.0.0.jar
```

### Frontend Build:
```powershell
cd frontend
npm run build
# Static files in: dist/
```
