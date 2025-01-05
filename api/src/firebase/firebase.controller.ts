import { Controller, Post, Body } from '@nestjs/common';
import { FirebaseService } from '@app/firebase/firebase.service'; // Create this service

@Controller('firestore')
export class FirestoreController {
  constructor(private readonly firestoreService: FirebaseService) {}

  @Post('add-item')
  async addItem(@Body() data: any) {
    return this.firestoreService.addItem(data);
  }
}
