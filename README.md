# Notes App Frontend

A modern, real-time collaborative note-taking application built with Next.js 14 and TypeScript.

## Features

- 📝 **Rich Text Editor**: Powerful TipTap-based editor with comprehensive formatting options
- 🔄 **Real-time Collaboration**: Edit and share notes in real-time with WebSocket integration
- 💾 **Auto-saving**: Never lose your work with automatic saving functionality
- 🔐 **Authentication**: Secure user authentication and authorization
- 🎨 **Modern UI**: Beautiful and responsive design with Tailwind CSS
- 📱 **Mobile Friendly**: Fully responsive layout that works on all devices

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- TipTap Editor
- Socket.IO
- Tailwind CSS
- Zustand (State Management)

## Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm
- Backend server running ([Backend Repository Link])

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd notesfrontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`:
     ```bash
     cp .env.example .env.local
     ```
   - Update the variables in `.env.local`:
     ```
     NEXT_PUBLIC_API_URL=http://localhost:3052/api
     NEXT_PUBLIC_WS_URL=ws://localhost:3052
     NEXT_PUBLIC_APP_NAME=Notes App
     ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | http://localhost:3052/api |
| `NEXT_PUBLIC_WS_URL` | WebSocket Server URL | ws://localhost:3052 |
| `NEXT_PUBLIC_APP_NAME` | Application Name | Notes App |

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
├── app/                 # App router pages and layouts
├── components/          # Reusable components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and configurations
├── styles/             # Global styles and variables
└── types/              # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[License Type] - See LICENSE file for details
