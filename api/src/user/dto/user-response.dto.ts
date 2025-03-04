import { Exclude, Expose, Transform } from 'class-transformer';
import { FirebaseTimestampTransformer } from '@app/utils/firebase-timestamp.transformer';
import { User } from '@app/user/models/user.model';

export class UserResponseDto {
  @Expose()
  uid: string;

  @Expose()
  email: string;

  @Expose()
  displayName: string | null;

  @Expose()
  photoURL: string | null;

  @Expose()
  authProvider: string;

  @Expose()
  @Transform(({ value }) => FirebaseTimestampTransformer.toDate(value))
  createdAt: Date;

  @Expose()
  @Transform(({ value }) => FirebaseTimestampTransformer.toDate(value))
  lastLogin: Date;

  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }
}
