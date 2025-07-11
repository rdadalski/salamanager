import { Injectable } from '@nestjs/common';
import { CreateUserRequestDto } from '@app/user/dto/create-user.dto';
import { UserService } from '@app/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async create(createUserDto: CreateUserRequestDto) {
    return await this.userService.createUser(createUserDto);
  }
}
