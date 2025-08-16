import PropTypes from 'prop-types';

const SidebarItem = ({ icon, isActive, onClick }) => {
    const baseClasses = "transition-all duration-200 ease-in-out cursor-pointer select-none";
    const hoverClasses = "hover:bg-white/15 hover:rounded-xl hover:scale-105 dark:hover:bg-black/5";
    const activeClasses = "rounded-xl ring-1 ring-white/30 bg-white/10 text-white ring-black/10 bg-black/5";
    const inactiveClasses = "text-white/70";

    return (
        <div 
            className={`${baseClasses} ${hoverClasses} ${isActive ? activeClasses : inactiveClasses}`} 
            onClick={onClick}
        >
            <div className={`w-10 h-10 flex items-center justify-center`}>
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