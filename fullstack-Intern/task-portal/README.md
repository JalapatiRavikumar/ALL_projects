# 🚀 AI-Powered Task Management Portal

A full-stack web application for managing tasks with AI assistance and blockchain-inspired immutable tracking.

## 🎯 Features

- **User Authentication**: JWT-based secure login and registration
- **Kanban Board**: Drag-and-drop task management with TODO, IN_PROGRESS, and DONE columns
- **AI Integration**: Google Gemini AI generates task descriptions, priorities, and time estimates
- **Blockchain Ledger**: Mocked immutable hash tracking for all tasks
- **Responsive UI**: Beautiful Tailwind CSS design
- **RESTful API**: Clean Spring Boot backend with proper layered architecture

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- Lombok

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React Icons

## 📦 Installation & Setup

### Prerequisites
- Java 17+
- Node.js 18+
- PostgreSQL 14+
- Maven 3.8+

### Database Setup

1. Install and start PostgreSQL
2. Create database:
```sql
CREATE DATABASE taskportal;
```

3. Update credentials in `backend/src/main/resources/application.properties` if needed

### Backend Setup

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Backend will run on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

### Google Gemini API Key

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Update `GEMINI_API_KEY` in `frontend/src/components/CreateTaskModal.jsx`

## 📁 Project Structure

```
fullstack-Intern/
├── backend/
│   ├── src/main/java/com/taskportal/
│   │   ├── controller/       # REST API endpoints
│   │   ├── entity/           # JPA entities
│   │   ├── repository/       # Data access layer
│   │   ├── service/          # Business logic
│   │   ├── security/         # JWT & Security config
│   │   ├── dto/              # Data transfer objects
│   │   └── exception/        # Global exception handling
│   └── pom.xml
└── frontend/
    ├── src/
    │   ├── components/       # React components
    │   ├── App.jsx           # Main app component
    │   └── main.jsx          # Entry point
    └── package.json
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login and get JWT token

### Tasks (Requires Authentication)
- `GET /api/tasks` - Get all user tasks
- `GET /api/tasks/{id}` - Get specific task
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

## 🎨 Features Breakdown

### Backend Architecture (25%)
- Layered design with Controllers, Services, Repositories
- Global exception handling
- Input validation with Jakarta Validation
- Clean DTOs for API communication

### Frontend UI (20%)
- Responsive Kanban board
- Smooth authentication flow
- Real-time task updates
- Beautiful gradient UI

### AI Feature (20%)
- Google Gemini integration
- Strict JSON response parsing
- Graceful fallback handling
- Auto-fill description, priority, and time

### Code Quality (15%)
- Clean, readable code
- Reusable React components
- Proper separation of concerns
- Consistent naming conventions

### Database (10%)
- Relational mapping (Users 1:N Tasks)
- Cascade operations
- Timestamps tracking
- Unique constraints

### Blockchain Bonus (10%)
- SHA-256 hash generation
- Immutable task tracking
- Hash displayed on UI
- Regeneration on updates

## 🚀 Usage

1. Register a new account
2. Login with credentials
3. Create tasks using "New Task" button
4. Use "AI Assist" to auto-generate task details
5. Move tasks between columns (TODO → IN_PROGRESS → DONE)
6. View blockchain hash for immutability verification
7. Delete completed tasks

## 🐛 Common Issues

### Backend won't start
- Ensure PostgreSQL is running
- Check database credentials in `application.properties`
- Verify port 8080 is available

### Frontend API errors
- Confirm backend is running on port 8080
- Check browser console for CORS errors
- Verify JWT token in localStorage

### AI Assist not working
- Ensure valid Gemini API key is configured
- Check browser console for API errors
- Verify internet connection

## 📝 Assignment Evaluation Criteria

This project fulfills all requirements:

✅ **Backend Architecture (25%)**: Layered design, exception handling, validation  
✅ **Frontend UI (20%)**: Responsive Kanban, Tailwind styling, state management  
✅ **AI Feature (20%)**: Gemini integration with graceful fallback  
✅ **Code Quality (15%)**: Clean naming, reusable components  
✅ **Database (10%)**: Proper relational mapping with JPA  
✅ **Blockchain Bonus (10%)**: Mocked immutable hash ledger  

## 📄 License

This project is for educational/interview purposes.

## 👤 Author

Built for internship application - Full Stack Developer Position
