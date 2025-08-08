import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const ProfilePicture = ({ className = "w-16 h-16", currentUser }) => {

  const findIndex = (key) => {
    return currentUser?.settings?.findIndex((setting) => setting.key === key);
  };

  const profilePictureIndex = findIndex("profilePicture");
  const profilePictureVersionIndex = findIndex("profilePictureVersion");

  const hasProfilePicture =
    currentUser &&
    currentUser.settings &&
    profilePictureIndex !== -1 &&
    profilePictureVersionIndex !== -1;

  if (hasProfilePicture) {
    const cld = new Cloudinary({
      cloud: {
        cloudName: "dzeah7jtd",
      },
    });

    const profilePicture = currentUser.settings[profilePictureIndex];
    const profilePictureVersion = currentUser.settings[profilePictureVersionIndex];

    const cldImg = cld.image(profilePicture.value);

    cldImg.setVersion(profilePictureVersion.value);

    return (
      <AdvancedImage
        cldImg={cldImg}
        alt="Profile Picture"
        className={`${className} object-cover`}
      />
    );
  }

  return (
    <img
      src={`https://placehold.co/64x64/BD9EFF/fff?text=${currentUser?.firstName.charAt(
        0
      )}`}
      alt={`${currentUser?.firstName}'s Profile Picture`}
      className={`${className} object-cover rounded-full`}
    />
  );
};

export default ProfilePicture;
