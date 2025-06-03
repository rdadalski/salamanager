import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { GenericFirestoreService } from '@app/firebase/generic-firestore.service';
import { User, UserRole } from './models/user.model';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Timestamp } from 'firebase-admin/firestore';
import * as admin from 'firebase-admin';
import { google } from 'googleapis';

// Mock the firebase-admin module
jest.mock('firebase-admin', () => ({
  app: {
    App: jest.fn(),
  },
}));

// Mock the googleapis module
jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        getToken: jest.fn().mockResolvedValue({
          tokens: {
            refresh_token: 'mock-refresh-token',
          },
        }),
      })),
    },
  },
}));

// Mock process.env
const mockEnv = {
  WEB_CLIENT_ID: 'mock-client-id',
  WEB_CLIENT_SECRET: 'mock-client-secret',
  WEB_CLIENT_REDIRECT_URI: 'mock-redirect-uri',
};

describe('UserService', () => {
  let service: UserService;
  let mockOAuth2Client: jest.Mocked<any>;

  const mockFirebaseAdmin = {
    firestore: jest.fn().mockReturnValue({
      collection: jest.fn().mockReturnThis(),
      doc: jest.fn().mockReturnThis(),
      get: jest.fn(),
      set: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    }),
  } as unknown as admin.app.App;

  const mockTimestamp = 'mock-timestamp' as unknown as admin.firestore.Timestamp;

  // Mock implementation of GenericFirestoreService
  const mockGenericService = {
    create: jest.fn(),
    findOne: jest.fn(),
    findAll: jest.fn(),
    findByQuery: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    // Mock environment variables
    process.env = { ...process.env, ...mockEnv };

    // Mock OAuth2 client
    mockOAuth2Client = {
      getToken: jest.fn().mockResolvedValue({
        tokens: {
          refresh_token: 'mock-refresh-token',
        },
      }),
    };

    (google.auth.OAuth2 as unknown as jest.Mock).mockImplementation(() => mockOAuth2Client);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'FIREBASE_ADMIN',
          useValue: mockFirebaseAdmin,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);

    // Replace the genericService with our mock
    service['genericService'] = mockGenericService as unknown as GenericFirestoreService<User>;

    // Mock Timestamp.now() for consistent testing
    jest.spyOn(Timestamp, 'now').mockReturnValue(mockTimestamp);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const createUserDto: CreateUserRequestDto = {
      uid: 'test-uid',
      email: 'test@example.com',
      displayName: 'Test User',
      phoneNumber: '+1234567890',
      photoURL: 'https://example.com/photo.jpg',
      password: 'password123',
      role: UserRole.CLIENT,
    };

    it('should create a user successfully', async () => {
      mockGenericService.findOne.mockResolvedValue(null);
      mockGenericService.create.mockResolvedValue(undefined);

      const result = await service.createUser(createUserDto);

      expect(mockGenericService.findOne).toHaveBeenCalledWith('test-uid');
      expect(mockGenericService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          uid: 'test-uid',
          email: 'test@example.com',
          displayName: 'Test User',
          phoneNumber: '+1234567890',
          photoURL: 'https://example.com/photo.jpg',
          role: UserRole.CLIENT,
          createdAt: mockTimestamp,
          lastLogin: mockTimestamp,
        }),
        'test-uid'
      );
      expect(result).toEqual(
        expect.objectContaining({
          uid: 'test-uid',
          email: 'test@example.com',
          role: UserRole.CLIENT,
        })
      );
    });

    it('should throw ConflictException if user already exists', async () => {
      const existingUser = { uid: 'test-uid', email: 'existing@example.com' } as User;
      mockGenericService.findOne.mockResolvedValue(existingUser);

      await expect(service.createUser(createUserDto)).rejects.toThrow(
        new ConflictException('User with ID test-uid already exists')
      );
      expect(mockGenericService.findOne).toHaveBeenCalledWith('test-uid');
      expect(mockGenericService.create).not.toHaveBeenCalled();
    });

    it('should add googleRefreshToken if serverAuthCode is provided', async () => {
      mockGenericService.findOne.mockResolvedValue(null);
      mockGenericService.create.mockResolvedValue(undefined);

      const dtoWithAuthCode = {
        ...createUserDto,
        serverAuthCode: 'test-auth-code',
      };

      const result = await service.createUser(dtoWithAuthCode);

      expect(google.auth.OAuth2).toHaveBeenCalledWith(
        mockEnv.WEB_CLIENT_ID,
        mockEnv.WEB_CLIENT_SECRET,
        mockEnv.WEB_CLIENT_REDIRECT_URI
      );
      expect(mockOAuth2Client.getToken).toHaveBeenCalledWith('test-auth-code');
      expect(mockGenericService.create).toHaveBeenCalledWith(
        expect.objectContaining({
          googleRefreshToken: 'mock-refresh-token',
        }),
        'test-uid'
      );
      expect(result.googleRefreshToken).toBe('mock-refresh-token');
    });

    it('should handle OAuth2 error gracefully', async () => {
      mockGenericService.findOne.mockResolvedValue(null);
      mockGenericService.create.mockResolvedValue(undefined);
      mockOAuth2Client.getToken.mockRejectedValue(new Error('OAuth2 error'));

      const dtoWithAuthCode = {
        ...createUserDto,
        serverAuthCode: 'test-auth-code',
      };

      // Should not throw error, but continue without refresh token
      const result = await service.createUser(dtoWithAuthCode);

      expect(result.googleRefreshToken).toBeUndefined();
      expect(mockGenericService.create).toHaveBeenCalledWith(
        expect.not.objectContaining({
          googleRefreshToken: expect.anything(),
        }),
        'test-uid'
      );
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' } as User;
      mockGenericService.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserById('test-uid');

      expect(mockGenericService.findOne).toHaveBeenCalledWith('test-uid');
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockGenericService.findOne.mockResolvedValue(null);

      const result = await service.getUserById('non-existent-uid');

      expect(mockGenericService.findOne).toHaveBeenCalledWith('non-existent-uid');
      expect(result).toBeNull();
    });
  });

  describe('getUserByIdOrFail', () => {
    it('should return a user if found', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' } as User;
      mockGenericService.findOne.mockResolvedValue(mockUser);

      const result = await service.getUserByIdOrFail('test-uid');

      expect(mockGenericService.findOne).toHaveBeenCalledWith('test-uid');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockGenericService.findOne.mockResolvedValue(null);

      await expect(service.getUserByIdOrFail('non-existent-uid')).rejects.toThrow(
        new NotFoundException('User with ID non-existent-uid not found')
      );
      expect(mockGenericService.findOne).toHaveBeenCalledWith('non-existent-uid');
    });
  });

  describe('getAllUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [
        { uid: 'user1', email: 'user1@example.com' },
        { uid: 'user2', email: 'user2@example.com' },
      ] as User[];
      mockGenericService.findAll.mockResolvedValue(mockUsers);

      const result = await service.getAllUsers();

      expect(mockGenericService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array if no users found', async () => {
      mockGenericService.findAll.mockResolvedValue([]);

      const result = await service.getAllUsers();

      expect(mockGenericService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('getUsersByEmail', () => {
    it('should return users with matching email', async () => {
      const mockUsers = [{ uid: 'user1', email: 'test@example.com' }] as User[];
      mockGenericService.findByQuery.mockResolvedValue(mockUsers);

      const result = await service.getUsersByEmail('test@example.com');

      expect(mockGenericService.findByQuery).toHaveBeenCalledWith([
        { field: 'email', operator: '==', value: 'test@example.com' },
      ]);
      expect(result).toEqual(mockUsers);
    });

    it('should return empty array if no users found with email', async () => {
      mockGenericService.findByQuery.mockResolvedValue([]);

      const result = await service.getUsersByEmail('nonexistent@example.com');

      expect(result).toEqual([]);
    });
  });

  // Remove this test if authProvider doesn't exist in User model
  describe('getUsersByProvider', () => {
    it('should return users with matching provider', async () => {
      const mockUsers = [{ uid: 'user1', email: 'user1@example.com', authProvider: 'google.com' } as any];
      mockGenericService.findByQuery.mockResolvedValue(mockUsers);

      const result = await service.getUsersByProvider('google.com');

      expect(mockGenericService.findByQuery).toHaveBeenCalledWith([
        { field: 'authProvider', operator: '==', value: 'google.com' },
      ]);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('updateUser', () => {
    const updateUserDto: UpdateUserDto = {
      displayName: 'Updated Name',
      photoURL: 'https://example.com/updated.jpg',
    };

    it('should update a user successfully', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' } as User;
      const updatedUser = {
        ...mockUser,
        ...updateUserDto,
        lastLogin: mockTimestamp,
      } as User;

      mockGenericService.findOne
        .mockResolvedValueOnce(mockUser) // For getUserByIdOrFail
        .mockResolvedValueOnce(updatedUser); // For getUserById after update

      const result = await service.updateUser('test-uid', updateUserDto);

      expect(mockGenericService.findOne).toHaveBeenNthCalledWith(1, 'test-uid');
      expect(mockGenericService.update).toHaveBeenCalledWith(
        'test-uid',
        expect.objectContaining({
          ...updateUserDto,
          lastLogin: mockTimestamp,
        })
      );
      expect(mockGenericService.findOne).toHaveBeenNthCalledWith(2, 'test-uid');
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException if user not found', async () => {
      mockGenericService.findOne.mockResolvedValue(null);

      await expect(service.updateUser('non-existent-uid', updateUserDto)).rejects.toThrow(
        new NotFoundException('User with ID non-existent-uid not found')
      );
      expect(mockGenericService.findOne).toHaveBeenCalledWith('non-existent-uid');
      expect(mockGenericService.update).not.toHaveBeenCalled();
    });
  });

  describe('updateLoginTimestamp', () => {
    it('should update only the login timestamp', async () => {
      mockGenericService.update.mockResolvedValue(undefined);

      await service.updateLoginTimestamp('test-uid');

      expect(mockGenericService.update).toHaveBeenCalledWith('test-uid', {
        lastLogin: mockTimestamp,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete a user successfully', async () => {
      const mockUser = { uid: 'test-uid', email: 'test@example.com' } as User;
      mockGenericService.findOne.mockResolvedValue(mockUser);
      mockGenericService.delete.mockResolvedValue(undefined);

      await service.deleteUser('test-uid');

      expect(mockGenericService.findOne).toHaveBeenCalledWith('test-uid');
      expect(mockGenericService.delete).toHaveBeenCalledWith('test-uid');
    });

    it('should throw NotFoundException if user not found', async () => {
      mockGenericService.findOne.mockResolvedValue(null);

      await expect(service.deleteUser('non-existent-uid')).rejects.toThrow(
        new NotFoundException('User with ID non-existent-uid not found')
      );
      expect(mockGenericService.findOne).toHaveBeenCalledWith('non-existent-uid');
      expect(mockGenericService.delete).not.toHaveBeenCalled();
    });
  });
});
