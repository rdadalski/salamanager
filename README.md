# React Native App with NestJS Backend

## Prerequisites

Make sure the following are installed on your system:
- Node.js (>=16)
- pnpm (>=8)
- PostgreSQL (>=14)
- Android Studio and/or Xcode (for mobile development)

---

## Installation

### Clone the Repository
```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd <repository-folder>
```

### Install Dependencies
```bash
# Install frontend and backend dependencies
pnpm install
```

---

## Setup Environment Variables

### Frontend (`/client`)
Create a `.env` file in the `frontend` directory (if required for environment-specific variables).

---

## Running the Applications

### Backend (NestJS)
```bash
# Navigate to the backend directory
cd api

# Start the backend application in development mode
pnpm start:dev
```

### Frontend (React Native)
#### Running on Android
```bash
# Navigate to the frontend directory
cd client

# Start the Metro bundler
pnpm start

# Run the app on an Android emulator or device
pnpm android
```

#### Running on iOS
```bash
# Navigate to the frontend directory
cd client

# Install iOS dependencies
cd ios && pod install && cd ..

# Start the Metro bundler
pnpm start

# Run the app on an iOS simulator or device
pnpm ios
```

---
