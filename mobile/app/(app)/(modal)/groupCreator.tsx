import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  View,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  Animated,
  Keyboard,
  TextInput as RNTextInput,
} from "react-native";
import { Stack, Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import Text from "@/global-components/Text";
import { router } from "expo-router";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import EmojiPicker from "@/components/ui/EmojiPicker";
import { Input } from "@/components/ui/input";

const DESCRIPTION_LIMIT = 160;

const GroupCreatorModal: React.FC = () => {
  const dispatch = useDispatch();
  const selectedCurrency = useSelector(
    (state: RootState) => state.currencySelector.currency
  );

  const [groupName, setGroupName] = useState("");
  const [groupDescription, setGroupDescription] = useState("");
  const [groupIcon, setGroupIcon] = useState<string>("👥");
  const [isPickingEmoji, setIsPickingEmoji] = useState(false);
  const emojiInputRef = useRef<RNTextInput | null>(null);

  const handleEmojiChange = useCallback((text: string) => {
    if (!text) {
      setGroupIcon("👥");
      return;
    }
    const chars = Array.from(text.trim());
    if (chars.length === 0) return;
    setGroupIcon(chars[0]);
  }, []);

  const [showValidation, setShowValidation] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  // External currency selection handled via /(modal)/currencySelector

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 280,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const nameTooLong = groupName.length > 60;
  const canCreate =
    groupName.trim().length >= 3 && !!selectedCurrency && !nameTooLong;
  const descTooLong = groupDescription.length > DESCRIPTION_LIMIT;

  const attemptCreate = () => {
    if (!canCreate) {
      setShowValidation(true);
      return;
    }
    // Placeholder success action
    console.log("Create group", {
      name: groupName.trim(),
      description: groupDescription.trim(),
      currency: selectedCurrency,
    });
    // Close modal after creation
    Keyboard.dismiss();
  };

  const openCurrencySelector = () =>
    router.push("/(app)/(modal)/currencySelector" as any);

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Stack.Screen options={{ headerShown: false }} />
      <KeyboardAwareScrollView
        enableOnAndroid
        keyboardOpeningTime={0}
        className="flex-1"
        contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
      >
        <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={() => setIsPickingEmoji(true)}
                accessibilityLabel="Pick group icon"
                className={`mr-3 rounded-full ${isPickingEmoji ? "bg-blue-600/30" : "dark:bg-white/10 bg-black/10"} p-2 border ${isPickingEmoji ? "border-blue-500" : "border-transparent"}`}
              >
                <Text className="text-2xl">{groupIcon}</Text>
              </TouchableOpacity>
              <Text className="text-xl font-bold dark:text-white text-black">New group</Text>
            </View>
            <Link href=".." asChild>
              <TouchableOpacity
                accessibilityLabel="Close modal"
                className="p-2 rounded-full"
              >
                <MaterialIcons
                  name="close"
                  size={22}
                  color={Platform.OS === "ios" ? "#F3F4F6" : "#fff"}
                />
              </TouchableOpacity>
            </Link>
          </View>

          {/* Group Name Field */}
          <View className="mb-10">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-medium text-secondary">
                Group name
              </Text>
              <Text className="text-xs text-secondary/60">
                {groupName.length}/60
              </Text>
            </View>
            <Input
              className="min-h-14 p-4"
              placeholder="e.g. Weekend Trip"
              placeholderTextColor="#9CA3AF"
              value={groupName}
              onChangeText={setGroupName}
              accessibilityLabel="Group name"
              returnKeyType="next"
              maxLength={60}
            />
            {showValidation && groupName.trim().length < 3 && (
              <Text className="text-red-400 text-xs mt-1">
                Enter at least 3 characters.
              </Text>
            )}
            {nameTooLong && (
              <Text className="text-red-400 text-xs mt-1">Name too long.</Text>
            )}
          </View>

          {/* Description Field */}
          <View className="mb-20">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-sm font-medium text-secondary">
                Brief description
              </Text>
              <Text className="text-xs text-secondary">
                {groupDescription.length}/{DESCRIPTION_LIMIT}
              </Text>
            </View>
            <Input
              className="min-h-28 p-4"
              multiline
              textAlignVertical="top"
              placeholder="What is this group about?"
              placeholderTextColor="#9CA3AF"
              value={groupDescription}
              onChangeText={setGroupDescription}
              accessibilityLabel="Group description"
              returnKeyType="done"
              maxLength={DESCRIPTION_LIMIT + 20} // soft overflow warning
            />
            {descTooLong && (
              <Text className="text-red-400 text-xs mt-1">
                Description too long.
              </Text>
            )}
          </View>

          {/* Currency Field */}
          <View className="mb-8">
            <Text className="text-sm font-medium text-secondary mb-2">
              Currency preference
            </Text>
            <TouchableOpacity
              onPress={openCurrencySelector}
              className="min-h-14 px-4 py-3 flex-row bg-background items-center justify-between rounded-md border border-input dark:bg-input/30 shadow-sm shadow-black/5 active:opacity-80"
              accessibilityLabel="Select currency"
              accessibilityRole="button"
            >
              {selectedCurrency ? (
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">{selectedCurrency.emoji}</Text>
                  <Text className="text-foreground font-medium">
                    {selectedCurrency.name} ({selectedCurrency.symbol})
                  </Text>
                </View>
              ) : (
                <Text className="text-muted-foreground">Tap to choose currency</Text>
              )}
              <MaterialIcons name="chevron-right" size={22} color="#9CA3AF" />
            </TouchableOpacity>
            {showValidation && !selectedCurrency && (
              <Text className="text-red-400 text-xs mt-1">
                Please pick a currency.
              </Text>
            )}
          </View>

          {/* Hidden emoji input using native keyboard */}
          {isPickingEmoji && (
            <RNTextInput
              ref={emojiInputRef}
              value={groupIcon}
              onChangeText={handleEmojiChange}
              autoFocus
              keyboardType="default"
              placeholder="😀"
              onBlur={() => setIsPickingEmoji(false)}
              accessibilityLabel="Emoji input"
              style={{ position: "absolute", opacity: 0, height: 0, width: 0 }}
              maxLength={4}
            />
          )}

          {/* CTA */}
          <TouchableOpacity
            activeOpacity={0.9}
            disabled={!canCreate}
            onPress={() => {
              attemptCreate();
              setIsPickingEmoji(false);
            }}
            className={`${
              canCreate ? "bg-blue-600" : "bg-gray-500/40"
            } py-4 rounded-2xl items-center border border-white/10`}
            accessibilityState={{ disabled: !canCreate }}
            accessibilityLabel="Create group"
          >
            <Text
              className={`${canCreate ? "text-white" : "text-white/40"} font-bold text-lg`}
            >
              Create group
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <EmojiPicker
          onEmojiSelected={(emoji) => handleEmojiChange(emoji.emoji)}
          open={isPickingEmoji}
          onClose={() => setIsPickingEmoji(false)}
        />
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default GroupCreatorModal;
