import React, { useState } from 'react';
import { User, Calendar, Briefcase, GraduationCap, Camera } from 'lucide-react';
import { 
  UserProfile, 
  LifestylePreferences, 
  RoomPreferences, 
  LifestyleHabits, 
  HouseRules 
} from '../types';
import { 
  PrimaryButton, 
  SecondaryButton, 
  FormInput, 
  FormTextarea, 
  ProgressBar, 
  PillSelector, 
  BackButton 
} from './Common';
import { INDIAN_CITIES } from '../data';

interface OnboardingFlowProps {
  currentOnboardingStep: number;
  setCurrentOnboardingStep: (step: number) => void;
  userProfile: UserProfile;
  setUserProfile: React.Dispatch<React.SetStateAction<UserProfile>>;
  lifestylePref: LifestylePreferences;
  setLifestylePref: React.Dispatch<React.SetStateAction<LifestylePreferences>>;
  roomPref: RoomPreferences;
  setRoomPref: React.Dispatch<React.SetStateAction<RoomPreferences>>;
  lifestyleHabits: LifestyleHabits;
  setLifestyleHabits: React.Dispatch<React.SetStateAction<LifestyleHabits>>;
  houseRules: HouseRules;
  setHouseRules: React.Dispatch<React.SetStateAction<HouseRules>>;
  onComplete: () => void;
  onSkip: () => void;
  onBackToLogin: () => void;
}

export const OnboardingFlow: React.FC<OnboardingFlowProps> = ({
  currentOnboardingStep,
  setCurrentOnboardingStep,
  userProfile,
  setUserProfile,
  lifestylePref,
  setLifestylePref,
  roomPref,
  setRoomPref,
  lifestyleHabits,
  setLifestyleHabits,
  houseRules,
  setHouseRules,
  onComplete,
  onSkip,
  onBackToLogin
}) => {
  // Preset avatars for photo upload selection
  const presetAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200'
  ];

  const handleAvatarClick = () => {
    // Cycle through preset pictures
    const currentIndex = presetAvatars.indexOf(userProfile.photoUrl);
    const nextIndex = (currentIndex + 1) % presetAvatars.length;
    setUserProfile({ ...userProfile, photoUrl: presetAvatars[nextIndex] });
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOnboardingStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOnboardingStep(3);
  };

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOnboardingStep(4);
  };

  const handleStep4Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOnboardingStep(5);
  };

  const handleStep5Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentOnboardingStep(6);
  };

  return (
    <div className="w-full min-h-[calc(100vh-60px)] flex flex-col justify-between py-4">
      {/* ONBOARDING STEP 1: Lifestyle & Preferences */}
      {currentOnboardingStep === 1 && (
        <form onSubmit={handleStep1Submit} className="flex flex-col justify-between flex-1 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <BackButton onClick={onBackToLogin} />
            </div>

            <div className="flex flex-col gap-1">
              <ProgressBar currentStep={1} totalSteps={6} />
              <h2 className="text-2xl font-bold text-[#0F172A] mt-3">Lifestyle & Preferences</h2>
              <p className="text-[15px] text-[#6B7280]">
                Help us find roommates with similar daily habits.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-2 pb-4 max-h-[420px] overflow-y-auto pr-1">
              <PillSelector
                label="Sleep Schedule"
                options={['Early Bird', 'Night Owl']}
                selectedValue={lifestylePref.sleepSchedule}
                onSelect={(val) => setLifestylePref({ ...lifestylePref, sleepSchedule: val })}
              />

              <PillSelector
                label="Cleanliness Level"
                options={['Spick & Span', 'Moderate', 'Chill']}
                selectedValue={lifestylePref.cleanliness}
                onSelect={(val) => setLifestylePref({ ...lifestylePref, cleanliness: val })}
              />

              <PillSelector
                label="Smoking"
                options={['Never', 'Occasionally', 'Yes']}
                selectedValue={lifestylePref.smoking}
                onSelect={(val) => setLifestylePref({ ...lifestylePref, smoking: val as any })}
              />

              <PillSelector
                label="Drinking"
                options={['Never', 'Occasionally', 'Yes']}
                selectedValue={lifestylePref.drinking}
                onSelect={(val) => setLifestylePref({ ...lifestylePref, drinking: val as any })}
              />

              <PillSelector
                label="Dietary Preference"
                options={['Veg', 'Non-Veg', 'Any']}
                selectedValue={lifestylePref.dietary}
                onSelect={(val) => setLifestylePref({ ...lifestylePref, dietary: val })}
              />
            </div>
          </div>

          <div className="mt-4">
            <PrimaryButton
              type="submit"
              text="Continue"
              disabled={
                !lifestylePref.sleepSchedule ||
                !lifestylePref.cleanliness ||
                !lifestylePref.smoking ||
                !lifestylePref.drinking ||
                !lifestylePref.dietary
              }
            />
          </div>
        </form>
      )}

      {/* ONBOARDING STEP 2: About You */}
      {currentOnboardingStep === 2 && (
        <form onSubmit={handleStep2Submit} className="flex flex-col justify-between flex-1 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center h-11">
              <BackButton onClick={() => setCurrentOnboardingStep(1)} />
              <button
                type="button"
                onClick={onSkip}
                className="text-sm font-semibold text-[#128A4E] hover:text-[#0F7A44] transition-colors pr-2 cursor-pointer"
              >
                Skip
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <ProgressBar currentStep={2} totalSteps={6} />
              <h1 className="text-[28px] font-bold text-[#0F172A] mt-3">About You</h1>
              <p className="text-[15px] text-[#6B7280]">
                Tell us a bit about yourself.
              </p>
            </div>

            {/* Profile Photo upload simulation */}
            <div className="flex flex-col items-center gap-2 my-2">
              <div 
                onClick={handleAvatarClick}
                className="relative w-[100px] h-[100px] rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#128A4E] transition-colors bg-gray-50 overflow-hidden group"
              >
                {userProfile.photoUrl ? (
                  <img 
                    src={userProfile.photoUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <User className="text-gray-400 w-10 h-10" />
                )}
                <div className="absolute right-0 bottom-0 bg-[#128A4E] text-white p-1.5 rounded-full border border-white shadow-sm">
                  <Camera size={14} />
                </div>
              </div>
              <span className="text-xs text-[#6B7280]">Tap to toggle photo avatar</span>
            </div>

            <div className="flex flex-col gap-5">
              <FormInput
                label="Full Name"
                placeholder="Enter your name"
                value={userProfile.fullName}
                onChange={(val) => setUserProfile({ ...userProfile, fullName: val })}
                icon={<User size={20} />}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Age"
                  placeholder="e.g. 23"
                  type="number"
                  value={userProfile.age}
                  onChange={(val) => setUserProfile({ ...userProfile, age: val })}
                  icon={<Calendar size={20} />}
                />
                
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-[#0F172A]">Gender</label>
                  <div className="flex gap-1 h-14 bg-gray-100 p-1 rounded-xl">
                    {['Male', 'Female', 'Other'].map((g) => {
                      const isSel = userProfile.gender === g;
                      return (
                        <button
                          key={g}
                          type="button"
                          onClick={() => setUserProfile({ ...userProfile, gender: g as any })}
                          className={`flex-1 rounded-lg text-xs font-semibold transition-all duration-200 ${
                            isSel
                              ? 'bg-[#128A4E] text-white shadow-sm'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {g}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <FormInput
                label="Occupation"
                placeholder="e.g. Software Engineer"
                value={userProfile.occupation}
                onChange={(val) => setUserProfile({ ...userProfile, occupation: val })}
                icon={<Briefcase size={20} />}
              />

              <FormInput
                label="Education / College"
                placeholder="e.g. BITS Pilani"
                value={userProfile.education}
                onChange={(val) => setUserProfile({ ...userProfile, education: val })}
                icon={<GraduationCap size={20} />}
              />

              <FormTextarea
                label="Short Bio"
                placeholder="Write a short bio about yourself..."
                value={userProfile.bio}
                onChange={(val) => setUserProfile({ ...userProfile, bio: val })}
                maxLength={150}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <SecondaryButton
              text="Back"
              onClick={() => setCurrentOnboardingStep(1)}
            />
            <PrimaryButton
              type="submit"
              text="Continue"
              disabled={!userProfile.fullName || !userProfile.age || !userProfile.gender}
            />
          </div>
        </form>
      )}

      {/* ONBOARDING STEP 3: Room Preferences */}
      {currentOnboardingStep === 3 && (
        <form onSubmit={handleStep3Submit} className="flex flex-col justify-between flex-1 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <BackButton onClick={() => setCurrentOnboardingStep(2)} />
            </div>

            <div className="flex flex-col gap-1">
              <ProgressBar currentStep={3} totalSteps={6} />
              <h1 className="text-[28px] font-bold text-[#0F172A] mt-3">Room Preferences</h1>
              <p className="text-[15px] text-[#6B7280]">
                Where would you like to live and what is your budget?
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-[#0F172A]">Target City in India</label>
                <div className="flex flex-wrap gap-2">
                  {INDIAN_CITIES.map((c) => {
                    const isSel = roomPref.cities.includes(c);
                    return (
                      <button
                        key={c}
                        type="button"
                        onClick={() => {
                          if (isSel) {
                            setRoomPref({ ...roomPref, cities: roomPref.cities.filter(item => item !== c) });
                          } else {
                            setRoomPref({ ...roomPref, cities: [...roomPref.cities, c] });
                          }
                        }}
                        className={`px-4 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                          isSel
                            ? 'border-[#128A4E] text-[#128A4E] bg-[#E8F5EE] font-semibold'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {c}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <label className="text-sm font-medium text-[#0F172A]">Preferred Budget (INR / month)</label>
                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Min Rent (₹)"
                    type="number"
                    placeholder="e.g. 5000"
                    value={roomPref.budgetMin ? String(roomPref.budgetMin) : ''}
                    onChange={(val) => setRoomPref({ ...roomPref, budgetMin: Number(val) })}
                  />
                  <FormInput
                    label="Max Rent (₹)"
                    type="number"
                    placeholder="e.g. 20000"
                    value={roomPref.budgetMax ? String(roomPref.budgetMax) : ''}
                    onChange={(val) => setRoomPref({ ...roomPref, budgetMax: Number(val) })}
                  />
                </div>
              </div>

              <PillSelector
                label="Sharing Mode Preference"
                options={['Private Room', 'Shared Room', 'Entire Flat']}
                selectedValue={roomPref.sharingType}
                onSelect={(val) => setRoomPref({ ...roomPref, sharingType: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <SecondaryButton
              text="Back"
              onClick={() => setCurrentOnboardingStep(2)}
            />
            <PrimaryButton
              type="submit"
              text="Continue"
              disabled={roomPref.cities.length === 0 || !roomPref.budgetMax || !roomPref.sharingType}
            />
          </div>
        </form>
      )}

      {/* ONBOARDING STEP 4: Lifestyle Habits */}
      {currentOnboardingStep === 4 && (
        <form onSubmit={handleStep4Submit} className="flex flex-col justify-between flex-1 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <BackButton onClick={() => setCurrentOnboardingStep(3)} />
            </div>

            <div className="flex flex-col gap-1">
              <ProgressBar currentStep={4} totalSteps={6} />
              <h1 className="text-[28px] font-bold text-[#0F172A] mt-3">Lifestyle Habits</h1>
              <p className="text-[15px] text-[#6B7280]">
                A few more details about your routine.
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              <PillSelector
                label="Personality"
                options={['Extrovert', 'Introvert', 'Balanced']}
                selectedValue={lifestyleHabits.personality}
                onSelect={(val) => setLifestyleHabits({ ...lifestyleHabits, personality: val as any })}
              />

              <PillSelector
                label="Pets"
                options={['No Pets', 'Dog Lover', 'Cat Lover', "Don't mind"]}
                selectedValue={lifestyleHabits.pets}
                onSelect={(val) => setLifestyleHabits({ ...lifestyleHabits, pets: val as any })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <SecondaryButton
              text="Back"
              onClick={() => setCurrentOnboardingStep(3)}
            />
            <PrimaryButton
              type="submit"
              text="Continue"
              disabled={!lifestyleHabits.personality || !lifestyleHabits.pets}
            />
          </div>
        </form>
      )}

      {/* ONBOARDING STEP 5: House Rules */}
      {currentOnboardingStep === 5 && (
        <form onSubmit={handleStep5Submit} className="flex flex-col justify-between flex-1 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <BackButton onClick={() => setCurrentOnboardingStep(4)} />
            </div>

            <div className="flex flex-col gap-1">
              <ProgressBar currentStep={5} totalSteps={6} />
              <h1 className="text-[28px] font-bold text-[#0F172A] mt-3">House Rules</h1>
              <p className="text-[15px] text-[#6B7280]">
                What rules do you expect in your shared home?
              </p>
            </div>

            <div className="flex flex-col gap-6 mt-2">
              <PillSelector
                label="Guests Policy"
                options={['No Guests', 'Daytime Only', 'Guests Allowed']}
                selectedValue={houseRules.guests}
                onSelect={(val) => setHouseRules({ ...houseRules, guests: val })}
              />

              <PillSelector
                label="Loud Music"
                options={['Quiet Hours', 'Flexible']}
                selectedValue={houseRules.loudMusic}
                onSelect={(val) => setHouseRules({ ...houseRules, loudMusic: val })}
              />

              <PillSelector
                label="Late Entry Policy"
                options={['Before 11 PM', 'Anytime']}
                selectedValue={houseRules.lateEntry}
                onSelect={(val) => setHouseRules({ ...houseRules, lateEntry: val })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">
            <SecondaryButton
              text="Back"
              onClick={() => setCurrentOnboardingStep(4)}
            />
            <PrimaryButton
              type="submit"
              text="Continue"
              disabled={!houseRules.guests || !houseRules.loudMusic || !houseRules.lateEntry}
            />
          </div>
        </form>
      )}

      {/* ONBOARDING STEP 6: Complete Screen */}
      {currentOnboardingStep === 6 && (
        <div className="flex flex-col justify-between flex-1 gap-6">
          <div className="flex flex-col gap-6">
            <div className="flex items-center">
              <BackButton onClick={() => setCurrentOnboardingStep(5)} />
            </div>

            <div className="flex flex-col gap-1">
              <ProgressBar currentStep={6} totalSteps={6} />
            </div>

            <div className="flex flex-col items-center justify-center text-center py-8 gap-6">
              {/* Illustrated House Completion Lockup */}
              <div className="relative w-44 h-44 flex items-center justify-center bg-[#E8F5EE] rounded-full border-[3px] border-[#128A4E]/20 animate-pulse">
                <svg className="w-24 h-24 text-[#128A4E]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
                <div className="absolute -bottom-1 -right-1 bg-[#128A4E] text-white p-3 rounded-full border-4 border-white shadow-md">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <h1 className="text-[28px] font-bold text-[#0F172A] tracking-tight">Profile Setup Complete!</h1>
                <p className="text-[15px] text-[#6B7280] max-w-sm">
                  Welcome to Relok! Your roommate-matching and room-listing profile is fully ready. Let's find your perfect home.
                </p>
              </div>

              {/* Profile summary card */}
              <div className="w-full bg-white rounded-2xl border border-gray-100 p-4 shadow-sm flex items-center gap-4 text-left">
                <img 
                  src={userProfile.photoUrl} 
                  alt={userProfile.fullName} 
                  className="w-14 h-14 rounded-full object-cover border border-gray-100"
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1">
                  <h4 className="text-base font-bold text-[#0F172A]">{userProfile.fullName}</h4>
                  <p className="text-xs text-gray-500">{userProfile.occupation || 'Member'} • {userProfile.age} yrs</p>
                  <div className="flex gap-1.5 mt-1.5 flex-wrap">
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                      {lifestylePref.sleepSchedule}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                      {lifestylePref.cleanliness}
                    </span>
                    <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-medium">
                      {roomPref.sharingType}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton
              onClick={onComplete}
              text="Enter Dashboard"
              icon={
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};
