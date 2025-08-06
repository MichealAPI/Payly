import { useAccountSettings } from "../../hooks/useAccountSettings";
import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import Button from "../ui/Button/Button";
import Label from "../ui/Label/Label";
import SettingRow from "./SettingRow";
import { Switch } from "@headlessui/react";
import { TrashIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const UserInfoPill = ({ title, value }) => (
  <div className="flex flex-col border-r-1 border-white/20 pr-3 last:border-r-0">
    <p className="text-white/70 text-xs">{title}</p>
    <p className="text-white text-sm">{value}</p>
  </div>
);

const AccountSettings = (props) => {
  const {
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
    emailNotifications,
    setEmailNotifications,
    pushNotifications,
    setPushNotifications,
    inAppAlerts,
    setInAppAlerts,
    setConfirmPassword,
    handleSaveChanges,
    handleDeleteAccount,
  } = useAccountSettings(props);

  const { groupsAmount, firstSeen } = props;
  const cld = new Cloudinary({ cloud: { cloudName: "dzeah7jtd" } });
  const fileInputRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    // Clean up the object URL to avoid memory leaks
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("File is too large. Please select an image under 5MB.");
        return;
      }
      setProfilePicture(file); // Store the file object for upload

      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview(URL.createObjectURL(file)); // For preview
    }
  };

  const inputClasses =
    "block w-full rounded-md bg-transparent border border-white/30 text-white sm:text-sm p-2 focus:ring-indigo-500 focus:border-indigo-500";

  return (
    <div className="flex flex-col gap-6 w-full max-w-3xl">
      {/* Profile Header */}
      <div className="flex items-center w-full gap-4">
        <div className="flex cursor-pointer" onClick={handleProfilePictureClick}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/png, image/jpeg"
          />
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile Preview"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : profilePicture ? (
            <AdvancedImage
              cldImg={cld.image(profilePicture).setVersion(Date.now())}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center">
              {/* Placeholder Icon or Initials can go here */}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <h1 className="text-white font-medium text-2xl">
            {lastName ? `${firstName} ${lastName}` : "Your Name"}
          </h1>
          <div className="flex items-center gap-2">
            <p className="text-white/80">{email || "your.email@example.com"}</p>
            <Label
              bgColor={isEmailVerified ? "bg-green-500/80" : "bg-red-500/80"}
              text={isEmailVerified ? "Verified" : "Unverified"}
            />
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="flex gap-3">
        <UserInfoPill
          title="First seen"
          value={new Date(firstSeen).toLocaleDateString()}
        />
        <UserInfoPill title="Groups joined" value={groupsAmount || 0} />
      </div>

      {/* Settings Form */}
      <div className="flex flex-col">
        <h2 className="text-white font-medium text-lg mb-3">
          Account Settings
        </h2>
        <SettingRow title="Name">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className={inputClasses}
            placeholder="First name"
          />
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className={inputClasses}
            placeholder="Last name"
          />
        </SettingRow>

        <SettingRow title="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`${inputClasses} w-full`}
            placeholder="your.email@example.com"
          />
        </SettingRow>

        <SettingRow title="New Password">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClasses}
            placeholder="New password"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={inputClasses}
            placeholder="Confirm new password"
          />
        </SettingRow>

        <h2 className="text-white font-medium text-lg mb-3 mt-10">
          Notifications
        </h2>
        <SettingRow
          title="Email Notifications"
          description="Receive notifications via email"
        >
          <div className="flex w-full justify-end">
            <Switch
              checked={emailNotifications}
              onChange={setEmailNotifications}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition data-checked:bg-[#BD9EFF]/80"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
            </Switch>
          </div>
        </SettingRow>

        <SettingRow
          title="Push Notifications"
          description="Receive notifications on your device"
        >
          <div className="flex w-full justify-end">
            <Switch
              checked={pushNotifications}
              onChange={setPushNotifications}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition data-checked:bg-[#BD9EFF]/80"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
            </Switch>
          </div>
        </SettingRow>
        <SettingRow
          title="In-App Alerts"
          description="Receive alerts while using the app"
        >
          <div className="flex w-full justify-end">
            <Switch
              checked={inAppAlerts}
              onChange={setInAppAlerts}
              className="group inline-flex h-6 w-11 items-center rounded-full bg-gray-700 transition data-checked:bg-[#BD9EFF]/80"
            >
              <span className="size-4 translate-x-1 rounded-full bg-white transition group-data-checked:translate-x-6" />
            </Switch>
          </div>
        </SettingRow>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center border-t-1 border-white/20 pt-4">
        <Button
          onClick={handleDeleteAccount}
          className={"bg-red-500 hover:bg-red-600"}
          bgColor="radial-gradient(50%_50.01%_at_50%_51.16%,#FF1A1A_14.9%,#FF4D4D_100%)"
          hoverBgColor="radial-gradient(50%_50.01%_at_50%_51.16%,#FF1A1A_14.9%,#FF4D4D_100%)"
          shadowColor="0px_0px_6.6px 7px rgba(255, 26, 26, 0.25)"
          borderColor="#FF8282"
          iconVisibility={true}
          style="fill"
          icon={<TrashIcon className="w-6" />}
          text={"Delete Account"}
        />
        <Button
          onClick={handleSaveChanges}
          text={"Save Changes"}
          iconVisibility={true}
          icon={<CheckIcon className="w-6" />}
        />
      </div>
    </div>
  );
};

export default AccountSettings;
