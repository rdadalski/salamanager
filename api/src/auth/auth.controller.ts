import { CreateUserRequestDto } from '@app/user/dto/create-user.dto';
import {
  Controller,
  Post,
  Body,
  ConflictException,
  HttpCode,
  HttpStatus,
  InternalServerErrorException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserRequestDto) {
    try {
      return await this.authService.create(createUserDto);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      throw new InternalServerErrorException('An unexpected error occurred while creating the user.');
    }
  }
}
