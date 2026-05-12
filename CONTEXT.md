# Central API Deployer

A self-hosted platform for registering, deploying, and managing multiple API services from a single dashboard.

## Project Overview

- **Type**: Full-stack web application
- **Monorepo structure** with `frontend/` and `backend/` directories
- **Runtime**: Bun (for both frontend and backend)

## Tech Stack

### Frontend
- **React 19** with React Compiler (Babel)
- **Vite 8** as dev server and bundler
- **Tailwind CSS v4** with `@tailwindcss/vite` plugin
- **React Router v7** for routing

### Backend
- **Express.js** (TypeScript)
- **Bun** as runtime
- Cookie-based session auth (JWT)
- MongoDB via Mongoose

## Project Structure

```
central_api_deployer/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── NewAPI.jsx
│   │   │   └── APIDetail.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── main.ts              # Express server entry point
│   ├── db/database.ts       # MongoDB connection + models
│   ├── models/
│   │   ├── User.model.ts    # User schema
│   │   └── Api.model.ts     # Registered API schema
│   ├── routes/
│   │   ├── auth/login/main.ts
│   │   ├── verify.ts
│   │   ├── logout.ts
│   │   ├── create_acc.ts
│   │   ├── apis/main.ts     # API CRUD routes
│   │   └── deploy.ts        # API deployment/routing logic
│   ├── middlewares/
│   │   ├── authorise.ts     # JWT passport authentication
│   │   └── JSON_Verify.ts
│   ├── utils/
│   │   ├── create_jwt.ts
│   │   └── send_jwt.ts
│   ├── auth_strategies/jwt_passport.ts
│   └── configs/sample.ts
│
├── package.json            # Root scripts (bun run backend, bun run frontend, bun run run)
├── vercel.json
└── bun.lock
```

## API Types Supported

1. **Static API** - Fixed JSON response with custom status code
2. **Proxy API** - Forwards requests to an upstream URL (with optional prefix stripping)
3. **Module** - Custom JS handler functions (serverless-style, supports multiple handlers)

## API Model Schema

```typescript
{
  userId: ObjectId,        // Reference to User
  name: string,            // API name
  endpoint: string,        // URL path (e.g., "/weather")
  type: "static" | "proxy" | "module",
  status: "Running" | "Stopped",
  config: {
    // Static
    staticBody?: string,
    staticStatus?: number,
    // Proxy
    upstreamUrl?: string,
    stripPrefix?: boolean,
    // Module
    moduleCode?: string,
    moduleHandlers?: Array<{ name: string, code: string }>
  },
  createdAt: Date,
  updatedAt: Date
}
```

## Frontend Routes

| Route | Component | Status |
|-------|-----------|--------|
| `/` | App (redirects to `/dashboard`) | ✅ |
| `/login` | LoginForm | ✅ |
| `/register` | RegisterForm | ✅ |
| `/dashboard` | Dashboard | ✅ |
| `/new` | NewAPI | ✅ |
| `/api-info/:id` | APIDetail | ✅ |

## Backend API Endpoints

### Authentication (public)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/login` | POST | Authenticate user |
| `/verify` | GET | Verify session cookie |
| `/logout` | POST | Clear session |
| `/register` | POST | Create new account (commented out) |

### API Management (protected)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/apis` | GET | List all APIs for user |
| `/apis` | POST | Create new API |
| `/apis/:id` | GET | Get API details |
| `/apis/:id` | DELETE | Delete API |
| `/apis/:id/toggle` | PATCH | Toggle Running/Stopped |

### Deployed APIs (catch-all)
| Endpoint | Method | Description |
|----------|--------|-------------|
| `/*` | * | Serve deployed APIs (static/proxy/module) |

## Deployment Logic

Requests to any path (e.g., `/weather`) are routed via `app.all("*", handleDeployedApi)`:

1. **Lookup** - Find API by endpoint in MongoDB (status must be "Running")
2. **Static** - Return configured JSON with custom status code
3. **Proxy** - Forward request to upstream URL (with optional prefix stripping)
4. **Module** - Execute handler function:
   - Match by HTTP method (get, post, put, delete, etc.)
   - Fall back to "main" or first handler if no method match

## Running the Project

```bash
# Run both frontend and backend concurrently
bun run run

# Run individually
bun run backend  # http://localhost:3000
bun run frontend # http://localhost:5173
```

## Environment Variables (Backend)

Required in `backend/.env`:
- `PORT` - Server port (e.g., 3000)
- `MONGODB_URI` - MongoDB connection string

## Frontend Environment

- Vite proxy configured to forward `/api` requests to `http://localhost:3000`
- `VITE_BACKEND_URL` set to `/api` via Vite define config