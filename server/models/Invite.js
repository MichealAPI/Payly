import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const inviteSchema = new mongoose.Schema({
  group: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group', 
    required: true 
  },
  inviter: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  code: { 
    type: String, 
    default: () => uuidv4().substring(0, 8), // Short code
    unique: true,
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'accepted'], 
    default: 'pending' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now, 
    expires: '7d' // Invites will automatically be deleted after 7 days
  },
});

export default mongoose.model('Invite', inviteSchema);