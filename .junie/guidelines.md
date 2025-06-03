# SalaManager Project Guidelines

## Project Overview
SalaManager is a full-stack mobile application for managing calendars, events, and resources. The application is built with:
- **Frontend**: React Native with Expo and TypeScript
- **Backend**: NestJS with Firebase Functions
- **Database**: Firebase Firestore

## Project Structure
```
/
├── api/                  # NestJS backend
│   ├── src/              # Source code
│   │   ├── auth/         # Authentication module
│   │   ├── calendar/     # Calendar functionality
│   │   ├── events/       # Event management
│   │   ├── firebase/     # Firebase integration
│   │   ├── google-auth/  # Google authentication
│   │   ├── resource/     # Resource management
│   │   ├── user/         # User management
│   │   └── utils/        # Utility functions
│   ├── dist/             # Compiled NestJS code
│   ├── index.ts          # Firebase functions entry point
│   └── firebase.json     # Firebase configuration
├── client/               # React Native frontend
│   ├── app/              # Application code
│   │   ├── api/          # API integration
│   │   ├── components/   # Reusable UI components
│   │   ├── forms/        # Form components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── navigation/   # Navigation setup
│   │   ├── Screens/      # Screen components
│   │   │   ├── Auth/     # Authentication screens
│   │   │   └── Calendar/ # Calendar screens
│   │   ├── services/     # Service functions
│   │   ├── store/        # State management
│   │   └── types/        # TypeScript types
│   ├── assets/           # Static assets
│   └── app.json          # Expo configuration
└── .junie/               # Junie guidelines
```

## Testing Guidelines
When implementing changes, Junie should:

1. **Run backend tests** if modifying backend code:
   ```bash
   cd api
   pnpm test
   ```

2. **Run frontend tests** if modifying frontend code:
   ```bash
   cd client
   pnpm test
   ```

3. For **end-to-end testing**, ensure both backend and frontend are running:
   - Start Firebase emulators: `cd api && pnpm emulators`
   - Start NestJS backend: `cd api && pnpm start:dev`
   - Start React Native frontend: `cd client && pnpm start`

## Build Guidelines
Before submitting changes, Junie should:

1. **Build the backend** if backend code was modified:
   ```bash
   cd api
   pnpm build
   ```

2. **Check frontend build** if frontend code was modified:
   ```bash
   cd client
   pnpm start
   # Press 'a' to check Android build or 'i' for iOS
   ```

## Code Style Guidelines
1. **TypeScript**: Use TypeScript for all new code.
2. **Formatting**: Follow the existing code style with Prettier configuration.
3. **Component Structure**:
   - Use functional components with hooks.
   - Keep components small and focused on a single responsibility.
4. **State Management**:
   - Use React Context and hooks for state management.
   - Avoid prop drilling by using context where appropriate.
5. **API Integration**:
   - Use the existing API integration patterns in the client/app/api directory.
   - Handle errors and loading states appropriately.
6. **Backend Structure**:
   - Follow NestJS module structure.
   - Use dependency injection for services.
   - Keep controllers thin and delegate business logic to services.

## Pull Request Guidelines
When submitting changes, Junie should:
1. Provide a clear description of the changes.
2. Reference any related issues.
3. Ensure all tests pass.
4. Include screenshots for UI changes if applicable.
5. List any new dependencies added.
