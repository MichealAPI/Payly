import React from "react";
import PropTypes from "prop-types";
import styles from "./Group.module.css";
import Button from "../Button/Button.jsx";
import { useNavigate } from "react-router-dom";
import { ArrowRightIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import Card from "../Card/Card.jsx";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import {
  PencilIcon,
  ArchiveBoxXMarkIcon,
  TrashIcon,
  Square2StackIcon,
} from "@heroicons/react/24/solid";
import { handleArchive, handleDelete } from "../../../utils/groupUtils.js";
import { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";

// members is an array of objects with a name property
function formatMembers(members) {
  console.log("members", members);

  if (!members || members.length === 0) {
    console.log("No members found");
    return "No members";
  }

  if (members.length === 1) {
    // Retrieve the name of the first member

    return members[0];
  }

  if (members.length === 2) {
    return `${members[0]} and ${members[1]}`;
  }

  if (members.length > 2) {
    return `${members[0]}, ${members[1]} and ${members.length - 2} others`;
  }
}

export const Group = ({className, title, members, entryId, description, icon, onActionComplete, observer}) => {
  const navigate = useNavigate();

  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState("");

  const handleConfirmModal = (title, message, confirmCallback) => {
    setConfirmModalTitle(title);
    setConfirmModalMessage(message);
    setConfirmAction(() => confirmCallback);
    setIsConfirmModalOpen(true);
  }

  const handleNavigate = () => {
    navigate(`/group/${entryId}`);
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

      <Card className={className}>
        <div className={styles.group}>
          <div className={styles.infoWrapper}>
            <div className="flex md:flex-col">
              <div className={styles.icon}>
                <p>{icon}</p>
              </div>

              <div className="flex flex-col justify-center">
                <div className={styles.title}>
                  <h3>{title}</h3>
                </div>

                <div className={styles.members}>
                  <p>{formattedMembers}</p>
                </div>
              </div>
            </div>

            <div className={styles.description}>
              <p>{description}</p>
            </div>
          </div>
          <div className={styles.actionWrapper}>
            <div className={styles.options} onClick={handleSettingsClick}>
              <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold cursor-pointer text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-purple-400/20">
                  <Cog6ToothIcon className="size-4" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-30 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20">
                      <PencilIcon className="size-4 fill-white/30" />
                      Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg cursor-pointer px-3 py-1.5 data-focus:bg-purple-400/20">
                      <Square2StackIcon className="size-4 fill-white/30" />
                      Duplicate
                    </button>
                  </MenuItem>
                  <div className="my-1 h-px bg-white/5" />
                  <MenuItem>
                    <button
                      onClick={() => {
                        handleConfirmModal(
                          "Archive Group",
                          "Are you sure you want to archive this group? You can restore it later.",
                          () => {
                            handleArchive(error, setError, entryId);
                            observer.notify(
                              "groupArchived"
                            );
                          }
                        );
                      }}
                      className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20"
                    >
                      <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                      Archive
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={() => {
                        handleConfirmModal(
                          "Delete Group",
                          "Are you sure you want to delete this group? This action <b>CANNOT</b> be undone.",
                          () => handleDelete(entryId, onActionComplete)
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
      </Card>
    </>
  );
};

Group.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
    })
  ).isRequired,
  entryId: PropTypes.string.isRequired,
  onActionComplete: PropTypes.func,
};

export default Group;
