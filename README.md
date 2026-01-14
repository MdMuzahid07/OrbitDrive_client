# OrbitDrive Client

The modern, responsive frontend for OrbitDrive, built with Next.js 15, React 19, and TailwindCSS. It features a desktop-class file explorer interface entirely in the browser.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- Running OrbitDrive Server

### Installation

1. Navigate to the client directory:

   ```bash
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:

   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:5000
   ```

4. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

---

## 🏗️ Architecture

The frontend is built using a modern, scalable stack designed for performance and developer experience.

### Core Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router) for routing and server-side capabilities.
- **Language**: TypeScript for type safety.
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/) for utility-first styling.
- **Icons**: [Lucide React](https://lucide.dev/) for consistent iconography.

### State Management (Redux Toolkit)

I used a centralized state management architecture to handle complex application states.

- **Store**: Configured in `redux/store.ts`.
- **Persistence**: `redux-persist` is used to save the `auth` and `fileSystem` state to local storage, ensuring users stay logged in and preferences are saved across reloads.
- **API Layer (RTK Query)**:
  - Located in `redux/api/baseApi.ts`.
  - Handles all data fetching, caching, and invalidation automatically.
  - **Automatic Auth Injection**: A custom `prepareHeaders` function automatically attaches the JWT Access Token from the Redux state to every outgoing request, ensuring seamless authentication.

---

## 🔐 Authentication Flow

The client implements a secure authentication flow that synchronizes with the backend:

1. **Login/Register**: User credentials are exchanged for an `accessToken` and `user` object.
2. **State Update**: These are stored in the Redux `auth` slice.
3. **Persistence**: The state is persisted to `localStorage` via Redux Persist.
4. **Request Authorization**:
   - Every API request goes through the interceptor in `baseApi.ts`.
   - It checks the Redux store for a valid token.
   - It injects the `Authorization: Bearer <token>` header.
   - This guarantees that even if Cookies fail (e.g., cross-site issues), the request remains authenticated.

---

## 🎨 Design System

The UI is designed to feel like a native desktop application ("Cyber Glow" aesthetic).

- **Components**: I use **Radix UI** primitives for accessible, unstyled interactive components (Dialogs, Slots).
- **Forms**: Managed by **React Hook Form** + **Zod** for robust validation.
- **Feedback**: **Sonner** is used for beautiful, non-intrusive toast notifications.
