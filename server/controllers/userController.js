import User from '../models/User.js'; 
export const getCurrentUser = async (req, res) => {

    const userId = req.user.id;

    const response = await User.findById(userId).select('-password -__v');

    if (!response) {
        return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user: response });
};