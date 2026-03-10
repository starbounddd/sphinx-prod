'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { useAuthModal } from '@/contexts/AuthModalContext';
import { validatePassword } from '@/utils/validation';
import { OTP_LENGTH } from './OtpInput';

export type Tab = 'signup' | 'login';
export type SignupStep = 'credentials' | 'otp';

export const POST_AUTH_REDIRECT = '/assessment/screening';

const OTP_RESEND_COOLDOWN_SECONDS = 60;
const DEFAULT_LOADING_MESSAGE = 'Loading...';

export interface AuthFlowState {
  isOpen: boolean;
  activeTab: Tab;
  signupStep: SignupStep;
  error: string | null;
  loading: boolean;
  loadingMessage: string;
  otpValue: string;
  pendingEmail: string;
  resendCooldown: number;
  signupPassword: string;
  isOtpStep: boolean;
  dialogTitle: string;
}

export interface AuthFlowHandlers {
  handleCredentialsSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleOtpSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleResendOtp: () => Promise<void>;
  handleBackToCredentials: () => void;
  handleTabChange: (tab: Tab) => void;
  handleOpenChange: (open: boolean) => void;
  handleGoogleLogin: () => void;
  setOtpValue: (value: string) => void;
  setSignupPassword: (value: string) => void;
}

const DIALOG_TITLES: Record<Tab, string> = {
  signup: 'Create Account',
  login: 'Welcome Back',
};

export function useAuthFlow(): AuthFlowState & AuthFlowHandlers {
  const { isOpen, closeAuthModal } = useAuthModal();
  const router = useRouter();
  const supabase = createClient();

  const [activeTab, setActiveTab] = useState<Tab>('signup');
  const [signupStep, setSignupStep] = useState<SignupStep>('credentials');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string>(DEFAULT_LOADING_MESSAGE);
  const [otpValue, setOtpValue] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const [signupPassword, setSignupPassword] = useState('');

  // Countdown timer for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSignupStep('credentials');
      setOtpValue('');
      setPendingEmail('');
      setError(null);
      setResendCooldown(0);
      setSignupPassword('');
      setLoadingMessage(DEFAULT_LOADING_MESSAGE);
    }
  }, [isOpen]);

  // Reset step when switching tabs
  useEffect(() => {
    setSignupStep('credentials');
    setOtpValue('');
    setPendingEmail('');
    setError(null);
    setSignupPassword('');
  }, [activeTab]);

  function redirectAfterAuth(): void {
    closeAuthModal();
    router.refresh();
    router.push(POST_AUTH_REDIRECT);
  }

  async function resendSignupOtp(email: string): Promise<boolean> {
    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (resendError) {
      setError(resendError.message);
      return false;
    }

    setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
    return true;
  }

  async function handleCredentialsSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const email = (form.elements.namedItem('email') as HTMLInputElement).value;
    const password = (form.elements.namedItem('password') as HTMLInputElement).value;

    if (activeTab === 'signup') {
      const confirmPassword = (form.elements.namedItem('confirmPassword') as HTMLInputElement)
        .value;
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      // Validate password strength and check against leaked passwords
      setLoadingMessage('Checking password security...');
      const validation = await validatePassword(password);
      if (!validation.isValid) {
        setError(validation.errors[0] || 'Password does not meet security requirements');
        setLoading(false);
        setLoadingMessage(DEFAULT_LOADING_MESSAGE);
        return;
      }

      setLoadingMessage('Creating account...');
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        setLoadingMessage(DEFAULT_LOADING_MESSAGE);
        return;
      }

      if (data.user && !data.session) {
        // User created but not confirmed - show OTP screen
        setPendingEmail(email);
        setResendCooldown(OTP_RESEND_COOLDOWN_SECONDS);
        setSignupStep('otp');
        setLoading(false);
        setLoadingMessage(DEFAULT_LOADING_MESSAGE);
      } else if (data.session) {
        // Auto-confirmed (shouldn't happen if email confirmation is enabled)
        setLoading(false);
        redirectAfterAuth();
      } else {
        setError('Failed to create account. Please try again.');
        setLoading(false);
        setLoadingMessage(DEFAULT_LOADING_MESSAGE);
      }
    } else {
      // Login flow
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }

      if (data.session) {
        setLoading(false);
        redirectAfterAuth();
      }
    }
  }

  async function handleOtpSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    if (otpValue.length !== OTP_LENGTH) {
      setError('Please enter all 6 digits');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingMessage('Verifying...');

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: pendingEmail,
      token: otpValue,
      type: 'signup',
    });

    if (verifyError) {
      if (verifyError.message.includes('expired')) {
        setError('Verification code has expired. Please request a new one.');
      } else if (verifyError.message.includes('invalid')) {
        setError('Invalid verification code. Please check and try again.');
      } else {
        setError(verifyError.message);
      }
      setLoading(false);
      setLoadingMessage(DEFAULT_LOADING_MESSAGE);
      return;
    }

    if (data.session) {
      setLoading(false);
      redirectAfterAuth();
    } else {
      setError('Verification failed. Please try again.');
      setLoading(false);
      setLoadingMessage(DEFAULT_LOADING_MESSAGE);
    }
  }

  async function handleResendOtp(): Promise<void> {
    if (resendCooldown > 0 || loading) return;

    setError(null);
    setLoading(true);
    setLoadingMessage('Sending code...');

    const success = await resendSignupOtp(pendingEmail);
    if (success) {
      setOtpValue('');
    }

    setLoading(false);
    setLoadingMessage(DEFAULT_LOADING_MESSAGE);
  }

  function handleBackToCredentials(): void {
    setSignupStep('credentials');
    setOtpValue('');
    setError(null);
  }

  const handleTabChange = useCallback((tab: Tab): void => {
    setActiveTab(tab);
    setError(null);
  }, []);

  const handleOpenChange = useCallback(
    (open: boolean): void => {
      if (!open) closeAuthModal();
    },
    [closeAuthModal]
  );

  const handleGoogleLogin = useCallback((): void => {
    // TODO: Implement Google OAuth
    alert('Google login coming soon!');
  }, []);

  const isOtpStep = activeTab === 'signup' && signupStep === 'otp';
  const dialogTitle = isOtpStep ? 'Verify Your Email' : DIALOG_TITLES[activeTab];

  return {
    // State
    isOpen,
    activeTab,
    signupStep,
    error,
    loading,
    loadingMessage,
    otpValue,
    pendingEmail,
    resendCooldown,
    signupPassword,
    isOtpStep,
    dialogTitle,

    // Handlers
    handleCredentialsSubmit,
    handleOtpSubmit,
    handleResendOtp,
    handleBackToCredentials,
    handleTabChange,
    handleOpenChange,
    handleGoogleLogin,
    setOtpValue,
    setSignupPassword,
  };
}
