import * as Device from "expo-device";

export interface IRegisterToken {
  userId: string;
  token: string;
  deviceInfo?: IDeviceInfo;
}

export interface IDeviceInfo {
  brand: string;
  modelName: string;
  deviceType: Device.DeviceType;
  isRealDevice: boolean;
}

export interface IRegisterTokenResponse {
  success: boolean;
  tokenId: string;
}

export interface ISendNotification {
  token: string;
  notification: {
    title: string;
    body: string;
    data: any;
  };
}
