import React, { useState, useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import Card from "../Card/Card";
import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/react";
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Button from "../Button/Button";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const deleteExpenseRequest = async (entryId) => {
  const response = await fetch(`/api/expenses/${entryId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    // Let the caller handle the error state by throwing an error
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to delete expense");
  }

  return true; // Indicate success
};

const Expense = ({
  className,
  type,
  paidBy,
  amount,
  title,
  description,
  participants,
  currency,
  onEdit,
  onView,
  expenseId,
  observer,
}) => {
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [error, setError] = useState("");

  // This value is only recalculated if the 'type' prop changes.
  const amountSign = useMemo(() => (type === "deposit" ? "+" : "-"), [type]);

  // This formatted string is only recalculated if the 'amount' prop changes.
  const formattedAmount = useMemo(
    () =>
      amount.toLocaleString("en-US", {
        style: "currency",
        currency: currency || "USD",
      }),
    [amount, currency]
  );

  const handleConfirmModal = useCallback((title, message, confirmCallback) => {
    setConfirmModalTitle(title);
    setConfirmModalMessage(message);
    setConfirmAction(() => confirmCallback);
    setIsConfirmModalOpen(true);
  }, []);

  // The delete handler is memoized to prevent re-creating the function on each render
  const handleDeleteClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      handleConfirmModal(
        "Delete Expense",
        "Are you sure you want to delete this expense? This action <b>CANNOT</b> be undone.",
        // The confirmation action is also an async function
        async () => {
          observer.notify({ type: "deletingExpense" });
          try {
            await deleteExpenseRequest(expenseId);
            observer.notify({
              type: "expenseDeleted",
              payload: { expenseId: expenseId },
            });
          } catch (err) {
            console.error("Error deleting expense:", err);
            setError(
              err.message || "An error occurred while deleting the expense"
            );
            observer.notify({
              type: "expenseDeletionError",
              payload: { error: err.message },
            });
          }
        }
      );
    },
    [handleConfirmModal, observer, expenseId]
  );

  const handleEditClick = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      onEdit();
    },
    [onEdit]
  );

  return (
    <>
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        setIsOpen={setIsConfirmModalOpen}
        title={confirmModalTitle}
        message={confirmModalMessage}
        onConfirm={confirmAction}
        onCancel={() => setIsConfirmModalOpen(false)}
        error={error}
      />

      <Card
        onClick={onView}
        className={`${className} relative md:p-10 w-full cursor-pointer transition-transform hover:scale-101`}
      >
        <div className="flex justify-between">
          {/* Text content */}
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="text-white text-xl md:text-2xl font-bold">
                {title.slice(0, 30)}
              </h2>
              <h3
                className={`${
                  type === "deposit" ? "text-[#97FFCB]" : "text-[#F88]"
                } text-xs md:text-sm font-bold md:font-semibold`}
              >
                {type.toUpperCase()}
              </h3>
            </div>

            <p className="text-white opacity-70 text-base md:text-lg hidden md:block">
              {description || "No description provided."}
            </p>

            <p className="text-white opacity-40 text-base sm:text-lg md:text-sm">
              {type === "deposit" ? "Transferred by" : "Paid by"}{" "}
              {paidBy.firstName && paidBy.lastName
                ? `${paidBy.firstName} ${paidBy.lastName}`
                : paidBy.email}
            </p>
          </div>

          {/* Amount, comments and edit button */}
          <div className="flex flex-col justify-between items-end">
            <h3
              className={`${
                type === "deposit" ? "text-[#97FFCB]" : "text-[#F88]"
              } text-xl md:text-2xl font-bold text-nowrap`}
            >
              {amountSign}
              {formattedAmount}
            </h3>

            <div className="flex gap-4 md:order-last order-first">
              {/* Transform these buttons actions into Triple Ellipses dropdown menu for mobile devices*/}
              <Menu>
                <MenuButton
                  as="div"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex md:hidden items-center gap-2 rounded-md text-sm/6 font-semibold cursor-pointer text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-purple-400/20"
                >
                  <EllipsisHorizontalIcon className="h-6 w-6 text-white" />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="w-30 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                >
                  <MenuItem>
                    <button
                      onClick={handleEditClick}
                      className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-blue-500/30"
                    >
                      <PencilIcon className="size-4 fill-white/30" />
                      Edit
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      onClick={handleDeleteClick}
                      className="group flex w-full items-center gap-2 cursor-pointer rounded-lg px-3 py-1.5 data-focus:bg-red-500/30"
                    >
                      <TrashIcon className="size-4 fill-white/30" />
                      Delete
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
              <Button
                className="hidden z-20 md:flex bg-red-500 hover:bg-red-600"
                text=""
                size="minimal"
                bgColor="radial-gradient(50%_50.01%_at_50%_51.16%,#FF1A1A_14.9%,#FF4D4D_100%)"
                hoverBgColor="radial-gradient(50%_50.01%_at_50%_51.16%,#FF1A1A_14.9%,#FF4D4D_100%)"
                shadowColor="0px_0px_6.6px_7px_rgba(255, 26, 26, 0.25)"
                borderColor="#FF8282"
                textVisibility={false}
                iconVisibility={true}
                icon={<TrashIcon className="w-6" />}
                onClick={handleDeleteClick}
                style="fill"
              />

              <Button
                className="hidden z-20 md:flex"
                text=""
                size="minimal"
                textVisibility={false}
                iconVisibility={true}
                icon={<PencilIcon className="w-6" />}
                onClick={handleEditClick}
                style="fill"
              />
            </div>
          </div>
        </div>

        {/* Member Avatars */}
        {participants && participants.length > 0 && (
          <div className="absolute -bottom-5 left-8 items-center hidden md:flex">
            <div className="flex -space-x-4">
              {participants.slice(0, 2).map((participant, index) => (
                (participant.isEnabled && (
                  <ProfilePicture
                    className={`size-10 rounded-full bg-white`}
                    profilePicture={participant.profilePicture}
                    key={index}
                  />
                ))
              ))}
              {participants.length > 2 && (
                <a
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white hover:bg-gray-600"
                  href="#"
                >
                  +{participants.length - 2}
                </a>
              )}
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

Expense.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(["deposit", "expense"]).isRequired,
  amount: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  owner: PropTypes.string.isRequired,
  description: PropTypes.string,
  commentsAmount: PropTypes.number,
  expenseId: PropTypes.string.isRequired, // Corrected from movementId
  members: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      src: PropTypes.string.isRequired,
    })
  ),
  date: PropTypes.string,
  onEdit: PropTypes.func,
  onView: PropTypes.func,
  observer: PropTypes.object, // Added for completeness
};

// Wrap the component with React.memo to prevent unnecessary re-renders
const MemoizedExpense = React.memo(Expense);
MemoizedExpense.displayName = "Expense";

export default MemoizedExpense;
