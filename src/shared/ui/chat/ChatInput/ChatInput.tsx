"use client";

import type { JSX } from "react";
import { useEffect, useRef } from "react";
import { Send } from "lucide-react";
import { HoverScale } from "@/shared/ui/motion";
import { cn } from "@/lib/utils";

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
 * Chat input with textarea
 * - Enter to send, Shift+Enter for new line
 * - Auto-resize up to maxRows
 */
export function ChatInput({
  value,
  onChange,
  onSend,
  placeholder = "Type here...",
  disabled = false,
  className,
  maxRows = 4,
}: ChatInputProps): JSX.Element {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea based on content
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Calculate line height (approximately 24px per line)
    const lineHeight = 24;
    const maxHeight = lineHeight * maxRows;

    // Set height to scrollHeight, capped at maxHeight
    textarea.style.height = `${Math.min(textarea.scrollHeight, maxHeight)}px`;
  }, [value, maxRows]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter without Shift sends the message
    if (e.key === "Enter" && !e.shiftKey && value.trim() && !disabled) {
      e.preventDefault();
      onSend();
    }
  };

  const isDisabledSend = disabled || !value.trim();

  return (
    <div
      className={cn(
        "flex items-end gap-3 rounded-3xl border border-sage/30 bg-white/90 p-2 shadow-lg backdrop-blur-sm",
        className
      )}
    >
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        className={cn(
          "flex-1 resize-none bg-transparent px-3 py-2 text-base text-dark placeholder:text-gray/60",
          "focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          "leading-6"
        )}
      />
      <HoverScale
        type="button"
        onClick={onSend}
        disabled={isDisabledSend}
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
          "bg-coral shadow-md",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        aria-label="Send message"
      >
        <Send className="h-5 w-5 text-white" />
      </HoverScale>
    </div>
  );
}
