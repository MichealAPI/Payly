import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import { getAndTransformExpense } from "../utils/expenseUtils.js";

export const createExpense = async (req, res) => {
  const { groupId } = req.params;

  const {
    title,
    description,
    amount,
    type,
    participants,
    splitMethod,
    date,
    paidBy,
    currency,
  } = req.body;
  const userId = req.user.id;

  try {
    // Validate group existence
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
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
      currency: currency,
      date: date,
      paidBy: paidBy,
    });

    await newExpense.save();

    group.expenses.push(newExpense._id);
    await group.save();

    const expense = await getAndTransformExpense(newExpense._id);

    res
      .status(201)
      .json({ message: "Expense created successfully", expense: expense });
  } catch (error) {
    throw new Error(`Error creating expense: ${error.message}`);
  }
};

export const updateExpense = async (req, res) => {
  const { expenseId } = req.params;
  const {
    title,
    description,
    amount,
    type,
    participants,
    splitMethod,
    date,
    paidBy,
    currency,
  } = req.body;

  try {
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    const updatedExpenseData = {
      title: title,
      amount: amount,
      description: description,
      type: type,
      participants: participants,
      splitMethod: splitMethod,
      currency: currency,
      date: date,
      paidBy: paidBy.id ? paidBy.id : paidBy,
    };

    const updatedExpense = await Expense.findByIdAndUpdate(
      expenseId,
      updatedExpenseData,
      { new: true }
    );

    if (!updatedExpense) {
      return res
        .status(404)
        .json({ message: "Expense not found after update" });
    }

    const transformedExpense = await getAndTransformExpense(updatedExpense._id);

    res.status(200).json({
      message: "Expense updated successfully",
      expense: transformedExpense,
    });
  } catch (error) {
    throw new Error(`Error updating expense: ${error.message}`);
  }
};

export const deleteExpense = async (req, res) => {
  const { expenseId } = req.params;

  try {
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    await Expense.findByIdAndDelete(expenseId);
    res.status(200).json({ message: "Expense deleted successfully" });
  } catch (error) {
    throw new Error(`Error deleting expense: ${error.message}`);
  }
};
