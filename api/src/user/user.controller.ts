import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserRequestDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { FirebaseAuthGuard } from '../utils/guards/firebase-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name);

  @Post()
  async create(@Body() createUserDto: CreateUserRequestDto) {
    try {
      this.logger.warn(createUserDto);
      const user = await this.userService.createUser(createUserDto);
      return user;
      // return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Error creating user from UserController');
    }
  }

  @Get()
  @UseGuards(FirebaseAuthGuard)
  async findAll() {
    const users = await this.userService.getAllUsers();
    return users.map((user) => new UserResponseDto(user));
  }

  @Get(':id')
  @UseGuards(FirebaseAuthGuard)
  async findOne(@Param('id') id: string) {
    try {
      const user = await this.userService.getUserByIdOrFail(id);
      return new UserResponseDto(user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error finding user');
    }
  }

  @Put(':id')
  @UseGuards(FirebaseAuthGuard)
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    try {
      const updatedUser = await this.userService.updateUser(id, updateUserDto);
      return new UserResponseDto(updatedUser);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error updating user');
    }
  }

  @Delete(':id')
  @UseGuards(FirebaseAuthGuard)
  async remove(@Param('id') id: string) {
    try {
      await this.userService.deleteUser(id);
      return { success: true, message: 'User deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error('Error deleting user');
    }
  }

  // @Get('provider/stats')
  // @UseGuards(FirebaseAuthGuard)
  // async getProviderStats() {
  //   return this.userService.countUsersByProvider();
  // }

  @Get('email/:email')
  @UseGuards(FirebaseAuthGuard)
  async findByEmail(@Param('email') email: string) {
    const users = await this.userService.getUsersByEmail(email);
    return users.map((user) => new UserResponseDto(user));
  }

  @Post(':id/login')
  @UseGuards(FirebaseAuthGuard)
  async updateLoginTime(@Param('id') id: string) {
    try {
      await this.userService.updateLoginTimestamp(id);
      return { success: true, message: 'Login timestamp updated' };
    } catch (error) {
      throw new Error('Error updating login timestamp');
    }
  }
}
