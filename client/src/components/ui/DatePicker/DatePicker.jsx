import { useState } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function DatePicker({ date, setDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultClassNames = getDefaultClassNames();

  return (
    <div className="w-full relative">
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
              className="text-white justify-center"
              classNames={{
                today: "bg-[#BD9EFF]/40 rounded-full",
                selected: "outline outline-[#BD9EFF] rounded-lg text-white",
                root: `${defaultClassNames.root} p-3 rounded-xl flex shadow-2xl shadow-purple-500/20 bg-black/70 backdrop-blur-xl border border-white/10`,
                chevron: "fill-[#BD9EFF]",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}