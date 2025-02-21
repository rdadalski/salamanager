import AsyncStorage from "@react-native-async-storage/async-storage";

export class StorageService {
  public async storeData(value: any, key: string) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (e) {
      //TODO saving error
    }
  }

  public async getData(key: string) {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (e) {
      //TODO error reading value
    }
  }
}
