import { useState } from "react";
import { toast } from "react-hot-toast";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";

const ProfileSettings = () => {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);

  const handleProfileUpdate = async () => {
    try {
      // Simulate an API call to update profile
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePicture(URL.createObjectURL(file));
    }
  };

  return (
    <div className="p-6 w-full">
      <h2 className="text-xl font-bold mb-4">Profile Settings</h2>
      <div className="mb-4">
        <label className="block mb-2">Profile Picture</label>
        <input type="file" accept="image/*" onChange={handlePictureChange} />
        {profilePicture && (
          <img src={profilePicture} alt="Profile Preview" className="mt-2 w-24 h-24 rounded-full" />
        )}
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-4">
        <Input
          type="text"
          placeholder="Bio"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />
      </div>
      <Button text="Update Profile" onClick={handleProfileUpdate} />
    </div>
  );
};

export default ProfileSettings;