import React, { useState, useEffect, useRef } from 'react';

interface AutocompleteInputProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  suggestions: string[];
  icon?: React.ReactNode;
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  suggestions,
  icon
}) => {
  const [filtered, setFiltered] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!value || value.trim() === "") {
      setFiltered(suggestions.slice(0, 15));
      return;
    }

    const query = value.toLowerCase().trim();
    
    // Filter and sort suggestions
    // Prioritize startsWith matches, then includes matches
    const startsWithMatches: string[] = [];
    const includesMatches: string[] = [];

    suggestions.forEach(item => {
      const lowerItem = item.toLowerCase();
      if (lowerItem.startsWith(query)) {
        startsWithMatches.push(item);
      } else if (lowerItem.includes(query)) {
        includesMatches.push(item);
      }
    });

    const combined = [...startsWithMatches, ...includesMatches].slice(0, 15);
    
    // If the value exactly matches one of the items, we can hide the dropdown
    if (combined.length === 1 && combined[0].toLowerCase() === query) {
      setFiltered([]);
    } else {
      setFiltered(combined);
    }
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full flex flex-col gap-2 relative" ref={containerRef}>
      <label className="text-sm font-medium text-[#0F172A]">{label}</label>
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        <input
          id={id}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          className={`w-full h-14 bg-white border border-[#E5E7EB] rounded-xl text-base px-4 ${
            icon ? 'pl-11' : ''
          } focus:outline-none focus:border-[#128A4E] focus:ring-2 focus:ring-[#128A4E]/20 transition-all duration-200 text-[#0F172A] placeholder-[#9CA3AF]`}
        />

        {isOpen && filtered.length > 0 && (
          <div className="absolute left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto z-50">
            {filtered.map((item, index) => (
              <button
                key={index}
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(item);
                  setIsOpen(false);
                }}
                onClick={() => {
                  onChange(item);
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-3 text-sm text-[#0F172A] hover:bg-slate-50 border-b border-gray-50 last:border-0 font-medium transition-colors"
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
