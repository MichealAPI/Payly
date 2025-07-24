
const Label = ({ className, textColor="text-white", bgColor="bg-blue-300", text=''}) => {
  return (
    <span className={`text-xs h-fit font-bold pointer-events-none select-none ${textColor} ${bgColor} ${className} rounded-full px-2 py-1 inline-flex items-center`}>
      {text}
    </span>
  );
}

export default Label;