import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "relative h-9 w-9 flex items-center justify-center rounded-lg border transition-colors",
        "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-100",
        "dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-zinc-300 dark:hover:bg-[#3f3f46]",
        className,
      )}
    >
      <Sun
        className={cn(
          "h-4 w-4 absolute transition-all",
          isDark
            ? "opacity-0 scale-50 rotate-90"
            : "opacity-100 scale-100 rotate-0",
        )}
      />
      <Moon
        className={cn(
          "h-4 w-4 absolute transition-all",
          isDark
            ? "opacity-100 scale-100 rotate-0"
            : "opacity-0 scale-50 -rotate-90",
        )}
      />
    </button>
  );
};

export default ThemeToggle;
