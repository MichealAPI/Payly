import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Group from "./Group";

const SortableGroup = ({ id, group, observer, isArchived }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 'auto',
    opacity: isDragging ? 0 : 1,
  };

  return (
    <div ref={setNodeRef} className="h-full cursor-pointer" style={style} {...attributes} {...listeners}>
      <Group
        className="hover:-translate-y-[2px] transition-all duration-300 hover:shadow-[0px_0px_20px_2px_rgba(198,172,255,0.35)]"
        key={group._id}
        icon={group.icon}
        title={group.name}
        members={group.members}
        entryId={group._id}
        description={group.description}
        observer={observer}
        isArchived={isArchived}
      />
    </div>
  );
};

export default SortableGroup;