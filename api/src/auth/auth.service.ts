import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from '@app/user/dto/create-user.dto';
import { getAuth } from 'firebase-admin/auth';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async create(createUserDto: CreateUserRequestDto) {
    // try {
    //   const authResponse = await getAuth().createUser({
    //     email: createUserDto.userData.email,
    //     emailVerified: false,
    //     password: createUserDto.userData.password,
    //     disabled: false,
    //   });
    //
    //   const storedUser = await this.userService.createUser(authResponse);
    //
    //   return authResponse;
    // } catch (e) {
    //   const error = e as Error;
    //   console.error(error);
    // }
  }
}
