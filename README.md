# Notes App Frontend

A modern, real-time collaborative note-taking application built with Next.js 15 and TypeScript, featuring markdown support and seamless real-time collaboration.

## ✨ Features

- 📝 **Markdown Editor**: Rich markdown editing with live preview using @uiw/react-md-editor
- 🔄 **Real-time Collaboration**: Edit and share notes in real-time with Socket.IO integration
- 💾 **Auto-saving**: Intelligent auto-save with visual indicators and debounced saving
- 🔐 **Secure Authentication**: JWT-based authentication with protected routes
- 🎨 **Modern UI**: Beautiful dark theme with Tailwind CSS and custom components
- 📱 **Fully Responsive**: Mobile-first design that works perfectly on all devices
- 🚀 **Performance**: Optimized with Next.js 15 App Router and React 19
- 🔒 **Protected Routes**: Client-side route protection with middleware
- 🌐 **Socket Integration**: Real-time updates and collaboration features

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom SCSS
- **Editor**: @uiw/react-md-editor (Markdown editor)
- **Real-time**: Socket.IO Client
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Authentication**: JWT with cookies (js-cookie)
- **Validation**: Zod
- **UI Components**: Custom components with Tailwind
- **Fonts**: Poppins (Google Fonts)

## 📋 Prerequisites

- **Node.js**: 18.17+ or 20.0+
- **Package Manager**: npm, yarn, or pnpm
- **Backend Server**: Notes API server running (see backend README)

## 🚀 Setup Instructions

### 1. Clone and Navigate
```bash
git clone [repository-url]
cd notesfrontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Configuration
Copy the environment template and configure:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3052/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:3052

# App Configuration
NEXT_PUBLIC_APP_NAME=Notes App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Start Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

### 5. Access Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## ⚙️ Environment Variables

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:3052/api` | ✅ |
| `NEXT_PUBLIC_SOCKET_URL` | Socket.IO server URL | `http://localhost:3052` | ✅ |
| `NEXT_PUBLIC_APP_NAME` | Application display name | `Notes App` | ⭕ |
| `NEXT_PUBLIC_APP_URL` | Frontend application URL | `http://localhost:3000` | ⭕ |

## 📜 Available Scripts

```bash
npm run dev         # Start development server with Turbo
npm run build       # Build production bundle
npm run start       # Start production server
npm run lint        # Run ESLint code linting
```

## 📁 Project Structure

```
src/
├── app/                     # Next.js 15 App Router
│   ├── (auth)/             # Authentication route group
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── dashboard/          # Protected dashboard area
│   │   ├── editor/         # Note editor pages
│   │   │   └── [id]/       # Dynamic note editor
│   │   ├── layout.tsx      # Dashboard layout
│   │   └── page.tsx        # Dashboard home
│   ├── store/              # Zustand state stores
│   │   ├── auth.ts         # Authentication state
│   │   └── note.ts         # Notes state management
│   ├── utils/              # App-level utilities
│   ├── globals.css         # Global styles
│   └── layout.tsx          # Root layout
├── components/             # Reusable React components
│   ├── ui/                # UI-specific components
│   │   ├── Editor.tsx     # Markdown editor component
│   │   ├── MarkdownEditor.tsx # Advanced markdown editor
│   │   ├── SaveIndicator.tsx  # Auto-save status indicator
│   │   ├── Toast.tsx      # Notification system
│   │   └── BackgroundGradient.tsx # Background effects
│   ├── nav/               # Navigation components
│   │   ├── MainNav.tsx    # Main navigation
│   │   ├── MobileNav.tsx  # Mobile navigation
│   │   └── sidebar.tsx    # Dashboard sidebar
│   ├── ErrorBoundary.tsx  # Error boundary wrapper
│   ├── LazyLoader.tsx     # Lazy loading component
│   └── ProtectedRoute.tsx # Route protection component
├── hooks/                 # Custom React hooks
│   ├── use-auto-save.ts   # Auto-save functionality
│   ├── use-debounce.ts    # Debouncing utility
│   ├── use-async.ts       # Async operations
│   └── use-mobile.ts      # Mobile device detection
├── lib/                   # Core utilities and configs
│   ├── api.ts            # API client functions
│   ├── axios.ts          # Configured Axios instance
│   └── socket.ts         # Socket.IO client setup
├── styles/               # Additional styling
│   ├── _variables.scss   # SCSS variables
│   └── _keyframe-animations.scss # Custom animations
└── middleware.ts         # Next.js middleware for auth
```

## 🔐 Authentication Flow

1. **Login/Register**: Users authenticate via `/login` or `/register`
2. **JWT Storage**: Tokens stored securely in HTTP-only cookies
3. **Route Protection**: Middleware protects dashboard routes
4. **Auto-redirect**: Unauthenticated users redirected to login
5. **State Management**: Auth state managed with Zustand

## 🔄 Real-time Features

- **Live Collaboration**: Multiple users can edit notes simultaneously
- **Auto-save**: Changes saved automatically with visual feedback
- **Socket Events**: Real-time synchronization of note updates
- **Connection Status**: Visual indicators for connection state
- **Conflict Resolution**: Handles concurrent edits gracefully

## 🎨 Design System

- **Theme**: Custom dark theme optimized for coding/writing
- **Typography**: Poppins font family for excellent readability
- **Colors**: Consistent color palette with CSS custom properties
- **Components**: Reusable, accessible component library
- **Responsive**: Mobile-first approach with breakpoint system
- **Animations**: Smooth transitions and micro-interactions

## 🚀 Production Deployment

### Build for Production
```bash
npm run build
npm run start
```

### Deployment Platforms
- **Vercel** (Recommended for Next.js)
- **Netlify**
- **AWS Amplify**
- **Railway**
- **Docker**

### Environment Variables for Production
- Update `NEXT_PUBLIC_API_URL` to production API URL
- Update `NEXT_PUBLIC_SOCKET_URL` to production Socket.IO URL
- Set `NEXT_PUBLIC_APP_URL` to production domain
- Ensure HTTPS for production environments

## 🧪 Development Tips

### Hot Reload with Turbo
This project uses Next.js Turbo mode for faster development:
```bash
npm run dev  # Already includes --turbo flag
```

### Code Quality
- **ESLint**: Configured for Next.js and TypeScript
- **TypeScript**: Strict mode enabled for better type safety
- **Component Structure**: Follow the established component patterns
- **State Management**: Use Zustand stores for complex state

### Debugging
- **React DevTools**: Install browser extension for component debugging
- **Zustand DevTools**: Enable in development for state debugging
- **Network Tab**: Monitor API calls and Socket.IO connections

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your feature branch (`git checkout -b feature/amazing-feature`)
3. **Follow** the code style and component patterns
4. **Test** your changes thoroughly
5. **Commit** your changes (`git commit -m 'Add amazing feature'`)
6. **Push** to the branch (`git push origin feature/amazing-feature`)
7. **Open** a Pull Request

### Code Style Guidelines
- Use TypeScript for all new components
- Follow the existing component structure
- Use Tailwind CSS for styling
- Add proper TypeScript types
- Include JSDoc comments for complex functions

## 📄 License

This project is licensed under the ISC License - see the LICENSE file for details.

## 🆘 Support & Issues

If you encounter any problems:

1. **Check** the console for error messages
2. **Verify** backend server is running
3. **Ensure** environment variables are set correctly
4. **Create** an issue with detailed error information

---

**Built with ❤️ using Next.js 15, React 19, and modern web technologies**
