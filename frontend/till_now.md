# Frontend Implementation Documentation

## Overview
This document records all changes made to the frontend codebase.

## Architecture

### Authentication Flow
- Backend sets JWT as **HTTP-only cookie** (not accessible via JavaScript)
- Frontend detects auth via `document.cookie` check
- No localStorage used for auth tokens
- `credentials: 'include'` required on all fetch requests to send/receive cookies

### Tech Stack
- Vite + React
- React Router for routing
- Context API for auth state management

## File Structure

```
src/
├── components/
│   ├── LoginForm.jsx
│   ├── RegisterForm.jsx
│   └── Dashboard.jsx
├── context/
│   └── AuthContext.jsx
├── App.jsx
├── main.jsx
└── index.css
vite.config.js
```

## Components

### AuthContext (`src/context/AuthContext.jsx`)
- `AuthProvider` - Wraps app, provides auth state to all children
- `useAuth()` - Hook to access `{ token, user, login, logout, loading }`
- `ProtectedRoute` - Guards routes requiring authentication
- Checks for cookie named `token` via `document.cookie`
- `login()` - Sets token state to 'authenticated'
- `logout()` - Clears cookie and token state

### LoginForm (`src/components/LoginForm.jsx`)
- Email/password form
- POST to `${backendUrl}/login`
- `credentials: 'include'` for cookie handling
- On success: calls `login()` from context, navigates to `/dashboard`

### RegisterForm (`src/components/RegisterForm.jsx`)
- Email/password form
- POST to `${backendUrl}/register`
- `credentials: 'include'` for cookie handling
- On success: calls `login()` from context, navigates to `/dashboard`

### Dashboard (`src/components/Dashboard.jsx`)
- Protected route, only accessible when authenticated

## Routes

| Path | Component | Description |
|------|-----------|-------------|
| `/login` | LoginForm | Login page |
| `/register` | RegisterForm | Registration page |
| `/dashboard` | Dashboard | Protected dashboard |
| `*` | Navigate | Redirect to /login |

## API Integration

### Backend URL
```javascript
const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'
```

### Endpoints Used

| Endpoint | Method | Body | Credentials | Description |
|----------|--------|------|-------------|-------------|
| `/login` | POST | `{ email, password }` | include | Authenticate user |
| `/register` | POST | `{ email, password }` | include | Create account |

## Environment Variables

- `VITE_BACKEND_URL` - Backend URL (defaults to `http://localhost:3000`)
