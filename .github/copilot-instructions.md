# AuraKey Codebase Guide for AI Agents

## Architecture Overview
AuraKey is a full-stack AI image generation application with:
- **Frontend** (web/): React 19 + TypeScript + Tailwind CSS + Vite
- **Backend** (www/): Express + Node.js + Prisma ORM + PostgreSQL
- **Authentication**: JWT-based with bcryptjs password hashing

### Data Flow
1. Frontend uses Zustand stores for state (e.g., `usePromptStore`)
2. React Context API wraps authentication state (`AuthContext`)
3. Backend exposes RESTful API at `/api/auth` and `/api/` endpoints
4. Prisma models define User and Setting entities with soft deletes

## Tech Stack Details

### Frontend Stack
- **React Router v7**: Routes defined in `App.tsx` (Home `/`, Gallery `/gallery`)
- **State Management**: Zustand for prompt store; React Context for auth
- **Styling**: Tailwind CSS v4 + PostCSS, with utility classes like `backdrop-blur-xl`, `bg-[#0c0d13]`
- **Icons**: lucide-react (e.g., Plus, Copy, Send, Check)
- **Build**: Vite with TypeScript compilation (`npm run build` runs `tsc -b && vite build`)

### Backend Stack
- **Framework**: Express v5 with CORS middleware
- **Database**: PostgreSQL via Prisma
- **Authentication**: JWT (secret from `JWT_SECRET` env var) with 24h expiry
- **Password Security**: bcryptjs with salt rounds 10
- **Development**: ts-node-dev for hot reload (`npm run dev`)

## Project Layout & Key Files

| Path | Purpose |
|------|---------|
| [web/src/App.tsx](web/src/App.tsx) | Main router, AuthProvider setup, layout structure |
| [web/src/context/AuthContext.tsx](web/src/context/AuthContext.tsx) | Auth state, login/logout, mock user data on token |
| [web/src/hooks/usePromptStore.ts](web/src/hooks/usePromptStore.ts) | Zustand store for prompt text, tag appending logic |
| [www/src/index.ts](www/src/index.ts) | Express app, CORS setup, route mounting |
| [www/src/controllers/auth.controller.ts](www/src/controllers/auth.controller.ts) | Register/login/logout endpoints with validation |
| [www/prisma/schema.prisma](www/prisma/schema.prisma) | User + Setting models with soft deletes |

## Developer Workflows

### Frontend Development
```bash
cd web
npm install
npm run dev              # Vite dev server (watches files)
npm run build            # TypeScript compilation + Vite build
npm run lint             # ESLint check (no fix in config)
```

### Backend Development
```bash
cd www
npm install
npm run dev              # ts-node-dev with auto-restart
npm run build            # TypeScript compilation to dist/
npm run start            # Run compiled dist/index.js
prisma generate         # Regenerate Prisma client
prisma migrate dev      # Create/apply migrations
```

### Database Setup
- Create `.env` with `DATABASE_URL=postgresql://user:pass@localhost/aurakey`
- Run `npm run prisma:generate && npm run prisma:migrate` in www/
- Models use snake_case DB columns mapped to camelCase TypeScript

## Code Patterns & Conventions

### Component Patterns (Frontend)
- Functional components with TypeScript interfaces for props
- Example: [PromptInput.tsx](web/src/components/chat/PromptInput.tsx) uses Zustand hook, conditional styling, floating/fixed positioning
- Zustand store pattern: `create<T>((set) => ({...}))` with immutable state updates
- Avoid duplicate tags in prompts by checking exact match before append

### API Endpoint Patterns (Backend)
- Routes mounted as `/api/{resource}` (e.g., `/api/auth` for authentication)
- Controllers use async/await with try-catch error handling
- Standard responses: `{ message, token?, user?, userId? }`
- Error status codes: 400 (validation), 401 (auth), 500 (server)

### Type Safety
- Use TypeScript strict mode for both frontend and backend
- Frontend interfaces: `AuthContextType`, `PromptStore`, component props
- Backend types from Prisma client auto-generated
- Express Request/Response fully typed with `@types/express`

### Styling Conventions
- Tailwind CSS v4 (no custom config needed)
- Dark theme: `bg-[#0c0d13]` (dark background), `text-white`, glassmorphism with `backdrop-blur-xl`
- Responsive spacing: `px-4`, `py-1.5`, use of `space-x-3`, `space-y-2`
- Border colors: `border-gray-700/50`, `border-white/10` for subtle dividers

## Integration Points & Authentication Flow

1. **Frontend Auth Flow**: 
   - User action → `AuthContext.login()` → mock JWT token → stored in localStorage → User state updated
   - Token sent in subsequent API calls (implement via fetch interceptor if needed)

2. **Backend Auth Validation**:
   - [auth.middleware.ts](www/src/middleware/auth.ts) likely verifies JWT tokens (check this file for exact pattern)
   - Controllers extract `email`, `password` from request body
   - Responses include serialized user object (excluding password)

3. **Cross-Origin Requests**:
   - Backend CORS enabled globally: `app.use(cors())`
   - Frontend will make requests to `http://localhost:3000/api/auth` (adjust BASE_URL as needed)

## Critical Developer Tips

- **Environment Variables**: Backend needs `JWT_SECRET` and `DATABASE_URL`; use `.env` file (not committed)
- **Type Generation**: After Prisma schema changes, run `npm run prisma:generate` in www/ to update types
- **Soft Deletes**: User/Setting models have `deletedAt` field; queries should filter `deletedAt === null` in service layer
- **Mock Data**: Frontend AuthContext uses mock user data; replace with actual API call once backend is ready
- **Build Order**: Frontend must compile TypeScript first (`tsc -b` before vite build)
- **Hot Reload**: Both frontend (Vite) and backend (ts-node-dev) support hot reload in dev mode

## Next Steps for Agents
1. Check [www/src/middleware/auth.ts](www/src/middleware/auth.ts) for exact JWT validation pattern
2. Identify required env variables and document in `.env.example`
3. Implement fetch interceptor in frontend to attach JWT token to API requests
4. Add error boundary in React for graceful error handling in child routes
5. Extend Prisma schema with AI model configurations and image metadata
