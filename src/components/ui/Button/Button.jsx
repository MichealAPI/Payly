import React from 'react';
import PropTypes from 'prop-types';
import styles from './Button.module.css';

const Button = ({ text, className, onClick, size = 'medium', style = 'fill', textVisibility = true, iconVisibility = false, icon}) => {
    return (
        <button
            type={'button'}
            className={`flex ${className} ${styles.btn} ${styles[size]} ${styles[style]} items-center justify-between gap-2`}
            onClick={onClick}
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