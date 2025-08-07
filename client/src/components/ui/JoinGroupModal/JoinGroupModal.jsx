import { Dialog, Transition, DialogTitle, DialogPanel, TransitionChild } from '@headlessui/react';
import { Fragment, useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function JoinGroupModal({ isOpen, onClose, onJoin, isJoining }) {
  const [inviteCode, setInviteCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inviteCode.trim() && !isJoining) {
      onJoin(inviteCode.trim());
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/80" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black border-1 border-[#BD9EFF]/40 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Join a Group
                </DialogTitle>
                 <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                        type="button"
                        className="rounded-md bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">
                        Enter the invite code you received to join a group.
                    </p>
                    <Input 
                        type="text"
                        placeholder="e.g. a1b2c3d4"
                        value={inviteCode}
                        onChange={(e) => setInviteCode(e.target.value)}
                        autoFocus
                    />
                    </div>

                    <div className="mt-6 flex justify-between gap-4">
                        <Button
                            text="Cancel"
                            onClick={onClose}
                            style="outline"
                        />
                        <Button
                            text={isJoining ? "Joining..." : "Join"}
                            type="submit"
                            style="fill"
                            disabled={!inviteCode.trim() || isJoining}
                        />
                    </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}