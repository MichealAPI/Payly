import { ChevronsUpDownIcon, EllipsisVertical } from "lucide-react-native";
import { setCurrency } from "@/features/modal/currencySelectorSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { currencies } from "@/constants/currencies";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Text as DropdownText } from "@/components/ui/text";
import Text from "@/global-components/Text";
import { Button } from "./Button";
import { Icon } from "./icon";
import { View, TextInput } from "react-native";
import React, { useMemo, useState } from "react";

// A small curated subset for quick-access
const popularCodes = ["USD", "EUR", "GBP", "NGN", "JPY", "CAD", "AUD"];

export const CurrencyDropdown = () => {
  const dispatch = useDispatch();
  const selected = useSelector(
    (state: RootState) => state.currencySelector.currency
  );

  const [query, setQuery] = useState("");

  const popular = useMemo(
    () =>
      currencies.filter((c) => popularCodes.includes(c.name)).sort((a, b) =>
        a.name.localeCompare(b.name)
      ),
    []
  );

  const filtered = query
    ? currencies
        .filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.symbol.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 12)
    : popular.slice(0, 4); // show just 4 when no query for compact quick pick

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <Icon as={ChevronsUpDownIcon} className="text-secondary mr-1" />
          {selected ? (
            <Text className="text-secondary font-medium">
              {selected.emoji} {selected.name} ({selected.symbol})
            </Text>
          ) : (
            <Text className="text-secondary">Choose currency</Text>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 max-h-96">
        <DropdownMenuLabel>
          <DropdownText>Select currency</DropdownText>
        </DropdownMenuLabel>
        <View className="px-2 pb-2">
          <TextInput
            placeholder="Search..."
            value={query}
            onChangeText={setQuery}
            className="bg-secondary/20 px-3 py-2 rounded-md text-sm text-primary"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <DropdownMenuSeparator />
        {filtered.map((c) => (
          <DropdownMenuItem
            key={c.name}
            onPress={() => dispatch(setCurrency(c))}
            className="flex-row items-center"
          >
            <DropdownText>
              {c.emoji} {c.name} ({c.symbol})
            </DropdownText>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex-row items-center"
          onPress={() => {
            // Navigate to full modal selector
            // Using expo-router imperative import to avoid circular import
            try {
              const { router } = require("expo-router");
              router.push("/(modal)/currencySelector");
            } catch (e) {
              console.warn("Navigation failed", e);
            }
          }}
        >
          <DropdownText>More currencies...</DropdownText>
        </DropdownMenuItem>
        {!filtered.length && (
          <View className="px-3 py-2 opacity-70">
            <DropdownText>No results</DropdownText>
          </View>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
