# 🔧 Fix Java Version Issue

## Problem
You have Java 25 installed, but this project requires Java 17 for Lombok compatibility.

## Solution: Install Java 17

### Option 1: Download Java 17 (Recommended)

1. **Download Java 17 LTS**:
   - Go to: https://adoptium.net/
   - Select: **Java 17 (LTS)**
   - Click: **Download for Windows**

2. **Install Java 17**:
   - Run the installer
   - Check: ☑ Set JAVA_HOME variable
   - Check: ☑ Add to PATH

3. **Verify Installation**:
```bash
java -version
```

Should show:
```
openjdk version "17.0.x"
```

4. **Run Backend**:
```bash
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\backend
mvn clean install
mvn spring-boot:run
```

---

### Option 2: Set JAVA_HOME to Java 17 (If already installed)

If you have multiple Java versions:

```powershell
# Set JAVA_HOME temporarily
$env:JAVA_HOME="C:\Program Files\Eclipse Adoptium\jdk-17.x.x"
$env:PATH="$env:JAVA_HOME\bin;$env:PATH"

# Verify
java -version

# Run backend
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\backend
mvn clean install
mvn spring-boot:run
```

---

### Option 3: Use IDE (Easiest)

#### IntelliJ IDEA:
1. Open `task-portal/backend` folder
2. File → Project Structure → Project SDK → Download JDK
3. Select: **Java 17 (Adoptium)**
4. Click Apply
5. Right-click `TaskPortalApplication.java` → Run

#### Eclipse:
1. Window → Preferences → Java → Installed JREs
2. Add → Standard VM → Browse to Java 17
3. Check Java 17 as default
4. Right-click project → Run As → Spring Boot App

---

## Why Java 17?

- Spring Boot 3.2.0 works best with Java 17
- Lombok 1.18.36 is fully compatible with Java 17
- Java 25 has annotation processing compatibility issues

---

## Quick Fix Summary

```bash
# 1. Download Java 17 from: https://adoptium.net/
# 2. Install it
# 3. Verify:
java -version

# 4. Run backend:
cd c:\Users\rravi\Downloads\fullstack-Intern\task-portal\backend
mvn clean install
mvn spring-boot:run
```

---

**After installing Java 17, the backend will compile and run successfully!** ✅
