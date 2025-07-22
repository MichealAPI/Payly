import Sidebar from "../components/ui/Sidebar/Sidebar";
import Navbar from "../components/ui/Navbar/Navbar";
import Wrapper from "../components/ui/Wrapper/Wrapper";
import Group from "../components/ui/Group/Group";

import { useState, useRef, useEffect, useMemo } from "react";
import Button from "../components/ui/Button/Button.jsx";
import { PlusIcon, UserPlusIcon } from "@heroicons/react/24/outline";

import NewGroupModal from "../components/ui/NewGroupModal/NewGroupModal.jsx";
import { toast } from "react-hot-toast";
import Observer from "../utils/observer.js";

const GroupSelectorPage = () => {
  const [allGroups, setAllGroups] = useState([]);
  const [archivedGroups, setArchivedGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAction, setActiveAction] = useState("showall");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const menuRef = useRef(null);

  const observer = useRef(new Observer());
  observer.current.subscribe((data) => {
    switch (data) {
        case "groupArchived":
            fetchArchivedGroups();
            break;
    }
  })

  const fetchArchivedGroups = async () => {
    try {
        const response = await fetch("/api/groups/archived");
        if (!response.ok) {
            throw new Error("Failed to fetch archived groups");
        }
        const data = await response.json();
        setArchivedGroups(data);
    } catch (error) {
        console.error("Failed to fetch archived groups:", error);
        toast.error("Could not load archived groups.");
    }
};



  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch all groups and archived groups in parallel
      const groupsResponse = await fetch("/api/groups/list");

      if (!groupsResponse.ok) {
        throw new Error("Network response was not ok");
      }

      const groupsData = await groupsResponse.json();

      setAllGroups(groupsData);
      await fetchArchivedGroups();
    } catch (error) {
      console.error("Failed to fetch groups:", error);
      toast.error("Could not load your groups.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
    switch (activeAction) {
      case "archived":
        // Find the full group object in allGroups for each archived ID
        return allGroups.filter((group) => archivedIds.has(group._id));
      case "running":
        return allGroups.filter((group) => !archivedIds.has(group._id));
      case "showall":
      default:
        return allGroups;
    }
  }, [activeAction, allGroups, archivedGroups]);

  const handlePrimaryButtonClick = () => {
    // Only toggle on smaller screens, larger screens are handled by hover
    if (window.innerWidth < 768) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  return (
    <>
      <Sidebar />
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

        <div className="p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-white">Loading groups...</p>
          ) : filteredGroups.length > 0 ? (
            filteredGroups.map((group) => (
              <Group
                className="hover:-translate-y-[2px] transition-all duration-300 hover:shadow-[0px_0px_20px_2px_rgba(198,172,255,0.35)]"
                key={group._id}
                icon={group.icon}
                title={group.name}
                members={group.members}
                entryId={group._id}
                description={group.description}
                onActionComplete={fetchData}
                observer={observer.current}
              />
            ))
          ) : (
            <p className="text-white col-span-full text-center">
              No groups found for this filter.
            </p>
          )}
        </div>
      </Wrapper>

      {/* Floating Action Button Speed Dial */}
      <div
        ref={menuRef}
        className="group fixed z-50 bottom-10 right-10 flex flex-col items-end gap-4"
      >
        {/* Secondary Action Buttons */}
        <div
          className={`flex flex-col-reverse items-center gap-4 transition-all duration-300 
          md:opacity-0 md:group-hover:opacity-100 md:translate-y-2 md:group-hover:translate-y-0
          ${
            isMenuOpen
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2 pointer-events-none md:pointer-events-auto"
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
              onClick={() => console.log("Join Group clicked")}
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
        <Button
          size="minimal"
          iconVisibility={true}
          onClick={handlePrimaryButtonClick}
          icon={
            <PlusIcon
              className={`w-6 transition-transform duration-300 md:group-hover:rotate-45 ${
                isMenuOpen ? "rotate-45" : ""
              }`}
            />
          }
          className="relative z-10"
        />

        <NewGroupModal
          isOpen={isCreatorOpen}
          setIsOpen={setIsCreatorOpen}
          onGroupCreated={fetchData}
        />
      </div>
    </>
  );
}

export default GroupSelectorPage;