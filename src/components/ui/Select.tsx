import { SelectOption } from '@/types/common'

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function Select({ value, onChange, options, disabled, className }: SelectProps) {
  return (
    <div className={`flex flex-row gap-1 flex-wrap ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={`px-2 py-1 rounded border text-xs transition-colors
            ${value === option.value ? 'bg-primary-100 border-primary-500 text-primary-700 dark:bg-primary-900 dark:border-primary-400 dark:text-primary-300' : 'bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300'}
            ${option.disabled || disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-primary-50 dark:hover:bg-primary-800'}
          `}
          onClick={() => !option.disabled && !disabled && onChange(option.value)}
          disabled={option.disabled || disabled}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
} 