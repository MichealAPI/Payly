import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { toast } from "react-hot-toast";
import apiClient from "../../../api/axiosConfig";

export function useExpenseForm({
  expenseToEdit,
  members,
  groupId,
  onComplete,
  setSpinnerVisible,
  closeModal,
  currentUser,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [currency, setCurrency] = useState(null);
  const [type, setType] = useState("expense");
  const [splitDetails, setSplitDetails] = useState([]);
  const [splitMethod, setSplitMethod] = useState("equal");
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paidAt, setPaidAt] = useState(new Date());
  const [paidBy, setPaidBy] = useState(null);

  const resetFields = useCallback(() => {
    setTitle("");
    setAmount(0);
    setCurrency(null);
    setType("expense");
    setSplitMethod("equal");
    setSplitDetails([]);
    setDescription("");
    setPaidAt(new Date());
    setPaidBy(currentUser || null);
  }, [currentUser]);

  // Normalize split details coming from edit mode to a minimal, client-usable shape
  const normalizeSplitDetailsFromEdit = useCallback(
    (details = [], memberList = []) => {
      const byId = new Map(memberList.map((m) => [m._id, { _id: m._id, isEnabled: true, splitAmount: 0 }]));
      details.forEach((d) => {
        const uid = d?.user?._id || d?.user || d?._id; // support various shapes
        if (!uid) return;
        byId.set(uid, {
          _id: uid,
          isEnabled: d.isEnabled ?? true,
          splitAmount: Number(d.splitAmount ?? 0),
        });
      });
      return Array.from(byId.values());
    },
    []
  );


  useEffect(() => {

    if (expenseToEdit) {
      // Prevent double hydration
      //if (didHydrateRef.current) return;
      setTitle(expenseToEdit.title || "");
      setDescription(expenseToEdit.description || "");
      setType(expenseToEdit.type || "expense");
      setAmount(Number(expenseToEdit.amount) || 0);
      setCurrency(expenseToEdit.currency ?? null);
      setSplitMethod(expenseToEdit.splitMethod || "equal");
      setPaidAt(
        expenseToEdit.paidAt ? new Date(expenseToEdit.paidAt) : new Date()
      );
      setPaidBy(expenseToEdit.paidBy || null);
      // Ensure splitDetails contain participant _id references for client logic
      const normalized = normalizeSplitDetailsFromEdit(
        expenseToEdit.splitDetails || [],
        members || []
      );
      setSplitDetails(normalized);

    } else {

      resetFields();
      if (currentUser) setPaidBy(currentUser);
      setPaidAt(new Date());
      // Prepare default split entries for all members (enabled, amount 0)
      if (Array.isArray(members) && members.length > 0) {
        setSplitDetails(members.map((m) => ({ _id: m._id, isEnabled: true, splitAmount: 0 })));
      } else {
        setSplitDetails([]);
      }

    }
  }, [
    resetFields,
    expenseToEdit,
    normalizeSplitDetailsFromEdit,
    JSON.stringify((members || []).map((m) => m._id)),
    currentUser,
  ]);

  const checkFields = useCallback(() => {
    if (!title || !currency || !splitMethod) {
      toast.error("Please fill in all fields", { position: "bottom-center" });
      return false;
    }

    if (amount <= 0) {
      toast.error("Amount must be greater than 0", {
        position: "bottom-center",
      });
      return false;
    }

    if (!paidAt) {
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
  }, [title, currency, splitDetails, amount, paidAt, paidBy]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (!checkFields()) return;
      setIsLoading(true);

      const url = `/expenses/${groupId}/upsert`;

      let finalParticipants = [];
      const enabledParticipants = splitDetails.filter(
        (p) => p.isEnabled ?? true
      );


      if (splitMethod === "equal") {
        if (enabledParticipants.length === 0) {
          toast.error(
            "At least one participant must be enabled for an equal split.",
            {
              position: "bottom-center",
            }
          );
          setIsLoading(false);
          return;
        }
        const splitAmount = amount / enabledParticipants.length;
        finalParticipants = splitDetails.map((p) => ({
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
          toast.error(
            `The sum of fixed amounts (€${totalSplit.toFixed(
              2
            )}) must equal the total expense amount (€${amount.toFixed(2)}).`,
            { position: "bottom-center" }
          );
          setIsLoading(false);
          return;
        }
        finalParticipants = splitDetails.map((p) => ({
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
            {
              position: "bottom-center",
            }
          );
          setIsLoading(false);
          return;
        }
        finalParticipants = splitDetails.map((p) => ({
          user: p._id,
          splitAmount: p.isEnabled ? (p.splitAmount / 100) * amount : 0,
          isEnabled: p.isEnabled ?? true,
        }));
      }

      try {
        if (setSpinnerVisible) setSpinnerVisible(true);

        const payload = {
          title,
          description,
          type,
          splitDetails: finalParticipants,
          splitMethod,
          currency,
          paidAt: paidAt ? paidAt.toISOString() : new Date().toISOString(),
          paidBy: paidBy ? paidBy._id : null,
          amount: amount ?? 0,
        };

        if (expenseToEdit) {
          payload._id = expenseToEdit._id;
        }

        const response = await apiClient.post(url, payload);
        const data = response.data;

        toast.success(
          `Expense '${title}' ${
            expenseToEdit ? "updated" : "created"
          } successfully!`,
          {
            position: "bottom-center",
          }
        );

        if (onComplete) {
          setIsLoading(false);
          onComplete(data.expense);
        }

        if (!expenseToEdit) {
          resetFields();
        }

        closeModal();
      } catch (err) {
        console.error("Expense submission error:", err);
        const errorMessage =
          err.message ||
          `An error occurred during expense ${
            expenseToEdit ? "update" : "creation"
          }`;
        toast.error(errorMessage, { position: "bottom-center" });
      } finally {
        if (setSpinnerVisible) setSpinnerVisible(false);
      }
    },
    [
      checkFields,
      expenseToEdit,
      groupId,
      splitDetails,
      splitMethod,
      amount,
      setSpinnerVisible,
      title,
      description,
      type,
      currency,
      onComplete,
      paidBy,
      closeModal,
      resetFields,
    ]


  );

  return {
    title,
    setTitle,
    description,
    setDescription,
    currency,
    setCurrency,
    type,
    setType,
    splitDetails,
    setSplitDetails,
    splitMethod,
    setSplitMethod,
    isLoading,
    amount,
    setAmount,
    paidAt,
    setPaidAt,
    paidBy,
    setPaidBy,
    handleSubmit,
  };
}
