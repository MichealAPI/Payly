import React, { useEffect, useState } from "react";
import { View, Pressable, Image, StyleSheet, Text } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import Toast from "react-native-toast-message";

WebBrowser.maybeCompleteAuthSession();

type Props = {
  onSuccess?: (provider: string, data?: any) => void;
  onError?: (provider: string, error: any) => void;
};

export default function SocialSignIn({ onSuccess, onError }: Props) {
  console.log("[SocialSignIn] render start");
  const [loading, setLoading] = useState<string | null>(null);

  const CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "<GOOGLE_CLIENT_ID>";
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
    if (!response) return;
    console.log("[SocialSignIn] response", response);

    if (response.type === "success") {
      const params = (response as any).params;
      Toast.show({ type: "success", text1: "Google sign-in success" });
      onSuccess?.("google", params);
    } else if (response.type === "error") {
      onError?.("google", response);
      Toast.show({ type: "error", text1: "Google sign-in failed" });
    }
    setLoading(null);
  }, [response]);

  const googleSignIn = async () => {
    try {
      if (loading) return;
      setLoading("google");
      if (!promptAsync) throw new Error("promptAsync unavailable");
      console.log("[SocialSignIn] launching promptAsync");
      await promptAsync();
    } catch (err) {
      onError?.("google", err);
      Toast.show({ type: "error", text1: "Google sign-in error" });
      setLoading(null);
    }
  };

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityLabel="Sign in with Google"
        onPress={googleSignIn}
        style={styles.button}
      >
        <Image
          source={require("../../assets/images/google-auth-icon.png")}
          style={styles.iconGoogle}
        />
      </Pressable>

      <Pressable
        accessibilityLabel="Sign in with Google"
        onPress={googleSignIn}
        style={styles.button}
      >
        <Image
          source={require("../../assets/images/apple-auth-icon.png")}
          style={styles.iconGoogle}
        />
      </Pressable>

      <Pressable
        accessibilityLabel="Sign in with Google"
        onPress={googleSignIn}
        style={styles.button}
      >
        <Image
          source={require("../../assets/images/facebook-auth-icon.png")}
          style={styles.iconGoogle}
        />
      </Pressable>
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
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  iconGoogle: { width: 28, height: 28, resizeMode: "contain" },
});
