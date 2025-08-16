import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { Fragment } from "react";
import Button from "../Button/Button";
import { CheckIcon, XMarkIcon} from "@heroicons/react/24/outline";

const ConfirmModal = ({ title, message, isOpen, setIsOpen, onConfirm, onCancel }) => {

  function closeModal(isCancel = false) {
    setIsOpen(false);
    if (isCancel && onCancel) {
      onCancel();
    }
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-999" onClose={() => closeModal(true)}>
        {/* The backdrop, rendered as a fixed sibling to the panel container */}
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
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
              <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black shadow-[0px_0px_10px_2px_rgba(198,172,255,0.25)] p-6 text-left align-middle transition-all">
                <DialogTitle
                  as="h3"
                  className="text-lg leading-6 text-secondary font-bold"
                >
                    {title}
                </DialogTitle>

                <div className="mt-2">
                    <span 
                      className="text-sm text-secondary"
                      dangerouslySetInnerHTML={{ __html: message }}
                    />
                </div>

                <div className="mt-2">
                  <div className="mt-6 flex justify-between space-x-4">
                    <Button
                      text="Confirm"
                      size="full"
                      className={"flex-1"}
                      iconVisibility={true}
                      icon={<CheckIcon className="w-6" />}
                      onClick={() => {
                        closeModal();
                        if (onConfirm) onConfirm();
                      }}
                    />
                    
                    <Button
                      text="Cancel"
                      style="outline"
                      size="full"
                      className={"flex-1"}
                      onClick={() => closeModal(true)}
                      iconVisibility={true}
                      icon={<XMarkIcon className="w-6" />}
                    />
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default ConfirmModal;