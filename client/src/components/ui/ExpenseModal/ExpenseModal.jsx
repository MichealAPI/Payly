import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Input,
} from "@headlessui/react";
import { Fragment, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button/Button";
import { PlusIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import EmojiPicker from "emoji-picker-react";
import CurrencySelector from "../CurrencySelector/CurrencySelector";
import SplitMethodSelector from "./SplittingMethods/SplitMethodSelector";
import SplitMenu from "./SplittingMethods/SplitMenu";
import { clsx } from "clsx";
import SelectorButton from "../SelectorButton/SelectorButton";
import DatePicker from "../DatePicker/DatePicker";
import PaidBySelector from "./PaidBySelector";
import { useExpenseForm } from "./expenseModalUtil";

export default function ExpenseModal({
  isOpen,
  setIsOpen,
  onComplete,
  expenseToEdit,
  members,
  setSpinnerVisible,
  groupId,
  currentUser,
}) {
  const closeModal = useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);

  const {
    isEditMode,
    title,
    setTitle,
    description,
    setDescription,
    currency,
    setCurrency,
    type,
    setType,
    participants,
    setParticipants,
    splitMethod,
    setSplitMethod,
    isLoading,
    amount,
    setAmount,
    date,
    setDate,
    paidBy,
    setPaidBy,
    handleSubmit,
  } = useExpenseForm({
    expenseToEdit,
    members: members,
    groupId,
    onComplete,
    setSpinnerVisible,
    closeModal,
    currentUser,
  });

  const { modalTitle, submitButtonText, submitButtonIcon } = useMemo(() => {
    const title = isEditMode ? "Edit Expense" : "Add Expense";
    const buttonText = isEditMode ? "Save Changes" : "Add";
    const icon = isEditMode ? (
      <PencilSquareIcon className="w-6" />
    ) : (
      <PlusIcon className="w-6" />
    );
    return {
      modalTitle: title,
      submitButtonText: buttonText,
      submitButtonIcon: icon,
    };
  }, [isEditMode]);

  console.log(participants)

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog
          static
          as="div"
          className="relative z-999"
          onClose={closeModal}
          open={isOpen}
        >
          {/* The backdrop, rendered as a fixed sibling to the panel container */}
          <motion.div
            className="fixed inset-0 bg-black/80"
            initial
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />

          <div className="fixed inset-0 overflow-y-scroll">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                <DialogPanel className="w-full md:min-w-md max-w-md transform overflow-hidden rounded-2xl bg-black shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)] p-6 text-left align-middle transition-all">
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
                              onChange={(e) =>
                                setAmount(parseFloat(e.target.value))
                              }
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

                    <div className="mt-4 flex">
                      <div className="flex flex-col flex-1/2 justify-center ">
                        <label
                          htmlFor="paidby"
                          className="block text-sm font-medium text-white"
                        >
                          Paid by
                        </label>
                        <PaidBySelector
                          participants={members}
                          paidBy={paidBy}
                          setPaidBy={setPaidBy}
                        />
                      </div>
                    </div>

                    <div className="mt-4 w-full">
                      <div className="flex w-full flex-col flex-1/2">
                        <label
                          htmlFor="date"
                          className="block text-sm font-medium text-white"
                        >
                          Paid on
                        </label>
                        <DatePicker date={date} setDate={setDate} />
                      </div>
                    </div>

                    <div className="mt-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-white"
                      >
                        Description{" "}
                        <span className="text-white/60">(optional)</span>
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
                      <SplitMenu
                        currencySymbol={currency?.symbol || ""}
                        splitMethod={splitMethod}
                        participants={participants}
                        setParticipants={setParticipants}
                        expenseToEdit={isEditMode ? expenseToEdit : null}
                        paidById={paidBy?._id || null}
                      />
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
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
