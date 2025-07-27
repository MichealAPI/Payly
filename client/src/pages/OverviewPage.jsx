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

const OverviewContent = ({
  onShowParticipants,
  movements,
  setIsMovementModalOpen,
  loading,
  onEditMovement,
}) => {
  console.log("Movements:", movements);
  console.log(movements && movements.length > 0);

  const mappedMovements =
    movements && movements.length > 0 ? (
      movements.map((item) => (
        <Movement
          key={item._id}
          type={item.type}
          amount={item.amount}
          title={item.title}
          description={item.description}
          commentsAmount={item.commentsAmount}
          movementId={item._id}
          className={"w-full md:w-[90%]"}
          owner={item.createdBy.name || item.createdBy.email} // Assuming createdBy has name or email
          members={item.members} // Assuming members is an array of participant objects
          onEdit={() => onEditMovement(item)}
        />
      ))
    ) : (
      <p className="text-white text-center opacity-70">
        No movements yet. Be the first to add one!
      </p>
    );

  return (
    <>
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
            <div className="w-full md:w-2/3 lg:w-1/2">
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
              className={"flex-shrink-0"}
              style="fill"
            />
          </div>

          <div className="flex flex-col gap-9 w-full">
            {loading ? (
              <p className="text-white text-center opacity-70">
                Loading movements...
              </p>
            ) : (
              mappedMovements
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
            onClick={() => setIsMovementModalOpen(true)}
            style="fill"
          />

          <Warning message="This is a warning message!" icon="⚠️" />

          <Card className="hidden md:flex w-full">
            <div className="flex flex-col w-full">
              <h3 className="text-lg text-white text-center font-bold">
                Overview
              </h3>
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
              <h3 className="text-lg text-white text-center font-bold">
                Balances
              </h3>
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
    </>
  );
};

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
        <p className="text-white text-center opacity-70">
          No participants found.
        </p>
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
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [editingMovement, setEditingMovement] = useState(null);

  const handleEditMovement = (movement) => {
    setEditingMovement(movement);
    setIsMovementModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsMovementModalOpen(false);
    setEditingMovement(null);
  };

  document.documentElement.classList.add("overflow-y-scroll");

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
        console.log("Group data:", data);
        setMovements(data.expenses || []);
        setParticipants(data.members || []);

        console.log("Group data loaded successfully.");
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

        <div className="flex flex-col items-center justify-center w-[90%] md:p-4 lg:w-[50vw]">
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
                  setIsMovementModalOpen={setIsMovementModalOpen}
                  loading={loading}
                  onEditMovement={handleEditMovement}
                />
              ) : (
                <ParticipantsContent participants={participants} />
              )}
            </AnimatePresence>
          </div>
        </div>

      </Wrapper>


        <MovementModal
          isOpen={isMovementModalOpen}
          defParticipants={participants}
          groupId={groupId}
          setIsOpen={handleCloseModal}
          movementToEdit={editingMovement}
          onComplete={(newMovement) => {
            if (editingMovement) {
              // Update existing movement
              setMovements((prev) =>
                prev.map((m) => (m._id === newMovement._id ? newMovement : m))
              );
            } else {
              // Add new movement
              setMovements((prev) => [...prev, newMovement]);
            }
          }}
        />

      {/* Floating Action Button for mobile */}
      <div className="flex fixed md:hidden bottom-4 right-4">
        <Button
          size="minimal"
          iconVisibility={true}
          onClick={() => setIsMovementModalOpen(true)}
          style="fill"
          icon={<PlusIcon className="w-6" />}
          className="relative z-50" // Explicitly set bottom-right position
        />
      </div>
    </>
  );
};

export default OverviewPage;
