import { Cloudinary } from "@cloudinary/url-gen";
import { AdvancedImage } from "@cloudinary/react";
import { Popover, PopoverBackdrop, PopoverButton, PopoverPanel } from "@headlessui/react";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../features/ui/themeSlice";
import { useNavigate } from "react-router-dom";
import apiClient from "../../../api/axiosConfig";
import toast from "react-hot-toast";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";

const ProfilePicture = ({ className = "w-full h-full", currentUser }) => {
  const findIndex = (key) => {
    return currentUser?.settings?.findIndex((setting) => setting.key === key);
  };

  const {theme} = useSelector((state) => state.theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let icon;

  const profilePictureIndex = findIndex("profilePicture");
  const profilePictureVersionIndex = findIndex("profilePictureVersion");

  const hasProfilePicture =
    currentUser &&
    currentUser.settings &&
    profilePictureIndex !== -1 &&
    profilePictureVersionIndex !== -1;

  if (hasProfilePicture) {
    const cld = new Cloudinary({
      cloud: { cloudName: "dzeah7jtd" },
    });

    const profilePicture = currentUser.settings[profilePictureIndex];
    const profilePictureVersion =
      currentUser.settings[profilePictureVersionIndex];

    const cldImg = cld.image(profilePicture.value);
    cldImg.setVersion(profilePictureVersion.value);

    icon = (
      <AdvancedImage
        cldImg={cldImg}
        alt="Profile Picture"
        className="w-full h-full object-cover rounded-full"
      />
    );
  }

  if (!icon) {
    icon = (
      <img
        src={`https://placehold.co/64x64/BD9EFF/fff?text=${
          currentUser?.firstName?.[0] ?? "U"
        }`}
        alt={`${currentUser?.firstName ?? "User"}'s Profile Picture`}
        className="w-full h-full object-cover rounded-full"
      />
    );
  }

  const onLogout = async () => {
    try {
      const logOut = await apiClient.post("/auth/signout");

      toast.success("Logged out successfully", { position: "bottom-center" });

      navigate("/login", { replace: true });

    } catch {
      toast.error("Failed to log out", { position: "bottom-center" });
    }
  }

  const onEditProfile = () => {
    navigate("/settings")
  };

  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    if (!currentUser?.email) return;
    try {
      await navigator.clipboard.writeText(currentUser.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // ignore
    }
  };

  return (
    <Popover as="div" className={`relative inline-block ${className}`}>
      <PopoverButton
        type="button"
        className="block w-full h-full overflow-hidden rounded-full cursor-pointer p-0 focus:outline-none"
      >
        {icon}
      </PopoverButton>

      <AnimatePresence>
        <PopoverPanel static>
          {({ open }) =>
            open && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="absolute top-full left-1/2 md:-translate-x-9/10 -translate-x-15 mt-4 z-50  w-64 flex-col rounded-md outline-1 outline-secondary/20 bg-primary shadow-md ring-1 ring-black/5"
              >
                {/* top arrow */}
                <span
                  aria-hidden="true"
                  className="absolute -top-1.5 md:right-1/14 max-md:left-12 max-md:translate-x-1/2 w-3 h-3 bg-primary border-l border-t border-secondary/30 transform rotate-45"
                />

                <div className="px-4 py-3 flex items-center gap-3">
                  <div className="w-10 h-10 overflow-hidden rounded-full flex-shrink-0 outline-1 outline-secondary/20">
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-secondary truncate">
                        {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <span
                        className={`w-2 h-2 rounded-full ${
                          "bg-green-400"
                        }`}
                        aria-hidden
                      />
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <p className="text-xs text-secondary/60 truncate">{currentUser?.email}</p>
                      <button
                        type="button"
                        onClick={copyEmail}
                        className="text-xs text-secondary cursor-pointer hover:underline"
                        aria-label="Copy email"
                      >
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="px-3 py-2 border-t border-white/5 flex flex-col gap-2">
                  <div className="flex gap-2">
                    <button
                      className="flex-1 bg-secondary/20 text-secondary cursor-pointer text-sm py-1 rounded-md hover:bg-secondary/10"
                    >
                      View profile
                    </button>
                    <button
                      onClick={onEditProfile}
                      className="flex-1 bg-secondary/20 text-secondary cursor-pointer text-sm py-1 rounded-md hover:bg-secondary/10"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={onLogout}
                      className="flex-1 bg-red-500 text-white font-medium cursor-pointer text-sm py-1 rounded-md hover:opacity-90"
                    >
                      Sign out
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <button
                      onClick={() => dispatch(toggleTheme())}
                      className="text-xs text-secondary/50 hover:underline cursor-pointer"
                    >
                      Theme: {theme === "dark" ? "Dark" : "Light"} <ArrowPathRoundedSquareIcon className="w-4 inline-block" />
                    </button>
                    <a
                      onClick={() => navigate("/settings")}
                      className="text-xs text-secondary cursor-pointer hover:underline"
                    >
                      Settings
                    </a>
                  </div>
                </div>

                {/* hidden file input to trigger upload */}
                <input
                  id="profile-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    // implement upload flow (e.g., Cloudinary signed upload)
                    console.log("Selected avatar:", file);
                  }}
                />
              </motion.div>
            )
          }
        </PopoverPanel>
      </AnimatePresence>
    </Popover>
  );
};

export default ProfilePicture;
