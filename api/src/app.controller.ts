import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { FirebaseAuthGuard } from './utils/guards/firebase-auth.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
