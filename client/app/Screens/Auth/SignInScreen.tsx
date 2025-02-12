import React, { FC, useState } from "react";
import { Button, Text, TextInput, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { AuthStackParamList } from "./types";
import { useSignIn } from "./hooks";
import { SignOutButton } from "./components/SignOutButton";

export const SignInScreen: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loading } = useSignIn();

  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParamList>>();

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  const handleSignIn = async () => {
    const result = await signIn(email, password);
    console.log("Sign In result", result);
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl mb-4 text-center">Sign In</Text>
      <TextInput
        className=" border border-gray-400 mb-3 px-2"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className=" border border-gray-400 mb-3 px-2"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <View className="flex-row w-full gap-2 justify-center">
        <Button color={"#000"} title="Sign in" onPress={handleSignIn} />
        <Button color={"#000"} title="Sign up" onPress={handleSignUp} />
        <SignOutButton></SignOutButton>
      </View>
    </View>
  );
};
