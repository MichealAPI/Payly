import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  icon: String,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  movements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movement' }],
});

export default mongoose.model('Group', groupSchema);