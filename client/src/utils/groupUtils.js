import toast from "react-hot-toast";

async function handleArchive(error, setError, groupId, isArchived) {
  try {
    const response = await fetch(`/api/groups/${groupId}/${isArchived ? "unarchive" : "archive"}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error("Failed to update group");
      toast.error("Failed to update group.", { position: "bottom-center" });
      return false;
    }

    toast.success("Group updated successfully!", {
      position: "bottom-center",
    });
    return true;
  } catch (err) {
    console.error("Archive error:", err);
    setError(err.message || "An error occurred while archiving the group");
    toast.error(error || "An error occurred.", { position: "bottom-center" });
    return false;
  }
}

async function handleDelete(error, setError, groupId) {
  try {
    const response = await fetch(`/api/groups/${groupId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete group");
    }

    toast.success("Group deleted successfully!", {
      position: "bottom-center",
    });
    return true;
  } catch (err) {
    console.error("Delete error:", err);
    setError(err.message || "An error occurred while deleting the group");
    toast.error(err.message, {
      position: "bottom-center",
    });
    return false;
  }
}

export { handleArchive, handleDelete };
export default { handleArchive, handleDelete };
