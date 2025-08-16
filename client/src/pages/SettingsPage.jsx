import Wrapper from "../components/ui/Wrapper/Wrapper";
import Navbar from "../components/ui/Navbar/Navbar";
import AccountSettings from "../components/settings/AccountSettings";
import Spinner from "../components/ui/Spinner/Spinner";
import { useSelector } from "react-redux";

const SettingsPage = () => {
  const { currentUser, isLoading } = useSelector((state) => state.auth);
  const { items } = useSelector((state) => state.groups); {/* Todo: keep always up-to-date */}

  // Combine user data and settings for the AccountSettings component
  const accountSettingsProps = currentUser
    ? {
        currentFirstName: currentUser.firstName,
        currentLastName: currentUser.lastName,
        currentEmail: currentUser.email,
        currentIsEmailVerified: currentUser.isEmailVerified,
        // Spread settings from the nested object
        settings: currentUser.settings || [],
        groupsAmount: items?.length,
        firstSeen: currentUser.createdAt,
      }
    : null;

  return (
    <Wrapper className={"bg-primary"}>
      <Navbar title="Settings" goBackEndpoint={"/groups"} />
      <div className="flex w-full justify-center">
        <div className="p-4 w-full max-w-3xl flex justify-center items-center">
          {isLoading || !currentUser ? (
            <Spinner />
          ) : accountSettingsProps ? (
            <AccountSettings {...accountSettingsProps} />
          ) : (
            <p>Could not load user settings</p>
          )}
        </div>
      </div>
    </Wrapper>
  );
};

export default SettingsPage;
