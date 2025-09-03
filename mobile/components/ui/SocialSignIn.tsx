import React, { useEffect, useState, useCallback } from "react";
import { View, Pressable, Image, StyleSheet, Text, Platform, useColorScheme } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";
import apiClient from "@/api/axiosConfig";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { verifyAuthStatus } from "@/features/auth/authSlice";

// IMPORTANT: The following native modules are not available in Expo Go unless you create a development build.
// We therefore load them lazily inside try/catch blocks so the routes don't crash (causing missing default export warnings).
// See https://docs.expo.dev/development/introduction/ to create a dev build when you want full native module support.
let AppleAuthentication: typeof import("expo-apple-authentication") | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  AppleAuthentication = require("expo-apple-authentication");
} catch {}

// react-native-fbsdk-next requires a dev build / config plugin; guard it.
let FB: {
  LoginManager: typeof import("react-native-fbsdk-next").LoginManager;
  AccessToken: typeof import("react-native-fbsdk-next").AccessToken;
  Settings: typeof import("react-native-fbsdk-next").Settings;
} | undefined;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require("react-native-fbsdk-next");
  FB = {
    LoginManager: mod.LoginManager,
    AccessToken: mod.AccessToken,
    Settings: mod.Settings,
  };
} catch {}

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onSuccess?: (provider: string, data?: any) => void;
  onError?: (provider: string, error: any) => void;
};

export default function SocialSignIn({ onSuccess, onError }: Props) {
  const [loading, setLoading] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const colorScheme = useColorScheme();

  const CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID || "<GOOGLE_CLIENT_ID>";
  const redirectUri = AuthSession.makeRedirectUri();

  // hooks must always be called at top level
  const discovery = AuthSession.useAutoDiscovery("https://accounts.google.com");
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri,
      scopes: ["openid", "profile", "email"],
      responseType: AuthSession.ResponseType.IdToken,
    },
    discovery
  );

  useEffect(() => {
    (async () => {
      if (!response) return;
      if (response.type === "success") {
        try {
          const idToken = (response as any).params.id_token;
            // exchange idToken with backend
          const res = await apiClient.post("/auth/google", { idToken });
          Toast.show({ type: "success", text1: "Signed in with Google" });
          onSuccess?.("google", res.data);
          // refresh auth state
          dispatch(verifyAuthStatus());
        } catch (err) {
          Toast.show({ type: "error", text1: "Google exchange failed" });
          onError?.("google", err);
        } finally {
          setLoading(null);
        }
      } else if (response.type === "error") {
        onError?.("google", response);
        Toast.show({ type: "error", text1: "Google sign-in failed" });
        setLoading(null);
      } else if (response.type === "dismiss" || response.type === "cancel") {
        setLoading(null);
      }
    })();
  }, [response, dispatch, onSuccess, onError]);

  const googleSignIn = useCallback(async () => {
    if (loading) return;
    try {
      setLoading("google");
      await promptAsync();
    } catch (err) {
      onError?.("google", err);
      Toast.show({ type: "error", text1: "Google sign-in error" });
      setLoading(null);
    }
  }, [loading, promptAsync, onError]);
  const disabledStyle = (prov: string) => (loading === prov ? { opacity: 0.6 } : null);

  const appleSignIn = async () => {
    if (loading) return;
    if (!AppleAuthentication || Platform.OS !== "ios") {
      Toast.show({ type: "info", text1: "Apple Sign-In unavailable" });
      return;
    }
    try {
      setLoading("apple");
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        ],
      });
      if (!credential.identityToken) throw new Error("No identity token");
      const res = await apiClient.post("/auth/apple", { identityToken: credential.identityToken });
      Toast.show({ type: "success", text1: "Signed in with Apple" });
      onSuccess?.("apple", res.data);
      dispatch(verifyAuthStatus());
    } catch (err: any) {
      if (err?.code === "ERR_REQUEST_CANCELED") {
        Toast.show({ type: "info", text1: "Apple sign-in cancelled" });
      } else {
        Toast.show({ type: "error", text1: "Apple sign-in failed" });
        onError?.("apple", err);
      }
    } finally {
      setLoading(null);
    }
  };

  const facebookSignIn = async () => {
    if (loading) return;
    if (!FB) {
      Toast.show({ type: "info", text1: "Facebook Sign-In requires dev build" });
      return;
    }
    try {
      setLoading("facebook");
      const fbAppId = process.env.EXPO_PUBLIC_FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID;
      if (fbAppId) {
        FB.Settings.setAppID(fbAppId);
      }
      FB.Settings.initializeSDK();
      const result = await FB.LoginManager.logInWithPermissions(["public_profile", "email"]);
      if (result.isCancelled) {
        Toast.show({ type: "info", text1: "Facebook sign-in cancelled" });
        setLoading(null);
        return;
      }
      const data = await FB.AccessToken.getCurrentAccessToken();
      if (!data) throw new Error("No access token");
      const res = await apiClient.post("/auth/facebook", { accessToken: data.accessToken.toString() });
      Toast.show({ type: "success", text1: "Signed in with Facebook" });
      onSuccess?.("facebook", res.data);
      dispatch(verifyAuthStatus());
    } catch (err) {
      Toast.show({ type: "error", text1: "Facebook sign-in failed" });
      onError?.("facebook", err);
    } finally {
      setLoading(null);
    }
  };

  const isDark = colorScheme === "dark";
  const showApple = !!AppleAuthentication && Platform.OS === "ios"; // only show if available
  const showFacebook = !!FB; // hide in Expo Go w/out dev build

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="Sign in with Google"
        onPress={googleSignIn}
        style={[styles.button, { backgroundColor: isDark ? "#fff" : "#E6E6E6" }]}
        disabled={loading === "google" || !request}
      >
        <Image
          source={require("../../assets/images/google-auth-icon.png")}
          style={[styles.iconGoogle, disabledStyle("google") as any]}
        />
      </Pressable>
      {showApple && (
        <Pressable
          accessibilityLabel="Sign in with Apple"
          onPress={appleSignIn}
          style={[styles.button, { backgroundColor: isDark ? "#fff" : "#E6E6E6" }]}
          disabled={loading === "apple"}
        >
          <Image
            source={require("../../assets/images/apple-auth-icon.png")}
            style={[styles.iconGoogle, disabledStyle("apple") as any]}
          />
        </Pressable>
      )}
      {showFacebook && (
        <Pressable
          accessibilityLabel="Sign in with Facebook"
          onPress={facebookSignIn}
          style={[styles.button, { backgroundColor: isDark ? "#fff" : "#E6E6E6" }]}
          disabled={loading === "facebook"}
        >
          <Image
            source={require("../../assets/images/facebook-auth-icon.png")}
            style={[styles.iconGoogle, disabledStyle("facebook") as any]}
          />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginTop: 16,
  },
  button: {
    width: 56,
    height: 56,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  iconGoogle: { width: 28, height: 28, resizeMode: "contain" },
});
