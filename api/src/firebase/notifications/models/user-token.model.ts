export interface UserToken {
  id?: string;
  userId: string;
  token: string;
  deviceInfo?: {
    platform: string;
    model?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
