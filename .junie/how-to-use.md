# How to Use SalaManager

## Overview
SalaManager is a full-stack mobile application for managing calendars, events, and resources. This guide will help you understand how to use the application, both as an end-user and as a developer.

## For End Users

### Getting Started
1. **Installation**: Download and install the SalaManager app from the app store.
2. **Authentication**: Sign in with your Google account to access your calendars.
3. **Home Screen**: Navigate through the app using the bottom navigation bar.

### Calendar Management
1. **View Calendars**: On the Calendar screen, you'll see a list of your Google calendars.
2. **Select Calendar**: Tap on a calendar to view its events.
3. **Refresh**: Use the "Refetch" button to refresh your calendar list.

### Event Management
1. **View Events**: After selecting a calendar, you'll see events displayed in a weekly view.
2. **Create Event**: Tap the "+" button to create a new event.
3. **Edit Event**: Tap on an existing event to view and edit its details.
4. **Reschedule Event**: Drag and drop events to reschedule them.
5. **Delete Event**: In the event details screen, tap the delete button to remove an event.

### Resource Management
1. **View Resources**: Navigate to the Resources tab to see available resources.
2. **Book Resource**: Select a resource and choose a time slot to book it.
3. **Cancel Booking**: View your bookings and cancel if needed.

## For Developers

### Project Structure
The SalaManager project is organized into two main parts:
- **Frontend** (client directory): React Native with Expo and TypeScript
- **Backend** (api directory): NestJS with Firebase Functions

### Setting Up Development Environment
1. **Clone Repository**: `git clone [repository-url]`
2. **Install Dependencies**:
   ```bash
   # Backend
   cd api
   pnpm install

   # Frontend
   cd client
   pnpm install
   ```
3. **Environment Setup**:
   - Create `.env` files in both api and client directories
   - Set up Firebase credentials

### Running the Application
1. **Start Backend**:
   ```bash
   cd api
   pnpm start:dev
   ```
2. **Start Frontend**:
   ```bash
   cd client
   pnpm start
   ```
3. **Firebase Emulators** (for local development):
   ```bash
   cd api
   pnpm emulators
   ```

### API Endpoints
The backend provides the following main endpoints:

#### Calendar Endpoints
- `GET /calendar/events` - List calendar events
- `GET /calendar/list` - Get list of calendars
- `POST /calendar/events` - Create a new event
- `PATCH /calendar/events/:eventId` - Update an event
- `DELETE /calendar/events/:eventId` - Delete an event

#### Authentication Endpoints
- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `GET /auth/profile` - Get user profile
- `POST /auth/refresh` - Refresh authentication token

#### Resource Endpoints
- `GET /resource` - List available resources
- `GET /resource/:id` - Get resource details
- `POST /resource` - Create a new resource
- `PATCH /resource/:id` - Update a resource
- `DELETE /resource/:id` - Delete a resource

### Frontend Components
The frontend is organized into reusable components:

1. **Screens**: Main application screens (Calendar, Resources, Auth)
2. **Components**: Reusable UI components
3. **Forms**: Form components for data entry
4. **Hooks**: Custom React hooks for business logic
5. **API**: API integration with the backend
6. **Navigation**: Navigation configuration

### State Management
The application uses React Context and Redux Toolkit Query for state management:

1. **API State**: Managed by Redux Toolkit Query
2. **UI State**: Managed by React Context
3. **Authentication State**: Managed by a dedicated auth context

### Testing
1. **Backend Tests**:
   ```bash
   cd api
   pnpm test
   ```
2. **Frontend Tests**:
   ```bash
   cd client
   pnpm test
   ```

## Troubleshooting

### Common Issues
1. **Authentication Errors**: Ensure your Google credentials are correctly set up
2. **Calendar Sync Issues**: Check your internet connection and try refreshing
3. **Event Creation Failures**: Verify you have write permissions for the selected calendar

### Getting Help
If you encounter any issues not covered in this guide, please:
1. Check the project documentation
2. Open an issue in the project repository
3. Contact the development team

## Conclusion
SalaManager provides a powerful and intuitive interface for managing calendars, events, and resources. Whether you're an end user or a developer, this guide should help you get started with the application.
