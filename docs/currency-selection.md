## Currency Selection Integration

This project uses a dedicated modal screen for currency selection instead of an in-place bottom sheet. This simplifies gesture handling (especially on iOS) and reduces component complexity.

### Flow
1. User taps the currency field in `groupCreator`.
2. We route to `/(modal)/currencySelector` using `router.push("/(modal)/currencySelector")`.
3. The selector screen lists currencies (search, favorites, quick picks) and dispatches `setCurrency` when one is chosen.
4. After dispatch, it calls `router.back()` to return to the previous screen.
5. `groupCreator` reads the updated currency from Redux (`state.currencySelector.currency`).

### Why Not a Bottom Sheet?
The earlier bottom sheet approach caused gesture conflicts and unreliable inner scrolling on some devices. A dedicated modal:
- Provides consistent scrolling performance.
- Avoids complex nested gesture coordination.
- Keeps state management (Redux) unchanged.

### Key Files
- `app/(app)/(modal)/groupCreator.tsx` – Triggers navigation to selector.
- `app/(app)/(modal)/currencySelector.tsx` – Full-feature selector UI (search, favorites, quick picks).
- `features/modal/currencySelectorSlice.ts` – Redux slice storing the chosen currency.

### Extending
To add multi-select or recently used currencies:
- Add new arrays to the slice (e.g. `recent: Currency[]`).
- Update the selector screen to dispatch updates after each selection.

### Accessibility & UX
- Currency field has an accessibility label.
- Favorites persisted via AsyncStorage (`favCurrencies`).
- Long-press quick pick to favorite.

### Performance Notes
- Selector list is derived with `useMemo` to avoid unnecessary re-renders.
- Expensive mappings (emoji + formatting) happen once per filter input change.

### Testing Tips
Use React Native Testing Library to:
- Assert navigation push on tap.
- Mock store update and verify UI shows selected currency when returning.

---
Last updated: automated assistant refactor.