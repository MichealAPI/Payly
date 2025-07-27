import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: {type: String},
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'expense'], required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  currency: { type: String, required: true },
  splitMethod: { type: String, enum: ['equal', 'fixed', "percentage"], default: 'equal' },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      splitAmount: { type: Number, required: false},
      isEnabled: { type: Boolean, default: true },
    }
  ],
  commentsAmount: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Expense', expenseSchema);