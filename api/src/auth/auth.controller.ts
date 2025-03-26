import { CreateUserRequestDto } from '@app/user/dto/create-user.dto';
import { Controller, Post, Body, Patch, Param, Delete, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserResponseDto } from '@app/user/dto/user-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async create(@Body() createUserDto: CreateUserRequestDto) {
    try {
      return await this.authService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new Error('Error creating user');
    }
  }
}
