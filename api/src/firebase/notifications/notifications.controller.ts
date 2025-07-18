import { Body, Controller, HttpException, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { UserTokenService } from '@app/firebase/notifications/userToken.service';
import { FirebaseAuthGuard } from '@app/utils/guards/firebase-auth.guard';
import { RolesGuard } from '@app/utils/guards/role.guard';

@Controller('notifications')
@UseGuards(FirebaseAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userTokenService: UserTokenService
  ) {}

  @Post('send')
  async sendNotification(
    @Body()
    payload: {
      token: string;
      notification: {
        title: string;
        body: string;
        data: any;
      };
    }
  ) {
    // if (!payload.token && !payload.tokens) {
    if (!payload.token) {
      throw new HttpException('Token or tokens array is required', HttpStatus.BAD_REQUEST);
    }

    if (!payload.notification) {
      throw new HttpException('Notification object is required', HttpStatus.BAD_REQUEST);
    }

    return this.notificationsService.sendToDevice(payload.token, payload.notification);
  }

  @Post('register-token')
  async registerToken(@Body() payload: { userId: string; token: string; deviceInfo?: any }) {
    if (!payload.userId || !payload.token) {
      throw new HttpException('UserId and token are required', HttpStatus.BAD_REQUEST);
    }

    try {
      const tokenId = await this.userTokenService.saveUserToken(payload.userId, payload.token, payload.deviceInfo);

      return { success: true, tokenId };
    } catch (error) {
      throw new HttpException(`Failed to register token: ${error.message}`, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
