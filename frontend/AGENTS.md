# Frontend Agent Guide

## Project Overview

React frontend application for the Central API Deployer project. Built with Vite, React 19, and Tailwind CSS v4.

## Tech Stack

- **Runtime**: React 19.2.5
- **Build Tool**: Vite 8.0.10
- **Routing**: React Router DOM 7.15.0
- **Styling**: Tailwind CSS v4
- **Language**: JavaScript (JSX)
- **Package Manager**: npm

## Project Structure

```
frontend/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── context/
│   │   └── AuthContext.jsx
│   └── components/
│       ├── LoginForm.jsx
│       ├── RegisterForm.jsx
│       ├── Dashboard.jsx
│       ├── NewAPI.jsx
│       └── APIDetail.jsx
├── public/
└── dist/
```

## Available Scripts

- `npm run dev` - Start development server (port 5173)
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## Backend Communication

- Backend URL: `import.meta.env.VITE_BACKEND_URL || '/api'`
- All API calls must include `credentials: 'include'` for cookie-based auth

### API Endpoints

| Method | Endpoint               | Purpose                      |
| ------ | ---------------------- | ---------------------------- |
| POST   | `/api/login`           | Authenticate user            |
| GET    | `/api/verify`          | Verify session (on app load) |
| POST   | `/api/logout`          | Logout user                  |
| POST   | `/api/register`       | Create new user account      |
| GET    | `/api/apis`           | List all registered APIs     |
| POST   | `/api/apis`           | Create new API entry        |
| GET    | `/api/apis/:id`       | Get API details              |
| PATCH  | `/api/apis/:id/toggle` | Toggle API status           |
| DELETE | `/api/apis/:id`       | Delete an API               |

## Authentication Flow

1. On app load, `AuthContext` calls `GET /api/verify` with credentials
2. Protected routes redirect unauthenticated users to `/login`
3. Logout clears local state and calls `POST /api/logout`

## Routing Structure

| Path           | Component  | Access    |
| -------------- | ---------- | --------- |
| `/login`       | LoginForm  | Public    |
| `/register`    | RegisterForm | Public |
| `/dashboard`   | Dashboard  | Protected |
| `/new`         | NewAPI     | Protected |
| `/api-info/:id`| APIDetail  | Protected |
| `*`            | Redirect to `/login` | - |

## Styling

- **Tailwind v4**: Uses `@import "tailwindcss"` and `@theme {}` block
- **Dark Mode**: Supported via `@media (prefers-color-scheme: dark)`
- **GlobalLayout**: `#root` centered with max-width 1126px, min-height 100svh
- > [!NOTE]
  > Always use Tailwind, and never write raw CSS!

## Custom CSS Variables

```css
--color-text        /* Body text */
--color-text-h      /* Headings */
--color-bg          /* Background */
--color-border      /* Borders */
--color-accent      /* Primary accent (purple #aa3bff) */
--color-error       /* Error messages (#dc2626) */
```

## Dashboard Component

Control panel for managing registered API services.

### Features

- **Navbar**: App title + New API button + context-aware Login/Signout
- **API List**: Scrollable list with status badges
- **Status Toggle**: Click to toggle Running/Stopped (optimistic UI)

### Interactions

- **New API button** → navigates to `/new`
- **API row** → navigates to `/api-info/:id`
- **Status badge** → PATCH `/api/apis/:id/toggle`

### CSS Classes

- `.dashboard-container` - Full-page container
- `.dashboard-panel` - Main card wrapper
- `.dashboard-nav` - Top navigation bar
- `.btn-pill` - Pill-shaped buttons
- `.api-row` - Individual API entry
- `.status-badge` - Running (green) / Stopped (red)

## NewAPI Component

Two-step flow for creating a new API.

### Steps

1. **Type Selection**: Three clickable cards (Static API, Proxy API, Module)
2. **Details Form**: Type-specific fields + shared fields (name, endpoint)

### Shared Fields

- API Name (text input)
- Endpoint Path (text input)

### Type-Specific Fields

| Type    | Fields                                    |
| ------- | ----------------------------------------- |
| Static  | HTTP Status Code (number), Response Body (JSON textarea) |
| Proxy   | Upstream URL (url), Strip prefix checkbox  |
| Module  | Handler Code (textarea with starter template) |

### Submission

On submit, POST to `/api/apis` with all fields. On success, navigate to `/api-info/:id`.

## APIDetail Component

Displays detailed information for a single API.

### Data Fetching

On mount, fetches `GET /api/apis/:id` with credentials. Shows loading/error states.

### Display Sections

- **Header**: API name, type badge, status pill with pulsing dot
- **Configuration**: Endpoint path + type-specific fields
- **Deployment Info**: Created date, last updated, region
- **Endpoints**: Table showing public URL (`BACKEND_URL + endpoint`)

### Controls

- **Toggle button**: PATCH `/api/apis/:id/toggle` with optimistic UI
- **Delete button**: DELETE `/api/apis/:id`, then navigate to `/dashboard`

## Common Tasks

### Making API calls

```javascript
const backendUrl = import.meta.env.VITE_BACKEND_URL || "/api";
fetch(`${backendUrl}/endpoint`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  credentials: "include",
  body: JSON.stringify(data),
});
```

### Using auth context

```javascript
import { useAuth } from "../context/AuthContext";

const { token, user, login, logout } = useAuth();
```

