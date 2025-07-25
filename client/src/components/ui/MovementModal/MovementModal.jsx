import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Select,
} from "@headlessui/react";
import { Fragment, useState, useEffect } from "react";
import Button from "../Button/Button";
import {
  PlusIcon,
  ChevronDownIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";
import CurrencySelector from "../CurrencySelector/CurrencySelector";
import SplitMethodSelector from "../SplitMethodSelector/SplitMethodSelector";

export default function GroupModal({
  isOpen,
  setIsOpen,
  onComplete,
  defTitle = "",
  defDescription = "",
  defType = "expense",
  defParticipants = [],
  defSplitMethod = "equal",
  setSpinnerVisible,
  isEditMode = false,
  groupId = null,
}) {
  const [title, setTitle] = useState(defTitle);
  const [description, setDescription] = useState(defDescription);
  const [currency, setCurrency] = useState("");
  const [type, setType] = useState(defType);
  const [participants, setParticipants] = useState(defParticipants);
  const [splitMethod, setSplitMethod] = useState(defSplitMethod);
  const [isLoading, setIsLoading] = useState(false);

  function closeModal() {
    setIsOpen(false);
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
        throw new Error(
          data.message || `Failed to ${isEditMode ? "update" : "create"} group`
        );
      }

      toast.success(
        `Group '${groupName}' ${
          isEditMode ? "updated" : "created"
        } successfully!`,
        {
          position: "bottom-center",
        }
      );

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
      const errorMessage =
        err.message ||
        `An error occurred during group ${isEditMode ? "update" : "creation"}`;
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      if (setSpinnerVisible) setSpinnerVisible(false);
    }
  };

  const modalTitle = isEditMode ? "Edit a Movement" : "Create a New Movement";
  const submitButtonText = isEditMode ? "Save Changes" : "Create Movement";
  const submitButtonIcon = isEditMode ? (
    <PencilSquareIcon className="w-6" />
  ) : (
    <PlusIcon className="w-6" />
  );

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
                  <div className="flex justify-between items-center mt-4 gap-10">
                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-white m-0">
                        Currency
                      </p>
                      <CurrencySelector
                        setCurrency={setCurrency}
                        currency={currency}
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <p className="text-sm font-medium text-white m-0">
                        Split Method
                      </p>
                      <SplitMethodSelector
                        setSplitMethod={setSplitMethod}
                        splitMethod={splitMethod}
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="groupName"
                      className="block text-sm font-medium text-white"
                    >
                      Movement Title
                    </label>
                    <input
                      type="text"
                      id="movementName"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-white text-white sm:text-sm p-2"
                      placeholder="Enter movement title"
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
                      placeholder="Enter movement description"
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
