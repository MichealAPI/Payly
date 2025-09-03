import { loginUser } from "@/features/auth/authSlice";
import { AppDispatch, RootState } from "@/store";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import * as Haptics from "expo-haptics";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";

export function useLogin() {
  const dispatch = useDispatch<AppDispatch>();
  const { error, currentUser, isLoading } = useSelector(
    (state: RootState) => state.auth
  );
  const [loginError, setLoginError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState<number>(0);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await dispatch(
          loginUser({ email: email.trim(), password: password.trim() })
        ).unwrap();
        // success: clear any previous login error and counters
        setLoginError(null);
        setFailedAttempts(0);
        // gentle haptic feedback for success
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
          type: "success",
          text1: "Signed in",
          visibilityTime: 1200,
        });
      } catch (err: any) {
        // increment local failed attempts counter and set a friendly message
        setFailedAttempts((s) => s + 1);

        const message = err.message || error || "An error occurred";
        console.log("[useLogin] login error:", message);
        setLoginError(message);
        // stronger haptic feedback for error
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        Toast.show({
          type: "error",
          text1: "Sign in failed",
          text2: message,
          visibilityTime: 4000,
        });
      }
    },
    [dispatch, error]
  );

  return { login, currentUser, isLoading, loginError, failedAttempts };
}
