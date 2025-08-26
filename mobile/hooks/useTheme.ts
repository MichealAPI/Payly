import { ThemeContext } from "@/providers/ThemeProviders";
import { useContext } from "react";

export const useTheme = () => useContext(ThemeContext);