import Text from "@/global-components/Text";
import { GestureResponderEvent } from "react-native";
import { TouchableOpacity, View } from "react-native";

interface BottomSheetOptionProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  onPress: (e: GestureResponderEvent) => void;
}

export const BottomSheetOption: React.FC<BottomSheetOptionProps> = ({
  title,
  description,
  icon,
  iconColor,
  iconBgColor,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row gap-4 w-[90%] items-center p-4 rounded-3xl"
      style={{ backgroundColor: "#292929" }}
    >
      <View
        className="p-3 rounded-full border"
        style={{ 
            backgroundColor: iconBgColor,
            borderColor: iconColor,
        }}
      >
        {icon}
      </View>
      <View className="flex-1">
        <Text className="text-white font-bold">{title}</Text>
        {description && <Text className="text-gray-400">{description}</Text>}
      </View>
    </TouchableOpacity>
  );
};
