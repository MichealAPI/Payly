import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  PlusIcon,
  EnvelopeIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "react-router-dom";
import Sidebar from "../components/ui/Sidebar/Sidebar";
import Navbar from "../components/ui/Navbar/Navbar";
import Wrapper from "../components/ui/Wrapper/Wrapper";
import Movement from "../components/ui/Movement/Movement";
import Button from "../components/ui/Button/Button";
import Warning from "../components/ui/Warning/Warning";
import Header from "../components/ui/Header/Header";
import Input from "../components/ui/Input/Input";
import Card from "../components/ui/Card/Card";
import Participant from "../components/ui/Participant/Participant";
import toast from "react-hot-toast";
import MovementModal from "../components/ui/MovementModal/MovementModal";


const OverviewContent = ({ onShowParticipants, movements}) => (
  <motion.div
    key="overview"
    initial={{ opacity: 0.2, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0.2, x: -20 }}
    transition={{ duration: 0.1 }}
    className="flex w-full justify-between flex-col md:flex-row"
  >
    {/* Left Column: Movements */}
    <div className="flex flex-col gap-10 flex-1">
      {/* Search Bar with Sorting */}
      <div className="flex gap-4">
        <div className="flex-1 md:flex-none">
          <Input
            type="text"
            placeholder="Search movements..."
            icon={<MagnifyingGlassIcon className="w-6" />}
          />
        </div>
        <Button
          text="Sort"
          size="minimal"
          textVisibility={false}
          iconVisibility={true}
          icon={<BarsArrowDownIcon className="w-6" />}
          onClick={() => console.log("Sort movements")}
          style="fill"
        />
      </div>

      <div className="flex flex-col gap-4 w-full">
        {movements && movements.length > 0 ? (
          movements.map((movement) => (
            <Movement
              key={movement._id}
              type={movement.type}
              amount={movement.amount}
              title={movement.title}
              description={movement.description}
              commentsAmount={movement.commentsAmount}
              movementId={movement._id}
              className={"w-full md:w-[90%]"}
              owner={movement.owner.name || movement.owner.email}
              members={movement.members}
            />
          ))
        ) : (
          <p className="text-white text-center opacity-70">No movements yet. Be the first to add one!</p>
        )}
      </div>
    </div>

    {/* Right Column: Actions & Summaries */}
    <div className="flex flex-col md:gap-10 order-first mb-4 md:mb-0 md:order-last">
      <Button
        text="Add Movement"
        size="full"
        className="hidden md:flex"
        icon={<PlusIcon className="w-6" />}
        onClick={() => alert("Add Movement clicked!")}
        style="fill"
      />

      <Warning message="This is a warning message!" icon="⚠️" />

      <Card className="hidden md:flex w-full">
        <div className="flex flex-col w-full">
          <h3 className="text-lg text-white text-center font-bold">Overview</h3>
          <div className="flex justify-between items-center mt-2">
            <div className="flex flex-col text-white text-lg">
              <p>You owe:</p>
              <p>You're owed:</p>
              <p>Your Expenses:</p>
              <p>Total Expenses:</p>
            </div>
            <div className="flex flex-col text-lg text-right">
              <p className="text-red-300 font-bold">$100.00</p>
              <p className="text-green-300 font-bold">$200.00</p>
              <p className="text-white font-bold">$50.00</p>
              <p className="text-white font-bold">$250.00</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="hidden md:flex w-full">
        <div className="flex flex-col justify-center">
          <h3 className="text-lg text-white text-center font-bold">Balances</h3>
          <div className="flex items-center mt-2">
            <img
              src="https://placehold.co/32x32/orange/white"
              alt="John Doe"
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="flex flex-col">
              <p className="text-white font-bold">John Doe</p>
              <p className="text-green-200">$150.00</p>
            </div>
          </div>
          <div
            className="flex gap-1 mt-2 text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            onClick={onShowParticipants}
          >
            <p className="text-sm">Show more</p>
            <ArrowTopRightOnSquareIcon className="w-4" />
          </div>
        </div>
      </Card>
    </div>
  </motion.div>
);

const ParticipantsContent = ({ participants }) => (
  <motion.div
    key="participants"
    initial={{ opacity: 0.2, x: 10 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0.2, x: -20 }}
    transition={{ duration: 0.1 }}
    className="flex flex-col gap-10"
  >
    <div className="flex justify-between gap-4">
      <div className="flex-1">
        <Input
          type="text"
          placeholder="Search participants..."
          icon={<MagnifyingGlassIcon className="w-6" />}
        />
      </div>
      <Button
        text="Invite"
        size="full"
        className="flex-1"
        icon={<EnvelopeIcon className="w-6" />}
        onClick={() => alert("Invite clicked!")}
        style="fill"
      />
    </div>

    <div className="flex flex-col gap-4">
      {participants && participants.length > 0 ? (
        participants.map((participant) => (
          <Participant
            key={participant._id}
            participantId={participant._id}
            participantName={participant.name || participant.email}
            src={`https://i.pravatar.cc/32?u=${participant._id}`}
            netBalance={0} // This will be calculated later
            currency={"USD"} // This should come from group settings
          />
        ))
      ) : (
        <p className="text-white text-center opacity-70">No participants found.</p>
      )}
    </div>
  </motion.div>
);

const OverviewPage = () => {
  const [activeAction, setActiveAction] = useState("overview");
  const { groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [movements, setMovements] = useState([]);
  const [participants, setParticipants] = useState([]);

  useEffect(() => {
    if (!groupId) {
      console.error("Group ID is required to fetch data.");
      toast.error("Group ID is invalid or missing", {
        position: "bottom-center",
      });
      return;
    }

    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/groups/${groupId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch group data");
        }

        const data = await response.json();

        setGroupData(data);
        setMovements(data.movements || []);
        setParticipants(data.members || []);
      } catch (error) {
        console.error("Error fetching group data:", error);
        toast.error("Failed to load group data", { position: "bottom-center" });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  return (
    <>
      <Sidebar />
      <Wrapper className="items-center">
        <Navbar
          title="Overview"
          actions={[
            { id: "overview", label: "Overview" },
            { id: "participants", label: "Participants" },
          ]}
          activeAction={activeAction}
          actionsDropdown={true}
          onActionClick={setActiveAction}
        />

        <div className="flex flex-col items-center justify-center md:p-4 md:w-[750px]">
          <Header
            title={groupData ? groupData.name : "Loading..."}
            description={groupData ? groupData.description : "Loading..."}
            membersCount={participants ? participants.length : 0}
            className="w-full"
            icon={groupData ? groupData.icon : "..."}
          />

          <div className="mt-5 w-full">
            <p className="text-base text-white opacity-70 mb-2 text-right m-0">
              Need help?
            </p>
            <AnimatePresence mode="wait">
              {activeAction === "overview" ? (
                <OverviewContent
                  onShowParticipants={() => setActiveAction("participants")}
                  movements={movements}
                />
              ) : (
                <ParticipantsContent
                  participants={participants}
                />
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Floating Action Button for mobile */}
        <Button
          size="minimal"
          iconVisibility={true}
          onClick={() => console.log("Add Movement")}
          style="fill"
          icon={<PlusIcon className="w-6" />}
          className="sticky md:hidden mb-auto ml-auto right-0 bottom-0 m-4"
        />

        <MovementModal
          isOpen={true}
          setIsOpen={(val) => {val}}
          onComplete={(newMovement) => {
            setMovements((prev) => [...prev, newMovement]);
          }}
        />
      </Wrapper>
    </>
  );
};

export default OverviewPage;
