import { Redirect, router, Stack } from "expo-router";
import "@/global.css";
import { setAuthInitialized, verifyAuthStatus } from "@/features/auth/authSlice";
import { useFonts } from "expo-font";
import { Provider, useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect } from "react";
import { ActivityIndicator, View, useColorScheme, Text } from "react-native";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "@/store";
import {
  ThemeProvider as NavThemeProvider,
  DarkTheme,
  DefaultTheme,
} from "@react-navigation/native";
import { ThemeProvider as AppThemeProvider } from "@/providers/ThemeProviders"; // <-- your provider
import ErrorBoundary from "@/components/ErrorBoundary";
import Toast from "react-native-toast-message";
import { SafeAreaProvider } from "react-native-safe-area-context";

function RootNavigator() {
  console.log("[RootNavigator] render");
  const dispatch = useDispatch<AppDispatch>();
  const { sessionId, isAuthenticated, isLoading, initialized } = useSelector(
    (state: RootState) => state.auth
  );

  const colorScheme = useColorScheme();


  const [loaded] = useFonts({
    PhantomRegular: require("@/assets/fonts/phantom_regular.ttf"),
    PhantomItalic: require("@/assets/fonts/phantom_italic.ttf"),
    PhantomBold: require("@/assets/fonts/phantom_bold.ttf"),
  });

  useEffect(() => {
    // This effect runs once on app startup after the store has been rehydrated
    if (sessionId) {
      // If redux-persist found a session ID, we try to verify it with the server.
      dispatch(verifyAuthStatus());
    } else {
      dispatch(setAuthInitialized());
    }
  }, [sessionId, dispatch]);

  // During initial bootstrap wait until fonts loaded and auth slice initialized
  if (!initialized || isLoading || !loaded) {
    const bg = colorScheme === "dark" ? "#111" : "#fff";
    const textColor = colorScheme === "dark" ? "#aaa" : "#111";
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: bg,
        }}
      >
        <ActivityIndicator size="large" color="#7c3aed" />
        <Text style={{ marginTop: 12, color: textColor }}>Loading…</Text>
      </View>
    );
  }

  const stackOptions = {
    headerShown: false,
    // use a fade animation instead of the default slide to avoid the awkward
    // horizontal slide when switching between auth and app routes
    animation: "slide_from_left" as const,
    animationDuration: 150,
    contentStyle: { backgroundColor: colorScheme === "dark" ? "#111" : "#fff" },
  };

  return (
    <Stack screenOptions={stackOptions}>
      {isAuthenticated ? (
        // User is signed in
        <Stack.Screen name="(app)" />
      ) : (
        // User is not signed in
        <Stack.Screen name="(auth)" />
      )}
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <SafeAreaProvider>
      <AppThemeProvider>
        {/* sets background View + ThemeContext */}
        <NavThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Provider store={store}>
            <PersistGate
              persistor={persistor}
              loading={
                <View
                  style={{
                    flex: 1,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#111",
                  }}
                >
                  <ActivityIndicator size="large" color="#7c3aed" />
                  <Text style={{ marginTop: 12, color: "#aaa" }}>
                    Rehydrating state…
                  </Text>
                </View>
              }
            >
              <ErrorBoundary>
                <RootNavigator />
                <Toast />
              </ErrorBoundary>
            </PersistGate>
          </Provider>
        </NavThemeProvider>
      </AppThemeProvider>
    </SafeAreaProvider>
  );
}
