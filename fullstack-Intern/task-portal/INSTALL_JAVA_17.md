# ⚠️ CRITICAL: Install Java 17

## Why You Need Java 17

Your system has **Java 25** which is incompatible with Lombok and Spring Boot 3.2.0.

## 📥 Download Java 17 (Takes 2 minutes)

### Step 1: Download
Go to: **https://adoptium.net/temurin/releases/?version=17**

Or direct link: **https://github.com/adoptium/temurin17-binaries/releases**

### Step 2: Select Windows Installer
- Operating System: **Windows**
- Architecture: **x64**
- Package Type: **JDK**
- File: `OpenJDK17U-jdk_x64_windows_hotspot_17.0.XX_X.msi`

### Step 3: Install
1. Run the MSI installer
2. ✅ Check: **Set JAVA_HOME variable**
3. ✅ Check: **Add to PATH**
4. Click Install

### Step 4: Verify
Close ALL terminals, open a NEW terminal:
```bash
java -version
```

Should show:
```
openjdk version "17.0.11"
```

### Step 5: Run Backend
```bash
cd C:\Users\rravi\Downloads\fullstack-Intern\task-portal\backend
mvn clean install
mvn spring-boot:run
```

## ✅ Expected Result
```
Started TaskPortalApplication in 3.456 seconds
```

---

## 🎯 This is the ONLY proper fix

Without Java 17, Lombok will never work, and you'll have 62 compilation errors.

**Download Java 17 now: https://adoptium.net/temurin/releases/?version=17**
