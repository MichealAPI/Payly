import { GestureResponderEvent } from "react-native";
import { TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import Text from "@/global-components/Text";
import { ChevronRight } from "lucide-react-native";

interface GroupProps {
  name: string;
  icon: string; // emoji
  description: string;
  members: string[];
  onPress?: (e: GestureResponderEvent) => void;
}

const Group: React.FC<GroupProps> = ({ name, icon, description, onPress }) => {
  const [isPressed, setIsPressed] = useState(false);
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      activeOpacity={0.8}
      className="w-full"
    >
      <View
        className="flex-row justify-between items-center p-6 bg-accent rounded-xl border-1 border-tertiary"
        style={{
          backgroundColor: true ? "#181818" : "#ffffff",
          borderColor: "#989898",
          borderWidth: 1,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: isPressed ? 8 : 2 },
          shadowOpacity: isPressed ? 0.35 : 0.15,
          shadowRadius: isPressed ? 12 : 4,
          elevation: isPressed ? 12 : 2,
        }}
      >
        <View className="flex-row items-center gap-4">
          <View>
            <Text className="text-secondary text-4xl">{icon}</Text>
          </View>
          <View>
            <Text className="font-bold text-secondary text-2xl">{name}</Text>
            <Text className="text-secondary text-xl">{description}</Text>
          </View>
        </View>

        <ChevronRight color={"#989898"} />
      </View>
    </TouchableOpacity>
  );
};

export default Group;
