import toast from "react-hot-toast";

async function handleArchive(error, setError, groupId) {
  try {
    const response = await fetch(`/api/groups/${groupId}/archive`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to archive group");
      return;
    }

    console.log("Group archived successfully");
  } catch (err) {
    console.error("Archive error:", err);
    setError(err.message || "An error occurred while archiving the group");
  } finally {
    if (error) {
      toast.error(error, {
        position: "bottom-center",
      });
    } else {
      toast.success("Group archived successfully!", {
        position: "bottom-center",
      });
    }
  }
}

async function handleDelete(groupId, onComplete) {
  try {
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete group");
    }

    toast.success("Group deleted successfully!");
    if (onComplete) {
      onComplete(); // This will call fetchGroups
    }
  } catch (err) {
    console.error("Delete error:", err);
    toast.error(err.message || "An error occurred while deleting the group");
  }
}

export { handleArchive, handleDelete };
export default { handleArchive, handleDelete };