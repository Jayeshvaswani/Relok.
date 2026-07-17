import React, { useState, useEffect } from 'react';
import { 
  UserProfile, 
  LifestylePreferences, 
  RoomPreferences, 
  LifestyleHabits, 
  HouseRules,
  RoommateCard,
  RoomListing,
  ChatThread
} from './types';
import { PRESET_ROOMMATES, PRESET_ROOMS, PRESET_CHATS } from './data';
import { OnboardingFlow } from './components/OnboardingFlow';
import { MainAppLayout } from './components/MainAppLayout';
import { PrimaryButton, BackButton } from './components/Common';

export default function App() {
  // Simulator State Controls
  const [currentScreen, setCurrentScreen] = useState<'splash' | 'welcome' | 'phone' | 'otp' | 'onboarding' | 'dashboard'>('splash');
  const [currentOnboardingStep, setCurrentOnboardingStep] = useState<number>(1);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean>(false);
  const [isLoginFlow, setIsLoginFlow] = useState<boolean>(false);

  // Authentication Fields
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(''));
  const [otpTimer, setOtpTimer] = useState<number>(30);
  const [canResendOtp, setCanResendOtp] = useState<boolean>(false);

  // Active User Profile Data
  const [userProfile, setUserProfile] = useState<UserProfile>({
    fullName: '',
    age: '',
    gender: '',
    occupation: '',
    education: '',
    bio: '',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
  });

  const [lifestylePref, setLifestylePref] = useState<LifestylePreferences>({
    sleepSchedule: '',
    cleanliness: '',
    socializing: '',
    dietary: '',
    smoking: '',
    drinking: ''
  });

  const [roomPref, setRoomPref] = useState<RoomPreferences>({
    cities: [],
    budgetMin: 0,
    budgetMax: 0,
    sharingType: ''
  });

  const [lifestyleHabits, setLifestyleHabits] = useState<LifestyleHabits>({
    personality: '',
    pets: ''
  });

  const [houseRules, setHouseRules] = useState<HouseRules>({
    guests: '',
    loudMusic: '',
    lateEntry: ''
  });

  // Global Lists of Marketplace data
  const [roommates, setRoommates] = useState<RoommateCard[]>(PRESET_ROOMMATES);
  const [roomListings, setRoomListings] = useState<RoomListing[]>(PRESET_ROOMS);
  const [chats, setChats] = useState<ChatThread[]>(PRESET_CHATS);

  // 1. Splash Auto-navigator
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('welcome');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // 2. OTP Countdown timer simulation
  useEffect(() => {
    let interval: any;
    if (currentScreen === 'otp' && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((prev) => prev - 1);
      }, 1000);
    } else if (otpTimer === 0) {
      setCanResendOtp(true);
    }
    return () => clearInterval(interval);
  }, [currentScreen, otpTimer]);

  // Reset the countdown timer
  const handleResendOtp = () => {
    setOtpTimer(30);
    setCanResendOtp(false);
    // Fill the OTP boxes with a dummy code 123456 as assistance
    setOtpDigits(['1', '2', '3', '4', '5', '6']);
  };

  // OTP Digits onChange helper
  const handleOtpDigitChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // numbers only
    const digitsCopy = [...otpDigits];
    digitsCopy[index] = value.slice(-1); // only keep last digit
    setOtpDigits(digitsCopy);

    // Auto focus next box
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  // OTP Form submission
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpDigits.join('').length < 6) return;

    // CRITICAL ROUTING LOGIC:
    // Check if the user has completed onboarding previously or logged in via "Already have an account"
    if (isLoginFlow || hasCompletedOnboarding) {
      // Returning user -> skip onboarding entirely, route straight to Home Dashboard
      setHasCompletedOnboarding(true);
      setCurrentScreen('dashboard');
    } else {
      // New user -> ALWAYS route to Onboarding Step 1 (Lifestyle & Preferences)
      setCurrentOnboardingStep(1);
      setCurrentScreen('onboarding');
    }
  };

  const handleSkipOnboarding = () => {
    // Treat skip as onboarding completed for future routing purposes
    setHasCompletedOnboarding(true);
    setCurrentScreen('dashboard');
  };

  const handleCompleteOnboarding = () => {
    setHasCompletedOnboarding(true);
    setCurrentScreen('dashboard');
  };

  const handleResetAllState = () => {
    setPhoneNumber('');
    setOtpDigits(Array(6).fill(''));
    setOtpTimer(30);
    setCanResendOtp(false);
    setHasCompletedOnboarding(false);
    setIsLoginFlow(false);
    setCurrentScreen('splash');
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center font-sans selection:bg-[#128A4E]/30 antialiased">
      
      {/* Mobile containment frame - centered on desktop, full bleed on mobile */}
      <div className="w-full max-w-[430px] min-h-screen bg-white text-[#0F172A] shadow-2xl relative overflow-x-hidden flex flex-col justify-between sm:min-h-[850px] sm:rounded-3xl sm:my-4 sm:border sm:border-slate-800">
        
        {/* TOP SYSTEM BAR DECORATION */}
        <div className="h-6 w-full bg-slate-50 flex items-center justify-between px-6 text-slate-400 text-[10px] font-bold select-none border-b border-gray-100 shrink-0">
          <span>Relok Secure App</span>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-4 h-2.5 bg-slate-300 rounded-xs" />
          </div>
        </div>

        {/* SCREENS ROUTER CONTAINER */}
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-between">
          
          {/* SCREEN 1: Splash Screen */}
          {currentScreen === 'splash' && (
            <div className="flex-1 flex flex-col items-center justify-between py-12 text-center animate-pulse">
              <div />
              {/* Centered logo lockup */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-20 h-20 bg-[#E8F5EE] rounded-3xl flex items-center justify-center border-2 border-[#128A4E] shadow-sm">
                  <svg className="w-10 h-10 text-[#128A4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <polyline points="9 22 9 12 15 12 15 22" />
                  </svg>
                </div>
                <h1 className="text-[32px] font-extrabold text-[#128A4E] tracking-tight leading-none mt-2">RELOK</h1>
                <p className="text-[15px] text-[#6B7280] font-medium max-w-xs leading-relaxed mt-1">
                  Find your perfect living match
                </p>
              </div>

              {/* Loader dots at bottom */}
              <div className="flex gap-2 items-center justify-center">
                <span className="w-2.5 h-2.5 bg-[#128A4E] rounded-full animate-bounce" />
                <span className="w-2.5 h-2.5 bg-[#128A4E] rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2.5 h-2.5 bg-[#128A4E] rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}

          {/* SCREEN 2: Welcome Screen */}
          {currentScreen === 'welcome' && (
            <div className="flex-1 flex flex-col justify-between py-6">
              {/* Top half: Beautiful flat illustration of home & roommates */}
              <div className="flex-1 flex flex-col items-center justify-center min-h-[250px] relative px-4">
                <div className="w-full max-w-[280px] aspect-square relative bg-gradient-to-tr from-[#E8F5EE] to-[#E8F5EE]/30 rounded-[40px] flex items-center justify-center shadow-inner">
                  {/* Styled House / Roommate Flat vector layout */}
                  <svg className="w-40 h-40 text-[#128A4E]/90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                    <line x1="9" y1="22" x2="9" y2="16" />
                    <line x1="15" y1="22" x2="15" y2="16" />
                    <path d="M9 16h6" />
                    <circle cx="12" cy="11" r="1.5" />
                  </svg>
                  {/* Floating abstract decorative shapes */}
                  <div className="absolute top-10 left-10 w-8 h-8 rounded-full bg-[#128A4E]/10 animate-bounce" />
                  <div className="absolute bottom-12 right-8 w-12 h-12 rounded-2xl bg-[#128A4E]/20 rotate-12" />
                </div>
              </div>

              {/* Bottom half: Title, subtext, and entry points */}
              <div className="flex flex-col gap-6 text-center">
                <div className="flex flex-col gap-2.5">
                  <h1 className="text-[28px] font-extrabold text-[#0F172A] leading-tight tracking-tight px-2">
                    Find Your Perfect Roommate
                  </h1>
                  <p className="text-[15px] text-[#6B7280] leading-relaxed max-w-sm mx-auto px-4">
                    Discover compatible roommates and great rooms near you.
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 mt-2">
                  <PrimaryButton
                    onClick={() => {
                      setIsLoginFlow(false);
                      setCurrentScreen('phone');
                    }}
                    text="Get Started"
                    icon={
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    }
                  />

                  <button
                    onClick={() => {
                      setIsLoginFlow(true);
                      setCurrentScreen('phone');
                    }}
                    className="text-[15px] font-semibold text-[#128A4E] hover:text-[#0F7A44] underline transition-colors cursor-pointer"
                  >
                    Already have an account? Log in
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREEN 3: Login — Phone Number Screen */}
          {currentScreen === 'phone' && (
            <div className="flex-1 flex flex-col justify-between py-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center">
                  <BackButton onClick={() => setCurrentScreen('welcome')} />
                </div>

                <div className="flex flex-col gap-2">
                  <h1 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight">
                    Enter your mobile number
                  </h1>
                  <p className="text-[15px] text-[#6B7280]">
                    We'll send you a one-time password to verify.
                  </p>
                </div>

                {/* Country Prefix Chip & Input Field */}
                <div className="flex flex-col gap-2 mt-4">
                  <label className="text-sm font-semibold text-[#0F172A]">Mobile Number</label>
                  <div className="flex gap-3 h-14 w-full">
                    <div className="flex items-center gap-1.5 px-4 h-full bg-gray-50 border border-[#E5E7EB] rounded-xl text-base font-bold text-[#0F172A] select-none">
                      <span>🇮🇳</span>
                      <span>+91</span>
                      <svg className="w-3 h-3 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>

                    <input
                      type="tel"
                      pattern="[0-9]*"
                      maxLength={10}
                      placeholder="98765 43210"
                      value={phoneNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ''); // numbers only
                        setPhoneNumber(val);
                      }}
                      className="flex-1 h-full bg-white border border-[#E5E7EB] rounded-xl text-base px-4 focus:outline-none focus:border-[#128A4E] focus:ring-2 focus:ring-[#128A4E]/20 text-[#0F172A] font-medium tracking-wide placeholder-[#9CA3AF]"
                    />
                  </div>
                </div>

                <p className="text-xs text-[#6B7280] leading-relaxed mt-2 text-center">
                  By continuing, you agree to our{' '}
                  <a href="#terms" className="text-[#128A4E] font-medium hover:underline">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="#privacy" className="text-[#128A4E] font-medium hover:underline">
                    Privacy Policy
                  </a>
                </p>
              </div>

              <div className="mt-8">
                <PrimaryButton
                  onClick={() => {
                    if (phoneNumber.length === 10) {
                      setOtpTimer(30);
                      setCanResendOtp(false);
                      setOtpDigits(Array(6).fill(''));
                      setCurrentScreen('otp');
                    }
                  }}
                  text="Continue"
                  disabled={phoneNumber.length !== 10}
                />
              </div>
            </div>
          )}

          {/* SCREEN 4: OTP Verification Screen */}
          {currentScreen === 'otp' && (
            <form onSubmit={handleVerifyOtpSubmit} className="flex-1 flex flex-col justify-between py-6">
              <div className="flex flex-col gap-6">
                <div className="flex items-center">
                  <BackButton onClick={() => setCurrentScreen('phone')} />
                </div>

                <div className="flex flex-col gap-2">
                  <h1 className="text-[28px] font-extrabold text-[#0F172A] tracking-tight">
                    Verify your number
                  </h1>
                  <p className="text-[15px] text-[#6B7280]">
                    Enter the 6-digit code sent to <strong className="text-[#0F172A]">+91 {phoneNumber.slice(0, 5)} {phoneNumber.slice(5)}</strong>
                  </p>
                </div>

                {/* 6 Grid Individual Digit Input Boxes */}
                <div className="flex justify-between gap-2 mt-4">
                  {otpDigits.map((digit, i) => (
                    <input
                      key={i}
                      id={`otp-input-${i}`}
                      type="tel"
                      inputMode="numeric"
                      maxLength={1}
                      pattern="[0-9]*"
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-12 h-14 bg-white border border-[#E5E7EB] rounded-xl text-xl font-bold text-center text-[#0F172A] focus:outline-none focus:border-[#128A4E] focus:ring-2 focus:ring-[#128A4E]/20 transition-all shadow-xs"
                    />
                  ))}
                </div>

                {/* Resend Code Logic */}
                <div className="text-center mt-2">
                  {canResendOtp ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-sm font-semibold text-[#128A4E] hover:text-[#0F7A44] hover:underline cursor-pointer"
                    >
                      Resend Code
                    </button>
                  ) : (
                    <p className="text-xs text-gray-400 font-medium">
                      Didn't receive the code? Resend in{' '}
                      <span className="text-[#128A4E] font-bold">
                        00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}
                      </span>
                    </p>
                  )}
                </div>

                {/* Quick assistant reminder */}
                <div className="bg-amber-50 rounded-xl border border-amber-100 p-3 flex gap-2 items-start mt-2">
                  <span className="text-sm">💡</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    <strong>Tester Tip:</strong> Enter any 6 digits (e.g. 123456) to proceed. Change the onboarding flag in Profile &gt; Controls to simulate login vs registration.
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <PrimaryButton
                  type="submit"
                  text="Verify & Continue"
                  disabled={otpDigits.join('').length < 6}
                />
              </div>
            </form>
          )}

          {/* SCREEN 5: Onboarding screens (Step 1 to 6) */}
          {currentScreen === 'onboarding' && (
            <OnboardingFlow
              currentOnboardingStep={currentOnboardingStep}
              setCurrentOnboardingStep={setCurrentOnboardingStep}
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              lifestylePref={lifestylePref}
              setLifestylePref={setLifestylePref}
              roomPref={roomPref}
              setRoomPref={setRoomPref}
              lifestyleHabits={lifestyleHabits}
              setLifestyleHabits={setLifestyleHabits}
              houseRules={houseRules}
              setHouseRules={setHouseRules}
              onComplete={handleCompleteOnboarding}
              onSkip={handleSkipOnboarding}
              onBackToLogin={() => setCurrentScreen('otp')}
            />
          )}

          {/* SCREEN 6: Main Dashboard Marketplace Layout */}
          {currentScreen === 'dashboard' && (
            <MainAppLayout
              userProfile={userProfile}
              setUserProfile={setUserProfile}
              lifestylePref={lifestylePref}
              setLifestylePref={setLifestylePref}
              roomPref={roomPref}
              setRoomPref={setRoomPref}
              lifestyleHabits={lifestyleHabits}
              setLifestyleHabits={setLifestyleHabits}
              houseRules={houseRules}
              setHouseRules={setHouseRules}
              roommates={roommates}
              roomListings={roomListings}
              setRoomListings={setRoomListings}
              chats={chats}
              setChats={setChats}
              onResetAll={handleResetAllState}
              hasCompletedOnboarding={hasCompletedOnboarding}
              setHasCompletedOnboarding={setHasCompletedOnboarding}
            />
          )}

        </div>
      </div>
    </div>
  );
}
