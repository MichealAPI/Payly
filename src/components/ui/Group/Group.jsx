import React from 'react';
import PropTypes from 'prop-types';
import styles from './Group.module.css';
import Button from '../Button/Button.jsx';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Card from '../Card/Card.jsx';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PencilIcon, ArchiveBoxXMarkIcon, TrashIcon, Square2StackIcon } from '@heroicons/react/24/solid';

// members is an array of objects with a name property
function formatMembers(members) {
    if (!members || members.length === 0) {
        return 'No members';
    }
    
    if (members.length === 1) {
        return members[0].name;
    }

    if (members.length === 2) {
        return `${members[0].name} and ${members[1].name}`;
    }

    if (members.length > 2) {
        return `${members[0].name}, ${members[1].name} and ${members.length - 2} others`;
    }
}

export const Group = ({ title, members, entryId, description, icon }) => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate(`/group/${entryId}`);
    };

    // Stop propagation to prevent parent onClick if it existed
    const handleSettingsClick = (e) => {
        e.stopPropagation();
    };

    const formattedMembers = formatMembers(members);

    return (
        <Card>
            <div className={styles.group}>
                <div className={styles.infoWrapper}>
                    <div className="flex md:flex-col">
                        <div className={styles.icon}>
                            <p>
                                {icon}
                            </p>
                        </div>

                        <div className="flex flex-col justify-center">
                            <div className={styles.title}>
                                <h3>{title}</h3>
                            </div>
                            
                            <div className={styles.members}>
                                <p>{formattedMembers}</p>
                            </div>
                        </div>
                    </div>

                    <div className={styles.description}>
                        <p>{description}</p>
                    </div>
                </div>
                <div className={styles.actionWrapper}>
                    <div className={styles.options} onClick={handleSettingsClick}>
                        <Menu>
                            <MenuButton className="inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:bg-purple-400/20">
                            
                                <Cog6ToothIcon className="size-4" />
                            </MenuButton>

                                <MenuItems
                                transition
                                anchor="bottom end"
                                className="w-30 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                                >
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20">
                                    <PencilIcon className="size-4 fill-white/30" />
                                    Edit
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20">
                                    <Square2StackIcon className="size-4 fill-white/30" />
                                    Duplicate
                                    </button>
                                </MenuItem>
                                <div className="my-1 h-px bg-white/5" />
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-purple-400/20">
                                    <ArchiveBoxXMarkIcon className="size-4 fill-white/30" />
                                    Archive
                                    </button>
                                </MenuItem>
                                <MenuItem>
                                    <button className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-red-500/30">
                                    <TrashIcon className="size-4 fill-white/30" />
                                    Delete
                                    </button>
                                </MenuItem>
                                </MenuItems>
                        </Menu>
                    </div>

                    <Button
                        text="Ciao"
                        size="minimal"
                        textVisibility={false}
                        iconVisibility={true}
                        icon={<ArrowRightIcon className="w-6" />}
                        onClick={handleNavigate}
                        style="fill"
                    />
                </div>
            </div>
        </Card>
    );
};

Group.propTypes = {
    icon: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
    })).isRequired,
    entryId: PropTypes.string.isRequired,
};

export default Group;