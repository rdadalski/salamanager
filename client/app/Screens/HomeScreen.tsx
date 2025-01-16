import React, { useState } from "react";
import { View, Text, Pressable, TextInput, ActivityIndicator } from "react-native";
import { useLazyGetTestGenericQuery, usePostGenericMutation } from "../store/api/testGenericApi";
import Icon from "react-native-vector-icons/FontAwesome";

const HomeScreen: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>("");
  const [Response, setRes] = useState<string>("Click to get firestore collection");

  const [testGeneric] = useLazyGetTestGenericQuery();
  const [postGeneric, { isError, isSuccess, isLoading }] = usePostGenericMutation();

  const onPress = () => {
    testGeneric().then((res) => {
      setRes(JSON.stringify(res.data));
    });
  };

  const onPressUpload = () => {
    if (inputValue !== "") {
      postGeneric({ text: inputValue }).then((res) => {
        console.log(res.data, res.error);
      });
    }
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="font-bold pb-2 text-2xl">Welcome to Home Screen</Text>
      <Pressable
        onPress={onPress}
        className="h-10 mb-4"
      >
        <View className="rounded-lg justify-center items-center bg-black">
          <Text className="font-bold text-white p-2">Test backend connection</Text>
        </View>
      </Pressable>
      <Text className="font-mono text-sm text-gray-800 bg-gray-200 p-2 rounded">{Response}</Text>

      <View className="w-80 p-0.5 my-2 flex-row items-center">
        <TextInput
          className="border border-gray-400 rounded p-2 text-base flex-1"
          placeholder="Enter text"
          value={inputValue}
          onChangeText={setInputValue}
        />
      </View>

      {isSuccess && (
        <Icon
          name="check-circle"
          size={24}
          color="green"
          style={{ marginLeft: 8 }}
        />
      )}
      {isLoading && (
        <ActivityIndicator
          size="large"
          color="#0000ff"
        />
      )}

      <View className="justify-center items-center">
        <Pressable
          onPress={onPressUpload}
          className="h-10"
        >
          <View className="rounded-lg justify-center items-center bg-black">
            <Text className="font-bold text-white p-2">Test backend upload</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default HomeScreen;
