import React, { Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { ChevronDownIcon, CheckIcon } from "@heroicons/react/20/solid";

export function CustomSelectDropdown(props) {
  const { options, value, onChange, className, ...rest } = props;

  const handleValueChange = (newValue) => {
    if (onChange) {
      onChange({ target: { value: newValue } });
    }
  };

  const selectedOption = options?.find(
    (o) => String(o?.value) === String(value)
  );

  return (
    <Listbox value={value} onChange={handleValueChange}>
      <div className="relative">
        <ListboxButton
          {...rest}
          aria-label={props["aria-label"] || props.label}
          className={`relative w-full cursor-default rounded-lg border bg-black py-1.5 pr-8 pl-3 text-left text-sm/6 text-white focus:outline-none focus:ring-2 focus:ring-white/75 ${className || ""}`}
        >
          <span className="block truncate">{selectedOption?.label ?? "Select"}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDownIcon className="size-4 fill-white/60" aria-hidden="true" />
          </span>
        </ListboxButton>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <ListboxOptions className="absolute z-10 mt-1 max-h-60 min-w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg ring-1 ring-white/10 focus:outline-none sm:text-sm">
            {options?.map((option) => (
              <ListboxOption
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className={({ active, disabled }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? "bg-gray-800 text-white" : "text-gray-300"
                  } ${disabled ? "opacity-50" : ""}`
                }
              >
                {({ selected }) => (
                  <>
                    <span className={`block truncate ${selected ? "font-medium" : "font-normal"}`}>
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-white">
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </ListboxOption>
            ))}
          </ListboxOptions>
        </Transition>
      </div>
    </Listbox>
  );
}

export default CustomSelectDropdown;