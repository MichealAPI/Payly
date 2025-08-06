import User from "../models/User.js";
import Group from "../models/Group.js";

export const getCurrentUser = async (req, res) => {
  const userId = req.user.id;

  const response = await User.findById(userId).select("-password -__v");

  if (!response) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user: response });
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
    user.emailNotifications =
      emailNotifications === "true" ?? user.emailNotifications;
    user.pushNotifications =
      pushNotifications === "true" ?? user.pushNotifications;
    user.inAppAlerts = inAppAlerts === "true" ?? user.inAppAlerts;

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
    throw new Error("Error updating user settings: " + error.message);
  }
};

export const handleArchivingUserGroup = async (req, res) => {
  // Determine if we are archiving or unarchiving
  const isArchived = req.path.includes("unarchive") ? false : true;

  const { groupId } = req.params;
  const userId = req.user.id; // Get user ID from auth middleware

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Add the group to the user's archived groups

    if (isArchived) {
      await User.findByIdAndUpdate(userId, {
        $push: { archived_groups: group._id },
      });
    } else {
      await User.findByIdAndUpdate(userId, {
        $pull: { archived_groups: group._id },
      });
    }

    res.status(200).json({ message: "Group updated successfully" });
  } catch (error) {
    throw new Error("Error updating group: " + error.message);
  }
};

export const getUserArchivedGroups = async (req, res) => {
  const userId = req.user.id; // Get user ID from auth middleware

  try {
    const user = await User.findById(userId).populate("archived_groups");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.archived_groups);
  } catch (error) {
    throw new Error("Error fetching archived groups: " + error.message);
  }
};

export const updateUserGroupOrder = async (req, res) => {
  const { orderedGroupIds } = req.body;
  const userId = req.user.id; // Standardize to req.user.id

  if (!orderedGroupIds || !Array.isArray(orderedGroupIds)) {
    return res
      .status(400)
      .json({ message: "Invalid group order data provided." });
  }

  try {
    // Find the user and update their 'groups' array to the new order.
    await User.findByIdAndUpdate(userId, { $set: { groups: orderedGroupIds } });
    res.status(200).json({ message: "Group order updated successfully." });
  } catch (error) {
    throw new Error("Error updating group order: " + error.message);
  }
};
