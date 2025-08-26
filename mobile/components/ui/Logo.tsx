import { Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { FC } from "react";

type LogoProps = {
  className?: string;
  onClickHomepageNavigate?: boolean;
};

const Logo: FC<LogoProps> = ({ className, onClickHomepageNavigate = true }) => {
  const router = useRouter();

  return (
    <Image
      source={require("@/assets/images/logo.png")}
      className={className || "w-8 h-8"}
      resizeMode="contain"
    />
  );
};

export default Logo;
