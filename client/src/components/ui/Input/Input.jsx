import { useState } from 'react';
import PropTypes from 'prop-types';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid';

const Input = ({
    type,
    placeholder,
    value,
    onChange,
    label,
    rightLabel,
    className,
    icon,
}) => {
    const [currentType, setCurrentType] = useState(type);

    const togglePasswordVisibility = () => {
        setCurrentType(currentType === 'password' ? 'text' : 'password');
    };

    return (
        <div className={`flex flex-col w-full ${className}`}>
            <div className={`flex items-center mb-1 ${label ? 'justify-between' : 'justify-end'}`}>
                {label && (
                    <p className="text-md font-sans text-white/60 m-0 mb-1">
                        {label}
                    </p>
                )}
                {rightLabel}
            </div>
            <div className="flex items-center outline-[1.5px] outline-white/50 bg-[#0a0a0a] rounded-[10px]">
                {icon && (
                    <div className="flex items-center justify-center px-3 text-white/60">
                        {icon}
                    </div>
                )}
                <div className="flex-grow text-white">
                    <input
                        placeholder={placeholder}
                        type={currentType}
                        value={value}
                        onChange={onChange}
                        className={`h-[50px] border-none outline-none bg-transparent font-sans px-2 w-full ${className}`}
                    />
                </div>
                {type === 'password' && (
                    <div className="flex items-center justify-center px-3">
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="btn outline-none cursor-pointer bg-transparent"
                        >
                            {currentType === 'password' ? (
                                <EyeSlashIcon className="w-6 h-8 text-white/30" />
                            ) : (
                                <EyeIcon className="w-6 h-8 text-white/30" />
                            )}
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