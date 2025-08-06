import Wrapper from "../components/ui/Wrapper/Wrapper";
import Navbar from "../components/ui/Navbar/Navbar";
import AccountSettings from "../components/settings/AccountSettings";
import { useEffect, useState } from "react";
import Spinner from "../components/ui/Spinner/Spinner";
import { useSelector } from "react-redux";

const SettingsPage = () => {
  const [userSettings, setUserSettings] = useState(null);

  const { currentUser, isLoading } = useSelector((state) => state.auth);

  useEffect(() => {

    if (!currentUser) { // user is not logged in
      return;
    }

    setUserSettings({
      currentFirstName: currentUser.firstName,
      currentLastName: currentUser.lastName,
      currentEmail: currentUser.email,
      currentIsEmailVerified: true,
      currentProfilePicture: currentUser.profilePicture,
      firstSeen: currentUser.createdAt,
      groupsAmount: currentUser.groups.length,
      emailNotifications: currentUser.emailNotifications,
      pushNotifications: currentUser.pushNotifications,
      inAppAlerts: currentUser.inAppAlerts,
    });
  }, [currentUser]);

  return (
    <Wrapper>
      <Navbar title="Settings" />
      <div className="flex w-full justify-center">
        <div className="p-4 w-full max-w-3xl flex justify-center items-center">
          {isLoading ? (
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
