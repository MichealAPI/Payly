import Expense from "../models/Expense.js";
import mongoose from "mongoose";
import Group from "../models/Group.js";

/**
 * Calculates the balance of each member in a group, from a specific user's perspective.
 * @param {string} groupId - The ID of the group.
 * @param {string} userId - The ID of the user requesting the balances.
 * @returns {Promise<Object>} An object containing lists of members who owe money, members who are owed money, and simplified debt transactions.
 */
export const calculateBalances = async (groupId, userId) => {
  if (
    !mongoose.Types.ObjectId.isValid(groupId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new Error("Invalid groupId or userId provided.");
  }

  const foundExpenses = await Group.findById(groupId)
  .populate({
    path: "expenses",
    populate: [
      { path: "paidBy", model: "User", select: "email" },
      { path: "participants.user", model: "User", select: "email" }
    ]
  });

  console.log("Expenses:", foundExpenses.expenses);

  if (!foundExpenses.expenses || foundExpenses.expenses.length === 0) {
    return {
      userOwes: [],
      owedToUser: [],
      totalUserOwes: 0,
      totalOwedToUser: 0,
      balances: {}
    };
  }

  const memberBalances = new Map();

  // Helper to initialize a member in the balance map
  const initMember = (member) => {
    const memberId = member._id.toString();
    if (!memberBalances.has(memberId)) {
      memberBalances.set(memberId, {
        paid: 0,
        owes: 0,
        user: {
          // Store user details for the final output
          _id: member._id,
          email: member.email,
          // Add other user fields if needed
        },
      });
    }
  };

  // 1. Calculate how much each member has paid and owes
  for (const expense of foundExpenses.expenses) {
    if (!expense.paidBy || !expense.amount) continue;

    initMember(expense.paidBy);
    const paidById = expense.paidBy._id.toString();
    memberBalances.get(paidById).paid += expense.amount;

    const enabledParticipants = expense.participants.filter(
      (p) => p.isEnabled && p.user
    );
    if (enabledParticipants.length === 0) continue;

    for (const p of enabledParticipants) {
      initMember(p.user);
      const participantId = p.user._id.toString();
      let amountOwed = 0;

      switch (expense.splitMethod) {
        case "equal":
          amountOwed = expense.amount / enabledParticipants.length;
          break;
        case "fixed":
          amountOwed = p.splitAmount || 0;
          break;
        case "percentage":
          amountOwed = (p.splitAmount / 100) * expense.amount;
          break;
        default:
          break;
      }
      memberBalances.get(participantId).owes += amountOwed;
    }
  }

  // 2. Calculate net balance for each member
  const finalBalances = Array.from(memberBalances.values()).map((b) => ({
    ...b,
    netBalance: b.paid - b.owes,
  }));

  console.log("Final balances:", finalBalances);

  // 3. Simplify debts
  const debtors = finalBalances
    .filter((b) => b.netBalance < 0)
    .map((d) => ({ ...d, netBalance: -d.netBalance }));
  const creditors = finalBalances.filter((b) => b.netBalance > 0);
  const debts = [];

  debtors.sort((a, b) => b.netBalance - a.netBalance);
  creditors.sort((a, b) => b.netBalance - a.netBalance);

  let i = 0,
    j = 0;
  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(debtor.netBalance, creditor.netBalance);

    if (amount > 0.01) {
      // Tolerance for floating point inaccuracies
      debts.push({
        from: debtor.user,
        to: creditor.user,
        amount: amount,
      });

      debtor.netBalance -= amount;
      creditor.netBalance -= amount;
    }

    if (debtor.netBalance < 0.01) i++;
    if (creditor.netBalance < 0.01) j++;
  }

  const userOwes = debts.filter((d) => d.from._id.toString() === userId);
  const owedToUser = debts.filter((d) => d.to._id.toString() === userId);

  const totalUserOwes = userOwes.reduce((sum, debt) => sum + debt.amount, 0);
  const totalOwedToUser = owedToUser.reduce(
    (sum, debt) => sum + debt.amount,
    0
  );

  // Simplified balance, Object { ParticipantId: Amount }, amount is positive if user owes, negative if user is owed
  const simplifiedBalance = {};
  for (const debt of debts) {
    const fromId = debt.from._id.toString();
    const toId = debt.to._id.toString();

    if (fromId === userId) {
      simplifiedBalance[toId] = (simplifiedBalance[toId] || 0) + debt.amount;
    } else if (toId === userId) {
      simplifiedBalance[fromId] = (simplifiedBalance[fromId] || 0) - debt.amount;
    }
  }

  return {
    userOwes: userOwes,
    owedToUser: owedToUser,
    totalUserOwes: totalUserOwes,
    totalOwedToUser: totalOwedToUser,
    balances: simplifiedBalance
  };
};
