import Group from "../models/Group";

export const createMovement = async (req, res) => {
    const { title, description, type, participants, splitMethod, groupId } = req.body;
    const userId = req.user.id; // Get the authenticated user's ID from the request

    try {
        // Validate group existence
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Create the movement
        const movement = await Movement.create({
            title,
            description,
            type,
            participants,
            splitMethod,
            group: groupId,
            createdBy: userId
        });

        // Optionally, update the group's movements array
        group.movements.push(movement._id);
        await group.save();

        res.status(201).json({ message: 'Movement created successfully', movement });
    } catch (error) {
        console.error('Error creating movement:', error);
        res.status(500).json({ message: 'Server error while creating movement' });
    }
}