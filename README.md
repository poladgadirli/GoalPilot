GoalPilot

GoalPilot is an AI-powered productivity and goal planning platform built with Java Spring Boot, PostgreSQL, JWT authentication, and Gemini AI.

The platform helps users define goals, generate structured plans, manage tasks, organize daily to-do lists, and track progress over time.

Project Overview

GoalPilot is designed for users who want to turn goals into actionable daily plans.

Instead of only creating a simple to-do list, users can create a goal, receive AI-based analysis, get recommended planning details, and generate a structured plan with daily tasks.

The project focuses on building a production-style backend with authentication, user-based data separation, task management, goal planning, AI integration, filtering, pagination, and clean API structure.

Main Features
User registration and login
JWT authentication
Refresh token support
Change password functionality
Forgot password / OTP-based recovery flow
Goal creation and management
AI-based goal analysis
AI-generated daily planning
Recommended duration and effort calculation
Task and to-do list management
Task filtering and pagination
Category-based task organization
Daily task tracking
User-specific data access
PostgreSQL database integration
Swagger / OpenAPI documentation
Global exception handling
DTO-based request and response models
Layered backend architecture
Tech Stack
Java 21
Spring Boot
Spring Security
JWT
Refresh Token
PostgreSQL
Spring Data JPA / Hibernate
Gemini API
Maven
Swagger / OpenAPI
React
Postman
Architecture

The backend follows a layered architecture.

GoalPilot
│
├── controller
│   ├── AuthController
│   ├── TaskController
│   ├── CategoryController
│   ├── GoalController
│   └── PlanController
│
├── service
│   ├── abstracts
│   └── concretes
│
├── repository
│
├── entity
│
├── dto
│   ├── request
│   └── response
│
├── mapper
│
├── security
│   ├── JwtService
│   ├── JwtAuthenticationFilter
│   └── SecurityConfig
│
├── exception
│
└── config
Core Modules
Authentication

GoalPilot includes a JWT-based authentication system.

Users can:

Register
Login
Use access tokens
Use refresh tokens
Change password
Recover password through OTP flow

Protected endpoints require a valid Bearer token.

Task Management

Users can create and manage their own tasks.

Task features include:

Title
Description
Due date
Priority
Status
Estimated time
Category
User ownership

Tasks can be filtered and paginated.

Category Management

Users can organize tasks by categories.

Category features include:

Name
Color
User-based ownership

Each user manages only their own categories.

Goal Management

Users can create goals and define planning information such as:

Goal title
Description
Start date
Duration
Daily available time

GoalPilot calculates useful planning details and helps users structure their goals into daily actions.

AI Planning

GoalPilot integrates with Gemini AI to analyze goals and generate structured plans.

AI-related features include:

Goal analysis
Recommended minimum duration
Recommended daily effort
Daily plan generation
Task suggestions based on the selected goal
API Endpoints
Authentication
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/change-password
POST /api/auth/forgot-password
Tasks
GET /api/tasks
GET /api/tasks/{id}
POST /api/tasks
PUT /api/tasks/{id}
DELETE /api/tasks/{id}
GET /api/tasks/category/{categoryId}
Categories
GET /api/categories
GET /api/categories/{id}
POST /api/categories
PUT /api/categories/{id}
DELETE /api/categories/{id}
Goals
GET /api/goals
GET /api/goals/{id}
POST /api/goals
PUT /api/goals/{id}
DELETE /api/goals/{id}
Plans
POST /api/plans/generate-ai
GET /api/plans/{id}

Endpoint names may be slightly different depending on the current implementation. Update this section according to your actual controller mappings.

Example Register Request
{
  "username": "polad",
  "email": "polad@example.com",
  "password": "StrongPassword123"
}
Example Login Request
{
  "email": "polad@example.com",
  "password": "StrongPassword123"
}
Example Create Task Request
{
  "title": "Prepare Java interview questions",
  "description": "Review Spring Boot, JWT, PostgreSQL, and REST API concepts",
  "categoryId": 1,
  "dueDate": "2026-07-10",
  "priority": "HIGH",
  "status": "TODO"
}
Example Create Goal Request
{
  "title": "Become a stronger Java backend developer",
  "description": "Improve Spring Boot, PostgreSQL, security, testing, and project architecture skills",
  "startDate": "2026-07-01",
  "durationDays": 30,
  "dailyAvailableMinutes": 90
}
Screenshots
Swagger API Documentation




Authentication Endpoints




Task Management




Goal Creation




AI Plan Generation




Dashboard




Screenshot Guide

Recommended screenshots for this repository:

docs/screenshots/swagger-api.png
docs/screenshots/swagger-auth.png
docs/screenshots/task-management.png
docs/screenshots/goal-create.png
docs/screenshots/ai-plan-generation.png
docs/screenshots/dashboard.png

Use screenshots that show the project actually works:

Swagger page with main controllers visible
Auth endpoints visible in Swagger
Successful login or register response in Postman
Task list or task creation screen
Goal creation screen
AI-generated plan response
Dashboard or daily tasks page from the frontend

Do not include screenshots that expose:

JWT tokens
Passwords
API keys
Database passwords
Email credentials
Private user data
Getting Started
Prerequisites

Before running the project, make sure you have installed:

Java 21
Maven
PostgreSQL
Git
Node.js and npm, if running the frontend
Gemini API key
Configuration

This project uses local configuration values that should not be committed to GitHub.

Create a local file:

src/main/resources/application.properties

Use the example configuration file as a template:

src/main/resources/application-example.properties

Example configuration:

# Server
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/goalpilot_db
spring.datasource.username=your_db_username
spring.datasource.password=your_db_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT
jwt.secret=your_jwt_secret_key
jwt.expiration=3600000
jwt.refresh-expiration=604800000

# Gemini AI
gemini.api.key=your_gemini_api_key

# Mail / OTP
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Swagger
springdoc.swagger-ui.path=/swagger-ui.html

Never commit real passwords, JWT secrets, email credentials, or API keys to GitHub.

Git Ignore Recommendation

Make sure these files are ignored:

src/main/resources/application.properties
src/main/resources/application.yml
src/main/resources/application-local.properties
src/main/resources/application-local.yml
.env

If application.properties was already tracked by Git, remove it from tracking:

git rm --cached src/main/resources/application.properties

Then commit the change:

git add .gitignore src/main/resources/application-example.properties
git commit -m "Add example configuration and ignore local properties"
Run the Backend

Clone the repository:

git clone https://github.com/poladgadirli/goalpilot.git

Navigate to the backend folder:

cd goalpilot

Install dependencies:

mvn clean install

Run the application:

mvn spring-boot:run

Swagger will be available at:

http://localhost:8080/swagger-ui/index.html
Run the Frontend

Navigate to the frontend folder:

cd frontend

Install dependencies:

npm install

Run the frontend:

npm run dev
What This Project Demonstrates

This project demonstrates practical backend and full-stack development skills, including:

Building REST APIs with Spring Boot
Implementing JWT authentication
Managing refresh tokens
Protecting user-specific data
Working with PostgreSQL and JPA
Designing DTO-based API contracts
Applying validation and exception handling
Implementing task and goal management logic
Integrating AI into a real application flow
Building a structured backend project
Connecting backend APIs with a React frontend
Documenting APIs with Swagger
Future Improvements
Unit and integration tests
Docker Compose setup
CI/CD pipeline
Deployment
Advanced AI assistant chat
Calendar-based planning
Notification system
Better analytics for goal progress
Improved frontend UI/UX
Multi-language support
Author

Polad Gadirli

GitHub: https://github.com/poladgadirli
LinkedIn: https://www.linkedin.com/in/polad-gadirli-1223a7375/
