import { useLogin } from "@/hooks/useLogin";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import Text from "@/global-components/Text";
import GlassCard from "@/components/ui/GlassCard";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import Animated, { FadeInDown } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import SocialSignIn from "@/components/ui/SocialSignIn";
import {
  ArrowLeftIcon,
  ChevronLeftIcon,
  Eye,
  EyeOff,
} from "lucide-react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { loginUser } from "@/features/auth/authSlice";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, isLoading, loginError, failedAttempts } =
    useLogin();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [socialLoading, setSocialLoading] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  function validCredentials(email: string, password: string) {
    return isValidEmail(email) && password.trim().length > 0;
  }

  function handleLogin(email: string, password: string) {
    if (validCredentials(email, password)) {
      login(email, password);
    } else {
      setError("Please enter valid email and password.");
      // haptics
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  return (
    <LinearGradient
      colors={["#1e1b4b", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={["bottom", "left", "right"]}>
        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <TouchableOpacity
            onPress={() => router.push("/home" as any)}
            style={{
              position: "absolute",
              left: 16,
              top: insets.top + 6, // small offset below the safe area
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.8)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
          >
            <ChevronLeftIcon size={24} color="#1e1b4b" />
          </TouchableOpacity>

          <View className="flex-1 text-center items-center justify-center">
            <Animated.View
              entering={FadeInDown.duration(900).springify()}
              className="w-full max-w-sm"
            >
              <Logo className="w-14 h- mx-auto mb-6" />
              <Text className="text-4xl font-semibold text-white text-center">
                Sign in now
              </Text>
              <Text className="text-xl text-white text-center mt-2">
                Please sign in to continue
              </Text>

              <View className="mt-6">
                <TextInput
                  className="bg-white/20 text-white text-lg/6 rounded-xl p-6 mb-4"
                  placeholder="Email"
                  placeholderTextColor="#ffffff"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                <View className="relative">
                  <TextInput
                    className="bg-white/20 text-lg/6 text-white rounded-xl p-6 mb-4"
                    placeholder="Password"
                    placeholderTextColor="#ffffff"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={{ paddingRight: 56 }} // make room for the left-side toggle
                  />
                  <Pressable
                    onPress={() => setShowPassword((prev) => !prev)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: [{ translateY: -24 }],
                      zIndex: 10,
                      padding: 8,
                    }}
                  >
                    <Text className="text-white text-sm font-medium">
                      {showPassword ? (
                        <EyeOff size={20} color={"#fff"} />
                      ) : (
                        <Eye size={20} color={"#fff"} />
                      )}
                    </Text>
                  </Pressable>
                </View>
                <Pressable onPress={() => router.push("/forgot")}>
                  <Text className="text-white font-bold text-right text-base">
                    Forgot Password?
                  </Text>
                </Pressable>

                <Button
                  text={isLoading ? "Signing in..." : "Sign In"}
                  disabled={isLoading}
                  size="full"
                  style="fill"
                  className="rounded-2xl mt-8"
                  onPress={() => handleLogin(email, password)}
                />

                {/* Inline error area: stays on page when credentials are wrong */}
                {loginError || error ? (
                  <Text className="text-red-300 text-center mt-4">
                    {loginError || error}
                  </Text>
                ) : null}

                <View className="mt-10 flex gap-2 items-center">
                  <View className="flex-row items-center justify-center">
                    <Text className="text-white font-light text-lg">
                      Don't have an account?{" "}
                    </Text>
                    <TouchableOpacity
                      onPress={() => router.push("/register")}
                    >
                      <Text className="text-tertiary font-bold text-lg">
                        Sign up
                      </Text>
                    </TouchableOpacity>
                  </View>

                  <Text className="text-white text-center text-lg font-light">
                    Or continue with
                  </Text>
                  <SocialSignIn
                    onSuccess={(provider: string, data: any) => {
                      // handle success from provider (e.g., token exchange)
                      console.log("social success", provider, data);
                    }}
                    onError={(provider: string, err: any) =>
                      console.log("social err", provider, err)
                    }
                  />
                </View>
              </View>
            </Animated.View>
          </View>
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
