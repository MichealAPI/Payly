import { Checkbox, Field, Input } from "@headlessui/react";
import { CheckIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function SplitField({
  setIsEnabled,
  isEnabled,
  amount,
  setAmount,
  participantName,
  participantId,
  currencySymbol,
  splitMethod,
  expenseToEdit = null,
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const isOverLimit = useRef(false);
  const maxValue = splitMethod === "fixed" ? 99999999 : 100; // Set max value for fixed entries

  console.log(amount, "amount in split field");

  useEffect(() => {
    // Keep local display value in sync with parent state
    const valueStr = String(amount);
    if (parseFloat(valueStr) !== parseFloat(displayValue.replace(",", "."))) {
      setDisplayValue(valueStr.replace(".", ","));
    }
  }, [amount]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    // Allow only numbers and a single comma
    let sanitizedValue = rawValue
      .replace(/[^0-9,]/g, "")
      .replace(/,(?=.*,)/g, "");

    // Remove leading zero if starting to type an integer
    if (
      sanitizedValue.length > 1 &&
      sanitizedValue.startsWith("0") &&
      !sanitizedValue.startsWith("0,")
    ) {
      sanitizedValue = sanitizedValue.substring(1);
    }

    // Prevent more than 2 decimal places
    const parts = sanitizedValue.split(",");
    if (parts[1] && parts[1].length > 2) {
      return; // Do not update if more than 2 decimal places are entered
    }

    // Prevent deleting the last '0'
    if (sanitizedValue === "") {
      sanitizedValue = "0";
    }

    // Convert to number for validation
    const numericValue = parseFloat(sanitizedValue.replace(",", "."));

    if (!isNaN(numericValue)) {
      if (numericValue > maxValue) {
        // Prevent value from exceeding the limit and show toast only once
        if (!isOverLimit.current) {
          toast.error(
            "Amount cannot exceed " + String(maxValue).length + " figures",
            {
              position: "bottom-center",
            }
          );
          isOverLimit.current = true;
        }
        // Do not update the display value to prevent typing over the limit
        return;
      }

      // Reset the limit flag if the number is valid again
      isOverLimit.current = false;
      setAmount(numericValue);
    } else if (sanitizedValue === "0") {
      setAmount(0);
    }

    setDisplayValue(sanitizedValue);
  };

  const [integerPart, decimalPart] = displayValue.split(",");

  console.log("Split type:", splitMethod);

  return (
    <Field
      className={`flex items-center gap-2 rounded-lg transition-colors duration-200 p-2 overflow-hidden ${
        !isEnabled ? "bg-[#BD9EFF]/10" : " bg-[#BD9EFF]/20"
      }`}
    >
      <Checkbox
        checked={isEnabled}
        onChange={setIsEnabled}
        className="group size-6 rounded-md bg-white/10 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-white data-focus:outline data-focus:outline-offset-2 data-focus:outline-white"
      >
        <CheckIcon className="hidden w-4 text-black group-data-checked:block stroke-3" />
      </Checkbox>
      <p
        className={`flex-1 text-sm text-white ${
          !isEnabled ? "opacity-50 select-none" : ""
        }`}
      >
        {participantName}
      </p>

      <AnimatePresence mode="wait">
        {isEnabled && splitMethod !== "equal" && (
          <motion.div
            key={splitMethod}
            initial={{ opacity: .2, scale: 0.95, y: -0.5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -0.5 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div
              className={clsx(
                "flex items-baseline justify-end rounded-lg border-none bg-white/5 py-1.5 pl-8 pr-3 text-right text-sm/6 text-white",
                "max-w-[200px] min-w-[70px] box-border"
              )}
            >
              <span className="text-sm">{integerPart}</span>
              {decimalPart !== undefined && (
                <>
                  <span className="text-sm">,</span>
                  <span className="text-xs">{decimalPart}</span>
                </>
              )}
            </div>
            <Input
              disabled={!isEnabled}
              type="text" // Use text for custom formatting
              inputMode={splitMethod === "percentage" ? "numeric" : "decimal"} // Show decimal keyboard on mobile
              value={displayValue}
              onChange={handleInputChange}
              className={clsx(
                "absolute inset-0 block w-full h-full rounded-lg bg-transparent text-transparent caret-white pr-3 pl-8 text-right", // Make input invisible but functional
                "border-none focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              )}
            />
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-white/50">
              {splitMethod === "fixed" ? currencySymbol : "%"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Field>
  );
}
