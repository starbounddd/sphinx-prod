'use client';

import { useEffect, useRef, useState } from 'react';

/* ==========================================================================
   useSessionTimer — Countdown timer hook
   ========================================================================== */

interface UseSessionTimerParams {
  initialSeconds: number;
  isActive: boolean;
  onExpire: () => void;
}

interface UseSessionTimerReturn {
  secondsLeft: number;
  isExpired: boolean;
}

/**
 * A reusable countdown timer that ticks every second while `isActive` is true.
 * Calls `onExpire` exactly once when the countdown reaches zero.
 */
export function useSessionTimer({
  initialSeconds,
  isActive,
  onExpire,
}: UseSessionTimerParams): UseSessionTimerReturn {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [isExpired, setIsExpired] = useState(false);

  // Keep a stable reference to onExpire so callers don't need to memoize it.
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  // Track whether we've already fired onExpire to avoid double-calls.
  const hasFiredRef = useRef(false);

  useEffect(() => {
    if (!isActive || isExpired) return;

    const startTime = Date.now();
    const startSeconds = secondsLeft;

    const interval = setInterval(() => {
      const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, startSeconds - elapsedSeconds);
      setSecondsLeft(remaining);

      if (remaining <= 0) {
        clearInterval(interval);
        setIsExpired(true);
        if (!hasFiredRef.current) {
          hasFiredRef.current = true;
          onExpireRef.current();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, isExpired]); // eslint-disable-line react-hooks/exhaustive-deps

  return { secondsLeft, isExpired };
}
