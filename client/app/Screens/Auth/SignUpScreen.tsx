import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import { useSignUp } from "./hooks";

export const SignUpScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signUp, loading } = useSignUp();

  const handleSignUp = async () => {
    // Handle sign up logic here
    const result = await signUp(email, password);
    console.log("Sign Up result: ", result);
  };

  return (
    <View className="flex-1 justify-center p-4">
      <Text className="text-2xl mb-4 text-center">Sign Up</Text>
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
      <Button title="Sign Up" onPress={handleSignUp} />
    </View>
  );
};
