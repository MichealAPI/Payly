import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
  Field,
  Label,
  Description,
  Input,
} from "@headlessui/react";
import { Fragment, useState } from "react";
import Button from "../Button/Button";
import {
  PlusIcon,
  ChevronDownIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-hot-toast";
import CurrencySelector from "../CurrencySelector/CurrencySelector";
import SplitMethodSelector from "./SplittingMethods/SplitMethodSelector";
import SplitMenu from "./SplittingMethods/SplitMenu";
import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { clsx } from "clsx";
import SelectorButton from "../SelectorButton/SelectorButton";

export default function MovementModal({
  isOpen,
  setIsOpen,
  onComplete,
  movementToEdit,
  defParticipants = [],
  setSpinnerVisible,
  groupId,
}) {
  const isEditMode = !!movementToEdit;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState(null);
  const [type, setType] = useState("expense");
  const [participants, setParticipants] = useState([]);
  const [splitMethod, setSplitMethod] = useState("equal");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);

  useEffect(() => {
    if (isEditMode && movementToEdit) {
      setTitle(movementToEdit.title);
      setDescription(movementToEdit.description || "");
      setType(movementToEdit.type);
      setAmount(movementToEdit.amount);
      setSplitMethod(movementToEdit.splitMethod);
      // Note: CurrencySelector needs to be adapted to handle currency string
      // For now, we assume it can handle it or we set it manually.
      // setCurrency({ name: movementToEdit.currency, ... });
      setParticipants(movementToEdit.participants.map(p => ({...p.user, splitAmount: p.splitAmount, isEnabled: p.isEnabled})));
    } else {
      setTitle("");
      setDescription("");
      setType("expense");
      setAmount(0);
      setSplitMethod("equal");
      setCurrency(null);
      setParticipants(defParticipants);
    }
  }, [isOpen, movementToEdit, defParticipants, isEditMode]);


  useEffect(() => {
    if (!isEditMode) {
        setParticipants(defParticipants);
    }
  }, [defParticipants, splitMethod, isEditMode]);

  console.log("Default participants in MovementModal:", defParticipants);
  console.log("Participants in MovementModal:", participants);

  function closeModal() {
    setIsOpen(false);
  }

  const checkFields = () => {
    if (!title || !currency || !participants.length) {
      toast.error("Please fill in all fields", {
        position: "bottom-center",
      });
      return false;
    }

    if (amount === 0) {
      toast.error("Amount must be greater than 0", {
        position: "bottom-center",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!checkFields()) return;

    setIsLoading(true);

    const url = isEditMode ? `/api/expenses/${groupId}/${movementToEdit._id}` : `/api/expenses/${groupId}`;
    const method = isEditMode ? "PUT" : "POST";

        try {
      if (setSpinnerVisible) setSpinnerVisible(true);

      const payload = {
        title: title,
        description: description,
        type: type,
        participants: participants.map(p => ({
          user: p._id,
          splitAmount: p.splitAmount || 0,
          isEnabled: p.isEnabled ?? true,
        })),
        splitMethod: splitMethod,
        currency: currency.name,
        amount: amount !== null ? amount : 0,
      };

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            `Failed to ${isEditMode ? "update" : "create"} expense`
        );
      }

      toast.success(
        `Expense '${title}' ${
          isEditMode ? "updated" : "created"
        } successfully!`,
        {
          position: "bottom-center",
        }
      );

      if (onComplete) {
        setIsLoading(false);
        onComplete(data.movement);
      }

      // Reset form fields and close the modal on success only if not in edit mode
      if (!isEditMode) {
        setTitle("");
        setAmount(0);
        setCurrency(null);
        setType("expense");
        setParticipants([]);
        setSplitMethod("equal");
        setDescription("");
      }

      closeModal();
    } catch (err) {
      console.error("Expense submission error:", err);
      const errorMessage =
        err.message ||
        `An error occurred during expense ${isEditMode ? "update" : "creation"}`;
      toast.error(errorMessage, {
        position: "bottom-center",
      });
    } finally {
      if (setSpinnerVisible) setSpinnerVisible(false);
    }
  };

  const modalTitle = isEditMode ? "Edit Expense" : "Add Expense";
  const submitButtonText = isEditMode ? "Save Changes" : "Add";
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
                  <div className="mt-4">
                    <SelectorButton
                      value={type}
                      setValue={setType}
                      options={[
                        { id: 1, label: "Expense", value: "expense" },
                        { id: 2, label: "Deposit", value: "deposit" },
                      ]}
                    />
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
                    <div className="flex gap-2">
                      <Field className="flex-1">
                        <Label className="text-sm font-medium text-white">
                          Amount
                        </Label>
                        <div className="relative">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-white sm:text-sm">
                              {currency?.symbol}
                            </span>
                          </div>
                          <Input
                            type="number"
                            className={clsx(
                              "block w-full border-1 rounded-lg bg-black pl-8 pr-3 py-1.5 text-sm/6 text-white text-right",
                              "focus:outline-none"
                            )}
                            value={amount}
                            placeholder="0.00"
                            min="0"
                            max="1000000"
                            step="0.1"
                            required
                            onChange={(e) => setAmount(parseFloat(e.target.value))}
                          />
                        </div>
                      </Field>
                      <div className="flex flex-1 flex-col gap-1">
                        <p className="text-sm font-medium text-white m-0">
                          Currency
                        </p>
                        <CurrencySelector
                          setCurrency={setCurrency}
                          currency={currency}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-white"
                    >
                      Description <span className="text-white/60">(optional)</span>
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full rounded-md border border-white text-white p-2 sm:text-sm"
                      placeholder="Enter movement description"
                    />
                  </div>

                  <div className="mt-4 flex gap-1 flex-col">
                    <p className="text-sm font-medium text-white m-0">
                      Split Method
                    </p>
                    <SplitMethodSelector
                      setSplitMethod={setSplitMethod}
                      splitMethod={splitMethod}
                    />
                  </div>

                  <div className="mt-4 text-white">
                    <AnimatePresence>
                      {(splitMethod === "fixed" ||
                        splitMethod === "percentage") && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, maxHeight: 0 }}
                          animate={{ opacity: 1, scale: 1, maxHeight: 500 }}
                          exit={{ opacity: 0, scale: 0.95, maxHeight: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <SplitMenu
                            currencySymbol={currency?.symbol || ""}
                            isFixed={splitMethod === "fixed"}
                            isPercentage={splitMethod === "percentage"}
                            participants={participants}
                            setParticipants={setParticipants}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Action buttons */}

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
