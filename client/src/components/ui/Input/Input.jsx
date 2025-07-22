import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './Input.module.css';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'

const Input = ({ type, placeholder, value, onChange, label, rightLabel, className, icon }) => {
    const [currentType, setCurrentType] = useState(type);

    const togglePasswordVisibility = () => {
        setCurrentType(currentType === 'password' ? 'text' : 'password');
    };


    return (
        <div className={`${className} ${styles['input-wrapper']}`}>
            <div className={styles['input-header']}>
                {label && <p className="phantom-regular">{label}</p>}
                {rightLabel}
            </div>
            <div className={styles['input-container']}>
                {icon && <div className={styles.icon}>{icon}</div>}
                <div className={styles.input}>
                    <input
                        placeholder={placeholder}
                        type={currentType}
                        value={value}
                        onChange={onChange}
                        className={`${styles['input-field']} ${className}`}
                    />
                </div>
                {type === 'password' && (
                    <div className={styles.icon}>
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="btn outline-transparent toggle-password"
                        >
                            
                        {currentType === 'password' ? <EyeSlashIcon className="w-6"/> : <EyeIcon className="w-6"/>}

                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

Input.propTypes = {
    type: PropTypes.string,
    label: PropTypes.string,
    icon: PropTypes.element,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func,
    rightLabel: PropTypes.element,
    className: PropTypes.string,
};

Input.defaultProps = {
    type: 'text',
    placeholder: '',
    value: '',
    onChange: () => {},
    className: '',
};

export default Input;