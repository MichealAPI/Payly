import React, { useEffect } from "react";
import { View, SafeAreaView, useColorScheme } from "react-native";
import Text from "@/global-components/Text";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";

export default function HomePage() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  // Animation shared values
  const logoScale = useSharedValue(0);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(20);
  const buttonsOpacity = useSharedValue(0);
  const buttonsTranslateY = useSharedValue(40);

  useEffect(() => {
    // Staggered entrance
    logoScale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
    titleOpacity.value = withDelay(250, withTiming(1, { duration: 450 }));
    titleTranslateY.value = withDelay(
      250,
      withTiming(0, { duration: 450, easing: Easing.out(Easing.cubic) })
    );
    buttonsOpacity.value = withDelay(550, withTiming(1, { duration: 500 }));
    buttonsTranslateY.value = withDelay(
      550,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.cubic) })
    );
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

  const bgColor: string = isDark ? "#050505" : "#fafafa";

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: bgColor }}
    >
      {/* Hero Section */}
      <View className="flex-1 items-center justify-center px-6">
        <Animated.View style={[logoStyle]}>
          <Logo className="w-24 h-24 mb-8" />
        </Animated.View>

        <Animated.View style={[titleStyle]}>
          <Text className="text-4xl font-bold text-secondary dark:text-white text-center drop-shadow-lg">
            Welcome to <Text className="text-tertiary font-bold">Payly</Text>
          </Text>
          <Text className="text-xl text-secondary dark:text-white/80 opacity-80 mt-2 text-center max-w-[480px]">
            Share bills, not headaches.
          </Text>
        </Animated.View>
      </View>

      {/* Buttons Section */}
      <Animated.View
        style={[
          { paddingHorizontal: 16, marginBottom: 48, gap: 12 },
          buttonsStyle,
        ]}
      >
        <Button
          variant={"secondary"}
          size={"xl"}
          onPress={() => router.push("/(auth)/login")}
          className="rounded-2xl"
        >
          <Text className="text-base font-semibold text-white dark:text-black">Login</Text>
        </Button>

        <Button
          variant={"borderSecondary"}
          size={"xl"}
          onPress={() => router.push("/(auth)/register")}
          className="rounded-2xl"
        >
          <Text className="text-base font-semibold text-black dark:text-white">
            Register
          </Text>
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}
