# Digital Signage Frontend

A modern, responsive digital signage management interface built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive admin dashboard for managing digital signage content, playlists, screens, and scheduling.

## 🚀 Features

### Core Functionality
- **Dashboard Analytics**: Real-time statistics and system health monitoring
- **Media Management**: Upload, organize, and manage digital content
- **Playlist Builder**: Drag-and-drop playlist creation with content scheduling
- **Screen Management**: Monitor and control digital signage displays
- **Schedule Management**: Time-based content delivery with timezone support
- **User Management**: Role-based access control and user administration
- **Real-time Updates**: Live synchronization with connected displays

### User Experience
- **Modern UI**: Beautiful, accessible interface with Radix UI components
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Drag & Drop**: Intuitive content organization and playlist management
- **Real-time Notifications**: Instant updates and system alerts
- **Progressive Web App**: Offline support and app-like experience

## 🛠 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **UI Framework**: React 19
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: Redux Toolkit
- **Authentication**: Iron Session + Custom flow
- **Real-time**: Socket.IO Client
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React

## 📋 Prerequisites

Before running the application, ensure you have:

- Node.js (v18 or higher)
- npm or yarn package manager
- Access to the Digital Signage Backend API
- Modern web browser with JavaScript enabled

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/Nithish-kumar-18-JS/digital-signage-frontend-v1.git
cd digital-signage-frontend-v1
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_WEBSOCKET_URL=http://localhost:3000

# Authentication
NEXT_PUBLIC_APP_URL=http://localhost:3000
SESSION_SECRET="your-super-secret-session-key"

# Application Settings
NEXT_PUBLIC_APP_NAME="Digital Signage Manager"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID="your_analytics_id"
```

### 4. Development Server
```bash
# Start the development server
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🏗 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── (protected)/        # Protected routes with authentication
│   │   └── [type]/         # Dynamic route for different page types
│   ├── login/              # Login page
│   ├── signup/             # Registration page
│   ├── webplayer/          # Digital signage player view
│   ├── layout.tsx          # Root layout component
│   ├── layoutClient.tsx    # Client-side layout logic
│   └── page.tsx            # Home page
├── api/                    # API integration
│   ├── auth/               # Authentication API calls
│   ├── dashboard/          # Dashboard data fetching
│   ├── media/              # Media management APIs
│   ├── playlist/           # Playlist operations
│   ├── schedule/           # Scheduling APIs
│   ├── screens/            # Screen management
│   └── index.ts            # API configuration
├── components/             # Reusable React components
│   ├── ui/                 # Base UI components (shadcn/ui)
│   ├── modals/             # Modal dialogs
│   ├── dashboard.tsx       # Dashboard component
│   ├── media.tsx           # Media management
│   ├── playlist.tsx        # Playlist builder
│   ├── schedule.tsx        # Scheduling interface
│   └── screens.tsx         # Screen management
├── lib/                    # Utility functions and configurations
├── types/                  # TypeScript type definitions
└── components.json         # Component library configuration
```

## 🎨 UI Components

The application uses a modern component system built on:

- **Radix UI**: Unstyled, accessible components
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Pre-built component library
- **Framer Motion**: Smooth animations and transitions

### Key Components
- **Dashboard**: Analytics and system overview
- **Media Manager**: File upload and organization
- **Playlist Builder**: Drag-and-drop content arrangement
- **Screen Monitor**: Real-time device status
- **Schedule Editor**: Time-based content planning

## 🔐 Authentication & Security

### Authentication Flow
1. **Login/Registration**: Secure user authentication
2. **Session Management**: Server-side session handling with Iron Session
3. **Route Protection**: Protected routes with authentication middleware
4. **Role-Based Access**: Different permission levels for users

### Security Features
- Server-side session management
- CSRF protection
- Input validation with Zod
- Secure HTTP headers
- XSS protection

## 📱 Responsive Design

The application is fully responsive with:
- **Mobile-first Design**: Optimized for mobile devices
- **Adaptive Layouts**: Different layouts for various screen sizes
- **Touch-friendly Interface**: Gestures and touch interactions
- **Progressive Enhancement**: Works on all modern browsers

## 🔄 Real-time Features

Real-time functionality includes:
- **Live Dashboard Updates**: Automatic data refresh
- **Screen Status Monitoring**: Real-time device health
- **Content Synchronization**: Instant playlist updates
- **System Notifications**: Live alerts and messages
- **WebSocket Integration**: Persistent connection with backend

## 🚀 Available Scripts

```bash
# Development
npm run dev              # Start development server with Turbopack
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Testing (when implemented)
npm run test            # Run test suite
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Generate coverage report
```

## 🎯 Key Features Guide

### Dashboard
- View system statistics and health metrics
- Monitor screen status and connectivity
- Track media usage and storage
- Analyze scheduling effectiveness

### Media Management
- Upload images, videos, and documents
- Organize content with tags and categories
- Preview media before publishing
- Manage file metadata and descriptions

### Playlist Creation
- Drag-and-drop content arrangement
- Set display duration for each item
- Configure transition effects
- Preview playlist before deployment

### Screen Management
- Register and configure displays
- Monitor device health and status
- Update screen settings remotely
- Track last seen and connectivity

### Scheduling
- Create time-based content schedules
- Set recurring patterns and exceptions
- Assign playlists to specific screens
- Configure timezone-aware scheduling

## 🌐 WebPlayer

The WebPlayer (`/webplayer`) is a dedicated view for digital signage displays:
- **Fullscreen Content**: Optimized for display screens
- **Automatic Playback**: Seamless content rotation
- **Offline Capability**: Cached content for network interruptions
- **Remote Control**: Managed through the admin interface

## 🔧 Development

### Code Style
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting (configured)
- **Tailwind CSS**: Utility-first styling

### State Management
- **Redux Toolkit**: Predictable state management
- **React Hook Form**: Form state and validation
- **Context API**: Component-level state sharing

### Performance Optimization
- **Next.js 15**: Latest performance improvements
- **App Router**: Optimized routing and loading
- **Image Optimization**: Automatic image compression
- **Code Splitting**: Automatic bundle optimization
- **Lazy Loading**: Component-level lazy loading

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```bash
NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
NEXT_PUBLIC_WEBSOCKET_URL=https://your-api-domain.com
SESSION_SECRET="your-production-secret"
```

### Deployment Options
- **Vercel**: Optimized for Next.js applications
- **Netlify**: Static site deployment with serverless functions
- **AWS/GCP/Azure**: Cloud platform deployment
- **Docker**: Containerized deployment

### Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

**Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Authentication Issues**
- Check session configuration in middleware
- Verify API endpoint URLs
- Ensure cookies are enabled

**WebSocket Connection Problems**
- Verify backend WebSocket server is running
- Check CORS configuration
- Ensure network connectivity

**Styling Issues**
- Check Tailwind CSS configuration
- Verify component imports
- Clear browser cache

## 🧪 Testing

### Testing Strategy (Recommended)
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing
- **Accessibility Testing**: WCAG compliance

### Recommended Testing Tools
```bash
# Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom jest
npm install --save-dev cypress # For E2E testing
```

## 📚 Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI](https://www.radix-ui.com)

### Related Repositories
- [Digital Signage Backend](https://github.com/Nithish-kumar-18-JS/digital-signage-backend)
- [WebPlayer Component](https://github.com/Nithish-kumar-18-JS/digital)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use conventional commit messages
- Write tests for new features
- Update documentation for changes
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Create an issue in this repository
- Email: nithishkumar@example.com
- Documentation: [Project Wiki](https://github.com/Nithish-kumar-18-JS/digital-signage-frontend-v1/wiki)

---

Built with ❤️ using Next.js, React, and TypeScript