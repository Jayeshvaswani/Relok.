import React from 'react';
import { Users, Key, Bed, Home, Briefcase } from 'lucide-react';

interface IntentSelectionGatewayProps {
  onSelect: (intent: 'roommate' | 'private_room' | 'shared_room' | 'post_room' | 'broker') => void;
  onSkip: () => void;
}

export const IntentSelectionGateway: React.FC<IntentSelectionGatewayProps> = ({ onSelect, onSkip }) => {
  const options = [
    {
      id: 'roommate' as const,
      icon: <Users className="w-6 h-6 text-[#128A4E]" />,
      title: 'Find a Roommate',
      description: 'AI-matched flatmates based on your lifestyle.',
    },
    {
      id: 'private_room' as const,
      icon: <Key className="w-6 h-6 text-[#128A4E]" />,
      title: 'Find a Private Room',
      description: 'Browse private rooms available near you.',
    },
    {
      id: 'shared_room' as const,
      icon: <Bed className="w-6 h-6 text-[#128A4E]" />,
      title: 'Find a Shared Room',
      description: 'Browse shared rooms and split rent.',
    },
    {
      id: 'post_room' as const,
      icon: <Home className="w-6 h-6 text-[#128A4E]" />,
      title: 'Post My Room',
      description: 'List your room or flat in minutes.',
    },
    {
      id: 'broker' as const,
      icon: <Briefcase className="w-6 h-6 text-[#128A4E]" />,
      title: 'Use as Broker',
      description: 'List multiple properties as a verified agent.',
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between py-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
      {/* Header & Subtitle */}
      <div className="flex flex-col gap-2 mb-6">
        <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
          What are you looking for?
        </h1>
        <p className="text-sm text-gray-500 font-medium leading-relaxed">
          Choose an option — you can always explore everything else from Home.
        </p>
      </div>

      {/* 5 Stacked Cards */}
      <div className="flex-1 flex flex-col gap-3.5 mb-6">
        {options.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => onSelect(option.id)}
            className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 shadow-xs hover:border-[#128A4E] hover:bg-[#E8F5EE]/10 active:scale-[0.99] transition-all flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-[#E8F5EE] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              {option.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-extrabold text-[#0F172A] group-hover:text-[#128A4E] transition-colors">
                {option.title}
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Skip Option */}
      <div className="text-center py-2 shrink-0">
        <button
          type="button"
          onClick={onSkip}
          className="text-xs font-bold text-gray-400 hover:text-gray-600 active:text-gray-800 transition-colors cursor-pointer"
        >
          Skip, just take me to home page
        </button>
      </div>
    </div>
  );
};
