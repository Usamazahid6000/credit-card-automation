# Smart Search UI - Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Configuration Files](#configuration-files)
5. [Application Entry Point](#application-entry-point)
6. [Core Application Files](#core-application-files)
7. [Pages](#pages)
8. [Components](#components)
9. [Custom Hooks](#custom-hooks)
10. [State Management](#state-management)
11. [API Integration](#api-integration)
12. [Authentication System](#authentication-system)
13. [Styling and UI](#styling-and-ui)
14. [Key Features](#key-features)

---

## Project Overview

**Smart Search UI** is a React-based web application designed for credit card OCR (Optical Character Recognition) validation and customer data management. The application provides a comprehensive dashboard for searching, filtering, and viewing customer credit card validation data with features like:

- User authentication with two-factor authentication (2FA)
- Advanced search and filtering capabilities
- Paginated data display
- Real-time data fetching from a REST API
- Responsive UI built with modern design principles

---

## Technology Stack

### Core Technologies
- **React 18.3.1** - UI library
- **TypeScript 5.8.3** - Type safety
- **Vite 5.4.19** - Build tool and dev server
- **React Router DOM 6.30.1** - Client-side routing

### UI Libraries
- **shadcn/ui** - Component library (Radix UI primitives)
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Lucide React** - Icon library
- **Sonner** - Toast notifications

### State Management & Data Fetching
- **Zustand 5.0.9** - Lightweight state management
- **TanStack React Query 5.83.0** - Server state management
- **Axios 1.13.2** - HTTP client

### Form Handling
- **React Hook Form 7.61.1** - Form state management
- **Zod 3.25.76** - Schema validation
- **@hookform/resolvers** - Form validation resolvers

### Development Tools
- **ESLint** - Code linting
- **TypeScript ESLint** - TypeScript-specific linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

---

## Project Structure

```
smart-search-ui-main/
├── public/                 # Static assets
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # shadcn/ui components
│   │   ├── Header.tsx
│   │   ├── ListView.tsx
│   │   ├── FilterSection.tsx
│   │   ├── ResultsSection.tsx
│   │   ├── StatusSection.tsx
│   │   ├── NavLink.tsx
│   │   └── ProtectedRoute.tsx
│   ├── pages/            # Page components
│   │   ├── Index.tsx
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── TwoFactorAuth.tsx
│   │   ├── Profile.tsx
│   │   └── NotFound.tsx
│   ├── hooks/            # Custom React hooks
│   │   ├── useLogin.tsx
│   │   ├── useAffiliates.tsx
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib/              # Utility libraries
│   │   ├── api.tsx       # Axios client configuration
│   │   ├── refreshToken.ts
│   │   └── utils.ts      # Utility functions
│   ├── config/           # Configuration files
│   │   └── api.ts        # API configuration
│   ├── store/            # State management
│   │   └── auth.ts       # Zustand auth store
│   ├── providers/        # Context providers
│   │   └── AuthProvider.tsx
│   ├── App.tsx           # Main app component
│   ├── main.tsx          # Application entry point
│   ├── App.css
│   └── index.css         # Global styles
├── index.html            # HTML template
├── package.json          # Dependencies
├── vite.config.ts        # Vite configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── README.md
```

---

## Configuration Files

### `package.json`
Defines project dependencies, scripts, and metadata:
- **Scripts:**
  - `dev`: Start development server
  - `build`: Production build
  - `build:dev`: Development build
  - `lint`: Run ESLint
  - `preview`: Preview production build

### `vite.config.ts`
Vite build configuration:
```typescript
- Server: Hosts on all interfaces (::) at port 8080
- Plugins: React SWC plugin for fast compilation
- Path Alias: @/ maps to ./src directory
- Component Tagger: Enabled in development mode
```

**Key Configuration:**
- Uses React SWC for faster compilation
- Path alias `@/` for cleaner imports
- Development server on port 8080

### `tailwind.config.ts`
Tailwind CSS configuration with:
- Dark mode support (class-based)
- Custom color scheme using CSS variables
- Extended animations (fade-in, pulse-glow, accordion)
- Custom border radius values
- Typography plugin support

**Color System:**
- Uses HSL color values via CSS variables
- Supports dark/light themes
- Primary color: Teal/cyan (168 76% 42%)

### `tsconfig.json`
TypeScript configuration:
- Path mapping: `@/*` → `./src/*`
- Relaxed strict mode for flexibility
- Allows JavaScript files
- Skips library type checking for faster compilation

---

## Application Entry Point

### `index.html`
The HTML template that serves as the base for the React application:
- Sets up meta tags for SEO
- Contains the root div where React mounts
- Loads the main TypeScript module

### `src/main.tsx`
Application entry point that:
1. Creates React root
2. Wraps app with `BrowserRouter` for routing
3. Wraps app with `AuthProvider` for authentication context
4. Renders the main `App` component

**Code Flow:**
```typescript
createRoot → BrowserRouter → AuthProvider → App
```

---

## Core Application Files

### `src/App.tsx`
Main application component that sets up:
- **QueryClientProvider**: React Query for server state
- **TooltipProvider**: Global tooltip context
- **Toaster Components**: Toast notifications (two instances)
- **Route Configuration**: Defines all application routes

**Routes:**
- `/` → Index (redirects to login)
- `/login` → Login page
- `/2fa` → Two-factor authentication
- `/dashboard` → Protected dashboard (requires auth)
- `*` → 404 Not Found page

**Key Features:**
- Protected routes using `ProtectedRoute` wrapper
- Global toast notifications
- React Query for data fetching

---

## Pages

### `src/pages/Index.tsx`
Landing page that automatically redirects to `/login`. Simple component that uses `useNavigate` to redirect on mount.

### `src/pages/Login.tsx`
Login page with:
- **Email/Password Input**: Form fields with icons
- **Password Toggle**: Show/hide password functionality
- **Remember Me**: Checkbox (UI only, not implemented)
- **Forgot Password**: Link (placeholder)
- **Form Validation**: Client-side validation
- **2FA Support**: Redirects to 2FA page if code verification required

**Authentication Flow:**
1. User enters credentials
2. Calls `useLogin` hook
3. If 2FA required → Navigate to `/2fa` with code_id
4. If direct login → Navigate to `/dashboard` with tokens

**UI Features:**
- Gradient button with loading state
- Icon-based input fields
- Responsive design
- Toast notifications for errors/success

### `src/pages/TwoFactorAuth.tsx`
Two-factor authentication page:
- **OTP Input**: 6-digit code input using `InputOTP` component
- **Code Verification**: Validates code against stored `code_id`
- **Token Management**: Sets auth tokens on successful verification
- **Error Handling**: Shows error messages for invalid codes
- **Navigation**: Back to login button

**Process:**
1. Retrieves `code_id` from Zustand store
2. User enters 6-digit code
3. Calls API: `/Api/V8/custom/portal/verify-automation-code`
4. On success: Sets tokens and redirects to dashboard
5. On failure: Shows error and clears input

### `src/pages/Dashboard.tsx`
Main dashboard page:
- **Header Component**: Application header with actions
- **ListView Component**: Main data display and filtering
- **Layout**: Container with spacing and animations

**Current Implementation:**
- Uses `ListView` component for all functionality
- `FilterSection` is commented out (functionality moved to ListView)
- Toast notifications for search actions

### `src/pages/Profile.tsx`
User profile settings page:
- **Basic Information**: Name, Email, Role fields
- **Security Settings**: Google Authenticator toggle
- **Form Handling**: Local state management
- **Save Functionality**: Simulated save (1 second delay)

**Features:**
- Icon-based form inputs
- Switch component for 2FA toggle
- Gradient save button
- Toast notifications

### `src/pages/NotFound.tsx`
404 error page:
- Simple centered layout
- Error logging to console
- Link back to home
- Uses location to log attempted route

---

## Components

### `src/components/Header.tsx`
Application header component:
- **Logo Section**: Credit card icon with title and subtitle
- **Navigation Actions**:
  - Redaction Pipeline status
  - Reset button
  - Download CSV button
  - Redacted ZIP folder count
- **Styling**: Sticky header with backdrop blur

### `src/components/ListView.tsx`
**Main component** for displaying and filtering customer data:

**State Management:**
- `filters`: Filter state (folio_number_c, first_name, last_name, status_c, date, country, affiliate)
- `data`: Customer data array
- `loading`: Loading state
- `currentPage`: Current pagination page
- `totalPages`: Total number of pages
- `recordsOnPage`: Records on current page
- `hasSearched`: Whether search has been performed

**Filter Options:**
- **Date**: Today, Yesterday, Last 7/30 Days, This/Last Month, Custom
- **Country**: 10 predefined countries (US, UK, CA, AU, DE, FR, JP, IN, BR, MX)
- **Affiliate**: Dynamically loaded from API via `useAffiliates` hook
- **Status**: Predefined status options (Refund Request Created, Check 0 - Reject, Pending, Processing, Completed, Failed, Cancelled, Refunded)

**Data Fetching:**
- API Endpoint: `/Api/V8/custom/customer/get-credit-card-validation-data`
- Method: POST
- Payload includes filters, order_by, and page_no
- Handles pagination automatically

**Table Columns:**
1. Customer Name
2. Status (with badge styling)
3. Date Entered (formatted)
4. Filename
5. CCN Expected
6. CCN Actual
7. Luhn Test Expected (color-coded: Pass/Fail)
8. Luhn Test Actual (color-coded: Pass/Fail/Empty)
9. Passport Country

**Pagination:**
- Shows up to 10 page numbers
- Smart page number calculation (centers around current page)
- Previous/Next buttons with disabled states
- Displays current page info

**UI States:**
- Loading: Spinner with message
- Empty (no search): Placeholder message
- Empty (no results): "No records found" message
- Data: Table with pagination

### `src/components/FilterSection.tsx`
Filter section component (currently not used, functionality moved to ListView):
- Four filter dropdowns: Date, Country, Affiliate, Status
- Search button
- Uses `SearchableDropdown` component
- Hardcoded affiliate options (not dynamic)

### `src/components/ResultsSection.tsx`
Simple results placeholder component:
- Shows "No data loaded" or "Results will appear here"
- Currently not actively used (ListView handles results)

### `src/components/StatusSection.tsx`
Process status component:
- Shows processed/total rows
- Progress bar with percentage
- Clock icon
- Currently not actively used in Dashboard

### `src/components/NavLink.tsx`
Custom NavLink wrapper:
- Extends React Router's NavLink
- Adds support for `activeClassName` and `pendingClassName`
- Uses `cn` utility for className merging
- Forward ref for proper DOM access

### `src/components/ProtectedRoute.tsx`
Route protection component:
- Checks authentication status via `useAuth` hook
- Shows loading spinner while checking auth
- Redirects to `/login` if not authenticated
- Renders children if authenticated

**Protection Logic:**
```typescript
if (loading) → Show spinner
if (!isAuthenticated) → Redirect to /login
else → Render children
```

### `src/components/ui/SearchableDropdown.tsx`
Reusable searchable dropdown component:
- **Features:**
  - Search/filter options
  - Icon support
  - Keyboard navigation
  - Selected state indication
  - Popover-based UI

**Props:**
- `placeholder`: Placeholder text
- `options`: Array of {value, label} objects
- `value`: Selected value
- `onChange`: Callback when selection changes
- `icon`: Optional icon element

**Functionality:**
- Filters options based on search input
- Shows checkmark for selected option
- Closes on selection
- Clears search on close

---

## Custom Hooks

### `src/hooks/useLogin.tsx`
Login hook that:
- Manages login submission state
- Calls login API endpoint
- Handles 2FA flow (stores code_id)
- Updates auth store on success
- Returns `handleLogin` function and `isSubmitting` state

**API Endpoint:** `/Api/V8/custom/portal/automation-login`

**Response Handling:**
- If `code_verification_required` → Store code_id, return early
- If `access_token` → Set auth in store
- Returns full response for component handling

### `src/hooks/useAffiliates.tsx`
Affiliate companies hook:
- Fetches affiliate companies from API
- Transforms data into dropdown options format
- Manages loading and error states
- Provides `refetch` function

**API Endpoint:** `/Api/V8/custom/portal/fetch-affiliates`

**Return Type:**
```typescript
{
  affiliateOptions: {value: string, label: string}[]
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}
```

**Usage:** Used in `ListView` to populate affiliate filter dropdown

### `src/hooks/use-mobile.tsx`
Mobile detection hook:
- Detects if viewport is mobile (< 768px)
- Uses `matchMedia` API
- Updates on window resize
- Returns boolean value

**Breakpoint:** 768px (standard tablet/mobile breakpoint)

---

## State Management

### `src/store/auth.ts`
Zustand store for authentication state:

**State Properties:**
- `user`: User object or null
- `accessToken`: JWT access token
- `refreshToken`: Refresh token for token renewal
- `expiresIn`: Token expiration time in seconds
- `codeId`: 2FA code ID (temporary)

**Actions:**
- `setAuth`: Sets authentication data and stores in localStorage
- `setCodeId`: Stores 2FA code ID temporarily
- `clearAuth`: Clears all auth data and localStorage
- `refreshAccessToken`: Refreshes access token using refresh token

**Persistence:**
- Stores tokens in localStorage
- Syncs with localStorage on set/clear
- Loads from localStorage on app init (via AuthProvider)

**DevTools:**
- Enabled with name "AuthStore"
- Trace enabled for debugging

### `src/providers/AuthProvider.tsx`
React Context provider for authentication:

**Context Value:**
- `accessToken`: Current access token
- `refreshToken`: Current refresh token
- `expiresIn`: Token expiration
- `userId`: User ID
- `isAuthenticated`: Boolean auth status
- `loading`: Initial auth check loading state
- `setTokens`: Function to set tokens
- `clearTokens`: Function to clear tokens

**Initialization:**
1. On mount, loads tokens from localStorage
2. Validates token via API call
3. If valid → Sets authenticated state
4. If invalid → Clears tokens and redirects to login

**Token Validation:**
- API: `/Api/V8/custom/portal/validate-token`
- Validates on app load
- Syncs with Zustand store

**Dual State Management:**
- Maintains both Context and Zustand store
- Keeps both in sync for compatibility

---

## API Integration

### `src/config/api.ts`
API configuration:
- **Base URL**: `https://gb-crm-3.vertekx.com` (from env or default)
- **Timeout**: 30 seconds
- **Headers**: JSON content type

**Environment Variable:** `VITE_API_URL`

### `src/lib/api.tsx`
Axios client with interceptors:

**Request Interceptor:**
- Adds `Authorization: Bearer {token}` header
- Gets token from Zustand store
- Applied to all requests

**Response Interceptor:**
- Handles 401 Unauthorized errors
- Implements automatic token refresh
- Queues failed requests during refresh
- Retries original request with new token

**Token Refresh Flow:**
1. Request fails with 401
2. Check if already refreshing (prevents multiple refresh calls)
3. If refreshing → Queue request
4. If not → Start refresh process
5. Call `refreshAccessToken` from store
6. On success → Update token, retry queued requests
7. On failure → Clear auth, redirect to login

**Queue Management:**
- Maintains queue of failed requests
- Processes queue after token refresh
- Resolves/rejects queued promises appropriately

### `src/lib/refreshToken.ts`
Refresh token API function:
- **Endpoint:** `/Api/V8/custom/portal/refresh-token`
- **Method:** POST
- **Payload:** `{ refresh_token: string }`
- **Returns:** New access_token, refresh_token, expires_in

**Purpose:** Separate function to avoid interceptor loops

---

## Authentication System

### Authentication Flow

**1. Login Process:**
```
User enters credentials
  ↓
useLogin hook called
  ↓
POST /Api/V8/custom/portal/automation-login
  ↓
Response check:
  ├─ If code_verification_required → Store code_id → Navigate to /2fa
  └─ If access_token → Set auth → Navigate to /dashboard
```

**2. Two-Factor Authentication:**
```
User enters 6-digit code
  ↓
POST /Api/V8/custom/portal/verify-automation-code
  ↓
If verified → Set tokens → Navigate to /dashboard
If failed → Show error → Clear input
```

**3. Token Refresh:**
```
API request with expired token
  ↓
401 Unauthorized response
  ↓
Refresh token API called
  ↓
New tokens received
  ↓
Update store → Retry original request
```

**4. Protected Routes:**
```
Route access attempt
  ↓
ProtectedRoute checks auth
  ↓
If loading → Show spinner
If not authenticated → Redirect to /login
If authenticated → Render component
```

### Token Storage
- **localStorage keys:**
  - `access_token`: JWT access token
  - `refresh_token`: Refresh token
  - `expires_in`: Expiration time
  - `user_id`: User ID
  - `user`: User object (JSON stringified)

### Security Features
- Automatic token refresh on expiration
- Token validation on app load
- Secure token storage in localStorage
- Request queuing during token refresh
- Automatic logout on refresh failure

---

## Styling and UI

### `src/index.css`
Global styles and CSS variables:

**CSS Variables:**
- Color system using HSL values
- Supports dark mode
- Custom tokens for gradients and borders

**Custom Classes:**
- `.card-dashed`: Dashed border card style
- `.btn-gradient`: Gradient button with hover effects
- `.dropdown-trigger`: Styled dropdown button
- `.text-gradient`: Gradient text effect

**Animations:**
- `fade-in`: Fade and slide up animation
- `pulse-glow`: Pulsing glow effect
- `accordion-down/up`: Accordion animations

**Color Scheme:**
- Primary: Teal/Cyan (168 76% 42%)
- Background: Dark blue-gray (210 29% 4%)
- Card: Slightly lighter blue-gray (212 27% 8%)
- Muted: Medium gray for secondary text

### `src/App.css`
Basic root styles (minimal, mostly handled by Tailwind)

### Component Styling
- Uses Tailwind utility classes
- shadcn/ui components for consistent design
- Responsive design with mobile breakpoints
- Dark theme by default
- Custom gradient buttons
- Icon-based UI elements

---

## Key Features

### 1. Advanced Search & Filtering
- Multiple filter types (text, dropdown, date)
- Real-time search with API integration
- Dynamic affiliate loading
- Status-based filtering
- Country-based filtering

### 2. Pagination
- Server-side pagination
- Smart page number display (max 10 visible)
- Previous/Next navigation
- Page info display (current page, total pages, records)

### 3. Data Display
- Responsive table layout
- Color-coded status badges
- Formatted dates
- Conditional styling (Pass/Fail indicators)
- Empty state handling

### 4. Authentication
- Email/password login
- Two-factor authentication support
- Automatic token refresh
- Protected routes
- Session persistence

### 5. User Experience
- Loading states with spinners
- Toast notifications (success/error)
- Responsive design
- Smooth animations
- Error handling with user-friendly messages

### 6. API Integration
- Centralized API client
- Automatic token injection
- Error handling
- Request/response interceptors
- Token refresh mechanism

---

## API Endpoints Used

1. **POST** `/Api/V8/custom/portal/automation-login`
   - Login with email/password
   - Returns: login status, tokens, 2FA requirements

2. **POST** `/Api/V8/custom/portal/verify-automation-code`
   - Verify 2FA code
   - Returns: verification status, tokens

3. **POST** `/Api/V8/custom/portal/refresh-token`
   - Refresh access token
   - Returns: New tokens and expiration

4. **POST** `/Api/V8/custom/portal/validate-token`
   - Validate current token
   - Returns: Validation status

5. **POST** `/Api/V8/custom/portal/fetch-affiliates`
   - Get affiliate companies list
   - Returns: Array of affiliate companies

6. **POST** `/Api/V8/custom/customer/get-credit-card-validation-data`
   - Get customer validation data
   - Returns: Paginated customer data with metadata

---

## Development Workflow

### Running the Application
```bash
npm install          # Install dependencies
npm run dev          # Start development server (port 8080)
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Environment Variables
Create `.env` file:
```
VITE_API_URL=https://gb-crm-3.vertekx.com
```

### Code Organization
- **Components**: Reusable UI components
- **Pages**: Route-level components
- **Hooks**: Custom React hooks for logic reuse
- **Store**: Global state management
- **Lib**: Utility functions and API clients
- **Config**: Configuration files

---

## Best Practices Implemented

1. **Type Safety**: Full TypeScript implementation
2. **Component Reusability**: Modular component structure
3. **State Management**: Centralized auth state with Zustand
4. **Error Handling**: Comprehensive error handling with user feedback
5. **Loading States**: Loading indicators for async operations
6. **Responsive Design**: Mobile-first approach
7. **Code Organization**: Clear separation of concerns
8. **API Abstraction**: Centralized API client with interceptors
9. **Security**: Token-based authentication with automatic refresh
10. **User Feedback**: Toast notifications for all user actions

---

## Future Enhancements

Potential improvements:
- Implement date range picker for custom date filtering
- Add export functionality (CSV download)
- Implement bulk actions
- Add advanced filtering options
- Implement data caching with React Query
- Add data visualization/charts
- Implement real-time updates
- Add user preferences/settings
- Implement search history
- Add keyboard shortcuts

---

## Conclusion

This Smart Search UI application is a well-structured, modern React application with comprehensive authentication, data management, and user interface features. The codebase follows React best practices, uses TypeScript for type safety, and implements a robust authentication system with token management and refresh capabilities.

The application is production-ready with proper error handling, loading states, and user feedback mechanisms. The modular architecture makes it easy to extend and maintain.

