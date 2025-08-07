import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";
import PropTypes from "prop-types";
import {
  BellIcon,
  Bars3Icon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { HomeIcon, HomeModernIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../ProfilePicture/ProfilePicture";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const Navbar = ({
  title,
  actions,
  activeAction,
  onActionClick,
  actionsDropdown,
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

  return (
    <nav className={styles.navbar}>
      <div
        className={`${styles.title} order-1 md:order-0 flex flex-col justify-center`}
      >
        <p className={`${actionsDropdown ? "hidden md:block" : ""}`}>
          {title || "No title provided"}
        </p>

        {actionsDropdown && (
          <div className="md:hidden flex justify-center z-20 flex-1 w-full">
            <Menu>
              <MenuButton className="flex group items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
                {getActiveActionLabel()}
                <ChevronDownIcon className="size-4 transition-transform duration-150 group-data-[open]:rotate-180" />
              </MenuButton>

              <MenuItems
                transition
                anchor="bottom"
                className="w-fit z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
              >
                {actions &&
                  actions.map((action) => (
                    <MenuItem key={action.id}>
                      <button
                        onClick={() =>
                          onActionClick && onActionClick(action.id)
                        }
                        className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
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
              className={`${styles.action} ${
                activeAction === action.id ? styles.active : ""
              }`}
              onClick={() => onActionClick && onActionClick(action.id)}
            >
              <p>{action.label}</p>
            </div>
          ))}
      </div>

      <div className={`md:hidden w-30 md:w-full order-2 flex justify-end`}>
        <Menu>
          <MenuButton className="cursor-pointer group inline-flex items-center gap-2 rounded-md outline-white outline-1 px-3 py-1.5 text-sm/6 font-semibold text-white">
            <Bars3Icon className="size-4 fill-white/60 transition-transform duration-150 group-data-[open]:rotate-90" />
          </MenuButton>

          <MenuItems
            transition
            anchor="bottom end"
            className="w-32 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
          >
            <MenuItem>
              <button
                onClick={() => {
                  navigate("/groups");
                }}
                className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
              >
                <HomeIcon className="size-4" />
                Home
              </button>
            </MenuItem>
          </MenuItems>
        </Menu>
      </div>

      <div className="flex gap-4 w-30 items-center justify-self-start md:justify-end order-0 md:order-3 md:flex-row">
        <div className={styles.notification}>
          <BellIcon className="w-6" />
        </div>

        <div className={styles.profile} onClick={() => navigate("/settings")}>
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
};

export default Navbar;
