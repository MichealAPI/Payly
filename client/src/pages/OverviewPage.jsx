import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MagnifyingGlassIcon, BarsArrowDownIcon, PlusIcon, EnvelopeIcon, ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

import Sidebar from "../components/ui/Sidebar/Sidebar";
import Navbar from "../components/ui/Navbar/Navbar";
import Wrapper from "../components/ui/Wrapper/Wrapper";
import Movement from "../components/ui/Movement/Movement";
import Button from "../components/ui/Button/Button";
import Warning from "../components/ui/Warning/Warning";
import Header from "../components/ui/Header/Header";
import Input from "../components/ui/Input/Input";
import Card from "../components/ui/Card/Card";
import Participant from "../components/ui/Participant/Participant";

// --- Mock Data (In a real app, this would come from an API) ---

const tripData = {
    title: "Trip to the Alps",
    description: "A week of skiing and snowboarding with friends.",
    membersCount: 5,
    icon: "🌍",
};

const movementsData = [
    {
        id: "1",
        type: "deposit",
        amount: 1000,
        title: "Flight Tickets",
        description: "Round trip flights for the group.",
        commentsAmount: 5,
        owner: "John Doe",
        members: [
            { name: 'John Doe', src: "https://placehold.co/32x32/orange/white" },
            { name: 'Jane Smith', src: "https://placehold.co/32x32/blue/white"},
            { name: 'Alice Johnson', src: "https://placehold.co/32x32/green/white" },
            { name: 'Bob Brown', src: "https://placehold.co/32x32/red/white" }
        ],
    }
];

const participantsData = [
    {
        id: "1",
        name: "John Doe",
        src: "https://placehold.co/32x32/orange/white",
        netBalance: 1000,
        currency: "USD",
    },
    {
        id: "2",
        name: "Jane Smith",
        src: "https://placehold.co/32x32/blue/white",
        netBalance: -250,
        currency: "USD",
    }
];

// --- Sub-components for better organization ---

const OverviewContent = ({ onShowParticipants }) => (
    <motion.div
        key="overview"
        initial={{ opacity: 0.2, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0.2, x: -20 }}
        transition={{ duration: 0.1 }}
        className="flex w-full justify-between flex-col md:flex-row"
    >
        {/* Left Column: Movements */}
        <div className="flex flex-col gap-10 flex-1">
            {/* Search Bar with Sorting */}
            <div className="flex gap-4">
                <div className="flex-1 md:flex-none">
                    <Input
                        type="text"
                        placeholder="Search movements..."
                        icon={<MagnifyingGlassIcon className="w-6" />}
                    />
                </div>
                <Button
                    text="Sort"
                    size="minimal"
                    textVisibility={false}
                    iconVisibility={true}
                    icon={<BarsArrowDownIcon className="w-6" />}
                    onClick={() => console.log('Sort movements')}
                    style="fill"
                />
            </div>

            <div className="flex flex-col gap-4 w-full">
                {movementsData.map(movement => (
                    <Movement
                        key={movement.id}
                        type={movement.type}
                        amount={movement.amount}
                        title={movement.title}
                        description={movement.description}
                        commentsAmount={movement.commentsAmount}
                        movementId={movement.id}
                        className={'w-full md:w-[90%]'}
                        owner={movement.owner}
                        members={movement.members}
                    />
                ))}
            </div>
        </div>

        {/* Right Column: Actions & Summaries */}
        <div className="flex flex-col md:gap-10 order-first mb-4 md:mb-0 md:order-last">
            <Button
                text="Add Movement"
                size="full"
                className='hidden md:flex'
                icon={<PlusIcon className="w-6" />}
                onClick={() => alert('Add Movement clicked!')}
                style="fill"
            />

            <Warning message="This is a warning message!" icon="⚠️" />

            <Card className="hidden md:flex w-full">
                <div className="flex flex-col w-full">
                    <h3 className="text-lg text-white text-center font-bold">Overview</h3>
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex flex-col text-white text-lg">
                            <p>You owe:</p>
                            <p>You're owed:</p>
                            <p>Your Expenses:</p>
                            <p>Total Expenses:</p>
                        </div>
                        <div className="flex flex-col text-lg text-right">
                            <p className="text-red-300 font-bold">$100.00</p>
                            <p className="text-green-300 font-bold">$200.00</p>
                            <p className="text-white font-bold">$50.00</p>
                            <p className="text-white font-bold">$250.00</p>
                        </div>
                    </div>
                </div>
            </Card>

            <Card className="hidden md:flex w-full">
                <div className="flex flex-col justify-center">
                    <h3 className="text-lg text-white text-center font-bold">Balances</h3>
                    <div className="flex items-center mt-2">
                        <img src="https://placehold.co/32x32/orange/white" alt="John Doe" className="w-8 h-8 rounded-full mr-2" />
                        <div className="flex flex-col">
                            <p className="text-white font-bold">John Doe</p>
                            <p className="text-green-200">$150.00</p>
                        </div>
                    </div>
                    <div className="flex gap-1 mt-2 text-white opacity-70 hover:opacity-100 transition-opacity cursor-pointer" onClick={onShowParticipants}>
                        <p className="text-sm">Show more</p>
                        <ArrowTopRightOnSquareIcon className="w-4" />
                    </div>
                </div>
            </Card>
        </div>
    </motion.div>
);

const ParticipantsContent = () => (
    <motion.div
        key="participants"
        initial={{ opacity: .2, x: 10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0.2, x: -20 }}
        transition={{ duration: 0.1 }}
        className="flex flex-col gap-10"
    >
        <div className="flex justify-between gap-4">
            <div className="flex-1">
                <Input
                    type="text"
                    placeholder="Search participants..."
                    icon={<MagnifyingGlassIcon className="w-6" />}
                />
            </div>
            <Button
                text="Invite"
                size="full"
                className="flex-1"
                icon={<EnvelopeIcon className="w-6" />}
                onClick={() => alert('Invite clicked!')}
                style="fill"
            />
        </div>

        <div className="flex flex-col gap-4">
            {participantsData.map(participant => (
                <Participant
                    key={participant.id}
                    participantId={participant.id}
                    participantName={participant.name}
                    src={participant.src}
                    netBalance={participant.netBalance}
                    currency={participant.currency}
                />
            ))}
        </div>
    </motion.div>
);


const OverviewPage = () => {
    const [activeAction, setActiveAction] = useState('overview');

    return (
        <>
            <Sidebar />
            <Wrapper className="items-center ">
                <Navbar
                    title="Overview"
                    actions={[
                        { id: 'overview', label: 'Overview' },
                        { id: 'participants', label: 'Participants' },
                    ]}
                    activeAction={activeAction}
                    actionsDropdown={true}
                    onActionClick={setActiveAction}
                />

                <div className="flex flex-col items-center justify-center md:p-4 md:w-[750px]">
                    <Header
                        title={tripData.title}
                        description={tripData.description}
                        membersCount={tripData.membersCount}
                        className="w-full"
                        icon={tripData.icon}
                    />

                    <div className="mt-5 w-full">
                        <p className="text-base text-white opacity-70 mb-2 text-right m-0">Need help?</p>
                        <AnimatePresence mode="wait">
                            {activeAction === 'overview' ? (
                                <OverviewContent onShowParticipants={() => setActiveAction('participants')} />
                            ) : (
                                <ParticipantsContent />
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Floating Action Button for mobile */}
                <Button
                    size="minimal"
                    iconVisibility={true}
                    onClick={() => console.log('Add Movement')}
                    style="fill"
                    icon={<PlusIcon className="w-6" />}
                    className="sticky md:hidden mb-auto ml-auto right-0 bottom-0 m-4"
                />
            </Wrapper>
        </>
    );
}

export default OverviewPage;