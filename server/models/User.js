import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  archived_groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  emailNotifications: { type: Boolean, default: true },
  pushNotifications: { type: Boolean, default: false },
  inAppAlerts: { type: Boolean, default: true },
  profilePicture: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('User', userSchema);