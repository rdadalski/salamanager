import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  displayName: string;

  @IsNotEmpty()
  photoURL: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  emailVerified: boolean;

  @IsNotEmpty()
  disabled: boolean;
}
