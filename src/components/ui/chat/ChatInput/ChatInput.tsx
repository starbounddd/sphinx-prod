'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Send, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  maxRows?: number;
}

/**
 * Chat input with textarea + send button.
 * Rounded pill style with mic icon and coral gradient send button.
 */
export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = 'Type your response...',
  disabled = false,
  className,
  maxRows = 4,
}: ChatInputProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = 'auto';
    const lineHeight = 24;
    const maxHeight = lineHeight * maxRows;
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value, maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && value.trim() && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  const isDisabledSend = disabled || !value.trim();

  return (
    <div className={cn('flex w-full items-center gap-3', className)}>
      {/* Text input card */}
      <div
        className="flex h-12 flex-1 items-center gap-3 rounded-3xl border border-[#E7E5E4] bg-white px-4 shadow-[0_1px_4px_rgba(41,37,36,0.02)]"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#78716C15]">
          <Mic className="h-[18px] w-[18px] text-gray" />
        </div>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'flex-1 resize-none bg-transparent py-3 text-sm text-foreground placeholder:text-muted-foreground',
            'focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            'font-body leading-6',
          )}
        />
      </div>

      {/* Send button — coral gradient */}
      <button
        type="button"
        onClick={onSend}
        disabled={isDisabledSend}
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-full',
          'bg-linear-to-b from-[#FFB7B2] to-[#FF9B95] text-white shadow-[0_2px_10px_rgba(255,183,178,0.19)]',
          'transition-opacity hover:opacity-90',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
        aria-label="Send message"
      >
        <Send className="h-5 w-5" />
      </button>
    </div>
  );
}
