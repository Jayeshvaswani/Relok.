import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface PrimaryButtonProps {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  text: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  id,
  onClick,
  disabled = false,
  text,
  icon,
  type = 'button'
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full h-14 rounded-2xl flex items-center justify-center font-semibold text-base transition-all duration-200 ${
        disabled
          ? 'bg-[#128A4E]/40 text-white cursor-not-allowed'
          : 'bg-[#128A4E] hover:bg-[#0F7A44] text-white shadow-sm hover:shadow active:scale-[0.98]'
      }`}
    >
      <span>{text}</span>
      {icon && <span className="ml-2">{icon}</span>}
    </button>
  );
};

interface SecondaryButtonProps {
  id?: string;
  onClick?: () => void;
  disabled?: boolean;
  text: string;
  icon?: React.ReactNode;
  type?: 'button' | 'submit';
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  id,
  onClick,
  disabled = false,
  text,
  icon,
  type = 'button'
}) => {
  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="w-full h-14 rounded-2xl flex items-center justify-center font-semibold text-base bg-white border-[1.5px] border-[#128A4E] text-[#128A4E] hover:bg-[#E8F5EE] transition-all duration-200 active:scale-[0.98]"
    >
      {icon && <span className="mr-2">{icon}</span>}
      <span>{text}</span>
    </button>
  );
};

interface FormInputProps {
  id?: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  icon?: React.ReactNode;
  maxLength?: number;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  maxLength,
  disabled = false
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-medium text-[#0F172A]">{label}</label>
      <div className="relative w-full">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full h-14 bg-white border border-[#E5E7EB] rounded-xl text-base px-4 ${
            icon ? 'pl-11' : ''
          } focus:outline-none focus:border-[#128A4E] focus:ring-2 focus:ring-[#128A4E]/20 transition-all duration-200 text-[#0F172A] placeholder-[#9CA3AF]`}
        />
      </div>
    </div>
  );
};

interface FormTextareaProps {
  id?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (val: string) => void;
  maxLength: number;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  maxLength
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-[#0F172A]">{label}</label>
        <span className="text-xs text-gray-400 font-medium">
          {value.length}/{maxLength}
        </span>
      </div>
      <textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.slice(0, maxLength))}
        className="w-full min-h-[100px] bg-white border border-[#E5E7EB] rounded-xl text-base p-4 focus:outline-none focus:border-[#128A4E] focus:ring-2 focus:ring-[#128A4E]/20 transition-all duration-200 text-[#0F172A] placeholder-[#9CA3AF] resize-none"
      />
    </div>
  );
};

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <span className="text-sm font-medium text-[#128A4E]">
        Step {currentStep} of {totalSteps}
      </span>
      <div className="w-full h-1 flex gap-1 rounded-full overflow-hidden bg-[#E5E7EB]">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-full flex-1 rounded-full transition-colors duration-300 ${
              index < currentStep ? 'bg-[#128A4E]' : 'bg-[#E5E7EB]'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

interface PillSelectorProps {
  label: string;
  options: string[];
  selectedValue: string;
  onSelect: (val: any) => void;
}

export const PillSelector: React.FC<PillSelectorProps> = ({
  label,
  options,
  selectedValue,
  onSelect
}) => {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-sm font-medium text-[#0F172A]">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const isSelected = selectedValue === option;
          return (
            <button
              key={option}
              type="button"
              onClick={() => onSelect(option)}
              className={`px-4 py-3 rounded-full border text-sm font-medium transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'border-[#128A4E] text-[#128A4E] bg-[#E8F5EE]'
                  : 'border-[#E5E7EB] text-gray-500 bg-white hover:border-[#CBD5E1]'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface BackButtonProps {
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-11 h-11 -ml-2 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-gray-100 active:scale-95 transition-all duration-150 cursor-pointer"
      aria-label="Go back"
    >
      <ChevronLeft size={24} />
    </button>
  );
};
