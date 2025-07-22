import Group from "../models/Group.js";
import User from "../models/User.js";
import fetchMemberNames from "../utils/groupUtils.js";

export const createGroup = async (req, res) => {
    const {name, description, icon} = req.body;
    const ownerId = req.user.id; // Get user ID from auth middleware

    try {
        const group = await Group.create({
            name,
            description,
            icon,
            owner: ownerId, // Associate group with the owner
            members: [ownerId]
        });

        // Add the group to the owner's list of groups
        await User.findByIdAndUpdate(ownerId, {
            $push: { groups: group._id }
        });

        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        console.error('Error creating group:', error);
        res.status(500).json({ message: 'Server error while creating group' });
    }
};

export const getGroups = async (req, res) => {
    // Retrieve user from request (assuming user is authenticated)
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).populate('groups');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Process each group to replace member IDs with member names
        const groupsWithMemberNames = await Promise.all(
            user.groups.map(async (group) => {
                const memberNames = await fetchMemberNames(group.members);
                // Return a plain object to avoid issues with Mongoose documents
                return {
                    ...group.toObject(),
                    members: memberNames,
                };
            })
        );

        res.status(200).json(groupsWithMemberNames);
    } catch (error) {
        console.error('Error fetching groups:', error);
        res.status(500).json({ message: 'Server error while fetching groups' });
    }
};

export const updateGroup = async (req, res) => {
    const { id } = req.params;
    const { title, description, members } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(id, {
            title,
            description,
            members
        }, { new: true });

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Group updated successfully', group });
    } catch (error) {
        console.error('Error updating group:', error);
        res.status(500).json({ message: 'Server error while updating group' });
    }
};

export const deleteGroup = async (req, res) => {
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
};


export const archiveGroup = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // Get user ID from auth middleware

    try {
        const group = await Group.findById(id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Add the group to the user's archived groups
        await User.findByIdAndUpdate(userId, {
            $push: { archived_groups: group._id }
        });

        res.status(200).json({ message: 'Group archived successfully' });
    } catch (error) {
        console.error('Error archiving group:', error);
        res.status(500).json({ message: 'Server error while archiving group' });
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
