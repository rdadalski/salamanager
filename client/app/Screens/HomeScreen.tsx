import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useLazyGetTestGenericQuery } from "../store/api/testGenericApi";

const HomeScreen: React.FC = () => {
  const [Response, setRes] = useState<string>("Click to get firestore collection");

  const [testGeneric] = useLazyGetTestGenericQuery();

  const onPress = () => {
    testGeneric().then((res) => {
      console.log(res);
      setRes(JSON.stringify(res.data));
    });
  };

  return (
    <View className="flex-1 justify-center items-center">
      <Text
        className="flex font-bold pb-2"
        style={{ fontSize: 24 }}
      >
        Welcome to Home Screen
      </Text>
      <Pressable
        onPress={onPress}
        className="flex h-10"
      >
        <View className="flex rounded-lg justify-center items-center bg-black">
          <Text className="font-bold color-white p-2">Test backend connection</Text>
        </View>
      </Pressable>
      <Text>{Response}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
});

export default HomeScreen;
