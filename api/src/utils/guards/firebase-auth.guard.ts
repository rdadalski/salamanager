import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseService } from '@app/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      throw new UnauthorizedException('Bearer token missing');
    }

    try {
      request.user = await this.firebaseService.verifyToken(token);
      request.token = token;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
