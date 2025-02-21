import { Controller, Get, UseGuards } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('auth/google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}

  @Get('config')
  @UseGuards()
  @ApiOperation({ summary: 'Get Google Sign-in configuration' })
  @ApiResponse({
    status: 200,
    description: 'Returns the Google Sign-in configuration',
  })
  async getConfig() {
    return this.googleAuthService.getGoogleConfig();
  }
}

// TODO
//  1. google auth controller - send config to front end
//  2. asyncStorage - store token
//  3. firebase - app check
