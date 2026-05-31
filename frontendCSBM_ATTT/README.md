# Frontend - CSBM ATTT (Employee Security Management System)

Ứng dụng web frontend cho hệ thống quản lý bảo mật tài liệu và nhân viên, xây dựng trên Next.js 14 với React 18, TypeScript và Tailwind CSS.

## Mục Lục

- [Tính Năng](#tính-năng)
- [Công Nghệ Sử Dụng](#công-nghệ-sử-dụng)
- [Yêu Cầu Hệ Thống](#yêu-cầu-hệ-thống)
- [Cài Đặt](#cài-đặt)
- [Cấu Hình](#cấu-hình)
- [Chạy Ứng Dụng](#chạy-ứng-dụng)
- [Cấu Trúc Project](#cấu-trúc-project)
- [Routing & Pages](#routing--pages)
- [Components](#components)
- [Services & API](#services--api)
- [Styling](#styling)
- [Development](#development)
- [Build & Deploy](#build--deploy)
- [Troubleshooting](#troubleshooting)

## Tính Năng

Authentication
- Đăng ký người dùng
- Đăng nhập với JWT
- Quên mật khẩu
- Persistent login (localStorage)
- Auto logout khi token hết hạn

Dashboard
- Overview statistics
- Charts & Analytics
- Notifications
- Quick actions

Quản lý Nhân viên
- Danh sách nhân viên
- Tạo nhân viên mới
- Cập nhật thông tin
- Xóa nhân viên
- Tìm kiếm & lọc
- Export dữ liệu (CSV, PDF)

Quản lý File/Tài liệu
- Upload file
- File được tự động mã hóa
- Download file
- Giải mã file
- Lịch sử file
- Tagging & Organization

Quản lý Người dùng (Admin)
- Danh sách người dùng
- Tạo tài khoản
- Đặt lại mật khẩu
- Vô hiệu hóa/Kích hoạt
- Quản lý quyền hạn (Roles)

Audit & Security
- Xem audit logs
- Tìm kiếm hoạt động
- Lịch sử thay đổi
- Activity tracking
- Security reports

Settings
- Cấu hình hệ thống
- Dark mode
- Language selection
- Password change
- Notifications

## Công Nghệ Sử Dụng

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| Next.js | 14.2.3 | React Framework |
| React | 18.2.0 | UI Library |
| TypeScript | 5.4.5 | Type Safety |
| Tailwind CSS | 3.4.4 | Styling |
| Axios | 1.13.6 | HTTP Client |
| Lucide React | 0.511.0 | Icons |
| Node.js | 18+ | Runtime |
| npm | 9+ | Package Manager |

## Yêu Cầu Hệ Thống

- Node.js: 18.0 trở lên
- npm: 9.0 trở lên (hoặc yarn/pnpm)
- Browser: Chrome, Firefox, Safari, Edge (latest)
- RAM: Tối thiểu 2GB
- Disk Space: 500MB

## Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd frontendCSBM_ATTT
```

### 2. Cài đặt Dependencies

```bash
npm install
```

Hoặc sử dụng yarn:

```bash
yarn install
```

### 3. Cấu hình Environment

Tạo file .env.local tại root của project:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_TOKEN_KEY=auth_token
NEXT_PUBLIC_TOKEN_EXPIRY=86400000

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=52428800
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,txt,zip

# Features
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ITEMS_PER_PAGE=20
```

### 4. Kiểm tra Backend Connection

```bash
npm run dev
# Truy cập http://localhost:3000
```

## Cấu Hình

### API Base URL

Chỉnh sửa lib/axios.ts:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Config

File: lib/auth.ts

```typescript
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 86400000, // 24 hours
  refreshThreshold: 5 * 60 * 1000, // 5 minutes
};
```

### CORS Settings

Backend cần allow requests từ http://localhost:3000

### Environment Variables

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NODE_ENV=development

# Production
NEXT_PUBLIC_API_URL=https://api.example.com/api
NODE_ENV=production
```

## Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

### Build Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

### Check & Fix Linting Issues

```bash
npm run lint -- --fix
```

## Cấu Trúc Project

```
frontendCSBM_ATTT/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── (auth)/                  # Auth routes (group)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/             # Dashboard routes (group)
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/            # Dynamic route
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── files/
│   │   │   └── page.tsx
│   │   ├── users/               # Admin only
│   │   │   └── page.tsx
│   │   ├── audit-logs/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── auth/                # Auth components
│   │   ├── employee/            # Employee components
│   │   ├── file/                # File components
│   │   ├── admin/               # Admin components
│   │   ├── common/              # Shared components
│   │   └── layout/              # Layout components
├── hooks/                        # Custom React hooks
│   └── use-auth.ts
├── lib/                         # Utilities & Config
│   ├── axios.ts
│   ├── auth.ts
│   ├── constants.ts
│   └── utils.ts
├── services/                    # API services
│   ├── auth.service.ts
│   ├── employee.service.ts
│   ├── file.service.ts
│   ├── user.service.ts
│   └── audit-log.service.ts
├── types/                       # TypeScript types
│   ├── auth.ts
│   ├── employee.ts
│   ├── file.ts
│   ├── user.ts
│   ├── audit-log.ts
│   └── index.ts
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── middleware.ts
└── README.md
```

## Routing & Pages

### Public Routes

```
/                    - Home page
/auth/login          - Login page
/auth/register       - Registration page
```

### Protected Routes (Authenticated)

```
/dashboard           - Dashboard overview
/employees           - List all employees
/employees/create    - Create new employee
/employees/:id       - Employee detail & edit
/files               - File management
/settings            - User settings
```

### Admin Routes

```
/admin/users         - User management
/admin/audit-logs    - Audit logs viewer
```

## Components

### Layout Components
- Navbar: Top navigation bar
- Sidebar: Side navigation menu
- Header: Page header
- Footer: Page footer

### Auth Components
- LoginForm: Login form
- RegisterForm: Registration form

### Employee Components
- EmployeeForm: Create/Edit employee form
- EmployeeTable: Display employees in table

### File Components
- FileUpload: File upload widget
- FileList: List of uploaded files

### Admin Components
- UserForm: Create/Edit user form
- UserTable: Display users in table
- AuditLogTable: Display audit logs

### Common Components
- Pagination: Pagination component
- Loading: Loading spinner
- ErrorBoundary: Error boundary wrapper
- ConfirmDialog: Confirmation dialog

## Services & API

### Auth Service (services/auth.service.ts)

```typescript
login(username, password): Promise<AuthResponse>
register(userData): Promise<User>
logout(): void
refreshToken(): Promise<AuthResponse>
```

### Employee Service (services/employee.service.ts)

```typescript
getAll(page, limit): Promise<EmployeeList>
getById(id): Promise<Employee>
create(data): Promise<Employee>
update(id, data): Promise<Employee>
delete(id): Promise<void>
```

### File Service (services/file.service.ts)

```typescript
upload(file, employeeId): Promise<FileResponse>
getAll(page, limit): Promise<FileList>
download(id): Promise<Blob>
decrypt(id): Promise<Blob>
delete(id): Promise<void>
```

### User Service (services/user.service.ts)

```typescript
getAll(page, limit): Promise<UserList>
getById(id): Promise<User>
create(data): Promise<User>
update(id, data): Promise<User>
resetPassword(id, newPassword): Promise<void>
delete(id): Promise<void>
```

### Audit Log Service (services/audit-log.service.ts)

```typescript
getAll(page, limit, filters): Promise<AuditLogList>
getById(id): Promise<AuditLog>
export(format): Promise<Blob>
```

## Styling

Project sử dụng Tailwind CSS cho styling.

Cấu hình: tailwind.config.ts

### Global Styles

File: app/globals.css

### Color Scheme

- Primary: Blue
- Secondary: Gray
- Success: Green
- Warning: Yellow
- Error: Red
- Dark Mode: Supported

## Authentication

### JWT Token Storage

Token được lưu trong localStorage với key: auth_token

### Token Refresh

- Automatic refresh 5 minutes before expiry
- Fallback to login if refresh fails

### Protected Routes

Middleware tự động chuyển hướng người dùng chưa xác thực tới /auth/login

### Custom Hook: useAuth

```typescript
const { user, token, login, logout, isLoading } = useAuth();
```

## Development

### TypeScript

- Strict mode enabled
- Path aliases configured

### Best Practices

1. Use TypeScript for type safety
2. Create reusable components
3. Use custom hooks for logic
4. Separate concerns (services, components, types)
5. Error handling & loading states
6. Accessibility (a11y)

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## Troubleshooting

### Cannot Connect to Backend

```
Error: Network Error
Solution:
1. Kiểm tra NEXT_PUBLIC_API_URL trong .env.local
2. Kiểm tra backend đang chạy (http://localhost:8080)
3. Kiểm tra CORS configuration trong backend
```

### Authentication Failed

```
Error: Unauthorized
Solution:
1. Clear localStorage: localStorage.clear()
2. Login lại
3. Kiểm tra token trong DevTools
```

### Build Errors

```
Error: Build failed
Solution:
1. npm run lint -- --fix
2. rm -rf .next node_modules && npm install
3. npm run build --verbose
```

### Port Already in Use

```
Error: Port 3000 already in use
Solution:
npm run dev -- -p 3001
```

## Performance Tips

- Use Image component instead of <img> tags
- Lazy load components with dynamic()
- Use useMemo & useCallback appropriately
- Optimize API calls (debouncing, caching)

## License

This project is licensed under the MIT License.

## Contributors

Development Team: Nhóm 3

---

Last Updated: May 2026
Version: 1.0.0

| Công Nghệ | Phiên Bản | Mục Đích |
|-----------|----------|---------|
| Next.js | 14.2.3 | React Framework |
| React | 18.2.0 | UI Library |
| TypeScript | 5.4.5 | Type Safety |
| Tailwind CSS | 3.4.4 | Styling |
| Axios | 1.13.6 | HTTP Client |
| Lucide React | 0.511.0 | Icons |
| Node.js | 18+ | Runtime |
| npm | 9+ | Package Manager |

## Yêu Cầu Hệ Thống

- Node.js: 18.0 trở lên
- npm: 9.0 trở lên (hoặc yarn/pnpm)
- Browser: Chrome, Firefox, Safari, Edge (latest)
- RAM: Tối thiểu 2GB
- Disk Space: 500MB

## Cài Đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd frontendCSBM_ATTT
```

### 2. Cài đặt Dependencies

```bash
npm install
```

Hoặc sử dụng yarn:

```bash
yarn install
```

### 3. Cấu hình Environment

Tạo file .env.local tại root của project:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NEXT_PUBLIC_API_TIMEOUT=30000

# Authentication
NEXT_PUBLIC_TOKEN_KEY=auth_token
NEXT_PUBLIC_TOKEN_EXPIRY=86400000

# File Upload
NEXT_PUBLIC_MAX_FILE_SIZE=52428800
NEXT_PUBLIC_ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,txt,zip

# Features
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_ENABLE_EXPORT=true
NEXT_PUBLIC_ITEMS_PER_PAGE=20
```

### 4. Kiểm tra Backend Connection

```bash
npm run dev
# Truy cập http://localhost:3000
```

## Cấu Hình

### API Base URL

Chỉnh sửa lib/axios.ts:

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Authentication Config

File: lib/auth.ts

```typescript
export const AUTH_CONFIG = {
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',
  tokenExpiry: 86400000, // 24 hours
  refreshThreshold: 5 * 60 * 1000, // 5 minutes
};
```

### CORS Settings

Backend cần allow requests từ http://localhost:3000

### Environment Variables

```bash
# Development
NEXT_PUBLIC_API_URL=http://localhost:8080/api
NODE_ENV=development

# Production
NEXT_PUBLIC_API_URL=https://api.example.com/api
NODE_ENV=production
```

## Chạy Ứng Dụng

### Development Mode

```bash
npm run dev
```

Ứng dụng sẽ chạy tại http://localhost:3000

### Build Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

### Check & Fix Linting Issues

```bash
npm run lint -- --fix
```

## Cấu Trúc Project

```
frontendCSBM_ATTT/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── (auth)/                  # Auth routes (group)
│   │   ├── login/
│   │   │   └── page.tsx
│   │   └── register/
│   │       └── page.tsx
│   ├── (dashboard)/             # Dashboard routes (group)
│   │   ├── layout.tsx           # Dashboard layout
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── employees/
│   │   │   ├── page.tsx
│   │   │   ├── [id]/            # Dynamic route
│   │   │   │   └── page.tsx
│   │   │   └── create/
│   │   │       └── page.tsx
│   │   ├── files/
│   │   │   └── page.tsx
│   │   ├── users/               # Admin only
│   │   │   └── page.tsx
│   │   ├── audit-logs/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── components/
│   │   ├── auth/                # Auth components
│   │   ├── employee/            # Employee components
│   │   ├── file/                # File components
│   │   ├── admin/               # Admin components
│   │   ├── common/              # Shared components
│   │   └── layout/              # Layout components
├── hooks/                        # Custom React hooks
│   └── use-auth.ts
├── lib/                         # Utilities & Config
│   ├── axios.ts
│   ├── auth.ts
│   ├── constants.ts
│   └── utils.ts
├── services/                    # API services
│   ├── auth.service.ts
│   ├── employee.service.ts
│   ├── file.service.ts
│   ├── user.service.ts
│   └── audit-log.service.ts
├── types/                       # TypeScript types
│   ├── auth.ts
│   ├── employee.ts
│   ├── file.ts
│   ├── user.ts
│   ├── audit-log.ts
│   └── index.ts
├── public/                      # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
├── middleware.ts
└── README.md
```

## Routing & Pages

### Public Routes

```
/                    - Home page
/auth/login          - Login page
/auth/register       - Registration page
```

### Protected Routes (Authenticated)

```
/dashboard           - Dashboard overview
/employees           - List all employees
/employees/create    - Create new employee
/employees/:id       - Employee detail & edit
/files               - File management
/settings            - User settings
```

### Admin Routes

```
/admin/users         - User management
/admin/audit-logs    - Audit logs viewer
```

## Components

### Layout Components
- Navbar: Top navigation bar
- Sidebar: Side navigation menu
- Header: Page header
- Footer: Page footer

### Auth Components
- LoginForm: Login form
- RegisterForm: Registration form

### Employee Components
- EmployeeForm: Create/Edit employee form
- EmployeeTable: Display employees in table

### File Components
- FileUpload: File upload widget
- FileList: List of uploaded files

### Admin Components
- UserForm: Create/Edit user form
- UserTable: Display users in table
- AuditLogTable: Display audit logs

### Common Components
- Pagination: Pagination component
- Loading: Loading spinner
- ErrorBoundary: Error boundary wrapper
- ConfirmDialog: Confirmation dialog

## Services & API

### Auth Service

```typescript
login(username, password): Promise<AuthResponse>
register(userData): Promise<User>
logout(): void
refreshToken(): Promise<AuthResponse>
```

### Employee Service

```typescript
getAll(page, limit): Promise<EmployeeList>
getById(id): Promise<Employee>
create(data): Promise<Employee>
update(id, data): Promise<Employee>
delete(id): Promise<void>
```

### File Service

```typescript
upload(file, employeeId): Promise<FileResponse>
getAll(page, limit): Promise<FileList>
download(id): Promise<Blob>
decrypt(id): Promise<Blob>
delete(id): Promise<void>
```

## Styling

Project sử dụng Tailwind CSS cho styling.

Cấu hình: tailwind.config.ts

### Global Styles

File: app/globals.css

### Color Scheme

- Primary: Blue
- Secondary: Gray
- Success: Green
- Warning: Yellow
- Error: Red
- Dark Mode: Supported

## Authentication

### JWT Token Storage

Token được lưu trong localStorage với key: auth_token

### Token Refresh

- Automatic refresh 5 minutes before expiry
- Fallback to login if refresh fails

### Protected Routes

Middleware tự động chuyển hướng người dùng chưa xác thực tới /auth/login

### Custom Hook: useAuth

```typescript
const { user, token, login, logout, isLoading } = useAuth();
```

## Development

### TypeScript

- Strict mode enabled
- Path aliases configured

### Best Practices

1. Use TypeScript for type safety
2. Create reusable components
3. Use custom hooks for logic
4. Separate concerns (services, components, types)
5. Error handling & loading states
6. Accessibility (a11y)

## Build & Deploy

### Build for Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Deploy to Vercel

```bash
npm i -g vercel
vercel
```

## Troubleshooting

### Cannot Connect to Backend

```
Error: Network Error
Solution:
1. Kiểm tra NEXT_PUBLIC_API_URL trong .env.local
2. Kiểm tra backend đang chạy (http://localhost:8080)
3. Kiểm tra CORS configuration trong backend
```

### Authentication Failed

```
Error: Unauthorized
Solution:
1. Clear localStorage: localStorage.clear()
2. Login lại
3. Kiểm tra token trong DevTools
```

### Build Errors

```
Error: Build failed
Solution:
1. npm run lint -- --fix
2. rm -rf .next node_modules && npm install
3. npm run build --verbose
```

### Port Already in Use

```
Error: Port 3000 already in use
Solution:
npm run dev -- -p 3001
```

## Performance Tips

- Use Image component instead of <img> tags
- Lazy load components with dynamic()
- Use useMemo & useCallback appropriately
- Optimize API calls (debouncing, caching)

## License

This project is licensed under the MIT License.

## Contributors

Development Team: Nhóm 3

---

Last Updated: May 2026
Version: 1.0.0
