import React, { Fragment, useState } from "react";
import Logo from "../Logo/Logo";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";
import {
  ArrowPathRoundedSquareIcon,
  ShieldCheckIcon,
  BoltIcon,
  DevicePhoneMobileIcon,
  BanknotesIcon,
} from "@heroicons/react/24/outline";

const IconHamburger = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M4 6.5h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2zm0 6h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2zm0 6h16a1 1 0 0 0 0-2H4a1 1 0 0 0 0 2z" />
  </svg>
);

const IconClose = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L10.586 12l-5.775 5.775a1 1 0 0 0 1.414 1.414L12 13.414l5.775 5.775a1 1 0 0 0 1.414-1.414L13.414 12l5.775-5.775a1 1 0 0 0-1.414-1.414L12 10.586 6.225 4.811z" />
  </svg>
);

const HomeNavbar = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const go = (path) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav className="flex justify-between items-center p-4 md:bg-transparent bg-dark-gray/10">
        {/* Logo and Desktop Title */}
        <Logo className="hidden md:block w-8" onClickHomepageNavigate={true} />

        {/* Desktop actions */}
        <div className="hidden md:flex gap-4">
          <Button
            onClick={() => navigate("/login")}
            className="inline-flex items-center gap-2 cursor-pointer rounded-md border-1 border-secondary font-medium px-4.5 py-1.5 text-md/6.5 text-secondary/80 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-70 transition-opacity data-open:bg-gray-700"
          >
            Log In
          </Button>

          <Button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-2 cursor-pointer rounded-md border-1 border-secondary font-medium px-4.5 py-1.5 text-md/6.5 text-secondary/80 shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-70 transition-opacity data-open:bg-gray-700"
          >
            Sign Up
          </Button>

          <Button
            onClick={() => navigate("/contact")}
            className="inline-flex items-center cursor-pointer gap-2 rounded-md bg-secondary font-medium px-4.5 py-1.5 text-md/6.5 text-primary shadow-inner shadow-white/10 focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:opacity-70 transition-opacity data-open:bg-gray-700"
          >
            Contact
          </Button>
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden">
          <button
            type="button"
            aria-label="Open menu"
            onClick={() => setMobileOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2 text-secondary/80 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/70"
          >
            <IconHamburger className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <Transition appear show={mobileOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 md:hidden"
          onClose={setMobileOpen}
        >
          <div className="fixed inset-0 bg-primary/40" aria-hidden="true" />
          <div className="fixed inset-y-0 right-0 flex max-w-full">
            <TransitionChild
              as={Fragment}
              enter="transform transition ease-in-out duration-300"
              enterFrom="translate-x-full"
              enterTo="translate-x-0"
              leave="transform transition ease-in-out duration-200"
              leaveFrom="translate-x-0"
              leaveTo="translate-x-full"
            >
              <DialogPanel className="w-screen max-w-xs bg-primary text-secondary shadow-xl p-6 flex flex-col">
                <div className="flex items-center justify-between">
                  <Logo className="w-8" onClickHomepageNavigate={true} />
                  <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="rounded-md p-2 hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-secondary/70"
                  >
                    <IconClose className="h-6 w-6" />
                  </button>
                </div>

                <div className="mt-6 flex flex-col gap-3 border-t border-secondary/20 pt-5">
                  <Button
                    onClick={() => go("/register")}
                    className="inline-flex items-center justify-center gap-2 rounded-md bg-secondary font-medium px-4.5 py-2 text-md/6.5 text-primary shadow-inner shadow-white/10 data-hover:opacity-70 transition-opacity"
                  >
                    Sign Up
                  </Button>
                  <Button
                    onClick={() => go("/login")}
                    className="inline-flex items-center justify-center gap-2 rounded-md border-1 border-secondary/30 font-medium px-4.5 py-2 text-md/6.5 text-secondary/90 shadow-inner shadow-white/10 data-hover:opacity-70 transition-opacity"
                  >
                    Log In
                  </Button>
                </div>

                <div className="flex text-secondary/70 mt-5 flex-col gap-5">
                  <a onClick={() => go("/contact")} className="cursor-pointer">Contact Us</a>
                  <a onClick={() => go("/privacy")} className="cursor-pointer">Privacy Policy</a>
                  <a onClick={() => go("/terms")} className="cursor-pointer">Terms of Service</a>
                </div>

                <div className="flex justify-between items-center border-b-1 border-t-1 mt-5 pt-3 pb-3 border-secondary/20">
                  <div className="flex gap-0.5 items-center">
                    <p className="text-secondary/70 ">Theme</p>
                    <ArrowPathRoundedSquareIcon className="w-3" />
                  </div>
                  <ThemeSwitcher className="border-1 border-secondary/20 rounded-xl"/>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>


    </>
  );
};

export default HomeNavbar;
