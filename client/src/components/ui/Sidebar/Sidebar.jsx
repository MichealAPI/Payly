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
        <div
            className="
                fixed z-[1000] top-0 left-0 w-20 h-screen
                bg-gradient-to-b from-[#6F2FF7] to-[#411C91]
                hidden justify-center items-center
                md:flex
            "
        >
            <ul className="list-none p-0 m-0">
                <li className="my-5">
                    <SidebarItem
                        icon={<HomeIcon />}
                        isActive={mainBranch === "groups"}
                        onClick={() => { navigate('/groups') }}
                    />
                </li>
                <li className="my-5">
                    <SidebarItem
                        icon={<Cog6ToothIcon />}
                        isActive={mainBranch === "settings"}
                        onClick={() => { navigate('/settings') }}
                    />
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;