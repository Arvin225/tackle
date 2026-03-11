import React, { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = "Search tracks, artists, albums...",
  className = "",
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <Search
        className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${
          isFocused ? "text-[#007aff]" : "text-[#86868b] dark:text-[#8e8e93]"
        }`}
      />

      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="w-full pl-12 pr-12 py-3 rounded-xl glass-input text-sm placeholder-[#aeaeb2] dark:placeholder-[#636366] transition-all focus:ring-2 focus:ring-[#007aff] focus:ring-offset-0"
      />

      {value && (
        <button
          onClick={() => onChange("")}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-[#f5f5f7] dark:hover:bg-[#2c2c2e] transition-colors"
        >
          <X className="w-4 h-4 text-[#86868b] dark:text-[#8e8e93]" />
        </button>
      )}
    </div>
  );
};
