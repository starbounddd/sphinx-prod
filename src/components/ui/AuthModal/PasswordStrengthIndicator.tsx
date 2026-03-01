'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { validatePasswordStrength } from '@/utils/validation';

export interface PasswordStrengthIndicatorProps {
  password: string;
  show: boolean;
}

export function PasswordStrengthIndicator({
  password,
  show,
}: PasswordStrengthIndicatorProps): React.JSX.Element | null {
  if (!show || !password) return null;

  const { strength, errors } = validatePasswordStrength(password);

  const strengthConfig = {
    weak: { color: 'bg-red-500', width: 'w-1/3', label: 'Weak' },
    fair: { color: 'bg-yellow-500', width: 'w-2/3', label: 'Fair' },
    strong: { color: 'bg-green-500', width: 'w-full', label: 'Strong' },
  };

  const config = strengthConfig[strength];

  return (
    <div className="mt-2 space-y-2">
      {/* Strength bar */}
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 rounded-full bg-dark/10">
          <div
            className={`h-full rounded-full transition-all ${config.color} ${config.width}`}
          />
        </div>
        <span
          className={`text-xs font-medium ${strength === 'weak' ? 'text-red-600' : strength === 'fair' ? 'text-yellow-600' : 'text-green-600'}`}
        >
          {config.label}
        </span>
      </div>
      {/* Validation errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((err, i) => (
            <div key={i} className="flex items-start gap-1.5 text-xs text-red-600">
              <AlertTriangle className="mt-0.5 h-3 w-3 flex-shrink-0" />
              <span>{err}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
