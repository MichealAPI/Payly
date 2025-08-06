import PropTypes from 'prop-types';

const SidebarItem = ({ icon, isActive, onClick }) => {
    const baseClasses = "transition-all duration-200 ease-in-out cursor-pointer hover:bg-white/10 hover:rounded-md hover:scale-110";
    const activeClasses = "";
    const disabledClasses = "opacity-50";

    return (
        <div 
            className={`${baseClasses} ${isActive ? activeClasses : disabledClasses}`} 
            onClick={onClick}
        >
            <div className={`w-8 ${isActive ? 'text-white' : ''}`}>
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