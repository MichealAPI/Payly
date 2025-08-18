import Card from "../Card/Card";

const ExpenseSkeleton = () => {
  return (
    <Card className="relative md:p-10 w-full animate-pulse">
      <div className="flex justify-between">
        {/* Left side */}
        <div className="flex flex-col justify-between flex-grow pr-4">
          <div>
            <div className="h-7 bg-slate-300 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
          </div>
          <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-full hidden md:block mt-4"></div>
          <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2 mt-4"></div>
        </div>

        {/* Right side */}
        <div className="flex flex-col justify-between items-end flex-shrink-0">
          <div className="h-7 bg-slate-300 dark:bg-slate-700 rounded w-24"></div>
          <div className="flex gap-4 mt-4">
            <div className="h-10 w-10 bg-slate-300 dark:bg-slate-700 rounded-lg hidden md:block"></div>
            <div className="h-10 w-10 bg-slate-300 dark:bg-slate-700 rounded-lg hidden md:block"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseSkeleton;