import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadImage } from "../utils/uploadUtils.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage });

export const uploadMiddleware = upload.single("profilePicture");

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
    // Todo: handle potential errors, e.g., duplicate email
    if (error.code === 11000) {
      return res.status(409).json({ message: "Email already in use" });
    }
    res.status(500).json({ message: "Server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  if (user) {
    req.session.user = {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      profilePicture: user.profilePicture,
    };
  }

  res.json({ message: "Login successful", user: req.session.user });
};

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const updateUserSettings = async (req, res) => {
  const userId = req.user.id;
  const {
    firstName,
    lastName,
    email,
    password,
    emailNotifications,
    pushNotifications,
    inAppAlerts,
  } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.firstName = firstName ?? user.firstName;
    user.lastName = lastName ?? user.lastName;
    user.email = email ?? user.email;
    user.emailNotifications = emailNotifications === 'true' ?? user.emailNotifications;
    user.pushNotifications = pushNotifications === 'true' ?? user.pushNotifications;
    user.inAppAlerts = inAppAlerts === 'true' ?? user.inAppAlerts;

    let newProfilePictureUrl;
    if (req.file) {
      newProfilePictureUrl = await uploadImage(
        req.file.buffer,
        "profilePicture",
        userId.toString()
      );

      if (newProfilePictureUrl) {
        user.profilePicture = newProfilePictureUrl;
      }
    }

    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();
    res.status(200).json({
      message: "Settings updated successfully",
      profilePicture: newProfilePictureUrl || user.profilePicture,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error while updating settings" });
  }
};

export const deleteUserAccount = async (req, res) => {
  const userId = req.user.id;
  try {
    await User.findByIdAndDelete(userId);
    req.session.destroy();
    res.status(200).json({ message: "Account deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error while deleting account" });
  }
};


export const getUserProfilePicture = async (req, res) => {
    const userId = req.user.id;
    try {
        const user = await User.findById(userId).select('profilePicture');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ profilePicture: user.profilePicture });
    } catch (error) {
        res.status(500).json({ message: "Server error while fetching profile picture" });
    }
};
