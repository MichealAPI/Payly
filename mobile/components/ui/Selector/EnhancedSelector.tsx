import React, { FC, useState, useMemo, useRef } from "react";
import { View, TouchableOpacity, TextInput, StyleSheet, Platform } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { AlphabeticalSidebar } from "./AlphabeticalSidebar"; // Make sure to import the new component
import Text from "@/global-components/Text"; // Assuming this is your custom Text component

type SelectorData = {
  Name: string;
  Value: string;
  Icon?: React.ReactNode | string;
  fullName?: string;
};

type SelectorProps = {
  setValue: (any: any) => void;
  data: Array<SelectorData>;
  hideSearch?: boolean; // when true, parent controls search externally
  favoritesCodes?: string[]; // list of favorite currency codes (Value field)
  onToggleFavorite?: (code: string) => void; // toggle star
};

const ListItemBase: FC<{
  title: string;
  subtitle: string;
  value: string;
  setValue: (any: any) => void;
  icon?: React.ReactNode | string;
  isFavorite?: boolean;
  onToggleFavorite?: (code: string) => void;
}> = ({ title, subtitle, icon, value, setValue, isFavorite, onToggleFavorite }) => (
  <TouchableOpacity onPress={() => setValue(value)} activeOpacity={0.7}>
    <View
      style={styles.listItemContainer}
      className="flex-row items-center gap-3 bg-[#121212] rounded-xl mx-2 mb-2 p-4 border border-white/10"
    >
      {icon && <Text style={styles.iconContainer}>{icon}</Text>}
      <View className="flex-1">
        <Text style={styles.title} className="text-white font-semibold">
          {title}
        </Text>
        {!!subtitle && (
          <Text style={styles.subtitle} className="text-white/60 text-[11px]" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {onToggleFavorite && (
        <TouchableOpacity
          hitSlop={8}
          onPress={(e) => {
            e.stopPropagation();
            onToggleFavorite(value);
          }}
          accessibilityRole="button"
          accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Text className={"text-lg" + (isFavorite ? ' text-yellow-400' : ' text-white/30')}>★</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
);

const ListItem = React.memo(ListItemBase, (prev, next) => (
  prev.title === next.title &&
  prev.subtitle === next.subtitle &&
  prev.value === next.value &&
  prev.icon === next.icon &&
  prev.isFavorite === next.isFavorite
));

export const EnhancedSelector: FC<SelectorProps> = ({ data, setValue, hideSearch, favoritesCodes = [], onToggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const flashListRef = useRef<FlashList<SelectorData>>(null);

  const sortedData = useMemo(() => {
    return [...data].sort((a, b) => a.Name.localeCompare(b.Name));
  }, [data]);
  // derive a readable label for each item (strip leading emoji/flags)
  const getLabel = (item: SelectorData) => {
    if (item.fullName && item.fullName.length) return item.fullName;
    // find first alphanumeric character and return substring from there
    const m = item.Name.match(/[A-Za-z0-9]/);
    if (m && typeof m.index === 'number') {
      return item.Name.slice(m.index).trim();
    }
    return item.Name.trim();
  };

  const filteredData = useMemo(() => {
    if (hideSearch) return sortedData; // parent already filtered
    if (!searchQuery) return sortedData;
    const q = searchQuery.toLowerCase();
    return sortedData.filter((item) => {
      const label = getLabel(item).toLowerCase();
      return (
        label.includes(q) ||
        (item.Value && item.Value.toLowerCase().includes(q)) ||
        (item.Name && item.Name.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, sortedData, hideSearch]);

  const alphabet = useMemo(() => {
    const letters = new Set<string>();
    for (const item of sortedData) {
      const label = getLabel(item);
      if (!label) continue;
      const ch = label[0].toUpperCase();
      if (/[A-Z0-9]/.test(ch)) letters.add(ch);
    }
    return Array.from(letters).sort();
  }, [sortedData]);

  const handleLetterPress = (letter: string) => {
    const index = filteredData.findIndex(item => getLabel(item).toUpperCase().startsWith(letter));
    if (index !== -1 && flashListRef.current) {
      flashListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  return (
    <View style={styles.container} className="flex-1">
      {!hideSearch && (
        <TextInput
          style={styles.textInput}
          placeholder="Search currencies..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor={Platform.OS === 'ios' ? '#6B7280' : '#6B7280'}
        />
      )}
      <View style={styles.listContainer} className="flex-1 pb-4">
        <FlashList
          ref={flashListRef}
          data={filteredData}
          nestedScrollEnabled
          contentContainerStyle={{ paddingBottom: 32, paddingRight: 44 }}
          // hide native scrollbars where platforms allow (no-op on some)
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.Value}
          renderItem={({ item }) => {
            const subtitle = item.fullName ? `${item.fullName} · ${item.Value}` : item.Value;
            return (
              <ListItem
                title={item.Name}
                subtitle={subtitle}
                icon={item.Icon}
                setValue={setValue}
                value={item.Value}
                isFavorite={favoritesCodes.includes(item.Value)}
                onToggleFavorite={onToggleFavorite}
              />
            );
          }}
          estimatedItemSize={70} // This is important for performance
        />
        <AlphabeticalSidebar alphabet={alphabet} onLetterPress={handleLetterPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  textInput: {
    height: 46,
    borderColor: '#2A2A2A',
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    marginHorizontal: 12,
    marginTop: 4,
    marginBottom: 10,
    color: '#ffffff',
    backgroundColor: '#111111'
  },
  listContainer: {
    flex: 1,
  },
  listItemContainer: {
    flexDirection: 'row',
  },
  iconContainer: {
    marginRight: 10,
    fontSize: 20,
  },
  title: {
    fontWeight: '600',
  },
  subtitle: {
    opacity: 0.7,
  },
});