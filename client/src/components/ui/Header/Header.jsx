import PropTypes from "prop-types";
import Card from "../Card/Card.jsx";
import styles from "./Header.module.css";
import { UserIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PencilIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
  Square2StackIcon,
} from "@heroicons/react/24/solid";

const Header = ({ title, membersCount, description, icon, isOwner, onEdit }) => {
  return (
    <Card
      className="mt-4 md:mt-0 md:border-b-[#6928F3] w-full md:border-solid md:border-b-2"
      bgHiddenSm={true}
    >
      <div className={`${styles.header} !w-full`}>
        <div className={`${styles.content} !w-full`}>
          <div className={`${styles.title}`}>
            <div className={`${styles.icon}`}>
              <p>{icon}</p>
            </div>
            <h1>{title}</h1>
          </div>

          <div className={styles.description}>
            <p>{description}</p>
          </div>

          <div className="flex">
            <div className={styles.members}>
              <UserIcon className={styles.icon} />
              <div className={styles.count}>
                <p>{membersCount}</p>
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.settings} hidden md:block`}>
          <HeaderSettingsMenu isOwner={isOwner} onEdit={onEdit} />
        </div>
      </div>
    </Card>
  );
};

const HeaderSettingsMenu = ({ isOwner, onEdit }) => {
  return (
    <Menu>
      <MenuButton className="items-center absolute md:relative gap-2 rp-1 text-sm/6 font-semibold inline-flex text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:text-purple-400/20 cursor-pointer">
        <Cog6ToothIcon className={styles.icon} />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="w-30 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <button
            onClick={onEdit}
            className="group flex cursor-pointer w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20"
          >
            <PencilIcon className="size-4 fill-white/30" />
            Edit
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-white/5" />
        <MenuItem>
          <button className="group flex cursor-pointer w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20">
            <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
            Archive
          </button>
        </MenuItem>
        {isOwner && (
          <MenuItem>
            <button className="group flex cursor-pointer w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-red-500/30">
              <TrashIcon className="size-4 fill-white/30" />
              Delete
            </button>
          </MenuItem>
        )}
      </MenuItems>
    </Menu>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  membersCount: PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  isOwner: PropTypes.bool,
  onEdit: PropTypes.func,
};

export default Header;
