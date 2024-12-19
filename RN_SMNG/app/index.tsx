import { View, ScrollView, Image, Text } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import { images } from "../constants";
import CustomButton from "../components/CustomButton";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image
            source={images.logo}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Image
            source={images.cards}
            className="max-w-[380px] w-full h-[300px]"
            resizeMode="contain"
          />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Discover Endless possibilities with{" "}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
          </View>

          <CustomButton
            title="Log In"
            onPress={() => router.push("/sign-in")}
            containerStyles={"w-full mt-7"}
            textStyles={""}
            isLoading={false}
          ></CustomButton>
        </View>
      </ScrollView>
      <StatusBar backgroundColor={"#161622"} style="light"></StatusBar>
    </SafeAreaView>
  );
};

export default App;
