import { Moon, Sun } from "lucide-react";
import useTheme from "../contexts/useTheme";

export default function ThemeToggle({ compact = false, showLabel = false }) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;
  const label = isDark ? "Light mode" : "Dark mode";

  return (
    <button
      type="button"
      className={`theme-toggle${compact ? " theme-toggle-compact" : ""}${
        showLabel ? " gap-2" : ""
      }`}
      onClick={toggleTheme}
      aria-label={`Switch to ${label.toLowerCase()}`}
      aria-pressed={isDark}
      title={`Switch to ${label.toLowerCase()}`}
    >
      <Icon size={18} aria-hidden="true" />
      {showLabel && <span>{label}</span>}
    </button>
  );
}
