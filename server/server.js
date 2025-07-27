import app from './app.js';
import { connectDB } from './config/database.js';

import "./models/User.js";
import "./models/Group.js";
import "./models/Expense.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch(err => {
  console.error('Database connection failed:', err);
  process.exit(1);
});