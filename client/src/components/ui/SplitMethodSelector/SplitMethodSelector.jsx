import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState, useMemo } from 'react'
import { PercentBadgeIcon, EqualsIcon, PlusIcon } from '@heroicons/react/24/outline'

const splitMethods = [
    { id: 1, name: 'Equal', icon: <EqualsIcon className="h-6 w-6 text-white" /> },
    { id: 2, name: 'Fixed', icon: <PlusIcon className="h-6 w-6 text-white" /> },
    { id: 3, name: 'Percentage', icon: <PercentBadgeIcon className="h-6 w-6 text-white" /> },
]

const SplitMethodSelector = ({ setSplitMethod, splitMethod }) => {
    const [query, setQuery] = useState('')
    const [selectedId, setSelectedId] = useState(
        splitMethods.find((method) => method.name === splitMethod)?.id || splitMethods[0].id
    )

    const selected = useMemo(() => splitMethods.find((method) => method.id === selectedId), [selectedId])

    const filteredMethods =
        query === ''
            ? splitMethods
            : splitMethods.filter((method) => method.name.toLowerCase().includes(query.toLowerCase()))

    return (
        <>
            <Combobox value={selected} onChange={(method) => setSelectedId(method.id)} onClose={() => setQuery('')}>
                <div className="relative">
                    <ComboboxInput
                        className={clsx(
                            'w-full rounded-lg border-1 bg-black py-1.5 pr-8 pl-3 text-sm/6 text-white',
                            'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                        )}
                        displayValue={(method) => method?.name}
                        onChange={(event) => setQuery(event.target.value) && setSplitMethod(event.target.value)}
                    />
                    <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                        <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                    </ComboboxButton>
                </div>

                <ComboboxOptions
                    anchor="bottom"
                    transition
                    className={clsx(
                        'w-(--input-width) h-50 rounded-xl border no-scrollbar shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)] bg-black p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                        'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                    )}
                >
                    {filteredMethods.map((method) => (
                        <ComboboxOption
                            key={method.id}
                            value={method}
                            className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-[#BD9EFF]/10"
                        >
                            <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                            <div className="flex gap-2 items-center w-full">
                                {method.icon}
                                <span className="text-sm/6 text-white font-bold">{method.name}</span>
                            </div>
                        </ComboboxOption>
                    ))}
                </ComboboxOptions>
            </Combobox>
        </>
    )
}

export default SplitMethodSelector;