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
  paidById,
}) {
  const [displayValue, setDisplayValue] = useState("0");
  const isOverLimit = useRef(false);
  const maxValue = splitMethod === "fixed" ? 99999999 : 100; // Set max value for fixed entries

  // Keep local display value in sync with parent state (preserve comma formatting)
  useEffect(() => {
    const next = amount ?? 0;
    const current = parseFloat((displayValue || "0").replace(",", "."));
    if (!Number.isNaN(next) && next !== current) {
      // stringify with up to 2 decimals but keep integer if exact
  const nextStr = Number(next).toLocaleString("it-IT", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
        useGrouping: false,
      });
  setDisplayValue(nextStr);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amount]);

  // Ensure the payer cannot be disabled
  useEffect(() => {
    if (paidById === participantId && !isEnabled) {
      setIsEnabled(true);
    }
  }, [paidById, participantId, isEnabled, setIsEnabled]);

  const handleInputChange = (e) => {
    const rawValue = e.target.value;
    // Allow only numbers and a single comma
    let sanitizedValue = rawValue.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");

    // Remove leading zero if starting to type an integer
    if (sanitizedValue.length > 1 && sanitizedValue.startsWith("0") && !sanitizedValue.startsWith("0,")) {
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
          toast.error("Amount cannot exceed " + String(maxValue).length + " figures", {
            position: "bottom-center",
          });
          isOverLimit.current = true;
        }
        // Do not update the display value to prevent typing over the limit
        return;
      }

      // Reset the limit flag if the number is valid again
      isOverLimit.current = false;
      if (numericValue !== amount) {
        setAmount(numericValue);
      }
    } else if (sanitizedValue === "0") {
      if (amount !== 0) setAmount(0);
    }

    setDisplayValue(sanitizedValue);
  };

  const [integerPart, decimalPart] = (displayValue || "0").split(",");

  return (
    <Field
      className={`flex items-center gap-2 rounded-lg transition-colors duration-200 p-2 overflow-hidden ${
        !isEnabled ? "bg-light-purple/10" : " bg-light-purple/20"
      }`}
    >
      <Checkbox
        checked={isEnabled}
        onChange={(val) => {
          if (paidById === participantId && !val) {
            toast.error("Cannot disable the participant who paid for the expense", {
              position: "bottom-center",
            });
            return;
          }

          setIsEnabled(val);
        }}
        disabled={paidById === participantId}
        className={`group size-6 rounded-md bg-tertiary/40 p-1 ring-1 ring-white/15 ring-inset focus:not-data-focus:outline-none data-checked:bg-tertiary data-focus:outline data-focus:outline-offset-2 data-focus:outline-white
          ${paidById === participantId ? "cursor-not-allowed opacity-30" : ""}`}
      >
        <CheckIcon className="hidden w-4 text-primary group-data-checked:block stroke-4" />
      </Checkbox>
      <p className={`flex-1 text-base text-secondary ${!isEnabled ? "opacity-50 select-none" : ""}`}>
        {participantName}
      </p>

      <AnimatePresence mode="wait">
        {isEnabled && splitMethod !== "equal" && (
          <motion.div
            key={splitMethod}
            initial={{ opacity: 0.2, scale: 0.95, y: -0.5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -0.5 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="relative"
          >
            <div
              className={clsx(
                "flex items-baseline justify-end rounded-lg border-none bg-white/5 py-1.5 pl-8 pr-3 text-right text-sm/6 text-secondary",
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
                "absolute inset-0 block w-full h-full rounded-lg bg-primary outline-[1.5px] outline-secondary/20 text-secondary caret-white pr-3 pl-8 text-right", // Make input invisible but functional
                "border-none focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
              )}
            />
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-secondary/50">
              {splitMethod === "fixed" ? currencySymbol : "%"}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </Field>
  );
}
