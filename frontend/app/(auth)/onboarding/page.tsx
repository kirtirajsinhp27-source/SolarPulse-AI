'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
  Building2,
  BadgeCheck,
  ChevronDown,
  ArrowRight,
  Check,
  Bell,
  Globe,
  Zap,
  Sliders,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();

  // Active step: 1 (Personal Info) | 2 (Preferences)
  const [activeStep, setActiveStep] = useState<1 | 2>(1);

  // Step 1 Form States
  const [fullName, setFullName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [role, setRole] = useState('');
  const [receiveUpdates, setReceiveUpdates] = useState(true);

  // Step 2 Form States
  const [timezone, setTimezone] = useState('UTC+05:30 (IST)');
  const [defaultUnit, setDefaultUnit] = useState<'kW' | 'MW'>('kW');
  const [alertChannel, setAlertChannel] = useState<'email' | 'slack' | 'sms'>('email');

  // Loading and feedback states
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (activeStep === 1) {
      if (!fullName.trim()) {
        setErrorMsg('Please enter your full name');
        return;
      }
      if (!workspaceName.trim()) {
        setErrorMsg('Please enter your workspace or company name');
        return;
      }
      if (!role) {
        setErrorMsg('Please select your role');
        return;
      }
      // Move to step 2 smoothly
      setActiveStep(2);
      return;
    }

    // Final Step 2 Submission
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/monitoring');
      }, 1000);
    }, 1000);
  };

  const handleSkip = () => {
    router.push('/monitoring');
  };

  return (
    <div className="min-h-screen bg-[#4C5768] flex flex-col justify-center items-center px-4 py-8 sm:px-6 lg:px-8 font-sans antialiased text-[#0F172A]">
      {/* Main White Card Container */}
      <div className="w-full max-w-[480px] sm:max-w-[500px] bg-[#FFFFFF] rounded-2xl shadow-[0_20px_25px_-5px_rgba(0,0,0,0.15),0_8px_10px_-6px_rgba(0,0,0,0.1)] border border-[#E2E8F0] p-8 sm:p-10 transition-all">
        
        {/* Top Segmented Navigation (Pill Tabs) */}
        <div className="bg-[#F1F5F9] p-1 rounded-[14px] flex items-center mb-7">
          <button
            type="button"
            onClick={() => setActiveStep(1)}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-[10px] transition-all flex items-center justify-center space-x-1.5 ${
              activeStep === 1
                ? 'bg-[#FFFFFF] text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#0F172A] text-white text-[10px] font-bold flex items-center justify-center">
              1
            </span>
            <span>Step 1: Personal Info</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (fullName && workspaceName && role) {
                setActiveStep(2);
              }
            }}
            className={`flex-1 py-2 px-3 text-xs font-semibold rounded-[10px] transition-all flex items-center justify-center space-x-1.5 ${
              activeStep === 2
                ? 'bg-[#FFFFFF] text-[#0F172A] shadow-sm'
                : 'text-[#64748B] hover:text-[#0F172A]'
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-[#E2E8F0] text-[#64748B] text-[10px] font-bold flex items-center justify-center">
              2
            </span>
            <span>Step 2: Preferences</span>
          </button>
        </div>

        {/* Heading & Subheading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#0F172A] leading-[1.2] tracking-tight">
            {activeStep === 1 ? 'Complete your profile' : 'Workspace Preferences'}
          </h1>
          <p className="text-sm font-normal text-[#64748B] leading-[1.5] mt-1.5">
            {activeStep === 1
              ? 'Provide your details to personalize your workspace environment.'
              : 'Configure default telemetry units, timezones, and alert channels.'}
          </p>
        </div>

        {/* Error Feedback Message */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center animate-fadeIn">
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Feedback Banner */}
        {isSuccess && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile setup complete! Redirecting to dashboard...</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          
          {/* ========================================================= */}
          {/* STEP 1: PERSONAL & WORKSPACE INFO                          */}
          {/* ========================================================= */}
          {activeStep === 1 && (
            <>
              {/* Full Name Field */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <User className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Alex Morgan"
                    className="w-full h-12 pl-11 pr-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>
              </div>

              {/* Workspace / Company Name Field */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">
                  Workspace Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Building2 className="w-[18px] h-[18px]" />
                  </div>
                  <input
                    type="text"
                    value={workspaceName}
                    onChange={(e) => {
                      setWorkspaceName(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    placeholder="e.g. Acme Corp"
                    className="w-full h-12 pl-11 pr-4 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] placeholder-[#94A3B8] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all"
                  />
                </div>
              </div>

              {/* Role Selection Dropdown */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">
                  Your Role
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <BadgeCheck className="w-[18px] h-[18px]" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (errorMsg) setErrorMsg('');
                    }}
                    className="w-full h-12 appearance-none pl-11 pr-10 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all cursor-pointer"
                  >
                    <option value="" disabled className="text-[#94A3B8]">
                      Select your primary role...
                    </option>
                    <option value="Solar PV Engineer">Solar PV Engineer</option>
                    <option value="Plant Operations Manager">Plant Operations Manager</option>
                    <option value="Grid Telemetry Analyst">Grid Telemetry Analyst</option>
                    <option value="Maintenance Technician">Maintenance Technician</option>
                    <option value="Executive / Asset Owner">Executive / Asset Owner</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Checkbox Option */}
              <div className="pt-1">
                <label className="flex items-start space-x-3 cursor-pointer select-none">
                  <div className="relative flex items-center mt-0.5">
                    <input
                      type="checkbox"
                      checked={receiveUpdates}
                      onChange={(e) => setReceiveUpdates(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-4 h-4 rounded border transition-all flex items-center justify-center ${
                        receiveUpdates
                          ? 'bg-[#0F172A] border-[#0F172A]'
                          : 'bg-white border-[#CBD5E1] hover:border-[#94A3B8]'
                      }`}
                    >
                      {receiveUpdates && <Check className="w-3 h-3 text-white stroke-[3]" />}
                    </div>
                  </div>
                  <span className="text-xs text-[#64748B] leading-normal font-normal">
                    Receive product updates and announcements via email
                  </span>
                </label>
              </div>
            </>
          )}

          {/* ========================================================= */}
          {/* STEP 2: WORKSPACE PREFERENCES                             */}
          {/* ========================================================= */}
          {activeStep === 2 && (
            <>
              {/* Default Telemetry Unit */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">
                  Default Power Metric
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setDefaultUnit('kW')}
                    className={`h-11 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
                      defaultUnit === 'kW'
                        ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-sm'
                        : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Kilowatts (kW / kWh)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDefaultUnit('MW')}
                    className={`h-11 rounded-xl border text-xs font-semibold transition-all flex items-center justify-center space-x-2 ${
                      defaultUnit === 'MW'
                        ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-sm'
                        : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>Megawatts (MW / MWh)</span>
                  </button>
                </div>
              </div>

              {/* Timezone */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">
                  System Timezone
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <Globe className="w-[18px] h-[18px]" />
                  </div>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full h-12 appearance-none pl-11 pr-10 py-3 text-sm bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] focus:outline-none focus:border-[#0F172A] focus:ring-1 focus:ring-[#0F172A] transition-all cursor-pointer"
                  >
                    <option value="UTC+05:30 (IST)">UTC+05:30 (India Standard Time)</option>
                    <option value="UTC+00:00 (GMT)">UTC+00:00 (London, GMT)</option>
                    <option value="UTC-05:00 (EST)">UTC-05:00 (Eastern Time US)</option>
                    <option value="UTC-08:00 (PST)">UTC-08:00 (Pacific Time US)</option>
                    <option value="UTC+01:00 (CET)">UTC+01:00 (Central European Time)</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-[#94A3B8]">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              {/* Urgent Alert Dispatch Channel */}
              <div>
                <label className="block text-sm font-medium text-[#334155] mb-1.5">
                  Primary Alert Dispatch
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: 'email', label: 'Email' },
                    { key: 'slack', label: 'Slack Webhook' },
                    { key: 'sms', label: 'SMS Hotline' },
                  ].map((ch) => (
                    <button
                      key={ch.key}
                      type="button"
                      onClick={() => setAlertChannel(ch.key as any)}
                      className={`h-11 rounded-xl border text-xs font-semibold transition-all ${
                        alertChannel === ch.key
                          ? 'border-[#0F172A] bg-[#0F172A] text-white shadow-sm'
                          : 'border-[#E2E8F0] bg-white text-[#334155] hover:bg-slate-50'
                      }`}
                    >
                      {ch.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Primary CTA Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full h-12 bg-[#0F172A] hover:bg-[#1E293B] active:bg-[#020617] text-white text-sm font-semibold rounded-xl shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#0F172A] focus:ring-offset-2 disabled:opacity-60 flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Redirecting...</span>
                </>
              ) : (
                <>
                  <span>{activeStep === 1 ? 'Save & Continue →' : 'Complete Setup & Launch →'}</span>
                </>
              )}
            </button>
          </div>

          {/* Back Action for Step 2 */}
          {activeStep === 2 && (
            <button
              type="button"
              onClick={() => setActiveStep(1)}
              className="w-full py-2 text-xs font-semibold text-[#64748B] hover:text-[#0F172A] transition-colors"
            >
              ← Back to Personal Info
            </button>
          )}

          {/* Secondary Skip Action */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-bold text-[#0F172A] hover:underline focus:outline-none"
            >
              Skip for now
            </button>
          </div>
        </form>
      </div>

      {/* Persistent Bottom Footer */}
      <footer className="mt-8 text-center text-xs text-[#94A3B8] font-normal">
        &copy; 2026 SolarPulse AI. All rights reserved. &bull; Privacy & Terms
      </footer>
    </div>
  );
}
