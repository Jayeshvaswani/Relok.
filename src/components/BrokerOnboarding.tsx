import React, { useState } from 'react';
import { ChevronLeft, Briefcase, Building2, Upload, FileText, Check, AlertCircle } from 'lucide-react';
import { PrimaryButton, FormInput, BackButton } from './Common';

interface BrokerOnboardingProps {
  onBack: () => void;
  onComplete: (brokerData: {
    agencyName: string;
    brokerType: 'Individual Agent' | 'Agency';
    experience: string;
    areas: string[];
    reraNumber: string;
  }) => void;
}

export const BrokerOnboarding: React.FC<BrokerOnboardingProps> = ({ onBack, onComplete }) => {
  const [step, setStep] = useState<1 | 2>(1);
  
  // Form State
  const [agencyName, setAgencyName] = useState('');
  const [brokerType, setBrokerType] = useState<'Individual Agent' | 'Agency'>('Individual Agent');
  const [experience, setExperience] = useState('');
  const [areas, setAreas] = useState<string[]>([]);
  const [reraNumber, setReraNumber] = useState('');

  // Upload States (simulated files)
  const [govIdUploaded, setGovIdUploaded] = useState<string | null>(null);
  const [businessRegUploaded, setBusinessRegUploaded] = useState<string | null>(null);

  const CITIES = [
    'Bengaluru',
    'Mumbai',
    'Delhi NCR',
    'Pune',
    'Hyderabad',
    'Chennai',
    'Kolkata'
  ];

  const toggleCity = (city: string) => {
    if (areas.includes(city)) {
      setAreas(areas.filter(c => c !== city));
    } else {
      setAreas([...areas, city]);
    }
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !experience || areas.length === 0) return;
    setStep(2);
  };

  const handleVerifySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!govIdUploaded || !businessRegUploaded) return;
    onComplete({
      agencyName,
      brokerType,
      experience,
      areas,
      reraNumber
    });
  };

  return (
    <div className="flex-1 flex flex-col justify-between py-6 max-w-xl mx-auto w-full animate-in fade-in duration-300">
      
      {/* SCREEN 1: Broker Details */}
      {step === 1 && (
        <form onSubmit={handleDetailsSubmit} className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-1">
              <BackButton onClick={onBack} />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Use as Broker (1/2)</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Use as Broker Registration
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Provide your commercial details to list multiple units.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              <FormInput
                label="Agency or Business Name"
                placeholder="e.g. Dream Realty Services"
                value={agencyName}
                onChange={setAgencyName}
              />

              {/* Broker Type Pill Toggle */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#0F172A]">Broker Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: 'Individual Agent' as const, label: 'Individual Agent', icon: <Briefcase size={16} /> },
                    { id: 'Agency' as const, label: 'Agency / Firm', icon: <Building2 size={16} /> }
                  ].map((type) => {
                    const isSelected = brokerType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setBrokerType(type.id)}
                        className={`h-14 rounded-xl border flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#128A4E] text-white border-[#128A4E] shadow-xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {type.icon}
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <FormInput
                label="Years of Experience"
                placeholder="e.g. 5"
                type="number"
                value={experience}
                onChange={setExperience}
              />

              {/* Areas of Operation (Multi-select) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Areas of Operation</label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CITIES.map((city) => {
                    const isSelected = areas.includes(city);
                    return (
                      <button
                        key={city}
                        type="button"
                        onClick={() => toggleCity(city)}
                        className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200 cursor-pointer ${
                          isSelected
                            ? 'bg-[#128A4E] text-white border-[#128A4E] shadow-xs'
                            : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        {city}
                      </button>
                    );
                  })}
                </div>
              </div>

              <FormInput
                label="RERA Registration Number (Optional)"
                placeholder="e.g. PRM/KA/RERA/1251/..."
                value={reraNumber}
                onChange={setReraNumber}
              />
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton
              type="submit"
              text="Continue"
              disabled={!agencyName || !experience || areas.length === 0}
            />
          </div>
        </form>
      )}

      {/* SCREEN 2: Broker Verification */}
      {step === 2 && (
        <form onSubmit={handleVerifySubmit} className="flex-1 flex flex-col justify-between">
          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-1">
              <BackButton onClick={() => setStep(1)} />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Use as Broker (2/2)</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <h1 className="text-2xl font-extrabold text-[#0F172A] tracking-tight">
                Submit Verifications
              </h1>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                We require proof of identity and business incorporation to display your verified broker tag.
              </p>
            </div>

            <div className="flex flex-col gap-4 mt-2">
              
              {/* Box 1: Government ID Upload */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#0F172A]">Government Issued Photo ID</label>
                <p className="text-xs text-gray-400 font-medium">Aadhaar Card, PAN Card, or Passport (PDF/JPG)</p>
                
                {govIdUploaded ? (
                  <div className="w-full h-24 bg-[#E8F5EE] border border-[#128A4E]/30 rounded-2xl flex items-center justify-between px-5 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#128A4E]/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#128A4E]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0F172A]">{govIdUploaded}</span>
                        <span className="text-[10px] text-gray-500 font-semibold">File uploaded successfully</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setGovIdUploaded(null)}
                      className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setGovIdUploaded('Gov_ID_Proof.pdf')}
                    className="w-full h-32 bg-slate-50 border-2 border-dashed border-gray-200 hover:border-[#128A4E] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                  >
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#128A4E] transition-colors" />
                    <span className="text-xs font-extrabold text-gray-500 group-hover:text-[#128A4E] transition-colors">Tap to select or upload ID</span>
                    <span className="text-[10px] text-gray-400">Max size 10MB</span>
                  </button>
                )}
              </div>

              {/* Box 2: Trade License/Business Reg Upload */}
              <div className="flex flex-col gap-2 mt-2">
                <label className="text-sm font-semibold text-[#0F172A]">Business registration / Trade License</label>
                <p className="text-xs text-gray-400 font-medium">GST, Trade Certificate, or Incorporation Document (PDF/JPG)</p>

                {businessRegUploaded ? (
                  <div className="w-full h-24 bg-[#E8F5EE] border border-[#128A4E]/30 rounded-2xl flex items-center justify-between px-5 animate-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#128A4E]/10 rounded-xl flex items-center justify-center">
                        <FileText className="w-5 h-5 text-[#128A4E]" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-[#0F172A]">{businessRegUploaded}</span>
                        <span className="text-[10px] text-gray-500 font-semibold">File uploaded successfully</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBusinessRegUploaded(null)}
                      className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setBusinessRegUploaded('Incorporation_Proof.pdf')}
                    className="w-full h-32 bg-slate-50 border-2 border-dashed border-gray-200 hover:border-[#128A4E] rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors group"
                  >
                    <Upload className="w-6 h-6 text-gray-400 group-hover:text-[#128A4E] transition-colors" />
                    <span className="text-xs font-extrabold text-gray-500 group-hover:text-[#128A4E] transition-colors">Tap to select or upload proof</span>
                    <span className="text-[10px] text-gray-400">Max size 10MB</span>
                  </button>
                )}
              </div>

              {/* Info notice */}
              <div className="bg-amber-50 rounded-xl border border-amber-100 p-3.5 flex gap-2.5 items-start mt-2">
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-amber-900">Pending Verification</span>
                  <p className="text-[10px] text-amber-700 leading-relaxed mt-0.5 font-normal">
                    You can post and view properties instantly! Your account and listings will be marked as "Under Review" until verification completes.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <PrimaryButton
              type="submit"
              text="Submit & Open Dashboard"
              disabled={!govIdUploaded || !businessRegUploaded}
            />
          </div>
        </form>
      )}
    </div>
  );
};
