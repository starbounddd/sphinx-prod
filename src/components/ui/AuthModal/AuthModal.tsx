'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/shadcn/input';
import { Separator } from '@/components/ui/shadcn/separator';
import { OtpInput, OTP_LENGTH } from './OtpInput';
import { PasswordStrengthIndicator } from './PasswordStrengthIndicator';
import { useAuthFlow } from './useAuthFlow';
import type { Tab } from './useAuthFlow';

const TAB_OPTIONS: { value: Tab; label: string }[] = [
  { value: 'signup', label: 'Sign Up' },
  { value: 'login', label: 'Log In' },
];

// Hoisted static SVG for Google logo
const GOOGLE_LOGO = (
  <svg className="h-5 w-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

// Prevent paste on password confirmation
function preventPaste(e: React.ClipboardEvent): void {
  e.preventDefault();
}

export function AuthModal(): React.JSX.Element {
  const {
    isOpen,
    activeTab,
    error,
    loading,
    loadingMessage,
    otpValue,
    pendingEmail,
    resendCooldown,
    signupPassword,
    isOtpStep,
    dialogTitle,
    handleCredentialsSubmit,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToCredentials,
    handleTabChange,
    handleOpenChange,
    handleGoogleLogin,
    setOtpValue,
    setSignupPassword,
  } = useAuthFlow();

  return (
    <Dialog.Root open={isOpen} onOpenChange={handleOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-dark/40 backdrop-blur-sm" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-dark/10 bg-white p-8 shadow-xl">
          <Dialog.Close asChild>
            <button
              className="absolute right-4 top-4 rounded-full p-2 text-dark/40 hover:bg-dark/5 hover:text-dark"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>

          {/* Back button for OTP step */}
          {isOtpStep && (
            <button
              type="button"
              onClick={handleBackToCredentials}
              className="absolute left-4 top-4 rounded-full p-2 text-dark/40 hover:bg-dark/5 hover:text-dark"
              aria-label="Back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}

          {/* Title */}
          <Dialog.Title className="mb-2 text-center text-2xl font-semibold text-dark">
            {dialogTitle}
          </Dialog.Title>

          {/* Subtitle */}
          <p className="mb-6 text-center text-sm text-dark/60">
            {isOtpStep ? (
              <>
                We sent a 6-digit confirmation code to{' '}
                <span className="font-medium text-dark">{pendingEmail}</span>
              </>
            ) : activeTab === 'signup' ? (
              'Start your mental health journey'
            ) : (
              'Continue your journey'
            )}
          </p>

          {/* Tab switcher - only show on credentials step */}
          {!isOtpStep && (
            <div className="mb-6 flex rounded-full border border-dark/10 bg-dark/5 p-1">
              {TAB_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleTabChange(value)}
                  className={`flex-1 rounded-full py-2 text-sm font-medium transition-colors ${
                    activeTab === value
                      ? 'bg-white text-dark shadow-sm'
                      : 'text-dark/60 hover:text-dark'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* OTP Form (signup only) */}
          {isOtpStep ? (
            <form onSubmit={handleOtpSubmit}>
              <div className="mb-6">
                <OtpInput value={otpValue} onChange={setOtpValue} disabled={loading} />
              </div>

              {/* Verify button */}
              <button
                type="submit"
                disabled={loading || otpValue.length !== OTP_LENGTH}
                className="w-full rounded-full bg-dark py-3 font-medium text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
              >
                {loading ? loadingMessage : 'Verify Code'}
              </button>

              {/* Resend OTP */}
              <div className="mt-4 text-center">
                {resendCooldown > 0 ? (
                  <p className="text-sm text-dark/60">Resend code in {resendCooldown} seconds</p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={loading}
                    className="text-sm font-medium text-dark hover:text-dark/70 disabled:opacity-50"
                  >
                    Resend code
                  </button>
                )}
              </div>

              {/* Help text */}
              <p className="mt-4 text-center text-xs text-dark/40">
                Check your spam folder if you don&apos;t see the email
              </p>
            </form>
          ) : (
            <>
              {/* Email/Password Form */}
              <form onSubmit={handleCredentialsSubmit}>
                <div className="space-y-3">
                  {/* Email */}
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email address"
                    required
                    className="h-12 rounded-xl border-dark/10 bg-white px-4 text-base"
                  />

                  {/* Password */}
                  <div>
                    <Input
                      name="password"
                      type="password"
                      placeholder="Password"
                      required
                      minLength={8}
                      value={activeTab === 'signup' ? signupPassword : undefined}
                      onChange={
                        activeTab === 'signup'
                          ? (e) => setSignupPassword(e.target.value)
                          : undefined
                      }
                      onPaste={activeTab === 'signup' ? preventPaste : undefined}
                      className="h-12 rounded-xl border-dark/10 bg-white px-4 text-base"
                    />
                    <PasswordStrengthIndicator
                      password={signupPassword}
                      show={activeTab === 'signup'}
                    />
                  </div>

                  {/* Confirm Password (signup only) */}
                  {activeTab === 'signup' && (
                    <Input
                      name="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      required
                      minLength={8}
                      onPaste={preventPaste}
                      className="h-12 rounded-xl border-dark/10 bg-white px-4 text-base"
                    />
                  )}
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-4 w-full rounded-full bg-dark py-3 font-medium text-white transition-colors hover:bg-dark/90 disabled:opacity-50"
                >
                  {loading
                    ? loadingMessage
                    : activeTab === 'signup'
                      ? 'Get verification code'
                      : 'Continue'}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <Separator className="flex-1" />
                <span className="text-sm text-dark/40">or</span>
                <Separator className="flex-1" />
              </div>

              {/* Google OAuth */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-full border border-dark/10 bg-white py-3 font-medium text-dark transition-colors hover:bg-dark/5"
              >
                {GOOGLE_LOGO}
                Continue with Google
              </button>

              {/* Terms */}
              <p className="mt-6 text-center text-xs text-dark/40">
                By continuing, you agree to our{' '}
                <a href="/terms" className="underline hover:text-dark/60">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="underline hover:text-dark/60">
                  Privacy Policy
                </a>
              </p>
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
