import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import {
  DeviceTokenDto,
  SendMulticastNotificationDto,
  SendNotificationDto,
} from './dto/notifications.dto';

@Controller('notifications')
// @UseGuards(AuthGuard('jwt')) TODO: Add JWT authentication
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

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
    @Body() body: { token: string; title: string; body: string; data?: any },
  ) {
    return this.notificationsService.sendPushNotification(body);
  }

  @Get('token/:userId')
  async getUserToken(@Param('userId') userId: string) {
    return this.notificationsService.getUserDeviceTokens(userId);
  }

  @Post('token')
  async saveDeviceToken(@Body() deviceTokenDto: DeviceTokenDto) {
    console.log(deviceTokenDto);
    return this.notificationsService.saveExpoToken(
      deviceTokenDto.userId,
      deviceTokenDto.token,
      deviceTokenDto.deviceData,
    );
  }

  // @Post('send-multicast')
  // async sendMulticastNotification(
  //   @Body() notificationDto: SendMulticastNotificationDto,
  // ) {
  //   const allTokens: string[] = [];

  //   // Collect tokens for all users
  //   for (const userId of notificationDto.userIds) {
  //     const tokens = await this.notificationsService.getUserTokens(userId);
  //     allTokens.push(...tokens);
  //   }

  //   if (allTokens.length === 0) {
  //     throw new Error('No device tokens found for specified users');
  //   }

  //   return this.notificationsService.sendBatchNotifications(
  //     allTokens,
  //     notificationDto.title,
  //     notificationDto.body,
  //     notificationDto.data,
  //   );
  // }
}
