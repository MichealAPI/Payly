import { useState, Fragment } from "react";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/style.css";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../Button/Button";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function DatePicker({ date, setDate }) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const defaultClassNames = getDefaultClassNames();

  return (
    <div className="w-full">
      <Button
        text={date ? date.toLocaleDateString() : "When"}
        className="max-w-full mt-1 h-10"
        onClick={() => setShowDatePicker(!showDatePicker)}
        style="fill"
        iconVisibility={true}
        size="full"
        icon={<ChevronDownIcon className="w-6" />}
      />
      <div className="mt-4">
        <AnimatePresence mode="wait">
          {showDatePicker && (
            <motion.div
              initial={{ opacity: 0.65, maxHeight: 0 }}
              animate={{ opacity: 1, maxHeight: 400 }}
              exit={{ opacity: 0, maxHeight: 0 }}
              transition={{ duration: 0.3 }}
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
                  root: `${defaultClassNames.root} p-3 rounded-xl flex`,
                  chevron: "fill-[#BD9EFF]",
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}