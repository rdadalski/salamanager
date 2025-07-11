import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { FirebaseService } from '@app/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers['authorization']?.split('Bearer ')[1];

    if (!token) {
      return false;
    }

    try {
      request.user = await this.firebaseService.verifyToken(token);
      request.token = token;
      return true;
    } catch {
      return false;
    }
  }
}
