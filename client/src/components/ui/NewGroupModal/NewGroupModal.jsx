import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../Button/Button";
import { PlusIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";

export default function NewGroupModal({ isOpen, setIsOpen, onGroupCreated }) {
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("👥"); // Default icon, can be changed later
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const [error, setError] = useState("");

  function closeModal() {
    setIsOpen(false);
  }

  const handleGroupCreation = async (e) => {
    e.preventDefault();
    // Here you would typically handle the form submission,
    // like sending the data to an API.

    try {
      const response = await fetch("/api/groups/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: groupName, description, icon }),
      });

      console.log(JSON.stringify(response.body));

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create group");
      }

      toast.success(`Group '${groupName}' created successfully!`);

      if (onGroupCreated) {
        onGroupCreated();
      }

      // Reset form fields and close the modal on success
      setIcon("👥");
      setGroupName("");
      setDescription("");
      closeModal();
    } catch (err) {
      console.error("Group creation error:", err);
      setError(err.message || "An error occurred during group creation");
      toast.error(error, {
        position: "bottom-center",
      });
    }
  };

  function togglePicker() {
    setEmojiPickerVisible(!emojiPickerVisible);
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
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
                  Create a New Group
                </DialogTitle>

                <form onSubmit={handleGroupCreation}>
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
                  <div className="mt-6 flex justify-end space-x-4">
                    <Button
                      text="Cancel"
                      style="outline"
                      onClick={closeModal}
                    />

                    <Button
                      text="Create Group"
                      iconVisibility={true}
                      icon={<PlusIcon className="w-6" />}
                      type="submit"
                    />
                  </div>
                </form>
              </DialogPanel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
