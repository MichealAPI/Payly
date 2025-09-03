// components/Dropdown.tsx
import React, { useState } from "react";
import {
  Platform,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActionSheetIOS,
  FlatList,
  Pressable,
} from "react-native";

type DropdownItem = {
  label: string;
  destructive?: boolean;
  onPress?: () => void;
};

type DropdownProps = {
  triggerLabel: string;
  items: DropdownItem[];
};

export default function Dropdown({ triggerLabel, items }: DropdownProps) {
  const [open, setOpen] = useState(false);

  const handleSelect = (item: DropdownItem) => {
    setOpen(false);
    if (item.onPress) {
      item.onPress();
    } else {
      Alert.alert("Selected", `You chose: ${item.label}`);
    }
  };

  const openMenu = () => {
    if (Platform.OS === "ios") {
      // Use native translucent ActionSheet
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...items.map((i) => i.label), "Cancel"],
          cancelButtonIndex: items.length,
          destructiveButtonIndex: items.findIndex((i) => i.destructive),
          userInterfaceStyle: "light",
        },
        (buttonIndex) => {
          if (buttonIndex < items.length) {
            handleSelect(items[buttonIndex]);
          }
        }
      );
    } else {
      // Android: custom floating dropdown
      setOpen((prev) => !prev);
    }
  };

  return (
    <View className="relative">
      {/* Trigger button */}
      <TouchableOpacity
        className="rounded-full bg-blue-600 px-4 py-2"
        onPress={openMenu}
      >
        <Text className="text-white font-semibold">{triggerLabel}</Text>
      </TouchableOpacity>

      {/* Android only: floating dropdown */}
      {Platform.OS === "android" && open && (
        <View className="absolute top-12 w-48 rounded-2xl border border-gray-200 bg-white shadow-xl z-50">
          <FlatList
            data={items}
            keyExtractor={(item) => item.label}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handleSelect(item)}
                className="px-4 py-3"
              >
                <Text
                  className={`text-base ${
                    item.destructive
                      ? "text-red-600 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {item.label}
                </Text>
              </Pressable>
            )}
            ItemSeparatorComponent={() => (
              <View className="h-[1px] bg-gray-200" />
            )}
          />
        </View>
      )}
    </View>
  );
}
