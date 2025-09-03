import { useColorScheme } from "react-native";
import NativeEmojiPicker from "rn-emoji-keyboard";

interface EmojiPickerProps {
  onEmojiSelected: (emoji: { emoji: string }) => void;
  open: boolean;
  onClose: () => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({
  onEmojiSelected,
  open,
  onClose,
}) => {
  const isDarkMode = useColorScheme() === "dark";

  const darkTheme = {
    backdrop: "#16161888",
    knob: "#766dfc",
    container: "#282829",
    header: "#fff",
    skinTonesContainer: "#252427",
    category: {
      icon: "#766dfc",
      iconActive: "#fff",
      container: "#252427",
      containerActive: "#766dfc",
    },
  };

  const lightTheme = {
    backdrop: "#ffffff88",
    knob: "#3b82f6",
    container: "#ffffff",
    header: "#111827",
    skinTonesContainer: "#f3f4f6",
    category: {
      icon: "#6b7280",
      iconActive: "#ffffff",
      container: "#f3f4f6",
      containerActive: "#3b82f6",
    },
  };

  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <NativeEmojiPicker
      onEmojiSelected={onEmojiSelected}
      open={open}
      onClose={onClose}
      theme={theme}
    />
  );
};

export default EmojiPicker;
