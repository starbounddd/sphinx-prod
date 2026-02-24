'use client';

import type { JSX } from 'react';
import { useEffect, useRef } from 'react';
import { Send, MessageCircle } from 'lucide-react';
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
 * Card-style container with MessageCircle icon, matching the Pencil design.
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

  // Auto-resize textarea based on content
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
      <div className="flex flex-1 items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 shadow-[0_2px_8px_rgba(41,37,36,0.03)]"
        style={{ height: 48 }}
      >
        <MessageCircle className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
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
            'leading-6',
          )}
        />
      </div>

      {/* Send button */}
      <button
        type="button"
        onClick={onSend}
        disabled={isDisabledSend}
        className={cn(
          'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
          'bg-[#0D9488] text-white transition-opacity',
          'hover:opacity-90',
          'disabled:pointer-events-none disabled:opacity-50',
        )}
        aria-label="Send message"
      >
        <Send className="h-[18px] w-[18px]" />
      </button>
    </div>
  );
}
