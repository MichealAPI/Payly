import React from 'react';
import PropTypes from 'prop-types';

const Card = ({ children, className, bgHiddenSm, onClick, dropShadow=true }) => {
    
    const baseClasses = "bg-dark-gray";
    const responsiveClasses = "md:bg-dark-gray";

    return (
        <div onClick={onClick} className={`${className} rounded-[18px] p-5 ${bgHiddenSm ? responsiveClasses : baseClasses} ${dropShadow ? "shadow-[0px_0px_10px_6px_rgba(198,172,255,0.15)]" : ""}`}>
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