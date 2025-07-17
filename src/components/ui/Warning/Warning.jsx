import { React } from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';

const Warning = ({ message, icon, className}) => {
    return (
        <Card className={'max-md:shadow-none max-md:bg-[#2A2A2D] max-md:rounded-[9px]'}>
            <div className={`flex justify-center items-center gap-4 ${className}`}>

                <div className="text-lg select-none">
                    {icon}
                </div>

                <div className="flex flex-col">
                    <h3 className="text-lg font-bold text-white">
                        {message}
                    </h3>
                    <p className="text-xs text-yellow-100 font-bold select-none">
                        WARNING
                    </p>
                </div>

            </div>
        </Card>
    );
}

export default Warning;