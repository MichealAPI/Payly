import React, { useCallback, useEffect, useMemo, useState, useDeferredValue } from "react";
import { View, TextInput, TouchableOpacity, Platform, ScrollView, InteractionManager, useColorScheme } from "react-native";
import { Stack, router } from "expo-router";
import Text from "@/global-components/Text";
import { useDispatch, useSelector } from "react-redux";
import { currencies } from "@/constants/currencies";
import { setCurrency } from "@/features/modal/currencySelectorSlice";
import { EnhancedSelector } from "@/components/ui/Selector/EnhancedSelector";
import { RootState } from "@/store";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Shimmer from "@/components/ui/Shimmer";

// Design goals (revamped):
// 1. All-black unified surface (no split heavy sections)
// 2. Single search bar (top) controlling list; remove secondary search inside list component
// 3. Star-based favorites (toggle star); favorites float to top when not searching
// 4. Recent shown as subtle chips under search (deduplicated via slice already)
// 5. No duplicated colors; minimize accent noise
// 6. Quick picks condensed into horizontally scrollable chips (with star if favorite)

// Preprocess currencies once (outside component) for faster filtering
type Prepped = {
  Name: string;
  Value: string;
  Icon: string;
  fullName?: string;
  search: string; // aggregated lowercase search string
};

const PREPPED_CURRENCIES: Prepped[] = currencies.map(c => ({
  Name: c.name,
  Value: c.countryCode,
  Icon: c.emoji,
  fullName: c.fullName,
  search: (c.name + " " + (c.fullName || "") + " " + c.symbol + " " + c.countryCode).toLowerCase(),
}));

const QUICK_PICK_CODES = ["USD", "EUR", "GBP", "NGN", "JPY", "CAD"];
const CODE_LOOKUP = new Map(currencies.map(c => [c.countryCode, c] as const));

export default function CurrencySelectorModal() {
  const dispatch = useDispatch();
  const scheme = useColorScheme();
  const isDark = scheme === "dark";

  const palette = useMemo(() => ({
    bg: isDark ? "#000000" : "#FFFFFF",
    gradient: isDark ? ["#050505", "#050505"] : ["#FFFFFF", "#FFFFFF"],
    surface: isDark ? "#111111" : "#F3F4F6",
    surfaceAlt: isDark ? "#0C0C0C" : "#EFEFF1",
    border: isDark ? "#1f1f1f" : "#DADCE1",
    text: isDark ? "#FFFFFF" : "#111111",
    subText: isDark ? "rgba(255,255,255,0.40)" : "rgba(0,0,0,0.50)",
    hint: isDark ? "#525252" : "#8C8C91",
    starActive: isDark ? "#f5c843" : "#C78100",
    starInactive: isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.25)",
    chipBg: isDark ? "#111111" : "#E9EAED",
    footerBorder: isDark ? "#111111" : "#E5E6EA",
  }), [isDark]);

  const current = useSelector(
    (state: RootState) => state.currencySelector.currency
  );
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query); // smoother typing
  const [favorites, setFavorites] = useState<string[]>([]);
  const recent = useSelector((state: RootState) => state.currencySelector.recent);
  const [loading, setLoading] = useState(true); // only for shimmer of favorites + recent (list can still render)
  const [favoritesReady, setFavoritesReady] = useState(false);

  // Load favorites & ensure ordering appears at top (persisted across opens)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem("favCurrencies");
        if (raw && mounted) {
          const parsed: string[] = JSON.parse(raw);
          setFavorites(parsed);
        }
      } catch {}
      // Defer marking favorites ready until after initial interactions to speed perceived open
      InteractionManager.runAfterInteractions(() => {
        if (mounted) setFavoritesReady(true);
      });
      if (mounted) setLoading(false); // remove artificial 400ms delay
    };
    load();
    return () => { mounted = false; };
  }, []);

  const saveFavorites = async (next: string[]) => {
    // normalize to unique, preserve order
    const uniq = Array.from(new Set(next));
    setFavorites(uniq);
    try {
      await AsyncStorage.setItem("favCurrencies", JSON.stringify(uniq));
    } catch {}
  };

  const toggleFavorite = (code: string) => {
    const next = favorites.includes(code) ? favorites.filter((c) => c !== code) : [...favorites, code];
    saveFavorites(next);
  };

  const shapedData = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    let base = PREPPED_CURRENCIES;
    if (q) base = PREPPED_CURRENCIES.filter(c => c.search.includes(q));
    if (favorites.length) {
      const favSet = new Set(favorites);
      const favOrdered = favorites
        .map(code => base.find(b => b.Value === code))
        .filter(Boolean) as Prepped[];
      const rest = base.filter(b => !favSet.has(b.Value));
      return [...favOrdered, ...rest];
    }
    return base;
  }, [deferredQuery, favorites]);

  const handleSelect = useCallback(
    (countryCode: string) => {
      const found = CODE_LOOKUP.get(countryCode);
      if (found) {
        dispatch(setCurrency(found));
        router.back();
      }
    },
    [dispatch]
  );

  const quickPick = useMemo(() => QUICK_PICK_CODES
    .map(code => currencies.find(c => c.name === code || c.countryCode === code))
    .filter(Boolean), []);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: palette.bg }}
      testID="currency-selector"
    >
      <Stack.Screen
        options={{
          headerShown: false,
          // (optional) set status bar style if you use expo-status-bar elsewhere
        }}
      />
      <LinearGradient
        colors={palette.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="pb-3"
      >
        <View className="px-4 pt-5 pb-4 gap-4">
          <View className="flex-row items-center justify-between">
            <Text style={{ color: palette.text }} className="text-lg font-semibold">Select Currency</Text>
            <TouchableOpacity onPress={() => router.back()} hitSlop={8}>
              <MaterialIcons name="close" size={22} color={palette.text} />
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search code, name or symbol"
              placeholderTextColor={palette.hint}
              className="rounded-xl px-4 h-12 text-sm"
              style={{
                backgroundColor: palette.surface,
                borderWidth: 1,
                borderColor: palette.border,
                color: palette.text,
              }}
              autoCorrect={false}
              autoCapitalize="characters"
              testID="currency-search"
            />
            {loading && (
              <View className="mt-3 flex-row gap-2" testID="currency-shimmers">
                <Shimmer width={120} height={14} />
                <Shimmer width={80} height={14} />
              </View>
            )}
            {!!current && (
              <Text
                className="text-[11px] mt-2"
                style={{ color: palette.subText }}
                testID="current-currency"
              >
                Current: {current.emoji} {current.name}
              </Text>
            )}
            {/* Recent chips */}
            {recent.length > 0 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
                contentContainerStyle={{ paddingRight: 12 }}
              >
                {recent.map(r => (
                  <TouchableOpacity
                    key={r.countryCode}
                    onPress={() => handleSelect(r.countryCode)}
                    style={{
                      backgroundColor: palette.surface,
                      borderColor: palette.border,
                      borderWidth: 1,
                    }}
                    className="mr-2 px-3 py-2 rounded-xl"
                    testID={`recent-${r.countryCode}`}
                  >
                    <Text style={{ color: palette.text }} className="text-xs font-medium">
                      {r.emoji} {r.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            {/* Quick picks */}
            {!query && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="mt-3"
                contentContainerStyle={{ paddingRight: 12 }}
              >
                {quickPick.map((c: any) => {
                  const fav = favorites.includes(c!.countryCode);
                  return (
                    <TouchableOpacity
                      key={c!.countryCode}
                      onPress={() => handleSelect(c!.countryCode)}
                      onLongPress={() => toggleFavorite(c!.countryCode)}
                      style={{
                        backgroundColor: palette.surface,
                        borderColor: palette.border,
                        borderWidth: 1,
                      }}
                      className="mr-2 px-4 py-3 rounded-2xl flex-row items-center"
                    >
                      <Text style={{ color: palette.text }} className="font-medium">
                        {c!.emoji} {c!.name}
                      </Text>
                      <Text
                        className="ml-2 text-xs"
                        style={{ color: fav ? palette.starActive : palette.starInactive }}
                      >
                        ★
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            )}
          </View>
        </View>
      </LinearGradient>

      <View className="flex-1 px-0 pt-1" testID="all-currencies-list">
        <EnhancedSelector
          data={shapedData}
          setValue={handleSelect}
          hideSearch
          favoritesCodes={favorites}
          onToggleFavorite={toggleFavorite}
          themeColors={{
            text: palette.text,
            subText: palette.subText,
            bg: palette.bg,
            surface: palette.surface,
            border: palette.border,
            starActive: palette.starActive,
            starInactive: palette.starInactive,
          }}
        />
        {loading && (
          <View className="px-4 mt-4" testID="list-shimmers">
            <Shimmer height={46} radius={14} style={{ marginBottom: 12 }} />
            {Array.from({ length: 10 }).map((_, i) => (
              <Shimmer key={i} height={54} radius={12} style={{ marginBottom: 10 }} />
            ))}
          </View>
        )}
      </View>
      <View
        className="px-5 pb-5 pt-3"
        style={{ borderTopWidth: 1, borderTopColor: palette.footerBorder }}
      >
        <Text className="text-[11px]" style={{ color: palette.subText }}>
          Tap to select. Long-press quick pick or tap star to favorite.
        </Text>
      </View>
    </SafeAreaView>
  );
}
