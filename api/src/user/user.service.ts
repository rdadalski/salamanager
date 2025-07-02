import { ConflictException, Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import * as admin from 'firebase-admin';
import { Timestamp } from 'firebase-admin/firestore';
import { User, UserRole } from '@app/user/models/user.model';

import { CreateUserRequestDto } from '@app/user/dto/create-user.dto';
import { UpdateUserDto } from '@app/user/dto/update-user.dto';
import { google } from 'googleapis';
import * as process from 'node:process';

@Injectable()
export class UserService {
  private genericService: GenericFirestoreService<User>;
  private readonly logger = new Logger(UserService.name);

  /**
   * Creates an instance of UserTokenService.
   *
   * @param firebaseAdmin - The Firebase admin app instance.
   */
  constructor(@Inject('FIREBASE_ADMIN') firebaseAdmin: admin.app.App) {
    this.genericService = new GenericFirestoreService<User>(firebaseAdmin, 'users');
  }

  /**
   * Create a new user in Firestore
   * @param createUserDto Data for the new user
   * @returns The created user with metadata
   */
  async createUser(createUserDto: CreateUserRequestDto): Promise<User> {
    // Check if a user already exists
    const existingUser = await this.genericService.findOne(createUserDto.uid);
    if (existingUser) {
      throw new ConflictException(`User with ID ${createUserDto.uid} already exists`);
    }

    const { email, uid, phoneNumber, photoURL, displayName } = createUserDto;

    const userData: User = {
      email,
      uid,
      phoneNumber,
      photoURL,
      displayName,
      createdAt: Timestamp.now(),
      lastLogin: Timestamp.now(),
      role: UserRole.CLIENT,
    };

    // If serverAuthCode exists, exchange it for a refresh token
    if (createUserDto.serverAuthCode) {
      try {
        const oauth2Client = new google.auth.OAuth2(
          process.env.WEB_CLIENT_ID,
          process.env.WEB_CLIENT_SECRET,
          process.env.WEB_CLIENT_REDIRECT_URI
        );

        const { tokens } = await oauth2Client.getToken(createUserDto.serverAuthCode);

        this.logger.log(tokens);

        if (tokens.refresh_token) {
          userData.googleRefreshToken = tokens.refresh_token;
        }
      } catch (error) {
        this.logger.error('Error exchanging auth code for refresh token:', error);
        // You may want to handle this error differently
      }
    }

    console.log(userData, uid);
    await this.genericService.create(userData, uid);
    return userData;
  }

  /**
   * Get a user by their unique ID
   * @param uid User ID
   * @returns User data or null if not found
   */
  async getUserById(uid: string): Promise<User | null> {
    return await this.genericService.findOne(uid);
  }

  /**
   * Get a user by ID with error if not found
   * @param uid User ID
   * @returns User data
   * @throws NotFoundException if user doesn't exist
   */
  async getUserByIdOrFail(uid: string): Promise<User> {
    const user = await this.getUserById(uid);
    if (!user) {
      throw new NotFoundException(`User with ID ${uid} not found`);
    }
    return user;
  }

  /**
   * Get all users (use with caution for large collections)
   * @returns Array of all users
   */
  async getAllUsers(): Promise<User[]> {
    return this.genericService.findAll();
  }

  /**
   * Find users by email
   * @param email Email address to search for
   * @returns Array of matching users (typically should be one or none)
   */
  async getUsersByEmail(email: string): Promise<User[]> {
    return this.genericService.findByQuery([{ field: 'email', operator: '==', value: email }]);
  }

  /**
   * Find users by authentication provider
   * @param provider Authentication provider
   * @returns Array of users using the specified provider
   */
  async getUsersByProvider(provider: 'password' | 'google.com'): Promise<User[]> {
    return this.genericService.findByQuery([{ field: 'authProvider', operator: '==', value: provider }]);
  }

  /**
   * Update user information
   * @param uid User ID
   * @param updateUserDto Data to update
   * @returns Updated user
   * @throws NotFoundException if user doesn't exist
   */
  async updateUser(uid: string, updateUserDto: UpdateUserDto): Promise<User> {
    // Verify user exists
    await this.getUserByIdOrFail(uid);

    // Update the user
    await this.genericService.update(uid, {
      ...updateUserDto,
      lastLogin: Timestamp.now(),
    });

    // Return updated user
    return this.getUserById(uid);
  }

  /**
   * Update only the login timestamp
   * @param uid User ID
   * @returns void
   */
  async updateLoginTimestamp(uid: string): Promise<{ success: boolean; data?: User; error?: string }> {
    return this.genericService.update(uid, {
      lastLogin: Timestamp.now(),
    });
  }

  /**
   * Delete a user
   * @param uid User ID
   * @returns void
   * @throws NotFoundException if user doesn't exist
   */
  async deleteUser(uid: string): Promise<void> {
    // Verify user exists
    await this.getUserByIdOrFail(uid);

    // Delete the user
    return this.genericService.delete(uid);
  }

  // /**
  //  * Count users by provider
  //  * @returns Object with counts per provider
  //  */
  // async countUsersByProvider(): Promise<Record<string, number>> {
  //   const users = await this.genericService.findAll();
  //
  //   const counts = {
  //     password: 0,
  //     'google.com': 0,
  //   };
  //
  //   users.forEach((user) => {
  //     if (counts[user.authProvider] !== undefined) {
  //       counts[user.authProvider]++;
  //     }
  //   });
  //
  //   return counts;
  // }
}
