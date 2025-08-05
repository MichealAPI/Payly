import React from 'react';
import styles from './Sidebar.module.css';
import SidebarItem from '../SidebarItem/SidebarItem';
import { HomeIcon, RocketLaunchIcon } from '@heroicons/react/16/solid';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { UserGroupIcon } from '@heroicons/react/24/solid';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

const Sidebar = () => {

    const [mainBranch, setMainBranch] = React.useState("");
    const currentPath = window.location.pathname; // Get the current path
    const navigate = useNavigate();

    useEffect(() => {
        // Check from url which page the user is on and set the active state accordingly
        const currentPath = window.location.pathname;
        const mainBranch = currentPath.split('/')[1]; // Get the main branch of the URL
        setMainBranch(mainBranch);
    }, [currentPath]);

    return (
        <div className={`${styles.sidebar}`}>
            <ul className={styles.sidebarMenu}>
                <li>
                    <SidebarItem 
                        icon={<HomeIcon/>}
                        isActive={mainBranch === "groups"}
                        onClick={() => {navigate('/groups')}} 
                    />
                </li>
                <li>
                    <SidebarItem 
                        icon={<Cog6ToothIcon/>}
                        isActive={mainBranch === "settings"} 
                        onClick={() => {navigate('/settings')}} 
                    />
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;