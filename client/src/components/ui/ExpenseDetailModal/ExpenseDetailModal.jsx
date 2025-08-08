import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import {
  XMarkIcon,
  CalendarIcon,
  UserCircleIcon,
  UsersIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import ProfilePicture from "../ProfilePicture/ProfilePicture";

const ExpenseDetailModal = ({ isOpen, onClose, expense }) => {
  // The parent component now controls rendering, so we can assume `expense` exists.

  const formattedDate = new Date(expense.paidAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const currencySymbol =
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: expense.currency || "USD",
    })
      .formatToParts(0)
      .find((part) => part.type === "currency")?.value || "$";

  return (
    <Dialog as="div" className="relative z-50" open={isOpen} onClose={onClose}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 bg-black/60"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <DialogPanel className="w-[90vw] md:min-w-md max-w-md transform overflow-hidden rounded-2xl bg-black border border-[#BD9EFF]/40 p-6 text-left align-middle shadow-xl transition-all">
              <DialogTitle
                as="h3"
                className="text-2xl font-bold leading-6 text-white flex justify-between items-center"
              >
                {expense.title}
                <button
                  onClick={onClose}
                  className="text-slate-400 cursor-poin hover:text-white"
                >
                  <XMarkIcon className="w-6 h-6" />
                </button>
              </DialogTitle>

              <div className="mt-4 flex flex-col gap-4 text-slate-300">
                {/* Amount */}
                <div className="flex items-center gap-3 p-3 bg-[#BD9EFF]/15 rounded-lg">
                  <CurrencyDollarIcon
                    className={`w-6 h-6 ${
                      expense.type === "deposit"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  />
                  <div>
                    <p className="text-sm text-slate-400">Amount</p>
                    <p
                      className={`text-lg font-bold ${
                        expense.type === "deposit"
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {expense.type === "deposit" ? "+" : "-"}
                      {currencySymbol}
                      {expense.amount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                {expense.description && (
                  <div className="flex items-start gap-3 p-3 bg-[#BD9EFF]/15 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-slate-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-slate-400">Description</p>
                      <p className="text-white whitespace-pre-wrap break-words">
                        {expense.description}
                      </p>
                    </div>
                  </div>
                )}

                {/* Paid By */}
                <div className="flex items-center gap-3 p-3 bg-[#BD9EFF]/15 rounded-lg">
                  <UserCircleIcon className="w-6 h-6 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Paid by</p>
                    <p className="text-white font-medium">
                      {expense.paidBy.firstName && expense.paidBy.lastName
                        ? `${expense.paidBy.firstName} ${expense.paidBy.lastName}`
                        : expense.paidBy.email}
                    </p>
                  </div>
                </div>

                {/* Date */}
                <div className="flex items-center gap-3 p-3 bg-[#BD9EFF]/15 rounded-lg">
                  <CalendarIcon className="w-6 h-6 text-slate-400" />
                  <div>
                    <p className="text-sm text-slate-400">Date</p>
                    <p className="text-white font-medium">{formattedDate}</p>
                  </div>
                </div>

                {/* Participants */}
                <div className="flex flex-col gap-3 p-3 bg-[#BD9EFF]/15 rounded-lg">
                  <div className="flex items-center gap-3">
                    <UsersIcon className="w-6 h-6 text-slate-400" />
                    <p className="text-sm text-slate-400">Participants</p>
                  </div>
                  <div className="flex flex-wrap gap-2 pl-9">
                    {expense.splitDetails.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-2 bg-slate-700/50 px-2 py-1 rounded-full"
                      >
                        {console.log("Participant in ExpenseDetailModal:", p)}
                        <ProfilePicture
                          currentUser={p.user}
                          className="w-4 h-4 rounded-full"
                        />
                        <span className="text-xs text-white">
                          {p.user.firstName} {p.user.lastName}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </DialogPanel>
          </motion.div>
        </div>
      </div>
    </Dialog>
  );
};

export default ExpenseDetailModal;
