import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ text, className, onClick, size = 'medium', style = 'fill', textVisibility = true, iconVisibility = false, type="button", icon, disabled = false}) => {
    return (
        <button
            type={type}
            className={`flex ${className} ${styles.btn} ${styles[size]} ${styles[style]} items-center justify-between gap-2`}
            onClick={onClick}
            disabled={disabled}
        >
            {textVisibility && size != 'minimal' && <span className="text">{text}</span>}
            {iconVisibility && icon && <span>{icon}</span>}
        </button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func,
    size: PropTypes.oneOf(['minimal', 'medium', 'large', 'full']),
    style: PropTypes.oneOf(['fill', 'outline']),
    textVisibility: PropTypes.bool,
    iconVisibility: PropTypes.bool,
    icon: PropTypes.element
};

export default Button;