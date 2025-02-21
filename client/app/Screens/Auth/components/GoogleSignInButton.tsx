import { FC } from "react";
import { useGoogleSignIn } from "@app/Screens/Auth/hooks";
import { useSelector } from "react-redux";
import { selectGoogleConfig } from "@app/store/slices";
import { CustomButton } from "@app/components";

export const GoogleSignInButton: FC = () => {
  const { signInWithGoogle } = useGoogleSignIn();
  const googleConfig = useSelector(selectGoogleConfig);

  const handleGoogleSignIn = async () => {
    if (googleConfig.webclientId !== null) {
      signInWithGoogle(googleConfig.webclientId).then((res) => {
        console.log("google sign in");
        console.log(res);
      });
    }
  };

  return (
    <CustomButton
      title={"GOOGLE"}
      iconName={"google"}
      onPress={handleGoogleSignIn}
    />
  );
};
