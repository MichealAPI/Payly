import React, { useMemo, useState, FC, useCallback } from 'react';
import { TextInput, TouchableOpacity, Platform, StyleSheet, View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import Text from '@/global-components/Text';

type Item = { Name: string; Value: string; Icon?: string | React.ReactNode };

interface Props {
  data: Item[];
  onSelect: (value: string) => void;
}

export const CurrencyBottomSheetList: FC<Props> = ({ data, onSelect }) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => {
    if (!query) return data;
    return data.filter(d => d.Name.toLowerCase().includes(query.toLowerCase()));
  }, [query, data]);
  const renderItem = useCallback(({ item }: { item: Item }) => (
    <TouchableOpacity
      onPress={() => onSelect(item.Value)}
      activeOpacity={0.7}
      style={styles.row}
    >
      {typeof item.Icon === 'string' ? (
        <Text style={styles.emoji}>{item.Icon}</Text>
      ) : (
        item.Icon
      )}
      <Text style={styles.label} className="text-white font-medium flex-1">
        {item.Name}
      </Text>
    </TouchableOpacity>
  ), [onSelect]);

  return (
    <BottomSheetFlatList
      data={filtered}
      keyExtractor={(i) => i.Value}
      renderItem={renderItem}
      keyboardDismissMode="on-drag"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 32 }}
      ListHeaderComponent={
        <View style={styles.headerWrap}>
          <TextInput
            style={styles.search}
            placeholder="Search..."
            placeholderTextColor={Platform.OS === 'ios' ? '#94A3B8' : '#94A3B8'}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      }
    />
  );
};

const styles = StyleSheet.create({
  headerWrap: { paddingHorizontal: 6, paddingTop: 4, paddingBottom: 8 },
  search: {
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.07)',
    color: '#fff'
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)'
  },
  emoji: { fontSize: 18, marginRight: 10 },
  label: { fontSize: 15 }
});

export default CurrencyBottomSheetList;