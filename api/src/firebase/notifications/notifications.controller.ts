import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { DeviceTokenDto } from './dto/notifications.dto';
import { UserTokenService } from '@app/firebase/notifications/userToken.service';

@Controller('notifications')
// @UseGuards(AuthGuard('jwt')) TODO: Add JWT authentication
export class NotificationsController {
  constructor(
    private readonly notificationsService: NotificationsService,
    private readonly userTokenService: UserTokenService
  ) {}

  @Get('test-connection')
  async testConnection() {
    try {
      // Test if we can access Firestore
      const testDoc = await this.notificationsService.testFirebaseConnection();
      return {
        success: true,
        message: 'Firebase connection successful',
        data: testDoc,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Firebase connection failed',
        error: error.message,
      };
    }
  }

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
