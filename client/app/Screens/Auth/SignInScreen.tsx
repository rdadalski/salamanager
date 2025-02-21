import { FC, useState } from "react";
import { Alert, Text, TextInput, View } from "react-native";
import { useSignIn, useSignUp } from "./hooks";
import { GoogleSignInButton } from "@app/Screens/Auth/components/GoogleSignInButton";
import { CustomButton } from "@app/components";

export const SignInScreen: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn, loading: signInLoading } = useSignIn();
  const { signUp, loading: signUpLoading } = useSignUp();

  const alertResponse = (title: string, message: string) => {
    Alert.alert(title, message, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };

  const handleSignUp = async () => {
    const result = await signUp(email, password);
    alertResponse("Sign up", result.message);
  };

  const handleSignIn = async () => {
    const result = await signIn(email, password);
    alertResponse("Sign up", result.message);
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
      <View className="flex-row w-full gap-2 justify-center items-center">
        <CustomButton
          title={"Sign In"}
          iconName={"login"}
          onPress={handleSignIn}
        />
        <CustomButton
          title={"Sign up"}
          iconName={"logout"}
          onPress={handleSignUp}
        />
        <GoogleSignInButton />
      </View>
    </View>
  );
};
