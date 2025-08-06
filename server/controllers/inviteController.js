import Invite from '../models/Invite.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const createInvite = async (req, res) => {
    const { id } = req.params; // group id
    const inviterId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid group ID.' });
    }

    try {
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found.' });
        }

        console.log('Group members:', group.members);

        // Check if the inviter is a member of the group
        if (!group.members.includes(inviterId)) {
            return res.status(403).json({ message: 'Only group members can create invites.' });
        }

        const invite = await Invite.create({
            group: id,
            inviter: inviterId,
        });

        res.status(201).json({ message: 'Invite created successfully.', inviteCode: invite.code });

    } catch (error) {
        throw new Error(`Error creating invite: ${error.message}`);
    }
};

export const acceptInvite = async (req, res) => {
    const { inviteCode } = req.body;
    const userId = req.user.id;

    if (!inviteCode) {
        return res.status(400).json({ message: 'Invite code is required.' });
    }

    try {
        const invite = await Invite.findOne({ code: inviteCode });

        if (!invite || invite.status !== 'pending') {
            return res.status(404).json({ message: 'Invite not found, is invalid, or has expired.' });
        }

        const group = await Group.findById(invite.group);
        if (!group) {
            return res.status(404).json({ message: 'Associated group not found.' });
        }

        // Check if user is already a member
        if (group.members.includes(userId)) {
            invite.status = 'accepted'; // Mark as accepted even if already a member
            await invite.save();
            return res.status(409).json({ message: 'You are already a member of this group.', group });
        }

        // Add user to group and group to user
        await Group.findByIdAndUpdate(group._id, { $addToSet: { members: userId } });
        await User.findByIdAndUpdate(userId, { $addToSet: { groups: group._id } });

        invite.status = 'accepted';
        await invite.save();
        
        const updatedGroup = await Group.findById(group._id).populate('members', 'name email');

        res.status(200).json({ message: 'Successfully joined the group!', group: updatedGroup });

    } catch (error) {
        throw new Error(`Error accepting invite: ${error.message}`);
    }
};