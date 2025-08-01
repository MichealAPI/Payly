import SplitField from "./SplitField";

function ParticipantEntry({
  participant,
  currencySymbol,
  splitMethod,
  onValueChange,
  expenseToEdit = null,
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
      amount={participant.splitAmount ?? 0.0}
      setAmount={(newAmount) => handleValueChange("splitAmount", newAmount)}
      participantName={participant.email}
      participantId={participant._id}
      currencySymbol={currencySymbol}
      splitMethod={splitMethod}
      expenseToEdit={expenseToEdit}
    />
  );
}

export default function SplitMenu({
  participants,
  expenseToEdit = null,
  setParticipants,
  currencySymbol = "",
  splitMethod,
}) {

  function firstCapitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <>
      <p className="mb-2 text-sm font-medium text-white">
        {firstCapitalize(splitMethod)} Split
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
              expenseToEdit={expenseToEdit}
              participant={participant}
              splitMethod={splitMethod}
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
