import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/axiosConfig";

export const useAccountSettings = ({
  currentFirstName,
  currentLastName,
  currentEmail,
  currentIsEmailVerified,
  settings: initialSettings,
}) => {
  const [firstName, setFirstName] = useState(currentFirstName || "");
  const [lastName, setLastName] = useState(currentLastName || "");
  const [email, setEmail] = useState(currentEmail || "");
  const [settings, setSettings] = useState(() => {
    const defaultSettings = {
      emailNotifications: false,
      pushNotifications: false,
      inAppAlerts: false,
      profilePicture: null,
    };
    const settingsObject = initialSettings || defaultSettings;
    return settingsObject.map((setting) => ({
      key: setting.key,
      value: setting.value,
    }));
  });

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailVerified] = useState(currentIsEmailVerified || false);

  // Track a pending new profile picture file independently from settings
  const [pendingProfileFile, setPendingProfileFile] = useState(null);

  const navigate = useNavigate();

  const handleSaveChanges = useCallback(async () => {
    
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return false;
    }

    // Convert settings array back to an object for submission
    const settingsObject = settings.reduce((acc, { key, value }) => {
      acc[key] = value;
      return acc;
    }, {});


    const submissionData = new FormData();
    submissionData.append("firstName", firstName);
    submissionData.append("lastName", lastName);
    submissionData.append("email", email);

    // Append profile picture file if present
    if (pendingProfileFile) {
      submissionData.append("profilePicture", pendingProfileFile);
    }

    // Append other settings, always exclude profilePicture (server upserts it from the file)
    const settingsToSubmit = { ...settingsObject };
    delete settingsToSubmit.profilePicture;
    const settingsAsArray = Object.entries(settingsToSubmit).map(
      ([key, value]) => ({ key, value })
    );
    submissionData.append("settings", JSON.stringify(settingsAsArray));

    if (password) {
      submissionData.append("password", password);
    }

    try {
      const res = await apiClient.put(
        "/users/settings/update",
        submissionData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const data = res.data;

      toast.success("Account settings updated successfully!");
      setPassword("");
      setConfirmPassword("");
      setPendingProfileFile(null);

      // Replace settings with the latest from server (includes profilePictureVersion for cache-busting)
      if (Array.isArray(data.settings)) {
        setSettings(data.settings.map(({ key, value }) => ({ key, value })));
      }

      return true;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Failed to update settings"
      );
      return false;
    }
  }, [
    firstName,
    lastName,
    email,
    settings,
    password,
    confirmPassword,
    navigate,
    pendingProfileFile,
  ]);

  const handleDeleteAccount = useCallback(async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await apiClient.delete("/users/account");
        toast.success("Account deleted successfully!");
        navigate("/login");
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to delete account"
        );
      }
    }
  }, [navigate]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    settings,
    setSettings,
    isEmailVerified,
    password,
    setPassword,
    setConfirmPassword,
    handleSaveChanges,
    handleDeleteAccount,
    // expose pending file setter for profile picture selection
    setPendingProfileFile,
  };
};
