import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  AuthStackParamList,
  SignInScreen,
  SignUpScreen,
} from "@app/Screens/Auth";
import { FC } from "react";

export const AuthStack = createNativeStackNavigator<AuthStackParamList>();

export const AuthNavigator: FC = () => {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="SignIn"
        component={SignInScreen}
      />
      <AuthStack.Screen
        options={{ headerShown: false }}
        name="SignUp"
        component={SignUpScreen}
      />
      {/*<AuthStack.Screen*/}
      {/*  name="ForgotPassword"*/}
      {/*  component={ForgotPasswordScreen}*/}
      {/*/>*/}
    </AuthStack.Navigator>
  );
};
