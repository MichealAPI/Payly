import styles from './SidebarItem.module.css';
import PropTypes from 'prop-types';

const SidebarItem = ({ icon, isActive, onClick }) => {
    return (
        <div 
            className={`${styles.sidebarItem} ${isActive ? styles.active : styles.disabled}`} 
            onClick={onClick}
        >
            <div className={`${styles.icon} w-8`}>
                {icon} 
            </div>
        </div>
    );
}

SidebarItem.propTypes = {
    icon: PropTypes.element.isRequired,
    isActive: PropTypes.bool,
    onClick: PropTypes.func
};

export default SidebarItem;