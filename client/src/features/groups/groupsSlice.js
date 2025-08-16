import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/axiosConfig";
import { arrayMove } from "@dnd-kit/sortable"; // You'll use this in the reducer

export const fetchGroups = createAsyncThunk(
  "groups/fetchGroups",
  async (_, { rejectWithValue }) => {
    try {
      const groups = await apiClient.get("/groups/list");

      const order = await apiClient.get("/users/settings/groupOrder");

      const orderedIds = order?.data || [];

      // Order groups based on their IDs
      groups.data.sort((a, b) => {
        const indexA = orderedIds.indexOf(a._id);
        const indexB = orderedIds.indexOf(b._id);
        return indexA - indexB; // Ascending order
      });

      return groups.data;
    } catch (error) {
      return rejectWithValue(error.groups.data);
    }
  }
);

export const fetchArchivedGroups = createAsyncThunk(
  "groups/fetchArchived",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiClient.get("/users/settings/archivedGroups");
      // API may return either an array or an object with a `value` array.
      const data = response.data;
      const archivedArray = Array.isArray(data) ? data : data?.value ?? [];
      // Normalize to an array of string IDs only
      const archivedIds = archivedArray
        .map((item) => {
          if (!item) return null;
          if (typeof item === "string") return item;
          if (typeof item === "number") return String(item);
          // object-like
          if (typeof item === "object") {
            // support {_id}, {id}, or value wrappers
            const possibleId = item._id ?? item.id ?? item.value ?? null;
            return possibleId ? String(possibleId) : null;
          }
          return null;
        })
        .filter(Boolean);
      return archivedIds;
    } catch (error) {
      return []
    }
  }
);

export const reorderGroups = createAsyncThunk(
  "groups/reorderGroups",
  async ({ oldIndex, newIndex, allGroups }, { rejectWithValue }) => {
    // Optimistically create the new array
    const newOrderedGroups = arrayMove(allGroups, oldIndex, newIndex);
    const orderedGroupIds = newOrderedGroups.map((g) => g._id);

    try {
      await apiClient.put("/users/order", orderedGroupIds);
      // On success, return the new, correctly ordered array
      return newOrderedGroups;
    } catch (error) {
      // On failure, the thunk will reject, and we can revert in the reducer
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteGroup = createAsyncThunk(
  "groups/deleteGroup",
  async (group, { rejectWithValue }) => {
    try {
      await apiClient.delete(`/groups/${group._id}/delete`);
      return group._id; // On success, return the ID of the deleted group
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createGroup = createAsyncThunk(
  "groups/createGroup",
  async (groupData, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/groups/upsert", groupData);

      return response.data; // Expect the new group object back from the API
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const toggleArchiveGroup = createAsyncThunk(
  "groups/toggleArchiveGroup",
  async (group, { rejectWithValue }) => {
    try {
      await apiClient.post(`/users/${group._id}/toggleArchive`);
      return group; // Return the full group object to move it between lists
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const joinGroup = createAsyncThunk(
  'groups/joinGroup',
  async (inviteCode, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/invites/${inviteCode}/join`);
      // The API returns { group, message }, we'll pass this whole object along
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateGroup = createAsyncThunk(
    "groups/updateGroup",
    async ({ groupId, groupData }, { rejectWithValue }) => {
        try {
            const response = await apiClient.put(`/${groupId}/update`, groupData);
            return response.data; // Expect the updated group object back from the API
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);


const initialState = {
  items: [],
  archivedItems: [],
  isLoading: false,
  error: null,
};

const groupsSlice = createSlice({
  name: "groups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle all pending states by showing the spinner
      .addCase(fetchGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchArchivedGroups.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteGroup.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(toggleArchiveGroup.pending, (state) => {
        state.isLoading = true;
      })

      // Handle all rejection states by hiding the spinner
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(deleteGroup.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchArchivedGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // etc. for all rejections...

      // Handle fulfillment
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchArchivedGroups.fulfilled, (state, action) => {
  // store only archived IDs
  state.archivedItems = action.payload;
      })
      .addCase(createGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload); // Add new group to the top
      })
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        // The payload is the groupId, filter it out from both lists
        state.items = state.items.filter((g) => g._id !== action.payload);
        state.archivedItems = state.archivedItems.filter(
          (id) => id !== action.payload,
        );
      })
      .addCase(toggleArchiveGroup.fulfilled, (state, action) => {
        state.isLoading = false;
        // Support various payload shapes: group object, { id }, or raw id
        const toggledId = String(
          action.payload?._id ?? action.payload?.id ?? action.payload,
        );
        if (!toggledId) return;
        const isArchived = state.archivedItems.includes(toggledId);
        if (isArchived) {
          // Unarchive
          state.archivedItems = state.archivedItems.filter((id) => id !== toggledId);
        } else {
          // Archive
          state.archivedItems.push(toggledId);
        }
      })
      // Handle reorderGroups lifecycle: optimistically reorder items on pending
      .addCase(reorderGroups.pending, (state, action) => {
        const { oldIndex, newIndex } = action.meta.arg;
        state.items = arrayMove(state.items, oldIndex, newIndex);
      })
      .addCase(reorderGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(reorderGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
    // ... and cases for joinGroup, reorderGroups, updateGroup...
  },
});

export default groupsSlice.reducer;
