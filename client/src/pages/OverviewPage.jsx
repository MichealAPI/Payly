import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { PlusIcon } from "@heroicons/react/24/outline";
import Navbar from "../components/ui/Navbar/Navbar";
import Wrapper from "../components/ui/Wrapper/Wrapper";
import Button from "../components/ui/Button/Button";
import Header from "../components/ui/Header/Header";
import ExpenseModal from "../components/ui/ExpenseModal/ExpenseModal";
import InviteModal from "../components/ui/InviteModal/InviteModal";
import ExpenseDetailModal from "../components/ui/ExpenseDetailModal/ExpenseDetailModal";
import GroupModal from "../components/ui/GroupModal/GroupModal";
import OverviewContent from "../components/overview/OverviewContent";
import ParticipantsContent from "../components/overview/ParticipantsContent";
import { useGroupData } from "../hooks/useGroupData";

const OverviewPage = () => {
  const [activeAction, setActiveAction] = useState("overview");
  const {
    groupId,
    loading,
    groupData,
    expenses,
    members,
    currentUser,
    balances,
    isCreatingInvite,
    inviteCode,
    setGroupData,
    setExpenses,
    setMembers,
  handleCreateInvite,
  refreshBalances,
  } = useGroupData();

  const [isExpenseModalOpen, setExpenseModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [viewingExpense, setViewingExpense] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [isInviteModalOpen, setInviteModalOpen] = useState(false);

  const handleCreateInviteClick = async () => {
    setInviteModalOpen(true); // Open modal immediately
    await handleCreateInvite();
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setExpenseModalOpen(true);
  };

  const handleViewExpense = (expense) => {
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

  return (
    <>
      <Wrapper className="items-center bg-primary">
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
            <p className="text-base text-secondary opacity-70 mb-2 text-right m-0">
              Need help?
            </p>
            <AnimatePresence mode="wait">
              {activeAction === "overview" ? (
                <OverviewContent
                  expenses={expenses}
                  setExpenses={setExpenses}
                  setExpenseModalOpen={setExpenseModalOpen}
                  loading={loading}
                  onEditExpense={handleEditExpense}
                  onViewExpense={handleViewExpense}
                  balances={balances}
                  members={members}
                  groupId={groupId}
                  refreshBalances={refreshBalances}
                />
              ) : (
                <ParticipantsContent
                  participants={members.filter(
                    (m) => m._id !== currentUser._id
                  )}
                  onInviteClick={handleCreateInviteClick}
                  balances={balances ? balances.balances : {}}
                  ownerId={groupData ? groupData.owner : null}
                  currentUserId={currentUser._id}
                  groupId={groupId}
                  currencySymbol={groupData ? groupData.currencySymbol : "$"}
                  refreshBalances={refreshBalances}
                  onDelete={(participantId) => {
                    setMembers((prev) =>
                      prev.filter((m) => m._id !== participantId)
                    );
                    refreshBalances?.();
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
        isCreating={isCreatingInvite}
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
          if (editingExpense) {
            setExpenses((prev) =>
              prev.map((m) => (m._id === newExpense._id ? newExpense : m))
            );
          } else {
            setExpenses((prev) => [...prev, newExpense]);
          }
          // Recalculate balances after any expense mutation
          refreshBalances?.();
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
          className="relative text-white"
        />
      </div>
    </>
  );
};

export default OverviewPage;
