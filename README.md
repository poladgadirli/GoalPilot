# AI Planner

AI Planner is a Spring Boot and React Vite application for managing manual tasks, goals, and AI-generated plans.

## Tech Stack

- Backend: Java 21, Spring Boot, Spring Security, Spring Data JPA, PostgreSQL, springdoc OpenAPI
- Frontend: React, Vite, React Router, Tailwind CSS, Radix/shadcn-style UI components
- Database: PostgreSQL

## Requirements

- Java 21
- Node.js and npm
- PostgreSQL running locally or reachable from the backend

## Environment Variables

- `GEMINI_API_KEY`: Gemini API key used by the backend AI client
- `VITE_BACKEND_URL`: optional frontend backend base URL. Leave empty when using the Vite proxy, or set to `http://localhost:8080`.

Database connection defaults are configured in `AIPlanner-backend/src/main/resources/application.properties`:

- URL: `jdbc:postgresql://localhost:5432/ai_planner_db`
- Username: `postgres`
- Password: `12345678`

Override these for your own local or deployed environment before running against a different database.

## Backend

```bash
cd AIPlanner-backend
./mvnw spring-boot:run
```

On Windows PowerShell:

```powershell
cd AIPlanner-backend
.\mvnw.cmd spring-boot:run
```

Swagger UI is available at:

```text
http://localhost:8080/swagger-ui/index.html
```

## Frontend

```bash
cd AIPlanner-frontend
npm install
npm run dev
```

The frontend is available at:

```text
http://localhost:5173
```
