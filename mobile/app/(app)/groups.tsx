import { useSheetRef, Sheet } from "@/components/nativewindui/Sheet";
import { BottomSheetOption } from "@/components/ui/BottomSheetOption";
import Group from "@/components/ui/Group";
import Text from "@/global-components/Text";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import { GroupIcon, PlusIcon, UserRoundPlus } from "lucide-react-native";
import { useEffect, useMemo } from "react";
import { TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const options = [
  {
    title: "Create a new group",
    description: "Start a new group",
    icon: <PlusIcon color={"#678BFF"}/>,
    iconColor: "#678BFF",
    iconBgColor: "#12329C",
    onPress: () => {
      router.push("/(modal)/groupCreator");
    },
  },

  {
    title: "Join an existing group",
    description: "Participate in an ongoing group",
    icon: <UserRoundPlus color={"#3FFF83"}/>,
    iconColor: "#3FFF83",
    iconBgColor: "#1C9747",
    onPress: () => {
      // Handle join existing group
    },
  }
]


const Groups = () => {
  const bottomSheetShelfModal = useSheetRef();

  // Use memoized snap points and ensure the larger snap point is available
  const snapPoints = useMemo(() => ["30%", "30%"], []);

  return (
    <SafeAreaView className="flex-1">
      <Text className="text-white">Groups:</Text>

      <View className="flex-1 w-full items-center">
        <Group
          name="Group 1"
          icon="👥"
          description="This is the first group"
          members={["Alice", "Bob", "Charlie"]}
        />
      </View>

      <TouchableOpacity
        className="absolute bottom-10 left-0 right-0 items-center"
        activeOpacity={0.8}
        // Present the sheet at the larger snap point (index 1) so it opens fully
        onPress={() => bottomSheetShelfModal.current?.present(1)}
      >
        <View className="justify-center items-center p-4 bg-tertiary rounded-full border-white border">
          <PlusIcon color={"#ffffff"} />
        </View>

        <View className="bg-tertiary mt-2 px-3 py-1 rounded-full border">
          <Text className="text-white font-bold">New Group</Text>
        </View>
      </TouchableOpacity>

  <Sheet ref={bottomSheetShelfModal} snapPoints={snapPoints}>
        <BottomSheetView className="items-center pb-6">

          <Text className="text-white text-lg font-bold mb-2">Options</Text>

          <View className="flex gap-4">
            {options.map((option, index) => (
              <BottomSheetOption
                key={index}
                title={option.title}
                description={option.description}
                icon={option.icon}
                iconColor={option.iconColor}
                iconBgColor={option.iconBgColor}
                onPress={option.onPress}
              />
            ))}
          </View>

        </BottomSheetView>
      </Sheet>
    </SafeAreaView>
  );
};

export default Groups;
