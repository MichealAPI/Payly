import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const useAccountSettings = ({
  currentFirstName,
  currentLastName,
  currentProfilePicture,
  currentEmail,
  currentIsEmailVerified,
  emailNotifications: currentEmailNotifications,
  pushNotifications: currentPushNotifications,
  inAppAlerts: currentInAppAlerts,
}) => {
  const [firstName, setFirstName] = useState(currentFirstName || "");
  const [lastName, setLastName] = useState(currentLastName || "");
  const [profilePicture, setProfilePicture] = useState(
    currentProfilePicture || null
  );
  const [email, setEmail] = useState(currentEmail || "");
  const [isEmailVerified] = useState(currentIsEmailVerified || false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(
    currentEmailNotifications ?? true
  );
  const [pushNotifications, setPushNotifications] = useState(
    currentPushNotifications ?? false
  );

  const hasProfilePictureChanged = profilePicture instanceof File;

  const [inAppAlerts, setInAppAlerts] = useState(currentInAppAlerts ?? true);
  const navigate = useNavigate();

  const handleSaveChanges = useCallback(async () => {
    if (password && password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("email", email);
    formData.append("emailNotifications", emailNotifications);
    formData.append("pushNotifications", pushNotifications);
    formData.append("inAppAlerts", inAppAlerts);

    if (hasProfilePictureChanged) {
      formData.append("profilePicture", profilePicture);
    }

    if (password) {
      formData.append("password", password);
    }

    try {
      const res = await fetch("/api/auth/settings", {
        method: "PUT",
        body: formData, // No 'Content-Type' header, browser sets it for FormData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to update settings");
      }

      toast.success("Account settings updated successfully!");
      setPassword("");
      setConfirmPassword("");
      // Optionally refresh or update state to show new image without a full reload
      if (data.profilePicture) {
        setProfilePicture(data.profilePicture);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }, [
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    emailNotifications,
    pushNotifications,
    inAppAlerts,
    profilePicture,
    hasProfilePictureChanged,
  ]);

  const handleDeleteAccount = useCallback(async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        const res = await fetch("/api/auth/account", {
          method: "DELETE",
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || "Failed to delete account");
        }
        toast.success("Account deleted successfully!");
        navigate("/login");
      } catch (error) {
        toast.error(error.message);
      }
    }
  }, [navigate]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    profilePicture,
    setProfilePicture,
    email,
    setEmail,
    isEmailVerified,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    emailNotifications,
    setEmailNotifications,
    pushNotifications,
    setPushNotifications,
    inAppAlerts,
    setInAppAlerts,
    handleSaveChanges,
    handleDeleteAccount,
  };
};