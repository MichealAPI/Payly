// Root index route: handle initial redirect based on auth state
import React from "react";
import { ActivityIndicator, View, Text, useColorScheme } from "react-native";
import { Redirect } from "expo-router";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

// Root index: decide where to go once auth slice is initialized.
export default function RootIndex() {
	const { isAuthenticated, initialized, isLoading } = useSelector(
		(s: RootState) => s.auth
	);
	const scheme = useColorScheme();
	const bg = scheme === "dark" ? "#111" : "#fff";
	const textColor = scheme === "dark" ? "#aaa" : "#111";

	if (initialized && !isLoading) {
		return (
			<Redirect href={isAuthenticated ? "/(app)/groups" : "/(auth)/home"} />
		);
	}

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
