import React, { FC } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

type AlphabeticalSidebarProps = {
  onLetterPress: (letter: string) => void;
  alphabet: string[];
};

export const AlphabeticalSidebar: FC<AlphabeticalSidebarProps> = ({ onLetterPress, alphabet }) => {
  return (
    <View style={styles.sidebarContainer} pointerEvents="box-none">
      {alphabet.map((letter) => (
        <TouchableOpacity key={letter} onPress={() => onLetterPress(letter)} hitSlop={6}>
          <Text style={styles.letter}>{letter}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  sidebarContainer: {
  position: "absolute",
  right: 8,
  top: 8,
  bottom: 8,
  width: 28,
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "transparent",
  paddingHorizontal: 2,
  borderRadius: 6,
  },
  letter: {
  fontSize: 11,
  fontWeight: "600",
  paddingVertical: 2,
  color: "#9CA3AF",
  },
});