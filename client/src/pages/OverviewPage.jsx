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
import Expense from "../components/ui/Expense/Expense";
import Button from "../components/ui/Button/Button";
import Warning from "../components/ui/Warning/Warning";
import Header from "../components/ui/Header/Header";
import Input from "../components/ui/Input/Input";
import Card from "../components/ui/Card/Card";
import Participant from "../components/ui/Participant/Participant";
import toast from "react-hot-toast";
import ExpenseModal from "../components/ui/ExpenseModal/ExpenseModal";
import Observer from "../utils/Observer";

const OverviewContent = ({
  onShowParticipants,
  expenses,
  setExpenses,
  setExpenseModalOpen,
  loading,
  onEditExpense,
  balances, // Receive balances as a prop
}) => {
  console.log("Expenses:", expenses);
  console.log(expenses && expenses.length > 0);

  const observer = new Observer();

  observer.subscribe((data) => {
    switch (data.type) {
      case "expenseDeleted":
        toast.success("Expense deleted successfully!", {
          position: "bottom-center",
        });

        setExpenses(
          expenses.filter((exp) => exp._id !== data.payload.expenseId)
        );
        break;
    }
  });

  const mapExpenses = () => {
    return (
      <AnimatePresence>
        {expenses && expenses.length > 0 ? (
          expenses.map((item) => (
            <motion.div
              key={item._id}
              layout
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <Expense
                type={item.type}
                amount={item.amount}
                title={item.title}
                description={item.description}
                expenseId={item._id}
                className={"w-full md:w-[90%]"}
                owner={item.createdBy.name || item.createdBy.email}
                members={item.members}
                onEdit={() => onEditExpense(item)}
                observer={observer}
                currency={item.currency}
              />
            </motion.div>
          ))
        ) : (
          <p className="text-white text-center opacity-70">
            No expenses yet. Be the first to add one!
          </p>
        )}
      </AnimatePresence>
    );
  };

  const userTotalExpenses = expenses.reduce((sum, exp) => {
    const paidByUser = exp.paidBy && exp.paidBy._id === balances.userId;
    return sum + (paidByUser ? exp.amount : 0);
  }, 0);
  const totalGroupExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);


  console.log('User Total Expenses:', userTotalExpenses);
  console.log('Total Group Expenses:', totalGroupExpenses);

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
        {/* Left Column: Expenses */}
        <div className="flex flex-col gap-10 flex-1">
          {/* Search Bar with Sorting */}
          <div className="flex gap-4">
            <div className="w-full md:w-2/3 lg:w-1/2">
              <Input
                type="text"
                placeholder="Search expenses..."
                icon={<MagnifyingGlassIcon className="w-6" />}
              />
            </div>
            <Button
              text="Sort"
              size="minimal"
              textVisibility={false}
              iconVisibility={true}
              icon={<BarsArrowDownIcon className="w-6" />}
              onClick={() => console.log("Sort expenses")}
              className={"flex-shrink-0"}
              style="fill"
            />
          </div>

          <div className="flex flex-col gap-9 w-full">
            {loading ? (
              <p className="text-white text-center opacity-70">
                Loading expenses...
              </p>
            ) : (
              mapExpenses()
            )}
          </div>
        </div>

        {/* Right Column: Actions & Summaries */}
        <div className="flex flex-col md:gap-10 order-first mb-4 md:mb-0 md:order-last">
          <Button
            text="Add Expense"
            size="full"
            className="hidden md:flex"
            icon={<PlusIcon className="w-6" />}
            onClick={() => setExpenseModalOpen(true)}
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
                  <p>Your Total Expenses:</p>
                  <p>Total Expenses:</p>
                </div>
                <div className="flex flex-col text-lg text-right">
                  <p className="text-red-300 font-bold">
                    ${balances ? balances.totalUserOwes.toFixed(2) : "0.00"}
                  </p>
                  <p className="text-green-300 font-bold">
                    ${balances ? balances.totalOwedToUser.toFixed(2) : "0.00"}
                  </p>
                  <p className="text-white font-bold">
                    ${userTotalExpenses.toFixed(2)}
                  </p>
                  <p className="text-white font-bold">
                    ${totalGroupExpenses.toFixed(2)}
                  </p>
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
  const [expenses, setExpenses] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [balances, setBalances] = useState(null);

  const handleEditExpense = (expense) => {
    console.log("Editing expense:", expense);
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleCloseModal = () => {
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  document.documentElement.classList.add("overflow-y-scroll");

  useEffect(() => {
    if (!groupId) return;

    const fetchGroupDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/groups/${groupId}`);
        if (!res.ok) throw new Error(res.statusText);
        const data = await res.json();
        setGroupData(data);
        setExpenses(data.expenses || []);
        setParticipants(data.members || []);
      } catch (err) {
        toast.error("Failed to load group", { position: 'bottom-center' });
      } finally {
        setLoading(false);
      }
    };

    fetchGroupDetails();
  }, [groupId]);

  useEffect(() => {

    if (!groupId || loading) return;

    const fetchBalances = async () => {
      try {
        const res = await fetch(`/api/groups/${groupId}/balances`);
        if (!res.ok) throw new Error(res.statusText);
        setBalances(await res.json());
      } catch (err) {
        toast.error("Failed to load balances", { position: 'bottom-center' });
      }
    };

    fetchBalances();
  }, [groupId, loading]);  

  console.log(balances);

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
                  expenses={expenses}
                  setExpenses={setExpenses}
                  setExpenseModalOpen={setExpenseModalOpen}
                  loading={loading}
                  onEditExpense={handleEditExpense}
                  groupId={groupId}
                  balances={balances}
                />
              ) : (
                <ParticipantsContent participants={participants} />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Wrapper>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        defParticipants={participants}
        groupId={groupId}
        setIsOpen={handleCloseModal}
        expenseToEdit={editingExpense}
        onComplete={(newExpense) => {
          console.log("New Expense:", newExpense);
          if (editingExpense) {
            // Update existing expense
            setExpenses((prev) =>
              prev.map((m) => (m._id === newExpense._id ? newExpense : m))
            );
          } else {
            // Add new expense
            setExpenses((prev) => [...prev, newExpense]);
          }
        }}
      />

      {/* Floating Action Button for mobile */}
      <div className="flex fixed md:hidden bottom-4 right-4">
        <Button
          size="minimal"
          iconVisibility={true}
          onClick={() => setExpenseModalOpen(true)}
          style="fill"
          icon={<PlusIcon className="w-6" />}
          className="relative z-50" // Explicitly set bottom-right position
        />
      </div>
    </>
  );
};

export default OverviewPage;
