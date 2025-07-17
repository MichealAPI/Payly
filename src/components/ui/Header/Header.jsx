import PropTypes from "prop-types";
import Card from "../Card/Card.jsx";
import styles from "./Header.module.css";
import { UserIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { PencilIcon, ArchiveBoxXMarkIcon, TrashIcon, Square2StackIcon } from '@heroicons/react/24/solid';


const Header = ({title, membersCount, description, icon}) => {
    return (
        <Card className="md:border-b-[#6928F3] md:border-solid md:border-b-2" bgHiddenSm={true}>
            <div className={styles.header}>
                <div className={styles.content}>
                    <div className={styles.title}>
                        <div className={styles.icon}>
                            <p>{icon}</p>
                        </div>
                        <h1>{title}</h1>
                    </div>

                    <div className={styles.description}>
                        <p>{description}</p>
                    </div>

                    <div className={styles.members}>
                        <UserIcon className={styles.icon} />
                        <div className={styles.count}>
                            <p>{membersCount}</p>
                        </div>

                    </div>
                </div>

                <div className={styles.settings}>
                    <Menu>
                        <MenuButton className="inline-flex items-center gap-2 rp-1 text-sm/6 font-semibold text-white focus:not-data-focus:outline-none data-focus:outline data-focus:outline-white data-hover:text-purple-400/20 cursor-pointer">
                            <Cog6ToothIcon className={styles.icon} />
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

            </div>
        </Card>
    );
}

Header.propTypes = {
    title: PropTypes.string.isRequired,
    membersCount: PropTypes.number.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired
};

export default Header;