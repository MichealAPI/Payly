import Expense from '../models/Expense.js';

/**
 * Populates and transforms a single expense document.
 * @param {mongoose.Document} expense - The Mongoose expense document.
 * @returns {Object} The transformed expense object.
 */
export const transformExpense = (expense) => {
    if (!expense) {
        return null;
    }

    const expObj = expense.toObject();

    if (expObj.paidBy && expObj.paidBy.email) {
        expObj.paidBy = { id: expObj.paidBy._id, name: expObj.paidBy.email };
    }

    if (expObj.participants) {
        expObj.participants = expObj.participants.map(p => {
            const participant = {
                id: p.user._id,
                name: p.user.email,
                splitAmount: p.splitAmount,
                isEnabled: p.isEnabled,
            };
            if (p.share != null) {
                participant.share = p.share;
            }
            return participant;
        });
    }

    return expObj;
};

/**
 * Fetches, populates, and transforms an expense by its ID.
 * @param {string} expenseId - The ID of the expense to fetch.
 * @returns {Promise<Object|null>} A promise that resolves to the transformed expense object or null if not found.
 */
export const getAndTransformExpense = async (expenseId) => {
    const expense = await Expense.findById(expenseId)
        .populate({ path: 'paidBy', model: 'User', select: 'email' })
        .populate({ path: 'participants.user', model: 'User', select: 'email' });

    return transformExpense(expense);
};