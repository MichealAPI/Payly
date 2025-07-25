import mongoose from 'mongoose';

const movementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  amount: { type: Number, required: true },
  type: { type: String, enum: ['deposit', 'expense'], required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
  splitMethod: { type: String, enum: ['equal', 'fixed', "percentage"], default: 'equal' },
  participants: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      splitAmount: { type: Number, required: false },
    }
  ],
  commentsAmount: { type: Number, default: 0 },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Movement', movementSchema);