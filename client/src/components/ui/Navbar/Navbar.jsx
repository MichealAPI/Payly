import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import PropTypes from "prop-types";
import {
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowLeftIcon, HomeIcon, HomeModernIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { useSelector } from "react-redux";
import ThemeSwitcher from "../ThemeSwitcher/ThemeSwitcher";

const Navbar = ({
  title,
  actions,
  activeAction,
  onActionClick,
  actionsDropdown,
  isBackButtonEnabled = true,
}) => {
  const navigate = useNavigate();

  const getActiveActionLabel = () => {
    if (actions && activeAction) {
      const active = actions.find((action) => action.id === activeAction);
      return active ? active.label : "Options";
    }
    return "Options";
  };

  const { currentUser } = useSelector((state) => state.auth);

  const handleTitleClick = () => {
    if (!isBackButtonEnabled) return;
    // Do not go back on small screens when the dropdown is shown
    if (actionsDropdown && window.matchMedia("(max-width: 767px)").matches) return;

    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/groups"); // default route
    }
  };

  return (
    <nav className={styles.navbar}>
      <div
        className={`${styles.title} order-1 md:order-0 md:flex flex-col justify-center ${
          isBackButtonEnabled ? "md:cursor-pointer md:hover:opacity-80 md:transition-opacity" : ""
        }`}
        onClick={handleTitleClick}
      >
        <div className="flex items-center gap-2 text-secondary">
          {isBackButtonEnabled && (
            <div className="hidden md:block">
              <ArrowLeftIcon className="w-4 stroke-1 stroke-white" />
            </div>
          )}

          <p className={`${actionsDropdown ? "hidden md:block" : ""}`}>
            {title || "No title provided"}
          </p>
        </div>

        {actionsDropdown && (
          <div
            className="md:hidden flex justify-center z-20 flex-1 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <Menu>
              <MenuButton
                className="flex group items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm/6 font-semibold text-secondary focus:not-data-focus:outline-none data-focus:outline data-focus:outline-secondary data-hover:bg-dark-gray data-open:bg-secondary/10"
                onClick={(e) => e.stopPropagation()}
              >
                {getActiveActionLabel()}
                <ChevronDownIcon className="size-4 transition-transform duration-150 group-data-[open]:rotate-180" />
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom"
                className="w-fit z-50 origin-top-right rounded-xl border border-purple-400/30 bg-dark-gray p-1 text-sm/6 text-secondary transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              >
                {actions &&
                  actions.map((action) => (
                    <MenuItem key={action.id}>
                      <button
                        onClick={() =>
                          onActionClick && onActionClick(action.id)
                        }
                        className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-secondary/10 cursor-pointer"
                      >
                        {action.label}
                      </button>
                    </MenuItem>
                  ))}
              </MenuItems>
            </Menu>
          </div>
        )}
      </div>

      <div className={`hidden md:flex ${styles.actionWrapper}`}>
        {actions &&
          actions.map((action) => (
            <div
              key={action.id}
              className={`${styles.action} ${activeAction === action.id ? styles.active : ""
                }`}
              onClick={() => onActionClick && onActionClick(action.id)}
            >
              <p>{action.label}</p>
            </div>
          ))}
      </div>

      <div className={`md:hidden w-30 md:w-full order-2 flex justify-end`}>
        <Menu>
          <MenuButton className="cursor-pointer group inline-flex items-center gap-2 rounded-md outline-secondary outline-1 px-3 py-1.5 text-sm/6 font-semibold text-secondary">
            <Bars3Icon className="size-4 fill-white/60 transition-transform duration-150 group-data-[open]:rotate-90" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-32 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-dark-gray p-1 text-sm/6 text-secondary transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem>
              <button
                onClick={() => navigate("/groups")}
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
              >
                <HomeIcon className="size-4" />
                Home
              </button>
            </MenuItem>

            <MenuItem>
                <button
                  onClick={() => navigate("/settings")}
                  className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
                >
                  <Cog6ToothIcon className="size-4" />
                  Settings
                </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      <div className="flex gap-4 w-30 items-center justify-self-start md:justify-end order-0 md:order-3 md:flex-row">
        <div className={styles.notification}>
          <BellIcon className="w-6" />
        </div>

        <ThemeSwitcher className="hidden md:flex"/>

        <div className={styles.profile}>
          <div className={styles.icon}>
            <ProfilePicture currentUser={currentUser} />
          </div>
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  title: PropTypes.string,
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ),
  activeAction: PropTypes.string,
  onActionClick: PropTypes.func,
  actionsDropdown: PropTypes.bool,
  isBackButtonEnabled: PropTypes.bool,
};

export default Navbar;
