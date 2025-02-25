# React Native Expo App with NestJS Backend

## 📱 Project Overview

This repository contains a full-stack application built with:
- **Frontend**: React Native with Expo and TypeScript
- **Backend**: NestJS with Firebase Functions (hosted on Firebase)
- **Database**: Firebase Firestore

## 🛠️ Prerequisites

Ensure you have the following installed on your system:

- Node.js (>=16)
- pnpm (>=8)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Firebase CLI](https://firebase.google.com/docs/cli) (for Firebase functions)
- Android Studio and/or Xcode (for mobile development)

## 📥 Installation

### Clone the Repository

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd <repository-folder>
```

### Install Dependencies

```bash
# Navigate to the API directory and install backend dependencies
cd api
pnpm install

# Navigate to the client directory and install frontend dependencies
cd ../client
pnpm install
```

## ⚙️ Setup Environment Variables

### Backend (`/api`)

Create a `.env` file in the `api` directory with the following variables:

```
# Firebase configuration (or use a firebase.json file)
FIREBASE_API_KEY=your_api_key
FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Add other backend environment variables as needed
```

### Frontend (`/client`)

Create a `.env` file in the `client` directory with your environment-specific variables.

### Firebase Configuration

Set up Firebase configuration in the appropriate files according to your project structure.

## 🚀 Running the Applications

### Backend (NestJS)

```bash
# Navigate to the backend directory
cd api

# Start the backend application in development mode
pnpm start:dev
```

### Firebase Emulators (Functions & Firestore)

```bash
# Navigate to the API directory
cd api

# Install Firebase tools if not already installed
npm install -g firebase-tools

# Login to Firebase (first-time setup)
firebase login

# Start all Firebase emulators (Functions, Firestore & Hosting)
firebase emulators:start --only functions,firestore,hosting

# Or start specific emulators
firebase emulators:start --only firestore
firebase emulators:start --only functions
firebase emulators:start --only hosting
```

### Frontend (React Native with Expo)

```bash
# Navigate to the frontend directory
cd client

# Start the Expo development server
pnpm start
```

After starting the Expo server, you can:
- Press `a` to open on Android emulator
- Press `i` to open on iOS simulator
- Scan the QR code with the Expo Go app on your physical device

## 🌐 Firebase Deployment (Backend)

```bash
# Navigate to the API directory
cd api

# Build the NestJS application
pnpm build

# Deploy Firebase Functions and Hosting for backend
firebase deploy --only functions,hosting

# Or deploy specific services
firebase deploy --only functions
firebase deploy --only hosting
```

## 🛠️ Common Scripts

Below are useful scripts you can add to your package.json files for development and testing.

### Backend (`api/package.json`)

```json
{
  "scripts": {
    "build": "nest build",
    "format": "prettier --write \"src/**/*.ts\" \"test/**/*.ts\"",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "lint": "eslint \"{src,apps,libs,test}/**/*.ts\" --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:debug": "node --inspect-brk -r tsconfig-paths/register -r ts-node/register node_modules/.bin/jest --runInBand",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "emulators": "firebase emulators:start --only functions,firestore",
    "deploy": "firebase deploy",
    "deploy:functions": "firebase deploy --only functions"
  }
}
```

### Frontend (`client/package.json`)

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "ios": "expo run:ios",
    "web": "expo start --web",
    "setup": "pnpm install && expo prebuild --clean",
    "lint": "eslint .",
    "build:android": "expo build:android",
    "build:ios": "expo build:ios",
    "publish": "expo publish"
  }
}
```

### Testing Locally

To test the entire application locally:

1. Start the Firebase emulators (add this script to your API package.json):
```bash
cd api
pnpm emulators # add this script: "emulators": "firebase emulators:start --only functions,firestore"
```

2. In a new terminal, start the NestJS backend:
```bash
cd api
pnpm start:dev
```

3. In another terminal, set up and start the React Native frontend:
```bash
cd client
pnpm setup # This will install dependencies and run prebuild
pnpm start
```

This will run your Firebase emulators, NestJS backend, and React Native frontend simultaneously for full local testing.

## 📱 Building for Production (Mobile)

### Android

```bash
# Navigate to the frontend directory
cd client

# Build for Android
pnpm build:android

# OR using Expo directly
expo build:android
```

This will generate an APK/AAB file that you can submit to the Google Play Store.

### iOS

```bash
# Navigate to the frontend directory
cd client

# Install iOS dependencies (if not already done)
cd ios && pod install && cd ..

# Build for iOS
pnpm build:ios

# OR using Expo directly
expo build:ios
```

The iOS build will be available through the Expo dashboard for download and submission to the App Store.

## 🧪 Testing

```bash
# Run backend tests
cd api && pnpm test

# Run frontend tests
cd client && pnpm test
```

## 📦 Project Structure

```
/
├── api/                  # NestJS backend
│   ├── src/              # Source code
│   ├── dist/             # Compiled NestJS code
│   ├── index.ts          # Firebase functions entry point
│   ├── firebase.json     # Firebase configuration
│   └── ...
├── client/               # React Native frontend
│   ├── src/              # Source code
│   ├── app.json          # Expo configuration
│   └── ...
└── ...
```

## 📄 License

[Your License Here]

## 🤝 Contributing

[Your Contribution Guidelines Here]
