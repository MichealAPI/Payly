import PropTypes from "prop-types";
import Card from "../Card/Card";
import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "../Button/Button.jsx";
import ConfirmModal from "../ConfirmModal/ConfirmModal.jsx";
import { toast } from "react-hot-toast";
import { useState } from "react";

const getBalanceDetails = (netBalance) => {
  if (netBalance === 0) {
    return {
      message: "You're even",
      className: "hidden",
    };
  }
  return netBalance < 0
    ? {
        message: "Owes you",
        className: "text-green-300",
      }
    : {
        message: "You owe",
        className: "text-red-300",
      };
};

const Participant = ({
  participantName,
  participantId,
  ownerId,
  currentUserId,
  groupId,
  currencyBalances,
  onDelete,
  className,
  image
}) => {
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmModalMessage, setConfirmModalMessage] = useState("");
  const [confirmModalTitle, setConfirmModalTitle] = useState("");
  const [confirmAction, setConfirmAction] = useState(null);

  // Get the first currency and balance from currencyBalances, or use 0 if it's null/empty.
  const currency = currencyBalances ? Object.keys(currencyBalances)[0] : null;
  const balance = currency ? currencyBalances[currency] : 0;

  const { message: netBalanceMessage, className: netBalanceClass } =
    getBalanceDetails(balance);

  const handleDelete = async () => {

    const response = await fetch(`/api/groups/${groupId}/${participantId}/kick`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.ok) {
        const data = await response.json();
        {onDelete}
        toast.success(data.message, { position: "bottom-center" });
        // todo Optionally, call a callback to refresh the participant list
    } else {
        const errorData = await response.json();
        toast.error(errorData.message, { position: "bottom-center" });
    }

  };

  return (
    <>
        <Card className={className}>
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 w-full justify-between">
            <div className="flex gap-4 items-center">
                {image}

                <div className="flex flex-col">
                <h3 className="text-xl font-bold text-white">
                    {participantName}
                </h3>
                <p className="text-white text-lg">
                    {netBalanceMessage}{" "}
                    <span className={`font-bold ${netBalanceClass}`}>
                       {currency ? `${currency} ` : ''}
                       {Math.abs(balance).toFixed(2)}
                    </span>
                </p>
                </div>
            </div>

            {currentUserId === ownerId && (
                <Button
                size="minimal"
                iconVisibility={true}
                icon={<TrashIcon className="w-6" />}
                onClick={() => {
                    setIsConfirmModalOpen(true)
                    setConfirmAction(() => handleDelete)
                    setConfirmModalMessage(`Are you sure you want to remove ${participantName}?`)
                    setConfirmModalTitle("Remove Participant")
                }}
                style="fill"
                />
            )}
            </div>
        </div>
        </Card>

        <ConfirmModal
            title={confirmModalTitle}
            message={confirmModalMessage}
            onConfirm={confirmAction}
            setIsOpen={setIsConfirmModalOpen}
            isOpen={isConfirmModalOpen}
        />

    </>
  );
};

Participant.propTypes = {
  participantName: PropTypes.string.isRequired,
  participantId: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  onDelete: PropTypes.func.isRequired,
  currencyBalances: PropTypes.object,
  className: PropTypes.string,
};

Participant.defaultProps = {
  currencyBalances: {},
  className: "",
};

export default Participant;
