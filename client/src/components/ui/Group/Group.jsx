import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Card from "../Card/Card.jsx";
import Label from "../Label/Label.jsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PencilIcon,
  ArchiveBoxXMarkIcon,
  ArchiveBoxIcon,
  TrashIcon,
} from "@heroicons/react/24/solid";
import { deleteGroup, toggleArchiveGroup } from "../../../features/groups/groupsSlice.js";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";
import GroupModal from "../GroupModal/GroupModal.jsx";
import { useDispatch } from "react-redux";

// members is an array of objects with a name property
function formatMembers(members) {

  if (!members || members.length === 0) {
    return "No members";
  }

  if (members.length === 1) {
    // Retrieve the name of the first member

    return members[0].firstName || members[0].email;
  }

  if (members.length === 2) {
    return `${members[0].firstName || members[0].email} and ${members[1].firstName || members[1].email}`;
  }

  if (members.length > 2) {
    return `${members[0].firstName || members[0].email}, ${members[1].firstName || members[1].email} and ${
      members.length - 2
    } others`;
  }
}

export const Group = ({
  className,
  groupData,
  isArchived,
}) => {

  const {
    _id: groupId,
    name: title,
    description,
    icon,
    members,
  } = groupData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [error, setError] = useState("");

  const Labels = () => {
    return <>{isArchived && <Label text="ARCHIVED" bgColor="bg-red-500" />}</>;
  };

  const handleConfirmModal = (title, message, confirmCallback) => {
    setConfirmModalTitle(title);
    setConfirmModalMessage(message);
    setConfirmAction(() => confirmCallback);
    setIsConfirmModalOpen(true);
  };

  const handleNavigate = () => {
    navigate(`/overview/${groupId}`);
  };

  // Stop propagation to prevent parent onClick if it existed
  const handleSettingsClick = (e) => {
    e.stopPropagation();
  };

  const formattedMembers = formatMembers(members);

  return (
    <>
      <ConfirmModal
        title={confirmModalTitle}
        message={confirmModalMessage}
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        onConfirm={confirmAction}
      />

      <GroupModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        isEditMode={true}
        groupId={groupId}
        defGroupName={title}
        defDescription={description}
        defIcon={icon}
      />

      <Card className={`${className} w-full md:h-55 cursor-pointer`} onClick={handleNavigate}>
        <div className="flex w-full items-center h-full gap-4 md:items-start ">
          <div className="flex flex-row items-center gap-4 flex-1 min-w-0 h-full md:flex-col md:items-start md:gap-9">
            <div className="flex md:flex-col items-center md:items-stretch">
              <div className="m-0 text-5xl select-none pointer-events-none">
                <p>{icon}</p>
              </div>

              <div className="mt-2 flex flex-col justify-center">
                <div className="m-0 select-none md:select-auto overflow-hidden text-ellipsis whitespace-nowrap text-2xl font-bold text-white">
                  <h3>{title}</h3>
                </div>

                <div className="text-sm font-normal text-white">
                  <p>{formattedMembers}</p>
                </div>

                {/* Labels */}
                <div className="items-end mt-2 mr-2 gap-2 flex md:hidden">
                  {Labels()}
                </div>
              </div>
            </div>

            <div className="hidden w-full text-lg font-normal text-white md:block">
              <p className="m-0 overflow-hidden text-ellipsis whitespace-nowrap">
                {description}
              </p>
            </div>
          </div>
          <div className="flex h-full flex-shrink-0 md:items-stretch items-center">
            {/* Labels */}
            <div className="items-end mr-2 mb-2 gap-2 hidden md:flex">
              {Labels()}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col justify-center md:justify-between">
              <div
                className="hidden items-center justify-center md:flex"
                onClick={handleSettingsClick}
              >
                <Menu>
                  <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold cursor-pointer text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-purple-400/20">
                    <Cog6ToothIcon className="h-6 w-6 text-white" />
                  </MenuButton>

                  <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-30 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                  >
                    <MenuItem>
                      <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20"
                      >
                        <PencilIcon className="size-4 fill-white/30" />
                        Edit
                      </button>
                    </MenuItem>
                    <div className="my-1 h-px bg-white/5" />
                    <MenuItem>
                      <button
                        onClick={() => {
                          handleConfirmModal(
                            isArchived ? "Unarchive Group" : "Archive Group",
                            `Are you sure you want to ${isArchived ? "unarchive" : "archive"} this group? You can ${isArchived ? "archive it again later" : "restore it later"}.`,
                            async () => {
                              await dispatch(toggleArchiveGroup(groupData)).unwrap();
                            }
                          );
                        }}
                        className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20"
                      >
                        {isArchived ? (
                          <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                        ) : (
                          <ArchiveBoxIcon className="size-4 fill-white/30" />
                        )}
                        {isArchived ? "Unarchive" : "Archive"}
                      </button>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={() => {
                          handleConfirmModal(
                            "Delete Group",
                            "Are you sure you want to delete this group? This action <b>CANNOT</b> be undone.",
                            async () => {
                              await dispatch(deleteGroup(groupData)).unwrap();
                            }
                          );
                        }}
                        className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-red-500/30"
                      >
                        <TrashIcon className="size-4 fill-white/30" />
                        Delete
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
              <Button
                size="minimal"
                iconVisibility={true}
                icon={<ArrowRightIcon className="w-6" />}
                onClick={handleNavigate}
                style="fill"
              />
            </div>
          </div>
        </div>
      </Card>
    </>
  );
};

export default Group;