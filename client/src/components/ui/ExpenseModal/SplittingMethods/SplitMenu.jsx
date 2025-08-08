import { useCallback } from "react";
import SplitField from "./SplitField";

function ParticipantEntry({
  participant,
  currencySymbol,
  splitMethod,
  onValueChange,
  paidById,
}) {
  const handleValueChange = useCallback(
    (key, value) => {
      onValueChange({
  ...participant,
        [key]: value,
      });
    },
    [onValueChange, participant]
  );

  return (
    <SplitField
      isEnabled={participant.isEnabled ?? true}
      setIsEnabled={(newIsEnabled) => handleValueChange("isEnabled", newIsEnabled)}
      amount={participant.splitAmount ?? 0}
      setAmount={(newAmount) => handleValueChange("splitAmount", newAmount)}
      participantName={
        participant.firstName && participant.lastName
          ? `${participant.firstName} ${participant.lastName}`
          : participant.email
      }
      participantId={participant._id}
      paidById={paidById}
      currencySymbol={currencySymbol}
      splitMethod={splitMethod}
    />
  );
}

export default function SplitMenu({
  splitDetails,
  setSplitDetails,
  members,
  currencySymbol = "",
  splitMethod,
  paidById,
}) {
  const firstCapitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  if (!members || members.length === 0) {
    return (
      <>
        <p className="mb-2 text-sm font-medium text-white">{firstCapitalize(splitMethod)} Split</p>
        <p className="text-sm text-white opacity-70">
          No participants added yet. Please add participants to split the amount.
        </p>
      </>
    );
  }

  const normalizedParticipants = members.map((member) => {
    const existingParticipant = splitDetails.find((p) => p._id === member._id);
    if (existingParticipant) {
      return { ...member, ...existingParticipant };
    }
    return {
      ...member,
      isEnabled: true,
      splitAmount: 0,
    };
  });


  return (
    <>
      <p className="mb-2 text-sm font-medium text-white">{firstCapitalize(splitMethod)} Split</p>

      <div className="flex flex-col gap-1 border-0 rounded-lg">
        <div className="flex flex-col gap-2">
          {normalizedParticipants.map((participant) => (
            <ParticipantEntry
              key={participant._id}
              paidById={paidById}
              currencySymbol={currencySymbol}
              participant={participant}
              splitMethod={splitMethod}
              onValueChange={(updatedParticipant) => {
                setSplitDetails((prevDetails) => {
                  const idx = prevDetails.findIndex((p) => p._id === updatedParticipant._id);
                  const minimal = {
                    _id: updatedParticipant._id,
                    isEnabled: updatedParticipant.isEnabled ?? true,
                    splitAmount: updatedParticipant.splitAmount ?? 0,
                  };
                  if (idx >= 0) {
                    const next = [...prevDetails];
                    next[idx] = { ...next[idx], ...minimal };
                    return next;
                  }
                  return [...prevDetails, minimal];
                });
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
