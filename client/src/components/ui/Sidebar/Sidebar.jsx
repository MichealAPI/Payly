import React from 'react';
import styles from './Sidebar.module.css';
import SidebarItem from '../SidebarItem/SidebarItem';
import { HomeIcon, RocketLaunchIcon } from '@heroicons/react/16/solid';

const Sidebar = () => {
    return (
        <div className={`${styles.sidebar}`}>
            <ul className={styles.sidebarMenu}>
                <li>
                    <SidebarItem 
                        icon={<HomeIcon/>}
                        isActive={true} 
                        onClick={() => console.log('Home clicked')} 
                    />
                </li>
                <li>
                    <SidebarItem 
                        icon={<RocketLaunchIcon/>} 
                        isActive={false} 
                        onClick={() => console.log('Profile clicked')} 
                    />
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;