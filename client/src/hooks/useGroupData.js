import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import apiClient from "../api/axiosConfig";
import { useSelector } from "react-redux";

export const useGroupData = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [groupData, setGroupData] = useState(null);
  const [expenses, setExpenses] = useState([]);
  const [members, setMembers] = useState([]);
  const [balances, setBalances] = useState(null);
  const [isCreatingInvite, setIsCreatingInvite] = useState(false);
  const [inviteCode, setInviteCode] = useState(null);

  const { currentUser } = useSelector((state) => state.auth);

  const fetchGroupDetails = useCallback(async () => {
    try {
      setLoading(true);
      const res = await apiClient.get(`/groups/${groupId}/retrieve`);
      const data = res.data;

      setGroupData(data);
      setExpenses(data.expenses || []);
      setMembers(data.members || []);
    } catch {
      toast.error("Failed to load group", { position: "bottom-center" });
      navigate("/groups");
    } finally {
      setLoading(false);
    }
  }, [groupId, navigate]);

  const fetchBalances = useCallback(async () => {
    try {
      const res = await apiClient.get(`/groups/${groupId}/balances`);
      const data = res.data;
      setBalances(data);
    } catch {
      toast.error("Failed to load balances", { position: "bottom-center" });
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      fetchGroupDetails();
    }
  }, [groupId, fetchGroupDetails]);

  useEffect(() => {
    if (groupId && !loading) {
      fetchBalances();
    }
  }, [groupId, loading, fetchBalances]);

  const handleCreateInvite = useCallback(async () => {
    if (isCreatingInvite) return;

    setIsCreatingInvite(true);
    setInviteCode(null);

    try {
      const res = await apiClient.post(`/invites/${groupId}/create`);
      const data = res.data;
      setInviteCode(data.code);
      return data.code;
    } catch (err) {
      toast.error(err.message, { position: "bottom-center" });
      return null;
    } finally {
      setIsCreatingInvite(false);
    }
  }, [groupId, isCreatingInvite]);

  return {
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
  // Allow pages/components to manually refresh data after mutations
  refreshBalances: fetchBalances,
  refreshGroup: fetchGroupDetails,
  };
};
