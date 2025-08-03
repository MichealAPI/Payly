import Group from "../models/Group.js";
import User from '../models/User.js';
import mongoose from 'mongoose';
import { calculateBalances } from '../utils/calculateBalance.js';

export const createGroup = async (req, res) => {
    // start stopwatch to measure execution time
    console.time('createGroup');

    const {name, description, icon} = req.body;
    const ownerId = req.user.id; // Get user ID from auth middleware

    try {
        // Create the new group without a transaction
        const group = new Group({
            name,
            description,
            icon,
            owner: ownerId, // Associate group with the owner
            members: [ownerId]
        });
        await group.save();

        // Add the group to the owner's list of groups
        await User.findByIdAndUpdate(ownerId, {
            $push: { groups: group._id }
        });

        // Populate the owner's email before sending the response
        const populatedGroup = await Group.findById(group._id).populate('members', 'email');

        res.status(201).json({ message: 'Group created successfully', group: populatedGroup });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Server error while creating group' });
    }

    // end stopwatch and log execution time
    console.timeEnd('createGroup');
};

export const updateGroup = async (req, res) => {
    // start stopwatch to measure execution time
    console.time('updateGroup');

    const { id } = req.params;
    const { name, description, icon } = req.body;
    const userId = req.user.id;

    try {
        const group = await Group.findById(id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Ensure the user updating the group is the owner
        //if (group.owner.toString() !== userId) {
        //    return res.status(403).json({ message: 'User not authorized to update this group' });
        //}

        // Update the group fields
        group.name = name || group.name;
        group.description = description || group.description;
        group.icon = icon || group.icon;

        await group.save();

        // Repopulate the members field before sending the response
        const updatedGroup = await Group.findById(id).populate('members', 'email');

        res.status(200).json({ message: 'Group updated successfully', group: updatedGroup });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: 'Server error while updating group' });
    }

    // end stopwatch and log execution time
    console.timeEnd('updateGroup');
};

export const deleteGroup = async (req, res) => {

    // start stopwatch to measure execution time
    console.time('deleteGroup');

    const { id } = req.params;

    try {
        const group = await Group.findByIdAndDelete(id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Remove the group from the owner's list of groups
        await User.findByIdAndUpdate(group.owner, {
            $pull: { groups: group._id }
        });

        res.status(200).json({ message: 'Group deleted successfully' });
    } catch (error) {
        console.error('Error deleting group:', error);
        res.status(500).json({ message: 'Server error while deleting group' });
    }

    // end stopwatch and log execution time
    console.timeEnd('deleteGroup');
};


export const archiveGroup = async (req, res) => {

    // start stopwatch to measure execution time
    console.time('archiveGroup');

    // Determine if we are archiving or unarchiving
    const isArchived = req.path.includes('unarchive') ? false : true; 

    const { id } = req.params;
    const userId = req.user.id; // Get user ID from auth middleware

    try {
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Add the group to the user's archived groups
        
        if (isArchived) {
            await User.findByIdAndUpdate(userId, {
                $push: { archived_groups: group._id }
            });
        } else {
            await User.findByIdAndUpdate(userId, {
                $pull: { archived_groups: group._id }
            });
        }

        res.status(200).json({ message: 'Group updated successfully' });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: 'Server error while updating group' });
    }

    // end stopwatch and log execution time
    console.timeEnd('archiveGroup');
};

export const getGroupDetails = async (req, res) => {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid group ID' });
    }

    try {
        const group = await Group.findById(id)
            .populate('members', 'name owner email')
            .populate({
                path: 'expenses',
                populate: [
                    { path: 'paidBy', model: 'User', select: 'email' },
                    { path: 'participants.user', model: 'User', select: 'email' }
                ]
            });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // remap each expense's paidBy & participants.user to { id, name }
        const transformedExpenses = group.expenses.map(exp => {
            const paidBy = exp.paidBy
                ? { id: exp.paidBy._id, name: exp.paidBy.email }
                : null;
            const participants = exp.participants.map(p => ({
                id: p.user._id,
                name: p.user.email,
                splitAmount: p.splitAmount, 
                isEnabled: p.isEnabled,
                ...(p.share != null && { share: p.share })
            }));
            const expObj = exp.toObject();
            expObj.paidBy = paidBy;
            expObj.participants = participants;
            return expObj;
        });

        const groupObj = group.toObject();
        groupObj.expenses = transformedExpenses;
        res.status(200).json(groupObj);
    } catch (error) {
        console.error('Error fetching group details:', error);
        res.status(500).json({ message: 'Server error while fetching group details' });
    }
};

export const getUserArchivedGroups = async (req, res) => {
    const userId = req.user.id; // Get user ID from auth middleware

    try {
        const user = await User.findById(userId).populate('archived_groups');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.archived_groups);
    } catch (error) {
        console.error('Error fetching archived groups:', error);
        res.status(500).json({ message: 'Server error while fetching archived groups' });
    }
};

export const updateGroupOrder = async (req, res) => {
    const { orderedGroupIds } = req.body;
    const userId = req.user.id; // Standardize to req.user.id

    if (!orderedGroupIds || !Array.isArray(orderedGroupIds)) {
        return res.status(400).json({ message: 'Invalid group order data provided.' });
    }

    try {
        // Find the user and update their 'groups' array to the new order.
        await User.findByIdAndUpdate(userId, { $set: { groups: orderedGroupIds } });
        res.status(200).json({ message: 'Group order updated successfully.' });
    } catch (error) {
        console.error('Error updating group order:', error);
        res.status(500).json({ message: 'Failed to update group order.' });
    }
};

// Modify your existing list/fetch groups controller
export const getGroups = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate({ // Standardize to req.user.id
            path: 'groups',
            model: 'Group',
            populate: {
                path: 'members',
                model: 'User',
                select: 'name email'
            }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // The 'groups' array is already sorted as per the user's document
        res.json(user.groups);
    } catch (error) {
        console.error('Failed to fetch groups:', error);
        res.status(500).json({ message: 'Failed to fetch groups' });
    }
};


export const getBalances = async (req, res) => {
    const { id } = req.params; // TODO: group ID, to be name-refactored

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid groupId provided.' });
    }

    // Current user
    const userId = req.user.id;

    try {
        const balances = await calculateBalances(id, userId);
        console.log("Calculated balances:", balances);
        res.status(200).json(balances);
    } catch (error) {
        console.error('Error calculating balances:', error);
        res.status(500).json({ message: 'Server error while calculating balances' });
    }
};