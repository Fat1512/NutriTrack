# EatWise Frontend - Authentication System

This project includes a complete authentication system with login, register, and logout functionality.

## 🚀 Features

- **Login Page**: Username/password authentication
- **Register Page**: User registration with password confirmation
- **Protected Routes**: Automatic redirection to login for unauthenticated users
- **User Context**: Global authentication state management using React Context + React Query
- **Token Management**: Automatic token storage and retrieval
- **Logout Functionality**: Secure logout with token cleanup

## 🔧 API Integration

The app is configured to work with your backend API:

- **Base URL**: `http://localhost:8080/eatwise-service/api/v1`
- **Login Endpoint**: `/auth/login`
- **Register Endpoint**: `/auth/register`

### API Formats

**Login Request:**

```json
{
  "username": "123",
  "password": "123"
}
```

**Login Response:**

```json
{
  "status": "OK",
  "message": "da login",
  "data": {
    "user": {
      "id": "68f3a94bdc3b2ae51050a894",
      "username": "123"
    },
    "tokenDTO": {
      "accessToken": "eyJhbGciOiJIUzM4NCJ9..."
    }
  }
}
```

**Register Request:**

```json
{
  "username": "123",
  "password": "123",
  "confirmedPassword": "123"
}
```

## 🛠️ Setup

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

2. Update `.env` with your API URL if different:

   ```env
   VITE_BASE_URL=http://localhost:8080/eatwise-service/api/v1
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 📱 Usage

### Authentication Flow

1. **First Visit**: Users are redirected to `/login` if not authenticated
2. **Login**: Enter username and password to authenticate
3. **Register**: New users can create an account at `/register`
4. **Main App**: After login, users access the protected routes
5. **Logout**: Click the user menu in the header to logout

### Routes

- `/login` - Login page (public)
- `/register` - Registration page (public)
- `/` - Main dashboard (protected)
- All other routes are protected and require authentication

### Using Authentication in Components

```tsx
import { useAuth } from "../context/AuthContext";

const MyComponent = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <div>Please login</div>;

  return (
    <div>
      <p>Welcome, {user?.username}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
};
```

## 🔐 Security Features

- **Automatic Token Management**: Tokens are stored in localStorage and added to API requests
- **Protected Routes**: Unauthenticated users cannot access protected pages
- **Token Validation**: Invalid tokens automatically redirect to login
- **Secure Logout**: Tokens are cleared on logout

## 🎨 UI Components

- **Material-UI**: Modern, responsive design
- **Form Validation**: Real-time form validation with error messages
- **Loading States**: Smooth loading indicators during API calls
- **Error Handling**: User-friendly error messages

## 📦 Key Files

- `src/context/AuthContext.tsx` - Authentication context and state management
- `src/service/authService.ts` - API calls for authentication
- `src/page/LoginPage.tsx` - Login form component
- `src/page/RegisterPage.tsx` - Registration form component
- `src/ui/ProtectedRoute.tsx` - Route protection component
- `src/ui/Header.tsx` - Header with user menu and logout
- `src/utils/axiosConfig.ts` - Axios configuration with token interceptor

## 🚦 Getting Started

1. Make sure your backend is running on `http://localhost:8080`
2. Start the frontend: `npm run dev`
3. Visit `http://localhost:5173` (or the port shown in terminal)
4. You'll be redirected to the login page
5. Register a new account or login with existing credentials
6. After successful login, you'll see the main dashboard

The authentication system is now fully integrated and ready to use!
