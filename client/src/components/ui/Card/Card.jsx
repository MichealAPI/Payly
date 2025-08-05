import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className, bgHiddenSm, onClick }) => {
    
    const baseClasses = "bg-[#121214] shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)]";
    const responsiveClasses = "md:bg-[#121214] md:shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)]";

    return (
        <div onClick={onClick} className={`${className} rounded-[18px] p-5 ${bgHiddenSm ? responsiveClasses : baseClasses}`}>
            {children}
        </div>
    );
}

Card.propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    bgHiddenSm: PropTypes.bool,
};

export default Card;