import { useEffect, useMemo, useState } from "react";
import { AnimatePresence } from "framer-motion";
import {
  MagnifyingGlassIcon,
  BarsArrowDownIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ScaleIcon,
  BarsArrowUpIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";
import Observer from "../../utils/observer";
import Expense from "../ui/Expense/Expense";
import Button from "../ui/Button/Button";
import Warning from "../ui/Warning/Warning";
import Input from "../ui/Input/Input";
import Card from "../ui/Card/Card";
import ExpenseSkeleton from "../ui/Expense/ExpenseSkeleton";
import DateSeparator from "./DateSeparator";
import { motion } from "framer-motion";

const OverviewContent = ({
  expenses,
  setExpenses,
  setExpenseModalOpen,
  loading,
  members,
  groupId,
  onEditExpense,
  balances, // Receive balances as a prop
  onViewExpense,
  refreshBalances,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // 'desc' or 'asc'

  const observer = useMemo(() => new Observer(), []);

  useEffect(() => {
    const handler = (data) => {
      switch (data.type) {
        case "expenseDeleted":
          toast.success("Expense deleted successfully!", {
            position: "bottom-center",
          });

          setExpenses((prev) =>
            prev.filter((exp) => exp._id !== data.payload.expenseId)
          );
          // After list update, refresh balances
          if (typeof refreshBalances === "function") {
            refreshBalances();
          }
          break;
        default:
          break;
      }
    };
    observer.subscribe(handler);
    return () => observer.unsubscribe(handler);
  }, [observer, setExpenses, refreshBalances]);

  const mapExpenses = () => {
    const filteredExpenses =
      expenses?.filter(
        (exp) =>
          exp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (exp.description &&
            exp.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ) || [];

    const sortedExpenses = [...filteredExpenses].sort((a, b) => {
      const dateA = new Date(a.paidAt);
      const dateB = new Date(b.paidAt);
      return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
    });

    if (sortedExpenses.length === 0) {
      return (
        <p className="text-secondary text-center opacity-70">
          {searchQuery
            ? "No expenses match your search."
            : "No expenses yet. Be the first to add one!"}
        </p>
      );
    }

    const expenseElements = [];
    let lastDate = null;

    sortedExpenses.forEach((item) => {
      const itemDate = new Date(item.paidAt).toDateString();
      if (itemDate !== lastDate) {
        expenseElements.push(<DateSeparator key={itemDate} date={item.paidAt} />);
        lastDate = itemDate;
      }

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
            participants={item.splitDetails}
            onEdit={() => onEditExpense(item)}
            onView={() => onViewExpense(item)}
            observer={observer}
            groupId={groupId}
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
          <div className="flex gap-4 items-center">
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
              className={"flex-shrink-0 text-white"}
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
            className="hidden md:flex text-white"
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
          <Card dropShadow={false} className="hidden md:flex w-full outline-1 outline-secondary/20">
            <div className="flex flex-col w-full gap-4">
              <h3 className="text-lg text-secondary font-bold text-center border-b-1 border-secondary/30 pb-3">
                Group Summary
              </h3>
              <div className="flex flex-col gap-4 text-secondary">
                {/* You Owe */}
                <div className="flex items-center gap-4">
                  <div className="bg-red-500/20 p-2 rounded-lg">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-red-400" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-secondary/80">You owe</p>
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
                    <p className="text-sm text-secondary/80">You're owed</p>
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
                    <ScaleIcon className="w-6 h-6 dark:text-slate-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm text-secondary/80">Total Expenses</p>
                    {Object.keys(totalGroupExpensesByCurrency).length > 0 ? (
                      Object.entries(totalGroupExpensesByCurrency).map(
                        ([currency, amount]) => (
                          <p
                            key={currency}
                            className="text-lg font-bold text-secondary"
                          >
                            {amount.toFixed(2)} {currency}
                          </p>
                        )
                      )
                    ) : (
                      <p className="text-lg font-bold text-secondary">0.00</p>
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

export default OverviewContent;
