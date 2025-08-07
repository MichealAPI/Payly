import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";

const ProfilePicture = ({className="w-16 h-16", currentUser, profilePicture=null }) => {

    console.log("Current user in ProfilePicture:", currentUser);
    if ((currentUser && currentUser.settings["profile-picture"]) || profilePicture) {

        const cloudinary = new Cloudinary({
            cloud: {
                cloudName: "dzeah7jtd"
            }
        });

        return (
            <AdvancedImage
                cldImg={cloudinary.image(profilePicture || currentUser.settings["profile-picture"])}
                alt="Profile Picture"
                className={`${className} object-cover`}
            />
        );
    }

  return (
    <img
      src={`https://placehold.co/64x64/BD9EFF/fff?text=${currentUser?.firstName.charAt(0)}`}
      alt={`${currentUser?.firstName}'s Profile Picture`}
      className={`${className} object-cover rounded-full`}
    />
  );
};

export default ProfilePicture;
