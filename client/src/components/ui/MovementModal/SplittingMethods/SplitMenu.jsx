import SplitField from "./SplitField";

function ParticipantEntry({
  participant,
  currencySymbol,
  isFixed = true,
  onValueChange,
}) {
  // The participant object from props is the source of truth.
  // Call onValueChange to update the parent's state.

  const handleValueChange = (key, value) => {
    onValueChange({ ...participant, user: participant._id, [key]: value });
  };

  return (
    <SplitField
      isEnabled={participant.isEnabled ?? true}
      setIsEnabled={(newIsEnabled) => handleValueChange("isEnabled", newIsEnabled)}
      amount={participant.amount ?? 0.0}
      setAmount={(newAmount) => handleValueChange("splitAmount", newAmount)}
      participantName={participant.email}
      currencySymbol={currencySymbol}
      isFixed={isFixed}
    />
  );
}

export default function SplitMenu({
  participants,
  setParticipants,
  currencySymbol = "",
  isFixed = true,
}) {
  return (
    <>
      <p className="mb-2 text-sm font-medium text-white">
        {isFixed ? "Fixed Split" : "Percentage Split"}
      </p>

      {participants.length === 0 && (
        <p className="text-sm text-white opacity-70">
          No participants added yet. Please add participants to split the amount.
        </p>
      )}

      <div className="flex flex-col gap-1 border-0 rounded-lg">
        <div className="flex flex-col gap-2">
          {participants.map((participant) => (
            <ParticipantEntry
              key={participant._id}
              currencySymbol={currencySymbol}
              participant={participant}
              isFixed={isFixed}
              onValueChange={(updatedParticipant) => {
                setParticipants((prev) =>
                  prev.map((p) =>
                    p._id === updatedParticipant._id ? updatedParticipant : p
                  )
                );
              }}
            />
          ))}
        </div>
      </div>
    </>
  );
}
