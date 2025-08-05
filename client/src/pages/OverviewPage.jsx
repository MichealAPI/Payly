import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScaleIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import { Navigate, useParams } from "react-router-dom";
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
import InviteModal from "../components/ui/InviteModal/InviteModal";
import Observer from "../utils/Observer";
import { useNavigate } from "react-router-dom";
import ExpenseSkeleton from "../components/ui/Expense/ExpenseSkeleton";
import ExpenseDetailModal from "../components/ui/ExpenseDetailModal/ExpenseDetailModal";
import GroupModal from "../components/ui/GroupModal/GroupModal";
import ProfilePicture from "../components/ui/ProfilePicture/ProfilePicture";

const DateSeparator = ({ date }) => {
  console.log("Date Separator:", date);
  const d = new Date(date);

  console.log("Date:", d);
  if (isNaN(d.getTime())) {
    // Date is invalid, don't render anything or render a fallback
    return null;
  }

  const formattedDate = d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center" aria-hidden="true">
      <div className="w-full border-t border-slate-600" />
      <span className="flex-shrink-0 mx-4 text-sm text-slate-400">
        {formattedDate}
      </span>
      <div className="w-full border-t border-slate-600" />
    </div>
  );
};

const OverviewContent = ({
  expenses,
  setExpenses,
  setExpenseModalOpen,
  loading,
  members,
  onEditExpense,
  balances, // Receive balances as a prop
  onViewExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' or 'asc'
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
    const filteredExpenses =
      expenses?.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exp.description &&
            exp.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || [];

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    if (sortedExpenses.length === 0) {
      return (
        <p className="text-white text-center opacity-70">
          {searchQuery
            ? "No expenses match your search."
            : "No expenses yet. Be the first to add one!"}
        </p>
      );
    }

    const expenseElements = [];
    let lastDate = null;

    sortedExpenses.forEach((item) => {
      const itemDate = new Date(item.date).toDateString();
      if (itemDate !== lastDate) {
        expenseElements.push(<DateSeparator key={itemDate} date={item.date} />);
        lastDate = itemDate;
      }

      console.log("Item:", item);
      console.log("Paid By:", item.paidBy);
      expenseElements.push(
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
            paidBy={item.paidBy}
            participants={item.participants}
            onEdit={() => onEditExpense(item)}
            onView={() => onViewExpense(item)}
            observer={observer}
            currency={item.currency}
          />
        </motion.div>
      );
    });

    return <AnimatePresence>{expenseElements}</AnimatePresence>;
  };

  const totalGroupExpensesByCurrency = expenses.reduce((acc, exp) => {
    if (!acc[exp.currency]) {
      acc[exp.currency] = 0;
    }
    acc[exp.currency] += exp.amount;
    return acc;
  }, {});

  console.log("Total Group Expenses:", totalGroupExpensesByCurrency);

  return (
    <>
      <motion.div
        key="overview"
        initial={{ opacity: 0.2, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0.2, x: -20 }}
        transition={{ duration: 0.1 }}
        className="flex w-full justify-between gap-[3vw] flex-col md:flex-row"
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              text="Sort"
              size="minimal"
              textVisibility={false}
              iconVisibility={true}
              icon={
                sortOrder === "desc" ? (
                  <BarsArrowDownIcon className="w-6" />
                ) : (
                  <BarsArrowUpIcon className="w-6" />
                )
              }
              onClick={() =>
                setSortOrder((prev) => (prev === "desc" ? "asc" : "desc"))
              }
              className={"flex-shrink-0"}
              style="fill"
            />
          </div>

          <div className="flex flex-col gap-8 pb-8">
            {loading ? (
              <>
                <ExpenseSkeleton />
                <ExpenseSkeleton />
                <ExpenseSkeleton />
              </>
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

          {balances &&
            balances.balances &&
            Object.entries(balances.balances).map(
              ([participantId, currencyBalances]) => {
                const participant = members.find(
                  (m) => m._id === participantId
                );

                if (!participant) {
                  // Probably kicked or not in the group anymore
                  return null;
                }

                return Object.entries(currencyBalances).map(
                  ([currency, amount]) => {
                    if (amount > 0) {
                      return (
                        <Warning
                          key={`${participantId}-${currency}`}
                          message={`You owe ${
                            participant.firstName && participant.lastName
                              ? `${participant.firstName} ${participant.lastName}`
                              : participant.email
                          } ${currency} ${amount.toFixed(2)}`}
                          icon="⚠️"
                        />
                      );
                    }
                    return null;
                  }
                );
              }
            )}
          <Card className="hidden md:flex w-full">
            <div className="flex flex-col w-full gap-4">
              <h3 className="text-lg text-white font-bold text-center border-b border-slate-600 pb-3">
                Group Summary
              </h3>
              <div className="flex flex-col gap-4 text-white">
                {/* You Owe */}
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-slate-300">You owe</p>
                    {balances &&
                    Object.keys(balances.totalUserOwes).length > 0 ? (
                      Object.entries(balances.totalUserOwes).map(
                        ([currency, amount]) => (
                          <p
                            key={currency}
                            className="text-lg font-bold text-red-400"
                          >
                            {amount.toFixed(2)} {currency}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-lg font-bold text-red-400">0.00</p>
                    )}
                  </div>
                </div>

                {/* You're Owed */}
                <div className="flex items-center gap-4">
                  <div className="bg-green-500/20 p-2 rounded-lg">
                    <ArrowTrendingDownIcon className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-slate-300">You're owed</p>
                    {balances &&
                    Object.keys(balances.totalOwedToUser).length > 0 ? (
                      Object.entries(balances.totalOwedToUser).map(
                        ([currency, amount]) => (
                          <p
                            key={currency}
                            className="text-lg font-bold text-green-400"
                          >
                            {amount.toFixed(2)} {currency}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-lg font-bold text-green-400">0.00</p>
                    )}
                  </div>
                </div>

                {/* Total Expenses */}
                <div className="flex items-center gap-4">
                  <div className="bg-slate-500/20 p-2 rounded-lg">
                    <ScaleIcon className="w-6 h-6 text-slate-300" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-slate-300">Total Expenses</p>
                    {Object.keys(totalGroupExpensesByCurrency).length > 0 ? (
                      Object.entries(totalGroupExpensesByCurrency).map(
                        ([currency, amount]) => (
                          <p
                            key={currency}
                            className="text-lg font-bold text-white"
                          >
                            {amount.toFixed(2)} {currency}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-lg font-bold text-white">0.00</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </motion.div>
    </>
  );
};

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
        <div className="flex-4">
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
          className="flex-1"
          iconVisibility={true}
          icon={<PlusIcon className="w-6" />}
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
                image={<ProfilePicture className="rounded-full w-12 h-12" profilePicture={participant.profilePicture} />}
                currencyBalances={currencyBalances}
                currencySymbol={currencySymbol}
              />
            );
          })
        ) : (
          <p className="text-white text-center opacity-70">
            {searchQuery
              ? "No participants match your search."
              : "No participants found. Invite some friends to get started!"}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const OverviewPage = () => {
  const [activeAction, setActiveAction] = useState("overview");
  const { groupId } = useParams();
  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [balances, setBalances] = useState(null);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [viewingExpense, setViewingExpense] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCreateInvite = async () => {
    if (isCreatingInvite) return;

    setIsCreatingInvite(true);
    setInviteCode(null); // Reset previous code
    setInviteModalOpen(true); // Open modal immediately to show "Generating..."

    try {
      const res = await fetch(`/api/groups/${groupId}/invites`, {
        method: "POST",
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create invite.");
      }

      setInviteCode(data.inviteCode);
    } catch (err) {
      toast.error(err.message, { position: "bottom-center" });
      setInviteModalOpen(false); // Close modal on error
    } finally {
      setIsCreatingInvite(false);
    }
  };

  const handleEditExpense = (expense) => {
    console.log("Editing expense:", expense);
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleViewExpense = (expense) => {
    console.log("Viewing expense:", expense);
    setViewingExpense(expense);
  };

  const handleEditGroup = () => {
    setEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setExpenseModalOpen(false);
    setEditingExpense(null);
  };

  useEffect(() => {
    document.documentElement.style.overflowY = "scroll";
    return () => {
      document.documentElement.style.overflowY = "auto";
    };
  }, []);

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
        setMembers(data.members || []);
        setCurrentUser(data.currentUser || {});
        console.log("Group Data:", data);
      } catch (err) {
        toast.error("Failed to load group", { position: "bottom-center" });
        navigate("/groups");
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
        const data = await res.json();
        setBalances(data);

        console.log("R", data);

        console.log("Balances:", data.balances);
      } catch (err) {
        toast.error("Failed to load balances", { position: "bottom-center" });
      }
    };

    fetchBalances();
  }, [groupId, loading]);

  console.log("TESTING OUT", groupData);

  return (
    <>
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

        <div className="flex flex-col items-center justify-center w-[90%] md:p-4 lg:w-[70vw] lg:max-w-[1000px]">
          <Header
            title={groupData ? groupData.name : "Loading..."}
            description={groupData ? groupData.description : "Loading..."}
            membersCount={members ? members.length : 0}
            className="w-full"
            icon={groupData ? groupData.icon : "..."}
            isOwner={groupData ? groupData.owner === currentUser._id : false}
            onEdit={handleEditGroup}
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
                  onViewExpense={handleViewExpense}
                  groupId={groupId}
                  balances={balances}
                  members={members}
                  currencySymbol={groupData ? groupData.currencySymbol : "$"}
                />
              ) : (
                <ParticipantsContent
                  participants={members.filter(
                    (m) => m._id !== currentUser._id
                  )}
                  onInviteClick={handleCreateInvite}
                  balances={balances ? balances.balances : {}} // Use the simplified balances
                  ownerId={groupData ? groupData.owner : null}
                  currentUserId={currentUser._id}
                  groupId={groupId}
                  currencySymbol={groupData ? groupData.currencySymbol : "$"}
                  onDelete={(participantId) => {
                    // Remove from cached participants
                    setMembers((prev) =>
                      prev.filter((m) => m._id !== participantId)
                    );
                  }}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </Wrapper>

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        inviteCode={inviteCode}
      />

      <AnimatePresence>
        {viewingExpense && (
          <ExpenseDetailModal
            isOpen={!!viewingExpense}
            onClose={() => setViewingExpense(null)}
            expense={viewingExpense}
          />
        )}
      </AnimatePresence>

      <ExpenseModal
        isOpen={isExpenseModalOpen}
        members={members}
        groupId={groupId}
        setIsOpen={handleCloseModal}
        expenseToEdit={editingExpense}
        currentUser={currentUser}
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

      <GroupModal
        isOpen={isEditModalOpen}
        setIsOpen={setEditModalOpen}
        defGroupName={groupData ? groupData.name : ""}
        defDescription={groupData ? groupData.description : ""}
        defIcon={groupData ? groupData.icon : "👥"}
        groupId={groupId}
        isEditMode={true}
        onComplete={(updatedGroup) => {
          setGroupData(updatedGroup);
        }}
      />

      {/* Floating Action Button for mobile */}
      <div className="flex fixed md:hidden bottom-4 right-4 z-50">
        <Button
          size="minimal"
          iconVisibility={true}
          onClick={() => setExpenseModalOpen(true)}
          style="fill"
          icon={<PlusIcon className="w-6" />}
          className="relative" // Explicitly set bottom-right position
        />
      </div>
    </>
  );
};

export default OverviewPage;
