import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ message: "User registered successfully", userId: user._id });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    // Log this unexpected error with Sentry
    throw new Error(`Server error during registration: ${error.message}`);
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };

    res.json({ message: "Login successful", user: req.session.user });
  } catch (error) {
    // Log this unexpected error with Sentry
    throw new Error(`Server error during login: ${error.message}`);
  }
};

export const deleteUserAccount = async (req, res) => {
  const userId = req.user.id;
  try {
    await User.findByIdAndDelete(userId);
    req.session.destroy();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    // Log this unexpected error with Sentry
    throw new Error(`Server error while deleting account: ${error.message}`);
  }
};
