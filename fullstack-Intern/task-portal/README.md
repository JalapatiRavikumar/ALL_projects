# 🚀 AI-Powered Task Management Portal with Blockchain Ledger

A premium full-stack web application designed for task tracking and planning. It features secure JWT-based user authentication, a responsive Kanban task board, AI-assisted task generation, and a blockchain-inspired immutable validation ledger. 

To enable easy evaluation, the frontend is deployed live and features an **automatic in-browser database fallback**, allowing you to test the entire application (registering, logging in, creating, moving, and deleting tasks) without setting up any backend or database locally.

---

## ⚡ Live Deployments

* **Live Frontend Link**: [https://frontend-ten-alpha-67.vercel.app](https://frontend-ten-alpha-67.vercel.app)
* **Direct Vercel Deployment**: [https://frontend-3wyamamof-jalapati-ravikumars-projects.vercel.app](https://frontend-3wyamamof-jalapati-ravikumars-projects.vercel.app)
* **GitHub Repository Location**: Located in [ALL_projects Repository](https://github.com/JalapatiRavikumar/ALL_projects) under the `fullstack-Intern/` directory.

> [!NOTE]
> **Dynamic Fallback Database (Demo Mode)**: When hosted on Vercel or when the local Spring Boot server is offline, the frontend automatically intercepts API calls to `http://localhost:8082` and redirects them to a browser-based `localStorage` database. A toast alert `⚠️ Running in Demo Mode` will appear to let you know it is running serverless.

---

## 🎯 Key Features

1. **User Authentication**: Secure register and login flows powered by stateless JWT bearer tokens.
2. **Interactive Kanban Board**: Dynamic board divided into three state columns: `📋 To Do`, `⚡ In Progress`, and `✅ Done`.
3. **AI Task Assistant**: Integrated Google Gemini model (via OpenRouter) that reads your task title and auto-generates description details, urgency priority levels, and duration time estimates.
4. **Blockchain Validation Ledger**: Generates a mocked 64-character SHA-256 cryptographic hash of task parameters (title, description, status, and timeline) to represent an immutable ledger track. The hash displays on each task card and regenerates on every task update.
5. **Robust Error Resilience**: Toast feedback alerts and graceful error handlers for network disconnects.

---

## 🛠 Tech Stack

### Frontend
* **Core**: React 18, Vite (Fast Bundling)
* **Styling**: Tailwind CSS (Modern aesthetics & gradients), Lucide React (Sleek icons)
* **API Handlers**: Fetch API with automated `window.fetch` interceptor fallback.

### Backend (Spring Boot)
* **Java Version**: Java 17
* **Framework**: Spring Boot 3.2.0, Spring Security (JWT authentication filter)
* **Data Access**: Spring Data JPA, Hibernate ORM
* **Database**: PostgreSQL 14+ / H2 In-Memory support
* **Validation**: Jakarta Validation API

---

## ⚙️ Setup & Installation

### Prerequisites
* **Node.js** (v18+)
* **Java JDK** (v17+)
* **PostgreSQL** (v14+)
* **Maven** (v3.8+)

---

### Step 1: Database Configuration
1. Start your PostgreSQL database service.
2. Log into the PostgreSQL CLI or pgAdmin and run:
   ```sql
   CREATE DATABASE taskportal;
   ```
3. Open `backend/src/main/resources/application.properties` and verify your username and password:
   ```properties
   spring.datasource.username=your_postgres_username
   spring.datasource.password=your_postgres_password
   ```

---

### Step 2: Backend Setup
The backend runs on Spring Boot. To align with the frontend's default fetch configurations, make sure the backend runs on port `8082` or set the port in your property configurations.

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Build and download dependencies:
   ```bash
   mvn clean install
   ```
3. Start the Spring Boot application:
   ```bash
   mvn spring-boot:run
   ```
   *The backend will boot up and print logs to verify connection to the database.*

---

### Step 3: Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file in the `frontend/` directory (ignored by git):
   ```env
   VITE_OPENROUTER_API_KEY=your_openrouter_api_key_here
   ```
4. Start the frontend Vite dev server:
   ```bash
   npm run dev
   ```
   *Open [http://localhost:5173](http://localhost:5173) in your browser.*

---

## 📁 Directory Structure

```
fullstack-Intern/
├── c:\Users\rravi\ALL_projects\fullstack-Intern\
│   ├── backend/
│   │   ├── src/main/java/com/taskportal/
│   │   │   ├── controller/      # REST API Controllers (Auth / Tasks)
│   │   │   ├── entity/          # JPA DB Entities (User, Task models)
│   │   │   ├── repository/      # Repository Interfaces (JPA queries)
│   │   │   ├── service/         # Business Logic (Hashing & DB updates)
│   │   │   ├── security/        # JWT Filtering & Security configs
│   │   │   ├── dto/             # Data Transfer Objects
│   │   │   └── exception/       # Global exception filters
│   │   └── pom.xml              # Maven dependencies file
│   └── frontend/
│       ├── src/
│       │   ├── components/      # React Kanban components
│       │   ├── utils/           # mockApi.js global fetch fallback
│       │   ├── App.jsx          # Auth routing & Layout shell
│       │   ├── main.jsx         # Entry point (integrates mock interceptor)
│       │   └── index.css        # Custom CSS & Tailwind styles
│       ├── vercel.json          # SPA routing config for Vercel redirects
│       ├── tailwind.config.js   # Tailwind configurations
│       └── package.json         # NPM packages definitions
```

---

## 🔐 API Endpoints

### Authentication REST APIs (Public)
* `POST /api/auth/register`: Create a new account. Expects: `{ username, email, password }`
* `POST /api/auth/login`: Authenticate credentials. Returns: `{ token, username, email }`

### Tasks REST APIs (Authorized - Bearer JWT Required)
* `GET /api/tasks`: Returns all tasks assigned to the authenticated user.
* `POST /api/tasks`: Create a new task. Generates and returns a unique `blockchainHash`.
* `PUT /api/tasks/{id}`: Update task title, description, priority, or status. Re-hashes the task parameter chain.
* `DELETE /api/tasks/{id}`: Delete a task from the ledger.

---

## 💡 Developer & Port Tuning Notes

* **Port Matching**: The frontend makes HTTP requests to port `8082` by default. Ensure the backend properties file contains `server.port=8082` if you want local integrations to communicate directly over network ports.
* **OpenRouter AI Key**: The AI Assist feature requires a valid key. Add it securely to your `.env` file under `VITE_OPENROUTER_API_KEY` for local usage, or config it in the Vercel Dashboard's environment variables.
* **Security Shield**: JWT security rejects unauthorized traffic. If requests fail with `401 Unauthorized`, verify that the token has been successfully stored in the browser's local storage.
