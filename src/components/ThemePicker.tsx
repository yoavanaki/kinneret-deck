"use client";

import { themes, themeIds, Theme } from "@/lib/themes";

interface ThemePickerProps {
  currentTheme: string;
  onSelect: (themeId: string) => void;
}

export default function ThemePicker({ currentTheme, onSelect }: ThemePickerProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
      <span className="text-sm font-medium text-gray-600">Theme:</span>
      <div className="flex gap-3">
        {themeIds.map((id) => {
          const t = themes[id];
          const isActive = id === currentTheme;
          return (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all text-sm ${
                isActive
                  ? "border-blue-500 shadow-md"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Color preview swatches */}
              <div className="flex gap-0.5">
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: t.colors.bg, border: "1px solid #ddd" }}
                />
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: t.colors.heading }}
                />
                <div
                  className="w-4 h-4 rounded-sm"
                  style={{ backgroundColor: t.colors.accent }}
                />
              </div>
              <div className="font-medium text-sm">{t.name}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
