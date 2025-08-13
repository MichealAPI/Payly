# Ideas to Improve Your Splitwise-like App

## Core Features
- **Recurring Expenses**: Allow users to set up recurring bills and payments.
- **Multi-Currency Support**: Enable splitting expenses in different currencies with real-time conversion rates.
- **Expense Categories**: Add tags or categories for better expense tracking (e.g., food, travel, utilities).
- **Offline Mode**: Allow users to add expenses offline and sync when online.

## User Experience
- **Customizable Themes**: Provide light/dark mode and color customization.
- **Smart Notifications**: Notify users about pending payments, due dates, or group activity.
- **Search and Filters**: Add advanced search and filtering options for expenses.

## Social Features
- **Group Chat**: Integrate a chat feature for group discussions about expenses.
- **Activity Feed**: Show a timeline of group activities and updates.
- **Expense Voting**: Allow group members to vote on shared expenses.

## Analytics and Insights
- **Spending Trends**: Provide visual charts and insights into spending habits.
- **Debt Simplification**: Automatically simplify debts within groups.
- **Monthly Reports**: Generate downloadable reports for users.

## Security and Privacy
- **Two-Factor Authentication**: Enhance account security.
- **Data Encryption**: Ensure all user data is encrypted.
- **Privacy Controls**: Allow users to control who sees their expenses.

## Monetization
- **Premium Features**: Offer advanced features like ad-free experience, detailed analytics, or priority support.
- **Affiliate Partnerships**: Suggest deals or discounts for users based on their spending habits.

## Integrations
- **Bank Sync**: Allow users to link their bank accounts for automatic expense tracking.
- **Payment Gateways**: Integrate with popular payment platforms for settling balances.
- **Calendar Sync**: Sync recurring expenses with users' calendars.

## Gamification
- **Achievements**: Reward users for milestones like settling debts quickly.
- **Leaderboards**: Show rankings for most active or punctual users in groups.

## Accessibility
- **Multi-Language Support**: Offer the app in multiple languages.

# Other things I could be adding
- **Archived label**: Show labels on Archived Group Cards

# User preferences
- Preferred default currency

# Important, to be fixed as soon as possible
- No animation when confirming deletion in the group cardview
- Put card interaction toasts at bottom
- Group creation modal buttons need justify-between
- IMPORTANT: prevent http attacks 
- Request rate limit for creation and other important features
- Group count header inside the GroupSelector


- Refactor since members qualifies as the whole set of members in the group and participants only to the expense's  
- Use a listbox instead of paid by selector to also add profile pictures besides the participant's name
- Debug split methods, overview board calculation and fix the centering of the register vs login form.
- Implement Sentry for Backend
- Fix navbar back-button for smaller devices which currently overrides the dropdown.


- Implementing a CD/CI and Sentry for error logging.