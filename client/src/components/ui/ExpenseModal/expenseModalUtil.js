import { useState, useEffect, useCallback, useMemo } from "react";
import { toast } from "react-hot-toast";

export function useExpenseForm({
  expenseToEdit,
  members,
  groupId,
  onComplete,
  setSpinnerVisible,
  closeModal,
  currentUser,
}) {
  const isEditMode = useMemo(() => !!expenseToEdit, [expenseToEdit]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState(null);
  const [type, setType] = useState("expense");
  const [participants, setParticipants] = useState([]);
  const [splitMethod, setSplitMethod] = useState("equal");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [date, setDate] = useState(new Date());
  const [paidBy, setPaidBy] = useState(null);

  const resetFields = useCallback(() => {
    setTitle("");
    setAmount(0);
    setCurrency(null);
    setType("expense");
    setSplitMethod("equal");
    setDescription("");
    setDate(new Date());
    setPaidBy(currentUser || null);
  }, [currentUser]);

  useEffect(() => {

    console.log("Members in useEffect:", members);
    const initialParticipants = members.map((member) => ({
      ...member,
      user: member._id,
      splitAmount: 0,
      isEnabled: true,
    }));

    console.log("Initial participants:", initialParticipants);

    if (isEditMode && expenseToEdit) {
      setTitle(expenseToEdit.title);
      setDescription(expenseToEdit.description || "");
      setType(expenseToEdit.type);
      setAmount(expenseToEdit.amount);
      setCurrency(expenseToEdit.currency);
      setSplitMethod(expenseToEdit.splitMethod);
      setDate(new Date(expenseToEdit.date));
      setPaidBy(expenseToEdit.paidBy || null);

      console.log("Editing....", expenseToEdit);
      

      const participantMap = new Map(
        expenseToEdit.participants.map((p) => [p.id, p])
      );

      const editedParticipants = initialParticipants.map((member) => {
        const savedParticipant = participantMap.get(member._id);
        return savedParticipant
          ? {
              ...member,
              splitAmount: savedParticipant.splitAmount,
              isEnabled: savedParticipant.isEnabled,
            }
          : { ...member, isEnabled: false };
      });
      setParticipants(editedParticipants);
    } else {
      resetFields();
      setParticipants(initialParticipants);
      if (currentUser) {
        setPaidBy(currentUser);
      }
    }
  }, [isEditMode, expenseToEdit, members, resetFields, currentUser]);

  const checkFields = useCallback(() => {
    if (!title || !currency || !participants.length) {
      toast.error("Please fill in all fields", {
        position: "bottom-center",
      });
      return false;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than 0", {
        position: "bottom-center",
      });
      return false;
    }

    if (!date) {
      toast.error("Please select a date for the expense", {
        position: "bottom-center",
      });
      return false;
    }

    if (!paidBy) {
      toast.error("Please select who paid for the expense", {
        position: "bottom-center",
      });
      return false;
    }

    return true;
  }, [title, currency, participants, amount, date, paidBy]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();

      if (!checkFields()) return;

      setIsLoading(true);

      const url = isEditMode
        ? `/api/expenses/${groupId}/${expenseToEdit._id}`
        : `/api/expenses/${groupId}`;
      const method = isEditMode ? "PUT" : "POST";

      let finalParticipants = [];
      const enabledParticipants = participants.filter(
        (p) => p.isEnabled ?? true
      );

      if (splitMethod === "equal") {
        if (enabledParticipants.length === 0) {
          toast.error(
            "At least one participant must be enabled for an equal split.",
            { position: "bottom-center" }
          );
          setIsLoading(false);
          return;
        }
        const splitAmount = amount / enabledParticipants.length;
        finalParticipants = participants.map((p) => ({
          user: p._id,
          splitAmount: p.isEnabled ? splitAmount : 0,
          isEnabled: p.isEnabled ?? true,
        }));
      } else if (splitMethod === "fixed") {
        const totalSplit = enabledParticipants.reduce(
          (sum, p) => sum + (p.splitAmount || 0),
          0
        );
        if (Math.abs(totalSplit - amount) > 0.01) {
          // Tolerance for floating point issues
          toast.error(
            `The sum of fixed amounts (€${totalSplit.toFixed(
              2
            )}) must equal the total expense amount (€${amount.toFixed(2)}).`,
            { position: "bottom-center" }
          );
          setIsLoading(false);
          return;
        }
        finalParticipants = participants.map((p) => ({
          user: p._id,
          splitAmount: p.splitAmount || 0,
          isEnabled: p.isEnabled ?? true,
        }));
      } else if (splitMethod === "percentage") {
        const totalPercentage = enabledParticipants.reduce(
          (sum, p) => sum + (p.splitAmount || 0),
          0
        );
        if (Math.abs(totalPercentage - 100) > 0.01) {
          toast.error(
            `The sum of percentages (${totalPercentage.toFixed(
              2
            )}%) must equal 100%.`,
            { position: "bottom-center" }
          );
          setIsLoading(false);
          return;
        }
        finalParticipants = participants.map((p) => ({
          user: p._id || p.user,
          splitAmount: p.isEnabled ? (p.splitAmount / 100) * amount : 0,
          isEnabled: p.isEnabled ?? true,
        }));
      }

      try {
        if (setSpinnerVisible) setSpinnerVisible(true);

        const payload = {
          title: title,
          description: description,
          type: type,
          participants: finalParticipants,
          splitMethod: splitMethod,
          currency: currency.name,
          date: date ? date.toISOString() : new Date(),
          paidBy: paidBy ? paidBy : null,
          amount: amount !== null ? amount : 0,
        };

        const response = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              `Failed to ${isEditMode ? "update" : "create"} expense`
          );
        }

        toast.success(
          `Expense '${title}' ${
            isEditMode ? "updated" : "created"
          } successfully!`,
          {
            position: "bottom-center",
          }
        );

        if (onComplete) {
          setIsLoading(false);
          onComplete(data.expense);
        }

        if (!isEditMode) {
          resetFields();
        }

        closeModal();
      } catch (err) {
        console.error("Expense submission error:", err);
        const errorMessage =
          err.message ||
          `An error occurred during expense ${
            isEditMode ? "update" : "creation"
          }`;
        toast.error(errorMessage, {
          position: "bottom-center",
        });
      } finally {
        if (setSpinnerVisible) setSpinnerVisible(false);
      }
    },
    [
      checkFields,
      isEditMode,
      expenseToEdit,
      groupId,
      participants,
      splitMethod,
      amount,
      setSpinnerVisible,
      title,
      description,
      type,
      currency,
      onComplete,
      date,
      paidBy,
      closeModal,
      resetFields,
    ]
  );

  return {
    isEditMode,
    title,
    setTitle,
    description,
    setDescription,
    currency,
    setCurrency,
    type,
    setType,
    participants,
    setParticipants,
    splitMethod,
    setSplitMethod,
    isLoading,
    amount,
    setAmount,
    date,
    setDate,
    paidBy,
    setPaidBy,
    handleSubmit,
  };
}
