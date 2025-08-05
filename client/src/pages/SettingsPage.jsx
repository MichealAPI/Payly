import Wrapper from "../components/ui/Wrapper/Wrapper";
import Navbar from "../components/ui/Navbar/Navbar";
import AccountSettings from "../components/settings/AccountSettings";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner/Spinner";
import { toast } from "react-hot-toast";

const SettingsPage = () => {
  const [userSettings, setUserSettings] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSettings = async () => {
      try {
        const res = await fetch("/api/auth/profile");
        if (!res.ok) {
          throw new Error("Failed to fetch user settings");
        }
        const data = await res.json();
        setUserSettings({
          currentFirstName: data.firstName,
          currentLastName: data.lastName,
          currentEmail: data.email,
          currentIsEmailVerified: true,
          currentProfilePicture: data.profilePicture,
          firstSeen: data.createdAt,
          groupsAmount: data.groups.length,
          emailNotifications: data.emailNotifications,
          pushNotifications: data.pushNotifications,
          inAppAlerts: data.inAppAlerts,
        });

        console.log("User settings fetched:", data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserSettings();
  }, []);

  return (
    <Wrapper>
      <Navbar title="Settings" />
      <div className="flex w-full justify-center">
        <div className="p-4 w-full max-w-3xl flex justify-center items-center">
          {loading ? (
            <Spinner />
          ) : userSettings ? (
            <AccountSettings {...userSettings} />
          ) : (
            <p>Could not load user settings</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default SettingsPage;
