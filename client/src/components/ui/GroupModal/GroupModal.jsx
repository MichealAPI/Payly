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
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";

export default function GroupModal({
  isOpen,
  setIsOpen,
  onComplete,
  setSpinnerVisible,
  defGroupName = "",
  defDescription = "",
  defIcon = "👥",
  isEditMode = false,
  groupId = null,
}) {
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

    setIsLoading(true);

    const url = isEditMode ? `/api/groups/${groupId}` : "/api/groups/";
    const method = isEditMode ? "PUT" : "POST";

    try {
      if (setSpinnerVisible) setSpinnerVisible(true);
      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName, description, icon }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${isEditMode ? 'update' : 'create'} group`);
      }

      toast.success(`Group '${groupName}' ${isEditMode ? 'updated' : 'created'} successfully!`, {
        position: "bottom-center",
      });

      if (onComplete) {
        setIsLoading(false);
        onComplete(data.group);
      }

      // Reset form fields and close the modal on success only if not in edit mode
      if (!isEditMode) {
        setIcon("👥");
        setGroupName("");
        setDescription("");
      }
      closeModal();
    } catch (err) {
      console.error("Group submission error:", err);
      const errorMessage = err.message || `An error occurred during group ${isEditMode ? 'update' : 'creation'}`;
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      if (setSpinnerVisible) setSpinnerVisible(false);
    }
  };

  function togglePicker() {
    setEmojiPickerVisible(!emojiPickerVisible);
  }

  const modalTitle = isEditMode ? "Edit Group" : "Create a New Group";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Group";
  const submitButtonIcon = isEditMode ? <PencilSquareIcon className="w-6" /> : <PlusIcon className="w-6" />;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
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
                  className="text-lg leading-6 text-white font-bold"
                >
                  {modalTitle}
                </DialogTitle>

                <form onSubmit={handleSubmit}>
                  <div className="mt-4">
                    <label
                      htmlFor="icon"
                      className="block text-sm font-medium text-white"
                    >
                      Group Icon
                    </label>
                    <div className="flex items-center justify-center gap-3 mt-1">
                      <p className="text-3xl">{icon || ""}</p>
                      <Button
                        iconVisibility={true}
                        icon={
                          <ChevronDownIcon
                            className={`w-6 transition-transform duration-300 ${
                              emojiPickerVisible ? "rotate-180" : ""
                            }`}
                          />
                        }
                        onClick={togglePicker}
                        size="minimal"
                      />
                    </div>
                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        emojiPickerVisible
                          ? "max-h-[450px] opacity-100 mt-2"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <EmojiPicker
                        width="100%"
                        onEmojiClick={(emojiData) => {
                          setIcon(emojiData.emoji);
                          togglePicker();
                        }}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-medium text-white"
                    >
                      Group Name
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      value={groupName}
                      onChange={(e) => setGroupName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-white text-white sm:text-sm p-2"
                      placeholder="Enter group name"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-white"
                    >
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-white text-white p-2 sm:text-sm"
                      placeholder="Enter group description"
                      required
                    />
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
