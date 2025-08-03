import { Listbox, ListboxButton, ListboxOption, ListboxOptions, Transition } from '@headlessui/react'
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { PercentBadgeIcon, EqualsIcon, PlusIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'

const splitMethods = [
    { id: 1, label: 'Equal', value: "equal", icon: <EqualsIcon className="h-5 w-5" /> },
    { id: 2, label: 'Fixed', value: "fixed", icon: <PlusIcon className="h-5 w-5" /> },
    { id: 3, label: 'Percentage', value: "percentage", icon: <PercentBadgeIcon className="h-5 w-5" /> },
]

const SplitMethodSelector = ({ setSplitMethod, splitMethod }) => {
    const selectedMethod = splitMethods.find(m => m.value === splitMethod) || splitMethods[0];

    return (
        <Listbox value={splitMethod} onChange={setSplitMethod}>
            <div className="relative">
                <ListboxButton
                    className={clsx(
                        'relative w-full cursor-default rounded-lg border-1 bg-black py-1.5 pr-10 pl-3 text-left text-sm/6 text-white',
                        'focus:outline-none focus:ring-2 focus:ring-white/75'
                    )}
                >
                    <span className="flex items-center gap-2">
                        {selectedMethod.icon}
                        <span className="block truncate">{selectedMethod.label}</span>
                    </span>
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                        <ChevronDownIcon className="size-4 fill-white/60" aria-hidden="true" />
                    </span>
                </ListboxButton>
                <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-black py-1 text-base shadow-lg ring-1 ring-white/10 focus:outline-none sm:text-sm">
                        {splitMethods.map((method) => (
                            <ListboxOption
                                key={method.id}
                                className={({ active }) =>
                                    `relative cursor-default select-none py-2 pl-10 pr-4 ${active ? 'bg-gray-700 text-white' : 'text-gray-300'}`
                                }
                                value={method.value}
                            >
                                {({ selected }) => (
                                    <>
                                        <span className={`flex items-center gap-2 truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                                            {method.icon}
                                            {method.label}
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
    )
}

export default SplitMethodSelector