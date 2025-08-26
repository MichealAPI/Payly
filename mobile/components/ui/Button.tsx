import React from "react";
import {
  Pressable,
  View,
  GestureResponderEvent,
  StyleProp,
  ViewStyle,
  useColorScheme,
} from "react-native";
import Text from "@/global-components/Text";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

type Size = "minimal" | "medium" | "large" | "full";
type StyleType = "fill" | "outline" | "glass";

interface ButtonProps {
  text?: string;
  className?: string;
  onPress?: (e: GestureResponderEvent) => void;
  size?: Size;
  style?: StyleType;
  bgColors?: [string, string, ...string[]];
  hoverBgColors?: [string, string, ...string[]];
  shadowColor?: string;
  borderColor?: string;
  textVisibility?: boolean;
  iconVisibility?: boolean;
  icon?: React.ReactNode;
  disabled?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
}

const sizeClasses: Record<Size, string> = {
  large: "py-3 px-20 rounded-2xl",
  medium: "py-2.5 px-10 rounded-xl",
  full: "w-full py-4 px-7 rounded-xl",
  minimal: "justify-center items-center rounded-full w-12 h-12 p-0",
};

const Button: React.FC<ButtonProps> = ({
  text,
  className,
  onPress,
  size = "medium",
  style = "fill",
  bgColors = ["#7c3aed", "#a78bfa"],
  hoverBgColors = ["#9f74fc", "#bd9eff"],
  shadowColor = "#7c3aed",
  borderColor = "#7c3aed",
  textVisibility = true,
  iconVisibility = false,
  icon,
  disabled = false,
  containerStyle,
}) => {
  const scheme = useColorScheme();

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    onPress?.(e);
  };

  const shadowStyle: StyleProp<ViewStyle> = {
    shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  };

  const textEl = (
    <Text
      className={`font-bold text-lg text-secondary ${
        disabled ? "opacity-70" : ""
      }`}
    >
      {text}
    </Text>
  );

  const content = (
    <View className="flex-row items-center justify-center gap-2">
      {textVisibility && size !== "minimal" && textEl}
      {iconVisibility && icon && <View>{icon}</View>}
    </View>
  );

  // OUTLINE — wrapper has ONLY rounding/overflow/shadow; size on inner
  if (style === "outline") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        android_ripple={{ color: "rgba(124,58,237,0.15)", borderless: false }}
        style={[
          shadowStyle,
          disabled && { opacity: 0.5 },
          size === "full" ? { width: "100%" } : {},
          containerStyle,
        ]}
        className={`rounded-xl overflow-hidden ${className || ""}`}
      >
        <View className={`${sizeClasses[size]} items-center justify-center border-2 border-tertiary bg-transparent`}>
          {content}
        </View>
      </Pressable>
    );
  }

  // GLASS — no size on wrapper; all size on BlurView
  if (style === "glass") {
    return (
      <Pressable
        onPress={handlePress}
        disabled={disabled}
        android_ripple={{ color: "rgba(255,255,255,0.15)", borderless: false }}
        style={[
          shadowStyle,
          disabled && { opacity: 0.6 },
          size === "full" ? { width: "100%" } : {},
          containerStyle,
        ]}
        className={`rounded-2xl overflow-hidden ${className || ""}`}
      >
        {({ pressed }) => (
          <BlurView
            intensity={50}
            tint={scheme === "dark" ? "dark" : "light"}
            className={`${sizeClasses[size]} items-center justify-center`}
            style={{
              backgroundColor:
                scheme === "dark" ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.20)",
              borderWidth: 1,
              borderColor:
                scheme === "dark" ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)",
              transform: [{ scale: pressed ? 0.97 : 1 }],
              opacity: pressed ? 0.96 : 1,
            }}
          >
            {content}
          </BlurView>
        )}
      </Pressable>
    );
  }

  // FILL — no size on wrapper; all size on LinearGradient
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled}
      android_ripple={{ color: hoverBgColors[0], borderless: false }}
      style={[
        shadowStyle,
        disabled && { opacity: 0.6 },
        size === "full" ? { width: "100%" } : {},
        containerStyle,
      ]}
      className={`rounded-2xl overflow-hidden ${className || ""}`}
    >
      {({ pressed }) => (
        <LinearGradient
          colors={bgColors}
          start={[0, 0]}
          end={[1, 1]}
          //className=${sizeClasses[size]}: linear gradient doesn't support classNames sadly
          style={{
            transform: [{ scale: pressed ? 0.97 : 1 }],
            opacity: pressed ? 0.96 : 1,
            paddingTop: 16,
            paddingBottom: 16,
            paddingLeft: 8,
            paddingRight: 8,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {content}
        </LinearGradient>
      )}
    </Pressable>

  );
};


export default Button;
