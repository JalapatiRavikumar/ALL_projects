# Backend - Task Portal API

Spring Boot REST API with JWT authentication and PostgreSQL.

## Quick Start

1. Create database:
```bash
psql -U postgres
CREATE DATABASE taskportal;
\q
```

2. Run application:
```bash
mvn clean install
mvn spring-boot:run
```

## API Documentation

### Authentication Endpoints

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john",
  "email": "john@example.com",
  "password": "password123"
}
```

**Login User**
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john",
  "password": "password123"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "john"
}
```

### Task Endpoints (Requires Authorization Header)

**Get All Tasks**
```http
GET /api/tasks
Authorization: Bearer <token>
```

**Create Task**
```http
POST /api/tasks
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build API",
  "description": "Create REST endpoints",
  "priority": "HIGH",
  "status": "TODO",
  "estimatedTime": 120
}
```

**Update Task**
```http
PUT /api/tasks/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Build API - Updated",
  "description": "Create REST endpoints with tests",
  "priority": "MEDIUM",
  "status": "IN_PROGRESS",
  "estimatedTime": 180
}
```

**Delete Task**
```http
DELETE /api/tasks/{id}
Authorization: Bearer <token>
```

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    priority VARCHAR(50),
    status VARCHAR(50),
    estimated_time INTEGER,
    blockchain_hash VARCHAR(255) UNIQUE,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    user_id BIGINT REFERENCES users(id)
);
```

## Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/taskportal
spring.datasource.username=postgres
spring.datasource.password=password

# JWT
jwt.secret=404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970
jwt.expiration=86400000

# Server
server.port=8080
```

## Security Features

- JWT token-based authentication
- BCrypt password encryption
- CORS configuration for frontend
- User-specific data isolation
- Token validation on every request

## Testing with cURL

```bash
# Register
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'

# Create Task (replace <TOKEN>)
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"title":"Test Task","priority":"HIGH","status":"TODO"}'

# Get Tasks
curl http://localhost:8080/api/tasks \
  -H "Authorization: Bearer <TOKEN>"
```
