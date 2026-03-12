"use client";

interface ThemePickerProps {
  currentTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemePicker({ currentTheme, onSelect }: ThemePickerProps) {
  const isDark = currentTheme === "aipac";

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-white border-b border-gray-200">
      <span className="text-sm text-gray-500">Theme</span>
      <button
        onClick={() => onSelect(isDark ? "aipac-light" : "aipac")}
        className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none"
        style={{ backgroundColor: isDark ? "#0e1117" : "#d1d5db" }}
        aria-label="Toggle dark/light theme"
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            isDark ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
      <span className="text-xs font-medium text-gray-600">
        {isDark ? "Dark" : "Light"}
      </span>
    </div>
  );
}
