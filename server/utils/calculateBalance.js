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
    throw new Error(`Invalid groupId or userId provided: ${groupId}, ${userId}`);
  }

  const foundGroup = await Group.findById(groupId)
  .populate({
    path: "expenses",
    populate: [
      { path: "paidBy", model: "User", select: "email" },
      { path: "participants.user", model: "User", select: "email" }
    ]
  });

  if (!foundGroup || !foundGroup.expenses || foundGroup.expenses.length === 0) {
    return {
      userOwes: [],
      owedToUser: [],
      totalUserOwes: {},
      totalOwedToUser: {},
      balances: {}
    };
  }

  // Group expenses by currency
  const expensesByCurrency = foundGroup.expenses.reduce((acc, expense) => {
    const currency = expense.currency || 'default'; // Handle expenses without a currency
    if (!acc[currency]) {
      acc[currency] = [];
    }
    acc[currency].push(expense);
    return acc;
  }, {});

  const allDebts = [];

  for (const currency in expensesByCurrency) {
    const expenses = expensesByCurrency[currency];
    const memberBalances = new Map();

    // Helper to initialize a member in the balance map
    const initMember = (member) => {
      const memberId = member._id.toString();
      if (!memberBalances.has(memberId)) {
        memberBalances.set(memberId, {
          paid: 0,
          owes: 0,
          user: {
            _id: member._id,
            email: member.email,
          },
        });
      }
    };

    // 1. Calculate how much each member has paid and owes for the current currency
    for (const expense of expenses) {
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

    // 2. Calculate net balance for each member for the current currency
    const finalBalances = Array.from(memberBalances.values()).map((b) => ({
      ...b,
      netBalance: b.paid - b.owes,
    }));

    // 3. Simplify debts for the current currency
    const debtors = finalBalances
      .filter((b) => b.netBalance < 0)
      .map((d) => ({ ...d, netBalance: -d.netBalance }));
    const creditors = finalBalances.filter((b) => b.netBalance > 0);
    
    debtors.sort((a, b) => b.netBalance - a.netBalance);
    creditors.sort((a, b) => b.netBalance - a.netBalance);

    let i = 0, j = 0;
    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];
      const amount = Math.min(debtor.netBalance, creditor.netBalance);

      if (amount > 0.01) { // Tolerance for floating point inaccuracies
        allDebts.push({
          from: debtor.user,
          to: creditor.user,
          amount: amount,
          currency: currency, // Add currency to the debt object
        });

        debtor.netBalance -= amount;
        creditor.netBalance -= amount;
      }

      if (debtor.netBalance < 0.01) i++;
      if (creditor.netBalance < 0.01) j++;
    }
  }

  const userOwes = allDebts.filter((d) => d.from._id.toString() === userId);
  const owedToUser = allDebts.filter((d) => d.to._id.toString() === userId);

  const totalUserOwes = userOwes.reduce((sum, debt) => {
    sum[debt.currency] = (sum[debt.currency] || 0) + debt.amount;
    return sum;
  }, {});

  const totalOwedToUser = owedToUser.reduce((sum, debt) => {
    sum[debt.currency] = (sum[debt.currency] || 0) + debt.amount;
    return sum;
  }, {});

  // Simplified balance, Object { ParticipantId: { Currency: Amount } }
  const simplifiedBalance = {};
  for (const debt of allDebts) {
    const fromId = debt.from._id.toString();
    const toId = debt.to._id.toString();

    if (fromId === userId) { // User owes someone
      if (!simplifiedBalance[toId]) simplifiedBalance[toId] = {};
      simplifiedBalance[toId][debt.currency] = (simplifiedBalance[toId][debt.currency] || 0) + debt.amount;
    } else if (toId === userId) { // Someone owes user
      if (!simplifiedBalance[fromId]) simplifiedBalance[fromId] = {};
      simplifiedBalance[fromId][debt.currency] = (simplifiedBalance[fromId][debt.currency] || 0) - debt.amount;
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
