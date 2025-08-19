import PropTypes from "prop-types";
import Card from "../Card/Card.jsx";
import { UserIcon, Cog6ToothIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PencilIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";

const Header = ({ title, membersCount, description, icon, isOwner, onEdit }) => {
  return (
    <Card
      dropShadow={false}
      className="mt-4 w-full md:mt-0 md:border-b-2 md:border-solid md:border-b-tertiary bg-dark-gray outline-1 outline-secondary/20"
      bgHiddenSm={true}
    >
      <div className="flex w-full justify-center md:w-full md:justify-between">
        <div className="flex w-full flex-col items-center md:items-start">
          <div className="text-center md:text-left">
            <p className="text-6xl">{icon}</p>
            <h1 className="m-0 text-4xl mt-1 font-bold text-secondary">
              {title}
            </h1>
          </div>

          <div className="hidden md:block">
            <p className="m-0 max-w-[600px] text-2xl font-light text-secondary opacity-70">
              {description}
            </p>
          </div>

          <div className="flex">
            <div className="flex items-center">
              <UserIcon className="w-5 text-secondary" />
              <div>
                <p className="m-0 text-2xl font-bold text-secondary">
                  {membersCount}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <HeaderSettingsMenu isOwner={isOwner} onEdit={onEdit} />
        </div>
      </div>
    </Card>
  );
};

const HeaderSettingsMenu = ({ isOwner, onEdit }) => {
  return (
    <Menu>
      <MenuButton className="absolute left-6/7 md:left-0 inline-flex items-center gap-2 text-sm/6 font-semibold text-secondary focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:text-purple-400/20 md:relative">
        <EllipsisHorizontalIcon className="h-[25px] w-[25px] cursor-pointer text-secondary transition-colors duration-100 ease-in-out hover:text-[]" />
      </MenuButton>

      <MenuItems
        transition
        anchor="bottom end"
        className="z-50 w-40 origin-top-right rounded-xl border border-purple-400/30 bg-dark-gray p-1 text-sm/6 text-secondary transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
      >
        <MenuItem>
          <button
            onClick={onEdit}
            className="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20"
          >
            <PencilIcon className="size-4 fill-secondary/30" />
            Edit
          </button>
        </MenuItem>
        <div className="my-1 h-px bg-secondary/10" />
        <MenuItem>
          <button className="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20">
            <ArchiveBoxXMarkIcon className="size-4 fill-secondary/30" />
            Archive
          </button>
        </MenuItem>
        {isOwner && (
          <MenuItem>
            <button className="group flex w-full cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-red-500/30">
              <TrashIcon className="size-4 fill-secondary/30" />
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
