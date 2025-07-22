import PropTypes from "prop-types";
import Card from "../Card/Card";
import { TrashIcon } from "@heroicons/react/24/outline";
import Button from "../Button/Button.jsx";

const getBalanceDetails = (netBalance) => {
    if (netBalance === 0) {
        return {
            message: "You're even",
            className: 'hidden'
        };
    }
    return netBalance < 0 ? {
        message: 'Owes you',
        className: 'text-green-300'
    } : {
        message: 'You owe',
        className: 'text-red-300'
    };
};

const Participant = ({
    participantName,
    participantId,
    src,
    netBalance,
    currency,
    onDelete,
    className
}) => {
    const { message: netBalanceMessage, className: netBalanceClass } = getBalanceDetails(netBalance);

    const handleDelete = () => {
        onDelete(participantId); // Pass the necessary identifier up to the parent
    };

    return (
        <Card className={className}>
            <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4 w-full justify-between">

                    <div className="flex gap-4 items-center">
                        <img
                            src={src}
                            alt={`Profile of ${participantName}`}
                            className="w-12 h-12 rounded-full object-cover"
                        />

                        <div className="flex flex-col">
                            <h3 className="text-xl font-bold text-white">{participantName}</h3>
                            <p className="text-white text-lg">
                                {netBalanceMessage}{' '}
                                <span className={`font-bold ${netBalanceClass}`}>
                                    {Math.abs(netBalance).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: currency
                                    })}
                                </span>
                            </p>
                        </div>
                    </div>

                    <Button
                        size="minimal"
                        iconVisibility={true}
                        icon={<TrashIcon className="w-6" />}
                        onClick={() => console.log(`Navigate to participant ${participantId}`)}
                        style="fill"
                    />
                </div>


            </div>
        </Card>
    );
};

Participant.propTypes = {
    participantName: PropTypes.string.isRequired,
    participantId: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    netBalance: PropTypes.number.isRequired,
    onDelete: PropTypes.func.isRequired,
    currency: PropTypes.string,
    className: PropTypes.string
};

Participant.defaultProps = {
    currency: 'USD',
    className: ''
};

export default Participant;