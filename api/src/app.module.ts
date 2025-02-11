import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { FirebaseModule } from './firebase/firebase.module';
import { FirebaseService } from './firebase/firebase.service';
import { FirebaseController } from './firebase/firebase.controller';
import { TestGenericModule } from './test-generic/test-generic.module';
import { TestGenericController } from './test-generic/test-generic.controller';
import { NotificationsModule } from './firebase/notifications/notifications.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['config/.env'] }),
    FirebaseModule.forRoot(),
    TestGenericModule,
    NotificationsModule,
    AuthModule,
  ],
  controllers: [AppController, FirebaseController],
  providers: [AppService, FirebaseService],
})
export class AppModule {}

// TODO Sign Up FLOW - backend
//  1. Create DTO (Data Transfer Object) for user registration with email, password validation
//  2. Create auth service method to handle registration
//  3. Implement email format validation and password strength checks
//  4. Check if email already exists in Firebase Auth
//  5. Create user in Firebase Auth using admin SDK
//  6. Generate custom claims/roles for user access control
//  7. Create user document in Firestore with additional user data
//  8. Generate email verification link using Firebase Auth
//  9. Send verification email to user
//  10. Return appropriate response (user data without sensitive info)
//  11. Add error handling for:
//     - Invalid email format
//     - Weak password
//     - Email already in use
//     - Firebase Auth errors
//     - Firestore errors
//  12. Add request rate limiting for security
//  13. Add request validation pipe
//  14. Add auth guard for protected routes
//  15. (Optional) Add logging service for tracking registration attempts
