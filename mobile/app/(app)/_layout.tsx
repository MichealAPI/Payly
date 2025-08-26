import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        presentation: "transparentModal",
        animation: "slide_from_right",
        animationDuration: 200,
      }}
    >
        <Stack.Screen name="groups" options={{headerShown: false}} />
    </Stack>
  );
}