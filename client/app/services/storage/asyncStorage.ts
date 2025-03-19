import AsyncStorage from "@react-native-async-storage/async-storage";

export async function storeData(value: any, key: string) {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    //TODO saving error
  }
}

export async function getData(key: string) {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    //TODO error reading value
  }
}

export async function storeToken(token: string) {
  await storeData(token, "access_token");
}

export async function storeGoogleAccessToken(token: string) {
  await storeData(token, "google_access_token");
}

export async function getAccessToken() {
  return await getData("access_token");
}

export async function getGoogleAccessToken() {
  return await getData("google_access_token");
}

export async function clearStorage() {
  await AsyncStorage.clear();
}
