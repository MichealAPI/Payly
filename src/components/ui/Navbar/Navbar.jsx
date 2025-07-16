import React from 'react';
import styles from './Navbar.module.css';
import PropTypes from 'prop-types';
import { BellIcon, Bars3Icon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';

const Navbar = ({title, actions, activeAction, onActionClick, actionsDropdown}) => {
    
    const getActiveActionLabel = () => {
        if (actions && activeAction) {
            const active = actions.find(action => action.id === activeAction);
            return active ? active.label : 'Options';
        }
        return 'Options';
    };
    
    return (
        <nav className={styles.navbar}>
            <div className={`${styles.title} order-1 md:order-0 flex flex-col justify-center`}>
                <p className={`${actionsDropdown ? 'hidden md:block' : ''}`}>
                    {title || 'No title provided'} 
                </p>


                {actionsDropdown && <div className="md:hidden w-full flex justify-center z-40">
                    <Menu>
                        <MenuButton className="inline-flex group items-center gap-2 rounded-md bg-transparent px-4 py-2 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-gray-700 data-open:bg-gray-700">
                            {getActiveActionLabel()}
                            <ChevronDownIcon className="size-4 transition-transform duration-150 group-data-[open]:rotate-180" />
                        </MenuButton>

                        <MenuItems
                        transition
                        anchor="bottom"
                        className="w-52 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                        >
                            {actions && actions.map((action) => (
                                <MenuItem key={action.id}>
                                    <button 
                                        onClick={() => onActionClick && onActionClick(action.id)}
                                        className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10"
                                    >
                                        {action.label}
                                    </button>
                                </MenuItem>
                            ))}
                        </MenuItems>
                    </Menu>
                </div>}
            </div>

            <div className={`hidden md:flex ${styles.actionWrapper}`}>
                {actions && actions.map((action) => (
                    <div 
                        key={action.id} 
                        className={`${styles.action} ${activeAction === action.id ? styles.active : ''}`}
                        onClick={() => onActionClick && onActionClick(action.id)}
                    >
                        <p>
                            {action.label}
                        </p>
                    </div>
                ))}
            </div>


            <div className={`md:hidden order-2`}>
            
                <Menu>
                    <MenuButton className="cursor-pointer group inline-flex items-center gap-2 rounded-md outline-white outline-1 px-3 py-1.5 text-sm/6 font-semibold text-white">
                        <Bars3Icon className="size-4 fill-white/60 transition-transform duration-150 group-data-[open]:rotate-90" />
                    </MenuButton>

                    <MenuItems
                    transition
                    anchor="bottom end"
                    className="w-32 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                    >
                        <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                            <BellIcon className="size-4" />
                            Edit
                            </button>
                        </MenuItem>
                        <MenuItem>
                            <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                            <BellIcon className="size-4" />
                            Duplicate
                            </button>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>

            <div className="flex gap-4 items-center justify-center order-0 md:order-3 flex-row-reverse md:flex-row">
                <div className={styles.notification}>
                    <BellIcon className="w-6" />
                </div>

                <div className={styles.profile}>
                    <div className={styles.icon}>
                    </div>
                </div>
            </div>

        </nav>
    );
};

Navbar.propTypes = {
    title: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        label: PropTypes.string.isRequired,
    })),
    activeAction: PropTypes.string,
    onActionClick: PropTypes.func,
    actionsDropdown: PropTypes.bool,
}

export default Navbar;