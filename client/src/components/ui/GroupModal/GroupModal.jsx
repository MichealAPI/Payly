import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Button from "../Button/Button";
import { PlusIcon, ChevronDownIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { CustomEmojiPicker } from "../CustomEmojiPicker/CustomEmojiPicker";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createGroup, updateGroup } from "../../../features/groups/groupsSlice";

export default function GroupModal({
  isOpen,
  setIsOpen,
  defGroupName = "",
  defDescription = "",
  defIcon = "👥",
  isEditMode = false,
  groupId = null,
}) {

  const dispatch = useDispatch();

  const [groupName, setGroupName] = useState(defGroupName);
  const [description, setDescription] = useState(defDescription);
  const [icon, setIcon] = useState(defIcon);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Update state if default props change (for editing)
  useEffect(() => {
    setGroupName(defGroupName);
    setDescription(defDescription);
    setIcon(defIcon);
  }, [defGroupName, defDescription, defIcon, isOpen]);


  function closeModal() {
    setIsOpen(false);
    setEmojiPickerVisible(false); // Close emoji picker on modal close
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start the local button spinner

    const groupData = { name: groupName, description, icon };
    const actionToDispatch = isEditMode
      ? updateGroup({ groupId, groupData })
      : createGroup(groupData);

    try {
      // Dispatch the appropriate action and wait for it to complete
      await dispatch(actionToDispatch).unwrap();

      // If .unwrap() doesn't throw, the action was successful
      toast.success(
        `Group '${groupName}' ${isEditMode ? "updated" : "created"} successfully!`,
        { position: "bottom-center" }
      );

      // Reset form only when creating a new group
      if (!isEditMode) {
        setGroupName("");
        setDescription("");
        setIcon("👥");
      }
      closeModal();
    } catch (err) {
      // The action was rejected, 'err' is the payload from rejectWithValue
      toast.error(err.message || "An error occurred.", {
        position: "bottom-center",
      });
    } finally {
      setIsLoading(false); // Stop the local button spinner
    }
  };

  function togglePicker() {
    setEmojiPickerVisible(!emojiPickerVisible);
  }

  const modalTitle = isEditMode ? "Edit Group" : "Create a New Group";
  const submitButtonText = isLoading
    ? (isEditMode ? "Saving..." : "Creating...")
    : (isEditMode ? "Save Changes" : "Create");
  const submitButtonIcon = isEditMode ? <PencilSquareIcon className="w-6" /> : <PlusIcon className="w-6" />;
  
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-30" onClose={closeModal}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)] p-6 text-left align-middle transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg leading-6 text-secondary font-bold"
                >
                  {modalTitle}
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                  <div className="mt-4 flex items-start gap-4">
                    {/* Icon Picker */}
                    <div className="flex flex-col items-center">
                      <label
                        htmlFor="icon-button"
                        className="block text-sm font-medium text-secondary mb-2"
                      >
                        Icon
                      </label>
                      <button
                        id="icon-button"
                        type="button"
                        onClick={togglePicker}
                        className="text-4xl p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                      >
                        {icon}
                      </button>
                    </div>

                    {/* Name and Description */}
                    <div className={`flex-grow`}>
                      <div>
                        <label
                          htmlFor="groupName"
                          className="block text-sm font-medium text-secondary"
                        >
                          Group Name
                        </label>
                        <input
                          type="text"
                          id="groupName"
                          value={groupName}
                          onChange={(e) => setGroupName(e.target.value)}
                          className="mt-1 block w-full rounded-md border-white/50 border-1 bg-transparent focus:border-white focus:ring-white text-secondary sm:text-sm p-2"
                          placeholder="Enter group name"
                          required
                        />
                      </div>
                      <div className="mt-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-secondary"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={3}
                          className="mt-1 block w-full rounded-md border-1 border-white/50 bg-transparent focus:border-white focus:ring-white text-secondary p-2 sm:text-sm"
                          placeholder="Enter group description"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Emoji Picker */}
                  <div
                    className={`transition-all duration-300 ease-in-out overflow-hidden ${
                      emojiPickerVisible
                        ? "max-h-[450px] opacity-100 mt-4"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="flex w-full justify-center">
                      <CustomEmojiPicker
                      onSelect={(emoji) => {
                        setIcon(emoji);
                        togglePicker();
                      }}
                    />
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between space-x-4">
                    <Button
                      text="Cancel"
                      style="outline"
                      onClick={closeModal}
                      disabled={isLoading}
                    />

                    <Button
                      text={submitButtonText}
                      iconVisibility={true}
                      icon={submitButtonIcon}
                      type="submit"
                      disabled={isLoading}
                    />
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
