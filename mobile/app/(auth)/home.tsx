import React, { useEffect } from "react";
import { View, SafeAreaView } from "react-native";
import Text from "@/global-components/Text";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

export default function HomePage() {
  const router = useRouter();

  // Animation shared values
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(40);

  useEffect(() => {
    // Staggered entrance
    logoScale.value = withTiming(1, { duration: 800, easing: Easing.out(Easing.exp) });
    titleOpacity.value = withDelay(250, withTiming(1, { duration: 450 }));
    titleTranslateY.value = withDelay(250, withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) }));
    buttonsOpacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    buttonsTranslateY.value = withDelay(550, withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) }));
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoScale.value,
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const buttonsStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
    transform: [{ translateY: buttonsTranslateY.value }],
  }));

  return (
    <LinearGradient
      colors={["#1e1b4b", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        {/* Hero Section */}
        <View className="flex-1 items-center justify-center px-6">
          <Animated.View style={[logoStyle]}>
            <Logo className="w-24 h-24 mb-8" />
          </Animated.View>

          <Animated.View style={[titleStyle]}>
            <Text className="text-4xl font-bold text-secondary text-center drop-shadow-lg">
              Welcome to <Text className="text-tertiary font-bold">Payly</Text>
            </Text>
            <Text className="text-xl text-secondary opacity-80 mt-3 text-center max-w-[480px]">
              Share bills, not headaches.
            </Text>
          </Animated.View>
        </View>

        {/* Buttons Section */}
        <Animated.View style={[{ paddingHorizontal: 16, marginBottom: 48, gap: 12 }, buttonsStyle]}>
          <Button
            text="Login"
            size="full"
            style="outline"
            className="rounded-2xl"
            onPress={() => router.push("/login")}
          />
          <Button
            text="Register"
            borderColor="#fff"
            size="full"
            style="fill"
            className="rounded-2xl"
            onPress={() => router.push("/register")}
          />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};