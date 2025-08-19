import Sidebar from "../components/ui/Sidebar/Sidebar";
import Navbar from "../components/ui/Navbar/Navbar";
import Wrapper from "../components/ui/Wrapper/Wrapper";
import Group from "../components/ui/Group/Group";

import { useState, useRef, useEffect, useMemo } from "react";
import Button from "../components/ui/Button/Button.jsx";
import {
  ChevronUpIcon,
  PlusIcon,
  UserPlusIcon,
} from "@heroicons/react/24/outline";

import GroupModal from "../components/ui/GroupModal/GroupModal.jsx";
import JoinGroupModal from "../components/ui/JoinGroupModal/JoinGroupModal.jsx";
import { toast } from "react-hot-toast";
import Spinner from "../components/ui/Spinner/Spinner.jsx";
import LoadingCard from "../components/ui/LoadingCard/LoadingCard.jsx";

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
  SortableContext,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import SortableGroup from "../components/ui/Group/SortableGroup.jsx";
import {
  fetchArchivedGroups,
  fetchGroups,
  joinGroup,
  reorderGroups,
} from "../features/groups/groupsSlice.js";
import { useDispatch, useSelector } from "react-redux";

const GroupSelectorPage = () => {
  const dispatch = useDispatch();

  const {
    error,
    items: allGroups,
    archivedItems,
    isLoading,
  } = useSelector((state) => state.groups);

  // --- Keep ONLY local UI state ---
  const [activeGroup, setActiveGroup] = useState(null);
  const [activeAction, setActiveAction] = useState("all");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [isJoinerOpen, setIsJoinerOpen] = useState(false);
  const [isJoining, setIsJoining] = useState(false); // For local button spinner
  const menuRef = useRef(null);

  // initial fetch
  useEffect(() => {
    dispatch(fetchGroups());
    dispatch(fetchArchivedGroups());
  }, [dispatch]);

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

      dispatch(reorderGroups({ oldIndex, newIndex, allGroups }))
        .unwrap()
        .catch((error) => {
          console.error("Reorder failed:", error);
          toast.error("Failed to reorder groups.");
        });
    }
  };

  const handleJoinGroup = async (inviteCode) => {
    setIsJoining(true);
    try {
      const result = await dispatch(joinGroup(inviteCode)).unwrap();
      toast.success("Successfully joined group!", { position: "bottom-center" });
      
      dispatch(fetchGroups());
      dispatch(fetchArchivedGroups());

      setIsJoinerOpen(false);
    } catch (error) {
      toast.error(error.message || "Failed to join group.");
    } finally {
      setIsJoining(false);
    }
  };

  const isGroupsListEmpty = () =>
    allGroups.length === 0 && archivedItems.length === 0;

  useEffect(() => {
    if (error) {
      toast.error(error.message || "An unknown error occurred.");
    }
  }, [error]);

  // Effect to handle clicks outside the menu to close it on mobile
  useEffect(() => {
    const isClickOutside = (event) => {
      const el = menuRef.current;
      if (!el) return false;
  
      const path = typeof event.composedPath === "function" ? event.composedPath() : [];
      if (path.length > 0) {
        return !path.includes(el);
      }
      return !el.contains(event.target);
    };
  
    const handlePointerDown = (event) => {
      if (isClickOutside(event)) {
        setIsMenuOpen(false);
      }
    };
  
    // Pointer events cover mouse + touch. Capture phase improves reliability.
    document.addEventListener("pointerdown", handlePointerDown, true);
  
    // Older Safari fallback
    document.addEventListener("touchstart", handlePointerDown, true);
  
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("touchstart", handlePointerDown, true);
    };
  }, []);

  const filteredGroups = useMemo(() => {
    const archivedIds = new Set((archivedItems || []).map((id) => id.toString()));

    switch (activeAction) {
      case "archived":
        return allGroups.filter((g) => archivedIds.has(g._id?.toString()));
      case "running":
        return allGroups.filter((g) => !archivedIds.has(g._id?.toString()));
      case "all":
      default:
        return [...allGroups];
    }
  }, [activeAction, allGroups, archivedItems]);

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
          isBackButtonEnabled={false}
          title="Select a Group"
          actions={[
            { id: "all", label: "All" },
            { id: "running", label: "Running" },
            { id: "archived", label: "Archived" },
          ]}
          activeAction={activeAction}
          actionsDropdown={true}
          onActionClick={setActiveAction}
        />
        <div className="w-full flex h-full flex-grow bg-primary">
          {isLoading ? (
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
                  <div className="grid p-5 mt-2 md:mt-0 md:p-10 items-center grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-5 md:gap-y-10 gap-x-25 h-full w-full">
                    {filteredGroups.map((group) => (
                      <SortableGroup
                        key={group._id}
                        id={group._id}
                        group={group}
                        className={`${allGroups.length < 2 ? "" : "cursor-pointer"
                          } touch-action-none`}
                        isArchived={(archivedItems || []).some(
                          (id) => id?.toString() === group._id?.toString()
                        )}
                      />
                    ))}
                  </div>
                </SortableContext>

                <DragOverlay className="cursor-pointer">
                  {activeGroup ? (
                    <Group
                      className="transform scale-105 transition-transform duration-100 "
                      groupData={activeGroup}
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
                <p className="text-secondary text-lg md:text-2xl">
                  No archived groups found.
                </p>
              ) : (
                <p className="text-secondary md:text-2xl text-lg text-center">
                  No groups found, click on the "<b>+</b>" button
                  <br /> in the bottom-right menu to create one!
                </p>
              )}
            </div>
          )}
        </div>
        {isLoading && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-primary/30">
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
          className={`flex flex-col-reverse items-center gap-4 transition-all duration-300 md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0 ${isMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2 pointer-events-none md:pointer-events-auto"
            }`}
        >
          {/* Join Group Button */}
          <div className="group/join flex justify-between w-full items-center">
            <p className="whitespace-nowrap text-light-purple mr-5 text-sm font-bold opacity-0 group-hover/join:opacity-100 transition-all duration-200 transform translate-x-[20px] group-hover/join:translate-x-0">
              Join Group
            </p>
            <Button
              size="minimal"
              iconVisibility={true}
              icon={<UserPlusIcon className="w-6" />}
              className="relative z-10 text-white"
              onClick={() => {
                setIsMenuOpen(false);
                setIsJoinerOpen(true)
              }
              }
            />
          </div>

          {/* Create Group Button */}
          <div className="group/create flex w-full items-center">
            <p className="whitespace-nowrap text-light-purple mr-5 text-sm font-bold opacity-0 group-hover/create:opacity-100 transition-all duration-200 transform translate-x-[20px] group-hover/create:translate-x-0">
              Create Group
            </p>
            <Button
              size="minimal"
              iconVisibility={true}
              icon={<PlusIcon className="w-6" />}
              className="relative z-10 text-white"
              onClick={() => {
                setIsMenuOpen(false);
                setIsCreatorOpen(true)
              }
              }
            />
          </div>
        </div>

        {/* Main Trigger Button */}
        <div className="flex">
          {isGroupsListEmpty() &&
            (activeAction === "all" || activeAction === "running") && (
              <img
                src="https://res.cloudinary.com/dzeah7jtd/image/upload/v1753265161/drawn_arrow_zxhhdw.png"
                alt="No groups"
                className="w-10 h-10 absolute right-15 bottom-5 animate-translate select-none pointer-events-none"
              />
            )}

          <Button
            size="minimal"
            iconVisibility={true}
            onClick={handlePrimaryButtonClick}
            icon={
              <PlusIcon
                className={`w-6 text-white transition-transform duration-400 md:group-hover:rotate-45 ${isMenuOpen ? "rotate-45" : ""
                  }`}
              />
            }
            className="relative z-10"
          />
        </div>

        <GroupModal isOpen={isCreatorOpen} setIsOpen={setIsCreatorOpen} />

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
