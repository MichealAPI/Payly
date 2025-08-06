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
            <div className="flex justify-between items-center mb-1">
                {label && (
                    <p className="text-2xl font-sans text-white m-0 mb-1">
                        {label}
                    </p>
                )}
                {rightLabel}
            </div>
            <div className="flex items-center outline outline-[1.5px] outline-[#3A3E501A] bg-[#F3F3F3] rounded-[10px]">
                {icon && (
                    <div className="flex items-center justify-center px-2">
                        {icon}
                    </div>
                )}
                <div className="flex-grow">
                    <input
                        placeholder={placeholder}
                        type={currentType}
                        value={value}
                        onChange={onChange}
                        className={`h-[50px] border-none outline-none bg-transparent font-sans text-black/60 px-2 w-full ${className}`}
                    />
                </div>
                {type === 'password' && (
                    <div className="flex items-center justify-center px-2">
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="btn outline-none bg-transparent"
                        >
                            {currentType === 'password' ? (
                                <EyeSlashIcon className="w-6 h-8 text-[#3A3E50]" />
                            ) : (
                                <EyeIcon className="w-6 h-8 text-[#3A3E50]" />
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