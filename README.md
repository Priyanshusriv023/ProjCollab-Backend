# ProjCollab Backend 🔧

REST API backend for ProjCollab — a full stack project management 
application inspired by Basecamp.

## Live Demo
Frontend: [https://proj-collab-frontend.vercel.app/](https://proj-collab-frontend.vercel.app/)

## Tech Stack
**Runtime:** Node.js  
**Framework:** Express.js  
**Database:** MongoDB + Mongoose  
**Auth:** JWT (access + refresh tokens), bcrypt  
**File Upload:** Multer  
**Email:** Nodemailer  
**Deployment:** Render  

## Features
- JWT authentication with access and refresh tokens
- Email verification and password reset
- Role based access control (Admin, Project Admin, Member)
- Project and task management with full CRUD
- File attachments on tasks
- MongoDB aggregation pipelines

## API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/v1/auth/register | Register user |
| POST | /api/v1/auth/login | Login user |
| POST | /api/v1/auth/logout | Logout user |
| GET | /api/v1/auth/current-user | Get current user |
| POST | /api/v1/auth/refresh-token | Refresh access token |
| POST | /api/v1/auth/forgot-password | Request password reset |

### Project Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/projects | List all projects |
| POST | /api/v1/projects | Create project |
| GET | /api/v1/projects/:id | Get project details |
| PUT | /api/v1/projects/:id | Update project (Admin) |
| DELETE | /api/v1/projects/:id | Delete project (Admin) |

### Task Routes
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/v1/tasks/:projectId | List project tasks |
| POST | /api/v1/tasks/:projectId | Create task |
| PUT | /api/v1/tasks/:projectId/t/:taskId | Update task |
| DELETE | /api/v1/tasks/:projectId/t/:taskId | Delete task |

## Permission Matrix
| Feature | Admin | Project Admin | Member |
|---------|-------|---------------|--------|
| Create Project | ✓ | ✗ | ✗ |
| Manage Members | ✓ | ✗ | ✗ |
| Create/Delete Tasks | ✓ | ✓ | ✗ |
| View Tasks | ✓ | ✓ | ✓ |

## Run Locally
git clone https://github.com/Priyanshusriv023/ProjCollab-Backend.git
cd ProjCollab-Backend
npm install
cp .env.example .env
npm run dev

## Environment Variables

Create a `.env` file in the root directory:

```env
PORT=8000
CORS_ORIGIN=
MONGO_URI=
ACCESS_TOKEN_SECRET=
ACCESS_TOKEN_EXPIRY=
REFRESH_TOKEN_SECRET=
REFRESH_TOKEN_EXPIRY=
MAILTRAP_SMTP_HOST=
MAILTRAP_SMTP_PORT=
MAILTRAP_SMTP_USER=
MAILTRAP_SMTP_PASS=
FORGOT_PASSWORD_REDIRECT_URL=
SERVER_URL=
```

## Frontend Repo
[ProjCollab Frontend](https://github.com/Priyanshusriv023/ProjCollab-Frontend)
