import { useRouter } from "expo-router";
import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Keyboard,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Animated, {
  FadeInDown,
  FadeOutUp,
  Layout,
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import {
  CheckCircle2,
  ChevronLeftIcon,
  ChevronRight,
  Eye,
  EyeOff,
} from "lucide-react-native";
import * as Haptics from "expo-haptics";

import Text from "@/global-components/Text";
import Logo from "@/components/ui/Logo";
import Button from "@/components/ui/Button";
import SocialSignIn from "@/components/ui/SocialSignIn";
import { registerUser } from "@/features/auth/authSlice";
import Toast from "react-native-toast-message";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

// --- Reusable Input Component ---
const InputField = ({
  innerRef,
  value,
  onChange,
  placeholder,
  secure = false,
  showToggle = false,
  autoCapitalize = "none",
  onSubmit,
}: {
  innerRef?: React.RefObject<TextInput>;
  value: string;
  onChange: (t: string) => void;
  placeholder: string;
  secure?: boolean;
  showToggle?: boolean;
  onSubmit?: () => void;
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
}) => {
  const [show, setShow] = useState(false);

  return (
    <View className="relative">
      <TextInput
        ref={innerRef}
        className="bg-white/20 text-white text-xl/6 rounded-xl p-6 mb-4 pr-12"
        placeholder={placeholder}
        placeholderTextColor="#ffffff"
        value={value}
        autoCapitalize={autoCapitalize}
        onChangeText={onChange}
        secureTextEntry={secure && !show}
        returnKeyType={onSubmit ? "next" : "done"}
        onSubmitEditing={onSubmit}
      />
      {showToggle && (
        <Pressable
          onPress={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2"
        >
          {show ? (
            <EyeOff size={20} color="#fff" />
          ) : (
            <Eye size={20} color="#fff" />
          )}
        </Pressable>
      )}
    </View>
  );
};

export default function RegisterPage() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch<AppDispatch>();

  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touchedStep, setTouchedStep] = useState(0); // track if user pressed Continue

  // Refs for auto-focus
  const emailRef = useRef<TextInput>(null);
  const firstNameRef = useRef<TextInput>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (step === 1) emailRef.current?.focus();
    if (step === 2) firstNameRef.current?.focus();
  }, [step]);

  // --- Validation ---
  const isValidEmail = useCallback(
    (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    []
  );

  const validateStep = useCallback(
    (s = step) => {
      const newErrors: Record<string, string> = {};
      if (s === 1) {
        if (!isValidEmail(form.email)) newErrors.email = "Enter a valid email.";
        if (form.password.length < 6)
          newErrors.password = "Password must be at least 6 characters.";
      }
      if (s === 2) {
        if (!form.firstName) newErrors.firstName = "First name is required.";
        if (!form.lastName) newErrors.lastName = "Last name is required.";
        if (!form.gender) newErrors.gender = "Please select a gender.";
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [form, step, isValidEmail]
  );

  // Shake animation for errors
  const shake = useSharedValue(0);
  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shake.value }],
  }));

  const triggerShake = () => {
    shake.value = withSequence(
      withTiming(-10, { duration: 60 }),
      withTiming(10, { duration: 60 }),
      withTiming(-6, { duration: 60 }),
      withTiming(6, { duration: 60 }),
      withTiming(0, { duration: 60 })
    );
  };

  const goNext = () => {
    Keyboard.dismiss();
    setTouchedStep(step); // mark step as touched (to show errors)
    if (!validateStep()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      triggerShake();
      return;
    }
    if (step < 2) setStep((s) => s + 1);
    else handleRegister();
  };

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1);
    else router.push("/home");
  };

  const handleRegister = async () => {
    console.log("Register:", form);

    try {
      await dispatch(registerUser(form)).unwrap();
      setShowSuccess(true);

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Registration failed",
        text2: err.message,
      });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      router.replace("/home");
    }
    
  };

  const setField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  // --- Progress Bar ---
  const progress = useSharedValue(step / 2);
  useEffect(() => {
    progress.value = step / 2;
  }, [step]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <LinearGradient
      colors={["#1e1b4b", "#0f172a"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1" edges={["bottom", "left", "right"]}>
        {/* Progress Bar */}
        <View
          className="h-1 absolute w-full bg-white/20"
          style={{ marginTop: insets.top }}
        >
          <Animated.View
            style={[{ height: "100%", backgroundColor: "#fff" }, progressStyle]}
          />
        </View>

        <KeyboardAwareScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          style={{ display: showSuccess ? "none" : "flex" }}
        >
          {/* Back Button */}
          <TouchableOpacity
            onPress={goBack}
            style={{
              position: "absolute",
              left: 16,
              top: insets.top + 25,
              width: 56,
              height: 56,
              borderRadius: 999,
              backgroundColor: "rgba(255,255,255,0.8)",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10,
            }}
            accessibilityLabel="Go back"
          >
            <ChevronLeftIcon size={24} color="#1e1b4b" />
          </TouchableOpacity>

          {/* Center Content */}
          <View className="flex-1 items-center justify-center px-6">
            <Animated.View
              entering={FadeInDown.duration(500)}
              exiting={FadeOutUp.duration(400)}
              layout={Layout.springify()}
              style={shakeStyle}
              className="w-full max-w-sm"
            >
              <Logo className="w-14 h-14 mx-auto mb-6" />
              <Text className="text-4xl font-semibold text-white text-center">
                {step === 1 ? "Create Account" : "Let's get to know you"}
              </Text>
              <Text className="text-lg text-white/90 text-center mt-2 mb-6">
                {step === 1
                  ? "Enter your login details"
                  : "Tell us about yourself"}
              </Text>

              {/* Step 1 */}
              {step === 1 && (
                <Animated.View entering={FadeInDown.delay(100)}>
                  <InputField
                    innerRef={emailRef}
                    value={form.email}
                    onChange={(v) => setField("email", v)}
                    autoCapitalize="none"
                    placeholder="Email"
                  />
                  {touchedStep >= 1 && errors.email && (
                    <Text className="text-red-400 mb-2">{errors.email}</Text>
                  )}

                  <InputField
                    value={form.password}
                    onChange={(v) => setField("password", v)}
                    placeholder="Password"
                    secure
                    showToggle
                  />
                  {touchedStep >= 1 && errors.password && (
                    <Text className="text-red-400 mb-2">{errors.password}</Text>
                  )}
                </Animated.View>
              )}

              {/* Step 2 */}
              {step === 2 && (
                <Animated.View entering={FadeInDown.delay(100)}>
                  <InputField
                    innerRef={firstNameRef}
                    value={form.firstName}
                    onChange={(v) => setField("firstName", v)}
                    placeholder="First Name"
                  />
                  {touchedStep >= 2 && errors.firstName && (
                    <Text className="text-red-400 mb-2">
                      {errors.firstName}
                    </Text>
                  )}
                  <InputField
                    value={form.lastName}
                    onChange={(v) => setField("lastName", v)}
                    placeholder="Last Name"
                  />

                  <View className="flex-row justify-around mb-4">
                    {["Male 🧑", "Female 👩", "Other"].map((g) => (
                      <Pressable
                        key={g}
                        onPress={() => setField("gender", g)}
                        className={`px-6 py-3 rounded-xl ${
                          form.gender === g ? "bg-white/40" : "bg-white/10"
                        }`}
                      >
                        <Text className="text-white font-medium">{g}</Text>
                      </Pressable>
                    ))}
                  </View>

                  {touchedStep >= 2 && errors.lastName && (
                    <Text className="text-red-400 mb-2">{errors.lastName}</Text>
                  )}

                  {touchedStep >= 2 && errors.gender && (
                    <Text className="text-red-400 mb-2">{errors.gender}</Text>
                  )}
                </Animated.View>
              )}

              {/* Continue / Register Button */}
              <Button
                text={step === 2 ? "Register" : "Continue"}
                size="full"
                style="fill"
                onPress={goNext}
                className="rounded-2xl mt-6"
              />

              {/* Social Sign in */}
              {step === 1 && (
                <View className="mt-10 items-center gap-2">
                  <Text className="text-white text-center text-lg font-light">
                    Or continue with
                  </Text>
                  <SocialSignIn
                    onSuccess={(p, d) => console.log("social success", p, d)}
                    onError={(p, e) => console.log("social err", p, e)}
                  />
                </View>
              )}
            </Animated.View>
          </View>
        </KeyboardAwareScrollView>

        {showSuccess && (
          <Animated.View
            entering={FadeInDown.springify().delay(100)}
            className="items-center flex-1 justify-center"
          >
            <CheckCircle2 size={64} color="white" />
            <Text className="text-white text-2xl font-bold mt-6">
              Registered Successfully
            </Text>

            <TouchableOpacity
              className="px-2 mt-10 rounded-2xl"
              onPress={() => router.replace("/")}
            >
              <View className="flex-row items-center bg-white/20 rounded-2xl px-6 py-3">
                <Text className="text-white text-lg font-medium">Go Home</Text>
                <ChevronRight color="#fff" />
              </View>
            </TouchableOpacity>
          </Animated.View>
        )}
      </SafeAreaView>
    </LinearGradient>
  );
}
