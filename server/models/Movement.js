import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  paidBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  splitBetween: [{ user: mongoose.Schema.Types.ObjectId, amount: Number }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Movement', expenseSchema);