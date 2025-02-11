import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { app } from 'firebase-admin';
import { FirebaseAuthError, getAuth, UserRecord } from 'firebase-admin/lib/auth';

@Injectable()
export class AuthService {
  constructor(@Inject('FIREBASE_ADMIN') private firebaseAdmin: app.App) {}

  async create(createUserDto: CreateUserDto) {}

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
