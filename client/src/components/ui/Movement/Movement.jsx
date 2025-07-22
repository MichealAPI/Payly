import React from 'react';
import PropTypes from 'prop-types';
import Card from '../Card/Card';
import Button from '../Button/Button.jsx';
import { ChatBubbleOvalLeftIcon, PencilIcon } from '@heroicons/react/24/outline';

const Movement = ({ className, type, owner, amount, title, description, commentsAmount, movementId, members }) => {

    const amountSign = type === 'deposit' ? '+' : '-';

    return (
        <Card className={`${className} relative md:p-8 w-[90%] cursor-pointer md:cursor-default transition-transform hover:scale-101 md:hover:scale-none`}>
            <div className="flex justify-between md:h-[120px]">

                {/* Text content */}
                <div className="flex flex-col h-full justify-between">
                    <div>
                        <h2 className="text-white text-xl md:text-2xl font-bold">{title}</h2>
                        <h3 className={`${type === 'deposit' ? 'text-[#97FFCB]' : 'text-[#F88]'} text-xs md:text-sm font-bold md:font-semibold`}>
                            {type.toUpperCase()}
                        </h3>
                    </div>

                    <p className="text-white opacity-60 text-base md:text-lg hidden md:block truncate w-30">
                        {description || 'No description provided.'}
                    </p>
                    
                    <p className="text-white opacity-60 text-base md:text-lg block md:hidden">
                        {type === 'deposit' ? 'Transferred by' : 'Paid by'} {owner}
                    </p>
                </div>

                {/* Amount, comments and edit button */}
                <div className="flex flex-col justify-between h-full items-end">
                    <h3 className={`${type === 'deposit' ? 'text-[#97FFCB]' : 'text-[#F88]'} text-xl md:text-2xl font-bold text-nowrap`}>
                        {amountSign}
                        {amount.toLocaleString('en-US', {
                            style: 'currency',
                            currency: 'USD' /* Todo: Make this dynamic */
                        })}
                    </h3>

                    <div className="flex gap-3">
                        <div className="flex gap-2 items-center">
                            <p className='text-xl md:text-2xl text-white'>
                                {commentsAmount || 0}
                            </p>

                            <ChatBubbleOvalLeftIcon className="size-5 md:size-6 text-white" />
                        </div>

                        <Button
                            className="hidden md:flex"
                            text=""
                            size="minimal"
                            textVisibility={false}
                            iconVisibility={true}
                            icon={<PencilIcon className="w-6" />}
                            onClick={() => console.log(`Edit movement ${movementId}`)}
                            style="fill"
                        />
                    </div>
                </div>
            </div>

            {/* Member Avatars - Positioned on the border */}
            {members && members.length > 0 && (
                <div className="absolute -bottom-5 left-8 items-center hidden md:flex">
                    <div className="flex -space-x-4">
                        {members.slice(0, 2).map((member, index) => (
                            <img
                                key={index}
                                className="inline-block h-10 w-10 rounded-full"
                                src={member.src}
                                alt={member.name}
                            />
                        ))}
                        {members.length > 2 && (
                            <a className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-700 text-xs font-medium text-white hover:bg-gray-600" href="#">
                                +{members.length - 2}
                            </a>
                        )}
                    </div>
                </div>
            )}
        </Card>
    )

}

Movement.propTypes = {
    className: PropTypes.string,
    type: PropTypes.oneOf(['deposit', 'expense']).isRequired,
    amount: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    owner: PropTypes.string.isRequired,
    description: PropTypes.string,
    commentsAmount: PropTypes.number,
    movementId: PropTypes.string.isRequired,
    members: PropTypes.arrayOf(PropTypes.shape({
        name: PropTypes.string.isRequired,
        src: PropTypes.string.isRequired
    })),
    date: PropTypes.string
};

export default Movement;