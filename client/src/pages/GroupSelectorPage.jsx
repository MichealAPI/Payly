import Sidebar from "../components/ui/Sidebar/Sidebar";
import Navbar from "../components/ui/Navbar/Navbar";
import Wrapper from "../components/ui/Wrapper/Wrapper";
import Group from "../components/ui/Group/Group";

import { useState, useRef, useEffect, useMemo } from "react";
import Button from "../components/ui/Button/Button.jsx";
import {ChevronUpIcon, PlusIcon, UserPlusIcon } from "@heroicons/react/24/outline";

import GroupModal from "../components/ui/GroupModal/GroupModal.jsx";
import JoinGroupModal from "../components/ui/JoinGroupModal/JoinGroupModal.jsx";
import { toast } from "react-hot-toast";
import Observer from "../utils/observer.js";
import Spinner from "../components/ui/Spinner/Spinner.jsx";
import LoadingCard from "../components/ui/LoadingCard/LoadingCard.jsx";

import { useNavigate } from "react-router-dom";

import { restrictToParentElement } from "@dnd-kit/modifiers";

import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../components/ui/Group/SortableGroup.jsx";

const GroupSelectorPage = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [activeGroup, setActiveGroup] = useState(null); // New state for the active group
  const [archivedGroups, setArchivedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState("showall");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isJoinerOpen, setIsJoinerOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [spinnerVisible, setSpinnerVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      // Require the mouse to move by 10 pixels before activating
      // Allows for clicking buttons inside the card without triggering a drag
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      // Press and hold for 250ms with 5px tolerance to start dragging
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const draggedGroup = allGroups.find((g) => g._id === active.id);
    setActiveGroup(draggedGroup); // Set the active group being dragged
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    setActiveGroup(null); // Clear the active group after drag ends

    if (active && over && active.id !== over.id) {
      const oldIndex = allGroups.findIndex((g) => g._id === active.id);
      const newIndex = allGroups.findIndex((g) => g._id === over.id);

      const newAllGroups = arrayMove(allGroups, oldIndex, newIndex);

      // Optimistically update the UI
      setAllGroups(newAllGroups);

      // Persist the new order to the database
      try {
        const orderedGroupIds = newAllGroups.map((g) => g._id);
        const response = await fetch("/api/groups/order", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ orderedGroupIds }),
        });

        if (!response.ok) {
          throw new Error("Failed to save the new group order.");
        }

      } catch (error) {
        console.error(error);
        toast.error("Could not save new order. Reverting.");
        // If the API call fails, revert the state to the original order
        setAllGroups(allGroups);
      }
    }
  };

  const handleJoinGroup = async (inviteCode) => {
    setIsJoining(true);
    try {
      const response = await fetch('/api/invites/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to join group.');
      }

      // Check if the group is already in the list to avoid duplicates
      if (!allGroups.some(g => g._id === data.group._id)) {
        setAllGroups(prev => [data.group, ...prev]);
      }
      
      toast.success(data.message);
      setIsJoinerOpen(false);

    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsJoining(false);
    }
  };

  const isGroupsListEmpty = () => (
    allGroups.length === 0 && archivedGroups.length === 0
  );

  const fetchArchivedGroups = async () => {
    try {
      setSpinnerVisible(true);
      const response = await fetch("/api/groups/archived");
      if (!response.ok) {
        throw new Error("Failed to fetch archived groups");
      }
      const data = await response.json();
      setArchivedGroups(data);
    } catch (error) {
      console.error("Failed to fetch archived groups:", error);
      toast.error("Could not load archived groups.");
    } finally {
      setSpinnerVisible(false);
    }
  };

  const fetchGroups = async () => {
    try {
      const response = await fetch("/api/groups/list");
      if (!response.ok) {
        throw new Error("Failed to fetch groups");
      }
      const data = await response.json();
      setAllGroups(data);
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast.error("Could not load groups.");
    } finally {
      setLoading(false);
    }
  };

  // Handling Group card Actions
  const observer = useRef(new Observer());

  useEffect(() => {
    const handleObserver = (data) => {
      switch (data.type) {
        case "groupArchived":
          setArchivedGroups((prev) => [...prev, data.payload]);
          setSpinnerVisible(false);
          break;
        case "groupUnarchived":
          setArchivedGroups((prev) =>
            prev.filter((g) => g._id !== data.payload._id)
          );
          setSpinnerVisible(false);
          break;
        case "groupDeleted":
          setAllGroups((prev) => prev.filter((g) => g._id !== data.payload.groupId));
          setLoading(false);
          break;
        case "deletingGroup":
          setLoading(true);
          break;
        case "groupUpdated":
          // Replace the re-fetch with a direct state update
          setAllGroups((prev) =>
            prev.map((g) => (g._id === data.payload._id ? data.payload : g))
          );
          break;
        case "unarchivingGroup":
        case "archivingGroup":
          setSpinnerVisible(true);
          break;
        case "groupCreated":
          setAllGroups((prev) => [data.payload, ...prev]);
          setLoading(false);
          break;
        case "actionError":
          setLoading(false);
          setSpinnerVisible(false);
          break;
      }
    };

    observer.current.subscribe(handleObserver);

    async function fetchData() {
      // Fetch all data concurrently
      await Promise.all([
        fetchGroups(),
        fetchArchivedGroups(),
      ]);
    }

    fetchData();

    return () => {
      observer.current.unsubscribe(handleObserver);
    };
  }, []);

  // Effect to handle clicks outside the menu to close it on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredGroups = useMemo(() => {
    const archivedIds = new Set(archivedGroups.map((g) => g._id));
    let groupsToShow = [];

    switch (activeAction) {
      case "archived":
        groupsToShow = allGroups.filter((group) => archivedIds.has(group._id));
        break;
      case "running":
        groupsToShow = allGroups.filter((group) => !archivedIds.has(group._id));
        break;
      case "showall":
      default:
        groupsToShow = [...allGroups];
        break;
    }
    return groupsToShow;
  }, [activeAction, allGroups, archivedGroups]);

  const handlePrimaryButtonClick = () => {
    // Only toggle on smaller screens, larger screens are handled by hover
    if (window.innerWidth < 768) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <>
      <Wrapper>
        <Navbar
          title="Select a Group"
          actions={[
            { id: "showall", label: "Show all" },
            { id: "running", label: "Running" },
            { id: "archived", label: "Archived" },
          ]}
          activeAction={activeAction}
          actionsDropdown={true}
          onActionClick={setActiveAction}
        />
        <div className="w-full flex h-full flex-grow">
          {loading ? (
            <>
              {/* Desktop loading cards */}
              <div className="hidden md:flex flex-col md:flex-row md:flex-wrap gap-10 justify-center items-center p-10">
                {Array.from({ length: 12 }, (_, index) => (
                  <LoadingCard key={index} />
                ))}
              </div>

              {/* Mobile loading spinner */}
              <div className="md:hidden absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                <Spinner />
              </div>
            </>
          ) : filteredGroups.length > 0 ? (
            <>
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                modifiers={[restrictToParentElement]}
                onDragStart={handleDragStart} // Add drag start handler
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={filteredGroups.map((g) => g._id)}
                  disabled={isCreatorOpen || allGroups.length < 2}
                  strategy={rectSortingStrategy}
                >
                  <div className="grid p-10 items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-25 h-full w-full">
                    {filteredGroups.map((group) => (
                      <SortableGroup
                        key={group._id}
                        id={group._id}
                        group={group}
                        observer={observer.current}
                        className={`${allGroups.length < 2 ? "" : "cursor-pointer"} touch-action-none`}
                        isArchived={archivedGroups.some(
                          (g) => g._id === group._id
                        )}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay className="cursor-pointer">
                  {activeGroup ? (
                    <Group
                      className="shadow-lg transform scale-105 transition-transform duration-100"
                      icon={activeGroup.icon}
                      title={activeGroup.name}
                      members={activeGroup.members}
                      entryId={activeGroup._id}
                      description={activeGroup.description}
                    />
                  ) : null}
                </DragOverlay>
              </DndContext>
            </>
          ) : (
            <div className="flex justify-center flex-grow items-center flex-col">
              <img
                src="https://res.cloudinary.com/dzeah7jtd/image/upload/v1753263941/undraw_stars_5pgw_zapchg.svg"
                alt="No groups found"
                className="w-1/3 mb-5 animate-translate select-none pointer-events-none"
              />
              {activeAction === "archived" ? (
                <p className="text-white text-lg md:text-2xl">No archived groups found.</p>
              ) : (
                <p className="text-white md:text-2xl text-lg text-center">
                  No groups found, click on the "<b>+</b>" button<br/> in the bottom-right menu to create one!
                </p>
              )}
            </div>
          )}
        </div>
        {spinnerVisible && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black/30">
            <Spinner />
          </div>
        )}
      </Wrapper>

      {/* Floating Action Button Speed Dial */}
      <div
        ref={menuRef}
        className="group fixed z-50 bottom-10 right-10 flex flex-col items-end gap-4"
      >
        {/* Secondary Action Buttons */}
        <div
          className={`flex flex-col-reverse items-center gap-4 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 ${
            isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2 pointer-events-none md:pointer-events-auto"
          }`}
        >
          {/* Join Group Button */}
          <div className="group/join flex justify-between w-full items-center">
            <p className="whitespace-nowrap text-[#BD9EFF] mr-5 text-sm font-bold opacity-0 group-hover/join:opacity-100 transition-all duration-200 transform translate-x-[20px] group-hover/join:translate-x-0">
              Join Group
            </p>
            <Button
              size="minimal"
              iconVisibility={true}
              icon={<UserPlusIcon className="w-6" />}
              className="relative z-10"
              onClick={() => setIsJoinerOpen(true)}
            />
          </div>

          {/* Create Group Button */}
          <div className="group/create flex w-full items-center">
            <p className="whitespace-nowrap text-[#BD9EFF] mr-5 text-sm font-bold opacity-0 group-hover/create:opacity-100 transition-all duration-200 transform translate-x-[20px] group-hover/create:translate-x-0">
              Create Group
            </p>
            <Button
              size="minimal"
              iconVisibility={true}
              icon={<PlusIcon className="w-6" />}
              className="relative z-10"
              onClick={() => setIsCreatorOpen(true)}
            />
          </div>
        </div>

        {/* Main Trigger Button */}
        <div className="flex">
          {isGroupsListEmpty() && (activeAction === "showall" || activeAction === "running") &&
              <img
                src="https://res.cloudinary.com/dzeah7jtd/image/upload/v1753265161/drawn_arrow_zxhhdw.png"
                alt="No groups"
                className="w-10 h-10 absolute right-15 bottom-5 animate-translate select-none pointer-events-none"
              />
            }

          <Button
            size="minimal"
            iconVisibility={true}
            onClick={handlePrimaryButtonClick}
            icon={
              <ChevronUpIcon
                className={`w-6 transition-transform duration-400 md:group-hover:rotate-180 ${
                  isMenuOpen ? "rotate-180" : ""
                }`}
              />
            }
            className="relative z-10"
          />
        </div>

        <GroupModal
          isOpen={isCreatorOpen}
          setIsOpen={setIsCreatorOpen}
          onComplete={(newGroup) =>
            observer.current.notify({ type: "groupCreated", payload: newGroup })
          }
          setSpinnerVisible={setLoading}
        />

        <JoinGroupModal
          isOpen={isJoinerOpen}
          onClose={() => setIsJoinerOpen(false)}
          onJoin={handleJoinGroup}
          isJoining={isJoining}
        />
      </div>
    </>
  );
};

export default GroupSelectorPage;
