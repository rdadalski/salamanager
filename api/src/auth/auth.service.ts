import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '@app/user/dto/create-user.dto';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const authResponse = await getAuth().createUser({
        email: createUserDto.email,
        emailVerified: false,
        password: createUserDto.password,
        disabled: false,
      });

      const storedUser = await this.userService.createUser(authResponse);

      return authResponse;
    } catch (e) {
      const error = e as Error;
      console.error(error);
    }
  }
}
