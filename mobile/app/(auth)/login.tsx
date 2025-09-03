import { useLogin } from "@/hooks/useLogin";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { View, Pressable, TouchableOpacity, Keyboard } from "react-native";
import Text from "@/global-components/Text";
import GlassCard from "@/components/ui/GlassCard";
import Logo from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import Animated, { FadeInDown, FadeIn } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import SocialSignIn from "@/components/ui/SocialSignIn";
import { ChevronLeftIcon, Loader2 } from "lucide-react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import * as Haptics from "expo-haptics";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { useColorScheme } from "react-native";

export default function LoginPage() {
  const router = useRouter();
  const { login, currentUser, isLoading, loginError, failedAttempts } = useLogin();
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [touchedEmail, setTouchedEmail] = useState(false);
  const [touchedPassword, setTouchedPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isValidEmail = (v: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  function validCredentials(email: string, password: string) {
    return isValidEmail(email) && password.trim().length > 0;
  }

  const handleLogin = useCallback(
    (emailValue: string, passwordValue: string) => {
      Keyboard.dismiss();
      if (validCredentials(emailValue, passwordValue)) {
        setLocalError(null);
        login(emailValue, passwordValue);
      } else {
        const problem = !isValidEmail(emailValue)
          ? "Please enter a valid email address."
          : "Password can't be empty.";
        setLocalError(problem);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    },
    [login]
  );

  const scheme = useColorScheme();
  const isDark = scheme === "dark";
  const bgColor: string = isDark ? "#050505" : "#f8f9fb";

  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView
      className="flex-1"
      edges={["bottom", "left", "right"]}
      style={{ backgroundColor: bgColor }}
      testID="login-screen"
    >
      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Decorative gradient header */}
        <LinearGradient
          colors={isDark ? ["#1e1b4b", "#312e81", "#1e1b4b"] : ["#ede9fe", "#ddd6fe", "#fafafa"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: "absolute", top: 0, left: 0, right: 0, height: 320 }}
        />
        <TouchableOpacity
          onPress={goBack}
            style={{
              position: "absolute",
              left: 16,
              top: insets.top + 10,
              width: 46,
              height: 46,
              borderRadius: 999,
              backgroundColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.08)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
            }}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          testID="back-button"
          hitSlop={8}
        >
          <ChevronLeftIcon size={24} color={isDark ? "#fff" : "#1e1b4b"} />
        </TouchableOpacity>

        <View className="flex-1 items-center justify-center px-4 pb-10">
          <Animated.View
            entering={FadeIn.delay(50).springify()}
            className="w-full max-w-md"
            style={{ gap: 20 }}
          >
            <View className="items-center">
              <Logo className="w-16 h-16 mb-3" />
              <Animated.View entering={FadeInDown.delay(120).springify()}>
                <Text className="text-4xl font-semibold tracking-tight text-secondary dark:text-white text-center">
                  Welcome back
                </Text>
                <Text className="mt-1 text-base text-secondary dark:text-white/70 text-center">
                  Sign in to continue budgeting smarter
                </Text>
              </Animated.View>
            </View>

            <Animated.View
              entering={FadeInDown.delay(180).springify()}
              className="w-full"
            >
              <GlassCard>
                <View className="w-full" style={{ rowGap: 14 }}>
                  {/* Email */}
                  <View>
                    <Text className="text-xs font-medium mb-1 text-secondary dark:text-white/80">
                      Email
                    </Text>
                    <Input
                      testID="email-input"
                      accessibilityLabel="Email"
                      keyboardType="email-address"
                      textContentType="emailAddress"
                      autoCapitalize="none"
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="h-12 text-base rounded-lg"
                      value={email}
                      onBlur={() => setTouchedEmail(true)}
                      onChangeText={(v) => {
                        setEmail(v);
                        if (touchedEmail) setLocalError(null);
                      }}
                      returnKeyType="next"
                      onSubmitEditing={() => {
                        // focus password maybe later if we add ref
                      }}
                    />
                    {touchedEmail && !isValidEmail(email) && (
                      <Text className="mt-1 text-xs text-red-300" testID="email-error">
                        Enter a valid email address.
                      </Text>
                    )}
                  </View>

                  {/* Password */}
                  <View>
                    <View className="flex-row items-center justify-between mb-1">
                      <Text className="text-xs font-medium text-secondary dark:text-white/80">
                        Password
                      </Text>
                      <Pressable
                        hitSlop={8}
                        accessibilityRole="button"
                        onPress={() => router.push("/(auth)/forgot" as any)}
                        testID="forgot-password-link"
                      >
                        <Text className="text-xs font-semibold text-tertiary dark:text-purple-300">
                          Forgot?
                        </Text>
                      </Pressable>
                    </View>
                    <Input
                      testID="password-input"
                      accessibilityLabel="Password"
                      textContentType="password"
                      autoComplete="password"
                      placeholder="••••••••"
                      secureTextEntry
                      className="h-12 text-base rounded-lg"
                      value={password}
                      onBlur={() => setTouchedPassword(true)}
                      onChangeText={(v) => {
                        setPassword(v);
                        if (touchedPassword) setLocalError(null);
                      }}
                      returnKeyType="done"
                      onSubmitEditing={() => handleLogin(email, password)}
                    />
                    {touchedPassword && password.trim().length === 0 && (
                      <Text className="mt-1 text-xs text-red-300" testID="password-error">
                        Password is required.
                      </Text>
                    )}
                  </View>

                  {/* Sign In */}
                  <Button
                    testID="sign-in-button"
                    disabled={isLoading || !validCredentials(email, password)}
                    variant={"secondary"}
                    size="xl"
                    className="rounded-xl mt-2 flex-row"
                    onPress={() => handleLogin(email, password)}
                  >
                    {isLoading && (
                      <View className="pointer-events-none animate-spin">
                        <Icon as={Loader2} className="text-primary-foreground" />
                      </View>
                    )}
                    <Text className="text-base font-semibold text-white dark:text-black">
                      {isLoading ? "Signing in…" : "Sign In"}
                    </Text>
                  </Button>

                  {(loginError || localError) && (
                    <Text
                      className="mt-2 text-sm text-red-300 text-center"
                      testID="form-error"
                    >
                      {loginError || localError}
                    </Text>
                  )}

                  {failedAttempts > 1 && !isLoading && (
                    <Text className="mt-1 text-[11px] text-center text-secondary dark:text-white/50" testID="attempts-hint">
                      {failedAttempts} failed attempts. After 5 tries consider resetting your password.
                    </Text>
                  )}
                </View>
              </GlassCard>
            </Animated.View>

            {/* Social + Register */}
            <Animated.View entering={FadeInDown.delay(260).springify()} className="items-center mt-2">
              <View className="flex-row items-center justify-center mb-4">
                <Text className="text-secondary dark:text-white text-base">
                  New here?{" "}
                </Text>
                <TouchableOpacity
                  accessibilityRole="button"
                  testID="register-link"
                  onPress={() => router.push("/(auth)/register")}
                >
                  <Text className="text-base font-semibold text-tertiary dark:text-purple-300">
                    Create account
                  </Text>
                </TouchableOpacity>
              </View>

              <Text className="text-secondary dark:text-white/80 text-sm mb-3">
                Or continue with
              </Text>
              <SocialSignIn
                onSuccess={(provider: string, data: any) => {
                  console.log("social success", provider, data);
                }}
                onError={(provider: string, err: any) => console.log("social err", provider, err)}
              />
            </Animated.View>
          </Animated.View>
        </View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
