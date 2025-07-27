import Group from "../models/Group.js";
import Expense from "../models/Expense.js";

export const createExpense = async (req, res) => {

    const { groupId } = req.params;

    const { title, description, amount, type, participants, splitMethod, currency } = req.body;
    const userId = req.user.id; // Get the authenticated user's ID from the request

    try {
        // Validate group existence
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Create the expense
        const newExpense = new Expense({
            title: title,
            amount: amount,
            description: description,
            type: type,
            participants: participants,
            splitMethod: splitMethod,
            createdBy: userId,
            currency: currency
        });

        await newExpense.save();

        // Optionally, update the group's expenses array
        group.expenses.push(newExpense._id);
        await group.save();

        const populatedExpense = await Expense.findById(newExpense._id).populate('createdBy', 'name email');

        res.status(201).json({ message: 'Expense created successfully', movement: populatedExpense });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Server error while creating expense' });
    }
}

export const updateExpense = async (req, res) => {
    const { expenseId } = req.params;
    const { title, description, amount, type, participants, splitMethod, currency } = req.body;
    const userId = req.user.id;

    try {
        const expense = await Expense.findById(expenseId);

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        // Optional: Check if the user is the creator of the expense
        if (expense.createdBy.toString() !== userId) {
            return res.status(403).json({ message: 'User not authorized to update this expense' });
        }

        const updatedExpenseData = {
            title,
            description,
            amount,
            type,
            participants,
            splitMethod,
            currency
        };

        const updatedExpense = await Expense.findByIdAndUpdate(expenseId, updatedExpenseData, { new: true })
            .populate('createdBy', 'name email');

        if (!updatedExpense) {
            return res.status(404).json({ message: 'Expense not found after update' });
        }

        res.status(200).json({ message: 'Expense updated successfully', movement: updatedExpense });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Server error while updating expense' });
    }
};