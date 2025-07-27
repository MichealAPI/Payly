
export default function SelectorButton({ value, setValue, options }) {
  return (
    <div className="rounded-full p-2 flex gap-2 bg-[#BD9EFF]/10">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setValue(option.value)}
          type="button"
          className={`px-4 py-2 text-sm/3 transition-all duration-300 rounded-full ${
            value === option.value
              ? "bg-[#BD9EFF] font-bold text-gray-700"
              : "bg-[#BD9EFF]/20 hover:bg-[#BD9EFF]/30 text-white"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
