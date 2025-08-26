// components/ui/HomeNavbar.tsx
import { View, TouchableOpacity, Text } from "react-native";
import { useRouter } from "expo-router";
import { FC, useState } from "react";
import { Menu, X } from "lucide-react-native";
import Logo from "./Logo";

const HomeNavbar: FC = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  return (
    <View className="flex-row justify-between items-center px-4 py-3 bg-dark-gray/20">
      <Logo className="w-8 h-8" />
      <TouchableOpacity onPress={() => setOpen(!open)}>
        {open ? <X size={28} className="text-secondary" /> : <Menu size={28} className="text-secondary" />}
      </TouchableOpacity>

      {open && (
        <View className="absolute top-14 right-4 bg-primary rounded-xl p-4 shadow-lg">
          <TouchableOpacity onPress={() => router.push("/login")} className="mb-2">
            <Text className="text-secondary text-lg">Log In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/register" as any)} className="mb-2">
            <Text className="text-secondary text-lg">Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/contact" as any)} className="mb-2">
            <Text className="text-secondary text-lg">Contact</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default HomeNavbar;
