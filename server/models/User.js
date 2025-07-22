import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  archived_groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
});

export default mongoose.model('User', userSchema);