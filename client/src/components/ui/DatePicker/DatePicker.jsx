import { useState, useEffect, useRef } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import CustomSelectDropdown from "./CustomSelectDropdown";

export default function DatePicker({ date, setDate, labelDropdown=false}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultClassNames = getDefaultClassNames();
  const containerRef = useRef(null);

  const handleClickOutside = (event) => {
    if (containerRef.current && !containerRef.current.contains(event.target)) {
      setShowDatePicker(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full relative">
      <Button
        text={date ? date.toLocaleDateString() : "When"}
        className="max-w-full mt-1 h-10"
        onClick={() => setShowDatePicker(!showDatePicker)}
        style="fill"
        iconVisibility={true}
        size="full"
        icon={<ChevronDownIcon className="w-6" />}
      />
      <AnimatePresence mode="wait" initial={false}>
        {showDatePicker && (
          <motion.div
            className="absolute left-0 right-0 top-full z-50 mt-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            onKeyDown={(e) => e.key === "Escape" && setShowDatePicker(false)}
          >
            <DayPicker
              animate
              disabled={{ after: new Date() }}
              endMonth={new Date()}
              mode="single"
              selected={date}
              onSelect={(val) => {
                if (val) setDate(val);
                setShowDatePicker(false);
              }}
              components={{ Dropdown: CustomSelectDropdown }}
              captionLayout={labelDropdown ? "dropdown" : "label"}
              className="text-white justify-center"
              classNames={{
                today: "bg-[#BD9EFF]/60 rounded-full",
                selected: "outline outline-[#BD9EFF] rounded-lg text-white",
                root: `${defaultClassNames.root} p-3 rounded-xl flex shadow-2xl shadow-purple-500/20 bg-black/90 backdrop-blur-xl border border-white/10`,
                chevron: "fill-[#BD9EFF]",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}