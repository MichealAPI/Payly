import { Combobox, ComboboxButton, ComboboxInput, ComboboxOption, ComboboxOptions } from '@headlessui/react'
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/20/solid'
import clsx from 'clsx'
import { useState, useMemo } from 'react'
import currenciesData from '../../../assets/currencies.json'

const currencies = currenciesData;

const CurrencySelector = ({ setCurrency, currency }) => {
    const [query, setQuery] = useState('');

    const filteredCurrencies = useMemo(() => {
        return query === ''
            ? currencies
            : currencies.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()));
    }, [query]);

    return (
        <Combobox
            value={currency}
            onChange={(selectedCurrency) => {
                if (selectedCurrency) {
                    setCurrency(selectedCurrency);
                }
            }}
            onClose={() => setQuery('')}
        >
            <div className="relative">
                <ComboboxInput
                    className={clsx(
                        'w-full rounded-lg border-1 bg-black py-1.5 pr-8 pl-3 text-sm/6 text-white',
                        'focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25'
                    )}
                    displayValue={(c) => c?.name || ''}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Select currency"
                />
                <ComboboxButton className="group absolute inset-y-0 right-0 px-2.5">
                    <ChevronDownIcon className="size-4 fill-white/60 group-data-hover:fill-white" />
                </ComboboxButton>
            </div>

            <ComboboxOptions
                anchor="bottom"
                transition
                className={clsx(
                    'w-[var(--input-width)] max-h-60 overflow-y-auto rounded-xl border no-scrollbar shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)] bg-black p-1 [--anchor-gap:--spacing(1)] empty:invisible',
                    'transition duration-100 ease-in data-leave:data-closed:opacity-0'
                )}
            >
                {filteredCurrencies.map((currency) => (
                    <ComboboxOption
                        key={currency.id}
                        value={currency}
                        className="group flex cursor-default items-center gap-2 rounded-lg px-3 py-1.5 select-none data-focus:bg-[#BD9EFF]/10"
                    >
                        <CheckIcon className="invisible size-4 fill-white group-data-selected:visible" />
                        <div className="text-sm/6 text-white font-bold flex w-full items-center">
                            <img
                                src={`https://flagpedia.net/data/${currency.section}/w20/${currency.countryCode}.webp`}
                                className="h-3 w-5 mr-2"
                                alt={currency.name}
                            />
                            {currency.name}
                        </div>
                    </ComboboxOption>
                ))}
            </ComboboxOptions>
        </Combobox>
    );
};

export default CurrencySelector;