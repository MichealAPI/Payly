import { Dialog, TransitionChild, DialogPanel, DialogTitle, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import Button from '../Button/Button';
import { ClipboardDocumentIcon, XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function InviteModal({ isOpen, onClose, inviteCode }) {

  const copyToClipboard = () => {
    if (inviteCode) {
      navigator.clipboard.writeText(inviteCode);
      toast.success('Invite code copied to clipboard!');
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
              <DialogPanel className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-black border-1 border-light-purple/50 p-6 text-left align-middle shadow-xl transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg font-medium leading-6 text-secondary"
                >
                  Share this invite code
                </DialogTitle>
                <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
                    <button
                        type="button"
                        className="rounded-md cursor-pointer bg-gray-800 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        onClick={onClose}
                    >
                        <span className="sr-only">Close</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Anyone with this code can join your group. The code will expire in 7 days.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-900 p-4">
                  <p className="text-2xl font-mono tracking-widest text-secondary">
                    {inviteCode || 'Generating...'}
                  </p>
                  <Button
                    icon={<ClipboardDocumentIcon className="w-6" />}
                    onClick={copyToClipboard}
                    iconVisibility={true}
                    size="minimal"
                    style="outline"
                    disabled={!inviteCode}
                  />
                </div>

                <div className="mt-6">
                  <Button
                    text="Done"
                    onClick={onClose}
                    style="fill"
                    size="full"
                  />
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}