import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: 'User registered successfully', userId: user._id });
    } catch (error) {
        // Todo: handle potential errors, e.g., duplicate email
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Server error during registration' });
    }
};

export const loginUser = async (req, res) => {
    const {email, password} = req.body;
    const user = await User.findOne({email});
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).json({message: 'Invalid email or password'});
    }

    if (user) {
        req.session.user = {
            id: user._id,
            email: user.email,
        }
    }

    res.json({message: 'Login successful', user: req.session.user});
}