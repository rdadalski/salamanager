import { Controller } from '@nestjs/common';
import { GoogleAuthService } from './google-auth.service';

@Controller('google-auth')
export class GoogleAuthController {
  constructor(private readonly googleAuthService: GoogleAuthService) {}
}
