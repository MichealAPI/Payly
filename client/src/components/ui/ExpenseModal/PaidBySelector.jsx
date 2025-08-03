import { Select } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { clsx } from "clsx";

export default function PaidBySelector({
  participants,
  paidBy,
  setPaidBy,
}) {
  const handleSelection = (e) => {
    const selectedParticipant = participants.find(
      (p) => p._id === e.target.value
    );

    console.log("Selected participant:", selectedParticipant);
    setPaidBy(selectedParticipant || null);
  };

  return (
    <div className="relative mt-1">
      <Select
        required
        value={paidBy?._id}
        onChange={handleSelection}
        className={clsx(
          "block w-full appearance-none rounded-lg border-1 bg-black py-1.5 pr-8 pl-3 text-sm/6 text-white",
          "focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25",
          "*:text-white"
        )}
      >
        <option value="" disabled>
          Select
        </option>
        {participants.map((participant) => (
          <option key={participant._id} value={participant._id}>
            {participant.email}
          </option>
        ))}
      </Select>
      <ChevronDownIcon
        className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
        aria-hidden="true"
      />
    </div>
  );
}