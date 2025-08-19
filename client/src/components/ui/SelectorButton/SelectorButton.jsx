
export default function SelectorButton({ value, setValue, options }) {
  return (
    <div className="rounded-full p-2 flex gap-2 bg-light-purple/10">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => setValue(option.value)}
          type="button"
          className={`px-4 py-2 text-base/3 transition-all duration-300 rounded-full ${
            value === option.value
              ? "bg-light-purple font-bold text-gray-700"
              : "bg-light-purple/20 hover:bg-light-purple/30 text-secondary"
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
