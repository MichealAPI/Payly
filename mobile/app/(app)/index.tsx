import { useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useRouter } from "expo-router";
import { ActivityIndicator, View, Text, useColorScheme } from "react-native";

export default function IndexRedirect() {
  const router = useRouter();
  const { isAuthenticated, initialized, isLoading } = useSelector((state: RootState) => state.auth);
  const colorScheme = useColorScheme();

  useEffect(() => {
    if (!initialized || isLoading) return;
    if (isAuthenticated) {
      router.replace("/app/groups");
    } else {
      router.replace("/auth/home");
    }
  }, [isAuthenticated, initialized, isLoading, router]);

  const bg = colorScheme === "dark" ? "#111" : "#fff";
  const textColor = colorScheme === "dark" ? "#aaa" : "#111";

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: bg }}>
      <ActivityIndicator size="large" color="#7c3aed" />
      <Text style={{ marginTop: 12, color: textColor }}>Redirecting…</Text>
    </View>
  );
}
