'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Phone, 
  ArrowLeft, 
  Check, 
  X, 
  ShieldCheck, 
  RefreshCw, 
  ChevronDown,
  User,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { loginAccount, loginWithPhone, registerAccount } from '@/lib/auth';

// Country codes for Phone Login option
const COUNTRY_CODES = [
  { code: '+1', country: 'US/CA', flag: '🇺🇸' },
  { code: '+44', country: 'UK', flag: '🇬🇧' },
  { code: '+91', country: 'IN', flag: '🇮🇳' },
  { code: '+61', country: 'AU', flag: '🇦🇺' },
  { code: '+49', country: 'DE', flag: '🇩🇪' },
  { code: '+33', country: 'FR', flag: '🇫🇷' },
  { code: '+81', country: 'JP', flag: '🇯🇵' },
];

export default function AuthPage() {
  const router = useRouter();

  // Main view state: 'email' | 'phone'
  const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');

  // Mode state for Email auth: 'login' | 'signup'
  const [mode, setMode] = useState<'login' | 'signup'>('login');

  // Password Recovery sub-view / modal state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [resetSubmitted, setResetSubmitted] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Validation & Error States
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Phone Auth State
  const [countryCode, setCountryCode] = useState('+1');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(0);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Password Requirement Checks (Dynamic)
  const passwordChecks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password),
  };

  const isPasswordValid = 
    passwordChecks.length && 
    passwordChecks.uppercase && 
    passwordChecks.number && 
    passwordChecks.special;

  // Email format regex
  const validateEmailFormat = (val: string) => {
    const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return pattern.test(val);
  };

  // Timer effect for OTP resend countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendTimer > 0) {
      timer = setTimeout(() => setResendTimer((prev) => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendTimer]);

  // Handle Email Validation
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    if (emailError) {
      if (validateEmailFormat(val)) {
        setEmailError('');
      }
    }
  };

  const handleEmailBlur = () => {
    if (email && !validateEmailFormat(email)) {
      setEmailError('Please enter a valid email address (e.g. name@domain.com)');
    } else {
      setEmailError('');
    }
  };

  // Handle Password Change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (passwordError && val) setPasswordError('');
    if (confirmPassword && val !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  // Handle Confirm Password Change
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setConfirmPassword(val);
    if (val !== password) {
      setConfirmPasswordError('Passwords do not match');
    } else {
      setConfirmPasswordError('');
    }
  };

  // Switch between Login and Signup modes cleanly
  const toggleMode = (newMode: 'login' | 'signup') => {
    setMode(newMode);
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');
    setSuccessMessage('');
  };

  // Handle Form Submission for Email Auth
  const handleSubmitEmailAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    // Validate email
    if (!email) {
      setEmailError('Email address is required');
      return;
    }
    if (!validateEmailFormat(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }

    // Validate password
    if (!password) {
      setPasswordError('Password is required');
      return;
    }

    if (mode === 'signup') {
      if (!fullName.trim()) {
        setGeneralError('Full name is required');
        return;
      }
      if (!isPasswordValid) {
        setPasswordError('Please fulfill all password security requirements');
        return;
      }
      if (password !== confirmPassword) {
        setConfirmPasswordError('Passwords do not match');
        return;
      }
      if (!agreeTerms) {
        setGeneralError('You must agree to the Terms of Service & Privacy Policy');
        return;
      }
    }

    setIsLoading(true);
    try {
      if (mode === 'login') {
        loginAccount(email, password);
        setSuccessMessage('Successfully logged in! Redirecting...');
      } else {
        registerAccount({ fullName, email, password, phone: phoneNumber });
        setSuccessMessage('Account created successfully! Welcome aboard.');
      }
      setTimeout(() => router.push('/monitoring'), 600);
    } catch (error) {
      setGeneralError(error instanceof Error ? error.message : 'Unable to complete authentication');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset Request
  const handleSendResetLink = (e: React.FormEvent) => {
    e.preventDefault();
    setResetEmailError('');

    if (!resetEmail) {
      setResetEmailError('Email address is required');
      return;
    }
    if (!validateEmailFormat(resetEmail)) {
      setResetEmailError('Please enter a valid email address');
      return;
    }

    setIsResetting(true);
    setTimeout(() => {
      setIsResetting(false);
      setResetSubmitted(true);
    }, 1000);
  };

  // Handle Send OTP for Phone Auth
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    const cleanPhone = phoneNumber.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 7) {
      setPhoneError('Please enter a valid phone number');
      return;
    }

    setIsSendingOtp(true);
    setTimeout(() => {
      setIsSendingOtp(false);
      setOtpSent(true);
      setResendTimer(30);
      setOtpValues(['', '', '', '', '', '']);
      setOtpError('');
      // Focus first OTP input
      setTimeout(() => otpInputRefs.current[0]?.focus(), 100);
    }, 1000);
  };

  // Handle OTP Inputs
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otpValues];
    // Take only the last entered digit
    newOtp[index] = value.slice(-1);
    setOtpValues(newOtp);
    setOtpError('');

    // Move focus to next input if digit entered
    if (value && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim().replace(/\D/g, '').slice(0, 6);
    if (pastedData) {
      const newOtp = [...otpValues];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = pastedData[i] || '';
      }
      setOtpValues(newOtp);
      const nextFocusIndex = Math.min(pastedData.length, 5);
      otpInputRefs.current[nextFocusIndex]?.focus();
    }
  };

  // Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otpValues.join('');
    if (fullOtp.length < 6) {
      setOtpError('Please enter the complete 6-digit verification code');
      return;
    }

    setIsVerifyingOtp(true);
    loginWithPhone(`${countryCode} ${phoneNumber}`);
    setIsVerifyingOtp(false);
    setSuccessMessage('Phone verified successfully! Redirecting...');
    setTimeout(() => router.push('/monitoring'), 600);
  };

  // Handle Social Google Login
  const handleGoogleSignIn = () => {
    setIsLoading(true);
    registerAccount({
      fullName: 'Google User',
      email: 'google.user@example.com',
      password: `Google@${Date.now()}`,
    });
    setIsLoading(false);
    setSuccessMessage('Signed in with Google! Redirecting...');
    setTimeout(() => router.push('/monitoring'), 600);
  };

  return (
    <div className="min-h-screen bg-[#475569] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 font-sans text-slate-900">
      {/* Outer Card Container */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-300/40 p-6 sm:p-8 transition-all">
        
        {/* Main Navigation Header: Auth Method Tabs */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex space-x-1 bg-slate-100/80 p-1 rounded-xl w-full">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('email');
                setGeneralError('');
                setSuccessMessage('');
              }}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                authMethod === 'email'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5 mr-1.5" />
              Email
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMethod('phone');
                setGeneralError('');
                setSuccessMessage('');
              }}
              className={`flex-1 flex items-center justify-center py-2 px-3 text-xs font-semibold rounded-lg transition-all ${
                authMethod === 'phone'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Phone className="w-3.5 h-3.5 mr-1.5" />
              Phone & OTP
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {generalError && (
          <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-start space-x-2 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <span>{generalError}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-start space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 1: EMAIL & PASSWORD AUTH (LOGIN / SIGN UP)              */}
        {/* ============================================================ */}
        {authMethod === 'email' && (
          <div>
            {/* Header Title */}
            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {mode === 'login'
                  ? 'Enter your credentials to access your account'
                  : 'Get started in seconds with a free account'}
              </p>
            </div>

            {/* Google Sign-in Button */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-3 py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
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
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-slate-400 font-medium">
                  or continue with email
                </span>
              </div>
            </div>

            {/* Email Form */}
            <form onSubmit={handleSubmitEmailAuth} className="space-y-4" noValidate>
              
              {/* Sign Up: Full Name */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <User className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Email Field with Dynamic Validation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    onBlur={handleEmailBlur}
                    placeholder="name@company.com"
                    className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      emailError
                        ? 'border-red-400 focus:ring-1 focus:ring-red-500 focus:border-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                    }`}
                  />
                </div>
                {emailError && (
                  <p className="mt-1 text-[11px] text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                    {emailError}
                  </p>
                )}
              </div>

              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number <span className="font-normal text-slate-400">(optional)</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
                    />
                  </div>
                </div>
              )}

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setResetEmail(email);
                        setResetEmailError('');
                        setResetSubmitted(false);
                        setIsForgotModalOpen(true);
                      }}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={handlePasswordChange}
                    placeholder="••••••••"
                    className={`w-full pl-9 pr-9 py-2 text-xs bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                      passwordError
                        ? 'border-red-400 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                        : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {passwordError && (
                  <p className="mt-1 text-[11px] text-red-600 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Dynamic Password Strength Indicators (Sign Up Only) */}
              {mode === 'signup' && (
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl space-y-2 text-xs">
                  <div className="text-[11px] font-semibold text-slate-600 mb-1">
                    Password Requirements:
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div className="flex items-center space-x-1.5">
                      {passwordChecks.length ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                        </div>
                      )}
                      <span className={passwordChecks.length ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                        Min. 8 characters
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {passwordChecks.uppercase ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                        </div>
                      )}
                      <span className={passwordChecks.uppercase ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                        1 Uppercase letter
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {passwordChecks.number ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                        </div>
                      )}
                      <span className={passwordChecks.number ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                        1 Number (0-9)
                      </span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {passwordChecks.special ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      ) : (
                        <div className="w-3.5 h-3.5 rounded-full border border-slate-300 flex items-center justify-center shrink-0">
                          <div className="w-1 h-1 rounded-full bg-slate-400" />
                        </div>
                      )}
                      <span className={passwordChecks.special ? 'text-emerald-700 font-medium' : 'text-slate-500'}>
                        1 Special char
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm Password Field (Sign Up Only) */}
              {mode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="••••••••"
                      className={`w-full pl-9 pr-9 py-2 text-xs bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                        confirmPasswordError
                          ? 'border-red-400 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                          : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {confirmPasswordError && (
                    <p className="mt-1 text-[11px] text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {confirmPasswordError}
                    </p>
                  )}
                </div>
              )}

              {/* Remember Me / Terms Checkbox */}
              {mode === 'login' ? (
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer accent-slate-900"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer">
                    Remember me for 30 days
                  </label>
                </div>
              ) : (
                <div className="flex items-start">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer accent-slate-900 shrink-0"
                  />
                  <label htmlFor="agree-terms" className="ml-2 block text-xs text-slate-600 leading-normal cursor-pointer">
                    I agree to the{' '}
                    <a href="#" className="font-semibold text-slate-900 underline hover:text-slate-700">
                      Terms of Service
                    </a>{' '}
                    and{' '}
                    <a href="#" className="font-semibold text-slate-900 underline hover:text-slate-700">
                      Privacy Policy
                    </a>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-60 flex items-center justify-center"
              >
                {isLoading ? (
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                ) : (
                  <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
                )}
              </button>
            </form>

            {/* Mode Switcher Toggle */}
            <div className="mt-6 text-center text-xs text-slate-500">
              {mode === 'login' ? (
                <span>
                  Don't have an account?{' '}
                  <button
                    type="button"
                    onClick={() => toggleMode('signup')}
                    className="font-semibold text-slate-900 hover:underline focus:outline-none"
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => toggleMode('login')}
                    className="font-semibold text-slate-900 hover:underline focus:outline-none"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* VIEW 2: PHONE & OTP AUTHENTICATION                           */}
        {/* ============================================================ */}
        {authMethod === 'phone' && (
          <div>
            <div className="mb-6">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                {!otpSent ? 'Log in with Phone' : 'Enter Verification Code'}
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                {!otpSent
                  ? 'We will send a 6-digit verification code to your phone'
                  : `We sent a code to ${countryCode} ${phoneNumber}`}
              </p>
            </div>

            {!otpSent ? (
              /* Phone Input Form */
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Phone Number
                  </label>
                  <div className="flex space-x-2">
                    {/* Country Code Prefix Dropdown */}
                    <div className="relative w-28 shrink-0">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        className="w-full appearance-none pl-3 pr-7 py-2 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 font-medium cursor-pointer"
                      >
                        {COUNTRY_CODES.map((item) => (
                          <option key={item.code} value={item.code}>
                            {item.flag} {item.code}
                          </option>
                        ))}
                      </select>
                      <div className="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none text-slate-400">
                        <ChevronDown className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* Phone Input Field */}
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => {
                          setPhoneNumber(e.target.value);
                          if (phoneError) setPhoneError('');
                        }}
                        placeholder="(555) 000-0000"
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                          phoneError
                            ? 'border-red-400 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                            : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                  {phoneError && (
                    <p className="mt-1 text-[11px] text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {phoneError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSendingOtp}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-60 flex items-center justify-center"
                >
                  {isSendingOtp ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Send OTP</span>
                  )}
                </button>
              </form>
            ) : (
              /* OTP Verification Form */
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      6-Digit OTP Code
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-xs font-medium text-slate-600 hover:text-slate-900 underline"
                    >
                      Change number
                    </button>
                  </div>

                  {/* 6 Digit Inputs */}
                  <div className="flex justify-between gap-2" onPaste={handleOtpPaste}>
                    {otpValues.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpInputRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-12 text-center text-base font-bold bg-white border rounded-xl text-slate-900 focus:outline-none transition-all ${
                          otpError
                            ? 'border-red-400 ring-1 ring-red-400 bg-red-50/20'
                            : digit
                            ? 'border-slate-900 ring-1 ring-slate-900'
                            : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                        }`}
                      />
                    ))}
                  </div>

                  {otpError && (
                    <p className="mt-2 text-[11px] text-red-600 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                      {otpError}
                    </p>
                  )}
                </div>

                {/* Resend Timer & Action */}
                <div className="text-center text-xs text-slate-500">
                  {resendTimer > 0 ? (
                    <span>Resend code in <strong className="text-slate-800">{resendTimer}s</strong></span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setResendTimer(30);
                        setOtpError('');
                      }}
                      className="font-semibold text-slate-900 hover:underline focus:outline-none"
                    >
                      Resend OTP Code
                    </button>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isVerifyingOtp}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-1 disabled:opacity-60 flex items-center justify-center"
                >
                  {isVerifyingOtp ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  ) : (
                    <span>Verify & Log In</span>
                  )}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL / SUB-VIEW: FORGOT PASSWORD RECOVERY                   */}
      {/* ============================================================ */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 relative">
            <button
              type="button"
              onClick={() => setIsForgotModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {!resetSubmitted ? (
              <div>
                <div className="flex items-center space-x-2 text-slate-900 mb-2">
                  <ShieldCheck className="w-5 h-5 text-slate-800" />
                  <h3 className="text-base font-bold">Reset Password</h3>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  Enter your email address below and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSendResetLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        value={resetEmail}
                        onChange={(e) => {
                          setResetEmail(e.target.value);
                          if (resetEmailError) setResetEmailError('');
                        }}
                        placeholder="name@company.com"
                        className={`w-full pl-9 pr-3 py-2 text-xs bg-white border rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none transition-all ${
                          resetEmailError
                            ? 'border-red-400 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                            : 'border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900'
                        }`}
                      />
                    </div>
                    {resetEmailError && (
                      <p className="mt-1 text-[11px] text-red-600 flex items-center">
                        <AlertCircle className="w-3 h-3 mr-1 shrink-0" />
                        {resetEmailError}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsForgotModalOpen(false)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isResetting}
                      className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center disabled:opacity-60"
                    >
                      {isResetting ? (
                        <RefreshCw className="w-4 h-4 animate-spin text-white" />
                      ) : (
                        <span>Send Link</span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="text-center py-2">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Check your email</h3>
                <p className="text-xs text-slate-500 mb-5">
                  We have sent password reset instructions to{' '}
                  <strong className="text-slate-800">{resetEmail}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(false)}
                  className="w-full py-2 px-4 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Return to Login
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Footer info */}
      <footer className="mt-8 text-center text-[11px] text-slate-200 font-medium">
        &copy; {new Date().getFullYear()} SolarPulse AI. All rights reserved. &bull; Privacy & Terms
      </footer>
    </div>
  );
}
