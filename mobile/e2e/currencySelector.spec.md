# Currency Selector E2E Test Plan (Scaffold)

## Goals
- Verify navigation from group creator to currency selector and back.
- Ensure shimmer appears then real list renders.
- Select a currency and confirm it shows in group creator page.
- Recent list updates after multiple selections.

## Suggested Tooling
If using Detox:
1. Launch app
2. Navigate to group creator
3. Tap currency field (testID: none yet, add if needed) -> expect currency selector screen
4. Assert shimmer (testID: currency-shimmers) visible
5. WaitFor element with testID all-currencies-list
6. Tap first currency row (add testIDs in EnhancedSelector if deeper granularity required)
7. Expect to be back on group creator and chosen currency text visible
8. Repeat selection with two other currencies
9. Open modal again and assert recent-section contains 3 entries

If using Playwright (web target): similar flow but via web bundler.

Add real implementation in a .e2e.ts file once E2E framework is installed.
