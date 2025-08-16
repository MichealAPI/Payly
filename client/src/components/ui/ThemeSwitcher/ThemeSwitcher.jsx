import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../features/ui/themeSlice";

export default function ThemeSwitcher() {
  const { theme } = useSelector((state) => state.theme || { theme: "light" });

  const dispatch = useDispatch();

  const size = "h-6 w-6";
  const icon = theme === "dark" ? <MoonIcon className={size} /> : <SunIcon className={size} />;

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="flex items-center justify-center p-2 rounded-md text-secondary cursor-pointer"
      aria-label="Toggle theme"
    >
      {icon}
    </button>
  );
}