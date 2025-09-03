import Text from "@/global-components/Text";
import { FlashList } from "@shopify/flash-list";
import { FC } from "react";
import { TouchableOpacity, View } from "react-native";

type SelectorProps = {
  setValue: (any: any) => void;
  data: Array<{
    Name: string;
    Value: string;
    Icon?: React.ReactNode | string;
  }>;
};

const ListItem: FC<{
  title: string;
  subtitle: string;
  value: string;
  setValue: (any: any) => void;
  icon?: React.ReactNode | string;
}> = ({ title, subtitle, icon, value, setValue }) => (
  <TouchableOpacity onPress={() => setValue(value)}>
    <View className="flex-row items-center p-4 border-b border-gray-300">
      {icon && <View className="mr-2">{icon}</View>}
      <View>
        <Text className="font-semibold text-secondary">{title}</Text>
        <Text className="text-secondary opacity-80">{subtitle}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export const Selector: FC<SelectorProps> = ({ data, setValue }) => {
  return (
    <FlashList
      estimatedItemSize={56}
      data={data}
      keyExtractor={(item) => item.Value}
      renderItem={({ item }) => (
        <ListItem
          title={item.Name}
          subtitle={item.Value}
          icon={item.Icon}
          setValue={setValue}
          value={item.Value}
        />
      )}
    />
  );
};
