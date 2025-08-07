import { Types } from "mongoose";
import { Expense } from "src/expenses/schemas/expense.schema";

// --- Type Definitions ---

interface Participant {
  user: UserData;
  isEnabled: boolean;
  splitAmount?: number;
}

interface UserData {
  _id: Types.ObjectId;
  email: string;
}

interface Debt {
  from: UserData;
  to: UserData;
  amount: number;
  currency: string;
}

interface CalculationResult {
  userOwes: Debt[];
  owedToUser: Debt[];
  totalUserOwes: Record<string, number>;
  totalOwedToUser: Record<string, number>;
  balances: Record<string, Record<string, number>>;
}

interface MemberBalance {
  paid: number;
  owes: number;
  user: UserData;
}

interface FinalBalance extends MemberBalance {
  netBalance: number;
}

const EMPTY_RESULT: CalculationResult = {
  userOwes: [],
  owedToUser: [],
  totalUserOwes: {},
  totalOwedToUser: {},
  balances: {},
};

/**
 * Calculates the balance of each member in a group, from a specific user's perspective.
 * @param {GroupData} group - The group object containing expenses.
 * @param {string} userId - The ID of the user requesting the balances.
 * @returns {CalculationResult} An object containing lists of members who owe money, members who are owed money, and simplified debt transactions.
 */
export const calculateBalances = (
  expenses: Expense[],
  userId: string
): CalculationResult => {

  if (!expenses || expenses.length === 0) {
    return EMPTY_RESULT;
  }

  // Group expenses by currency
  const expensesByCurrency = expenses.reduce((acc, expense) => {
    const currency = expense.currency || "default";
    (acc[currency] = acc[currency] || []).push(expense);
    return acc;
  }, {} as Record<string, Expense[]>);

  const allDebts: Debt[] = [];

  for (const currency in expensesByCurrency) {
    const expenses = expensesByCurrency[currency];
    const memberBalances = new Map<string, MemberBalance>();

    const initMember = (member: UserData) => {
      const memberId = member._id.toString();
      if (!memberBalances.has(memberId)) {
        memberBalances.set(memberId, {
          paid: 0,
          owes: 0,
          user: member,
        });
      }
    };

    // 1. Calculate how much each member has paid and owes for the current currency
    for (const expense of expenses) {
      if (!expense.paidBy || !expense.amount) continue;

      const payerParticipant = expense.splitDetails.find(p => p.user._id.equals(expense.paidBy));
      if (!payerParticipant) continue; // Skip expense if payer is not a participant

      initMember(payerParticipant.user as any);
      const paidById = expense.paidBy.toString();
      memberBalances.get(paidById)!.paid += expense.amount;

      const enabledParticipants = expense.splitDetails.filter(
        (p) => p.isEnabled && p.user
      );
      if (enabledParticipants.length === 0) continue;

      for (const p of enabledParticipants) {
        initMember(p.user as any);
        const participantId = p.user._id.toString();
        let amountOwed = 0;

        switch (expense.splitMethod) {
          case "equal":
            amountOwed = expense.amount / enabledParticipants.length;
            break;
          case "fixed":
            // Flaw: The sum of fixed split amounts might not equal the total expense amount.
            // This can lead to the payer unintentionally covering the difference or receiving extra credit.
            amountOwed = p.splitAmount || 0;
            break;
          case "percentage":
            // Flaw: The sum of percentages might not equal 100.
            // Similar to the 'fixed' split, this can cause incorrect balance calculations.
            amountOwed = ((p.splitAmount || 0) / 100) * expense.amount;
            break;
        }
        memberBalances.get(participantId)!.owes += amountOwed;
      }
    }

    // 2. Calculate net balance for each member for the current currency
    const finalBalances: FinalBalance[] = Array.from(memberBalances.values()).map(
      (b) => ({
        ...b,
        netBalance: b.paid - b.owes,
      })
    );

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
          currency: currency,
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
  }, {} as Record<string, number>);

  const totalOwedToUser = owedToUser.reduce((sum, debt) => {
    sum[debt.currency] = (sum[debt.currency] || 0) + debt.amount;
    return sum;
  }, {} as Record<string, number>);

  // Simplified balance, Object { ParticipantId: { Currency: Amount } }
  // Flaw: This re-iterates over all debts. It could be calculated more directly.
  const simplifiedBalance: Record<string, Record<string, number>> = {};
  for (const debt of allDebts) {
    const fromId = debt.from._id.toString();
    const toId = debt.to._id.toString();

    if (fromId === userId) { // User owes someone
      simplifiedBalance[toId] = simplifiedBalance[toId] || {};
      simplifiedBalance[toId][debt.currency] = (simplifiedBalance[toId][debt.currency] || 0) + debt.amount;
    } else if (toId === userId) { // Someone owes user
      simplifiedBalance[fromId] = simplifiedBalance[fromId] || {};
      simplifiedBalance[fromId][debt.currency] = (simplifiedBalance[fromId][debt.currency] || 0) - debt.amount;
    }
  }

  return {
    userOwes,
    owedToUser,
    totalUserOwes,
    totalOwedToUser,
    balances: simplifiedBalance,
  };
};