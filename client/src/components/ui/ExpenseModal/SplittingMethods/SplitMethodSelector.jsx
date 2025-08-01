import { Select } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { PercentBadgeIcon, EqualsIcon, PlusIcon } from '@heroicons/react/24/outline'

const splitMethods = [
    { id: 1, label: 'Equal', value: "equal", icon: <EqualsIcon className="h-6 w-6 text-white" /> },
    { id: 2, label: 'Fixed', value: "fixed", icon: <PlusIcon className="h-6 w-6 text-white" /> },
    { id: 3, label: 'Percentage', value: "percentage", icon: <PercentBadgeIcon className="h-6 w-6 text-white" /> },
]

const SplitMethodSelector = ({ setSplitMethod, splitMethod }) => {
    return (
        <div className="relative">
            <Select
                value={splitMethod}
                onChange={(e) => setSplitMethod(e.target.value)}
                className={clsx(
                    'block w-full appearance-none rounded-lg border-1 bg-black py-1.5 pr-8 pl-3 text-sm/6 text-white',
                    'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25',
                    '*:text-white'
                )}
            >
                {splitMethods.map((method) => (
                    <option key={method.id} value={method.value}>
                        {method.label}
                    </option>
                ))}
            </Select>
            <ChevronDownIcon
                className="group pointer-events-none absolute top-2.5 right-2.5 size-4 fill-white/60"
                aria-hidden="true"
            />
        </div>
    )
}

export default SplitMethodSelector