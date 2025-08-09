import React from "react";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
import { Button } from "@headlessui/react";

const HomeNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="flex justify-between items-center p-4 md:bg-transparent bg-gray-500/10">
      {/* Logo and Desktop Title */}
      <Logo className="hidden md:block w-8" onClickHomepageNavigate={true} />

      <div className="flex gap-4">
        <Button className="inline-flex items-center gap-2 cursor-pointer rounded-md border-1 border-white font-medium px-4.5 py-1.5 text-md/6.5 text-white/80 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-50 transition-opacity data-open:bg-gray-700">
          Sign Up
        </Button>

        <Button className="inline-flex items-center cursor-pointer gap-2 rounded-md bg-white font-medium px-4.5 py-1.5 text-md/6.5 text-black shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-50 transition-opacity data-open:bg-gray-700">
          Contact
        </Button>
      </div>
    </nav>
  );
};

export default HomeNavbar;
