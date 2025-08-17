import { useState } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlassIcon, PlusIcon } from "@heroicons/react/24/outline";
import Input from "../ui/Input/Input";
import Button from "../ui/Button/Button";
import Participant from "../ui/Participant/Participant";
import ProfilePicture from "../ui/ProfilePicture/ProfilePicture";

const ParticipantsContent = ({
  participants,
  onInviteClick,
  balances,
  currentUserId,
  groupId,
  ownerId,
  currencySymbol,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredParticipants =
    participants &&
    participants.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  return (
    <motion.div
      key="participants"
      initial={{ opacity: 0.2, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0.2, x: -20 }}
      transition={{ duration: 0.1 }}
      className="flex flex-col gap-10"
    >
      <div className="flex justify-between gap-4">
        <div className="flex-5">
          <Input
            type="text"
            placeholder="Search participants..."
            icon={<MagnifyingGlassIcon className="w-6" />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button
          text="Invite"
          size="full"
          className="flex-1 text-white"
          iconVisibility={true}
          icon={<PlusIcon className="w-5" />}
          onClick={onInviteClick}
          style="fill"
        />
      </div>

      <div className="flex flex-col gap-4">
        {filteredParticipants && filteredParticipants.length > 0 ? (
          filteredParticipants.map((participant) => {
            const currencyBalances = balances
              ? balances[participant._id]
              : null;
            return (
              <Participant
                key={participant._id}
                groupId={groupId}
                ownerId={ownerId}
                currentUserId={currentUserId}
                participantId={participant._id}
                participantName={
                  participant.firstName && participant.lastName
                    ? `${participant.firstName} ${participant.lastName}`
                    : participant.email
                }
                image={<ProfilePicture className="rounded-full w-12 h-12" currentUser={participant} />}
                currencyBalances={currencyBalances}
                currencySymbol={currencySymbol}
              />
            );
          })
        ) : (
          <p className="text-secondary text-center opacity-70">
            {searchQuery
              ? "No participants match your search."
              : "No participants found. Invite some friends to get started!"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default ParticipantsContent;
