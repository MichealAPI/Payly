import React from 'react';
import SidebarItem from './SidebarItem/SidebarItem';
import { HomeIcon, Cog6ToothIcon } from '@heroicons/react/24/solid';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const [mainBranch, setMainBranch] = React.useState("");
    const currentPath = window.location.pathname;
    const navigate = useNavigate();

    useEffect(() => {
        const currentPath = window.location.pathname;
        const mainBranch = currentPath.split('/')[1];
        setMainBranch(mainBranch);
    }, [currentPath]);

    return (
        <>
            {/* Colored glow behind the sidebar */}
            <div
                aria-hidden
                className="
                    fixed z-[950] top-0 left-0 h-screen w-15 pointer-events-none select-none overflow-hidden
                    hidden md:block
                "
            >
                <div className="absolute -left-10 top-20 h-48 w-48 rounded-full bg-fuchsia-500/35 blur-3xl" />
                <div className="absolute -left-12 top-1/2 -translate-y-1/2 h-56 w-56 rounded-full bg-indigo-500/30 blur-3xl" />
                <div className="absolute -left-8 bottom-14 h-44 w-44 rounded-full bg-sky-400/25 blur-3xl" />
            </div>

            {/* Glass sidebar panel */}
            <div
                className="
                    fixed z-[1000] top-0 left-0 w-15 h-screen
                    backdrop-blur-xl border-r bg-white/20 dark:bg-white/10 border-black/10 shadow-[0_8px_24px_rgba(17,24,39,0.08)]
                    hidden md:flex justify-center items-center
                    text-white/80
                "
            >
                <ul className="list-none p-0 m-0">
                    <li className="my-4">
                        <SidebarItem
                            icon={<HomeIcon className='w-7'/>}
                            isActive={mainBranch === "groups"}
                            onClick={() => { navigate('/groups') }}
                        />
                    </li>
                    <li className="my-4">
                        <SidebarItem
                            icon={<Cog6ToothIcon className='w-7' />}
                            isActive={mainBranch === "settings"}
                            onClick={() => { navigate('/settings') }}
                        />
                    </li>
                </ul>
            </div>
        </>
    );
};

export default Sidebar;