import React, { useState } from 'react';
import { 
  Shield, 
  Edit3, 
  TrendingUp, 
  CheckCircle, 
  MessageSquare, 
  Plus, 
  Eye, 
  EyeOff, 
  MapPin, 
  Building2, 
  ChevronRight, 
  X, 
  Check,
  Award
} from 'lucide-react';
import { RoomListing, ChatThread } from '../types';
import { FormInput } from './Common';

interface BrokerDashboardProps {
  agencyName: string;
  setAgencyName: (val: string) => void;
  brokerType: 'Individual Agent' | 'Agency';
  experience: string;
  areas: string[];
  reraNumber: string;
  brokerVerificationStatus: 'pending' | 'under_review' | 'verified';
  setBrokerVerificationStatus: (val: 'pending' | 'under_review' | 'verified') => void;
  myRooms: RoomListing[];
  setRoomListings: React.Dispatch<React.SetStateAction<RoomListing[]>>;
  chats: ChatThread[];
  setChats: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  setActiveChatThread: (chat: ChatThread | null) => void;
  setActiveTab: (tab: 'home' | 'matches' | 'post' | 'chats' | 'profile') => void;
  onResetAll: () => void;
  showToast: (msg: string) => void;
}

export const BrokerDashboard: React.FC<BrokerDashboardProps> = ({
  agencyName,
  setAgencyName,
  brokerType,
  experience,
  areas,
  reraNumber,
  brokerVerificationStatus,
  setBrokerVerificationStatus,
  myRooms,
  setRoomListings,
  chats,
  setChats,
  setActiveChatThread,
  setActiveTab,
  onResetAll,
  showToast,
}) => {
  const [isEditingBroker, setIsEditingBroker] = useState(false);
  const [editName, setEditName] = useState(agencyName);
  const [deactivatedIds, setDeactivatedIds] = useState<string[]>([]);
  
  // Quick Edit Listing state
  const [editingListing, setEditingListing] = useState<RoomListing | null>(null);
  const [editListingTitle, setEditListingTitle] = useState('');
  const [editListingRent, setEditListingRent] = useState('');

  // 1. Leads originating from the broker's own listings
  const brokerLeads = chats.filter(chat => 
    chat.roomListing && myRooms.some(room => room.id === chat.roomListing?.id)
  );

  const handleSaveBrokerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) return;
    setAgencyName(editName);
    setIsEditingBroker(false);
    showToast('Agent profile updated successfully!');
  };

  const toggleListingActive = (id: string) => {
    if (deactivatedIds.includes(id)) {
      setDeactivatedIds(deactivatedIds.filter(x => x !== id));
      showToast('Property listing is now LIVE!');
    } else {
      setDeactivatedIds([...deactivatedIds, id]);
      showToast('Property listing has been deactivated.');
    }
  };

  const handleOpenEditListing = (room: RoomListing) => {
    setEditingListing(room);
    setEditListingTitle(room.title);
    setEditListingRent(room.rent.toString());
  };

  const handleSaveListingEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editListingTitle.trim() || !editListingRent) return;
    
    setRoomListings(prev => prev.map(room => 
      room.id === editingListing?.id 
        ? { ...room, title: editListingTitle, rent: Number(editListingRent) }
        : room
    ));

    setEditingListing(null);
    showToast('Property details updated successfully!');
  };

  const handleOpenLead = (chat: ChatThread) => {
    // Mark as read
    const updatedChats = chats.map(c => c.id === chat.id ? { ...c, unread: false } : c);
    setChats(updatedChats);
    setActiveChatThread(chat);
    setActiveTab('chats');
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      
      {/* 1. Broker Profile Header */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-xs flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex gap-3.5 items-center">
            <div className="w-14 h-14 rounded-2xl bg-[#E8F5EE] flex items-center justify-center shrink-0 border border-[#128A4E]/10">
              <Building2 className="w-7 h-7 text-[#128A4E]" />
            </div>
            <div className="flex flex-col min-w-0">
              <h2 className="text-base font-extrabold text-[#0F172A] truncate">
                {agencyName || 'Broker Services'}
              </h2>
              <p className="text-[10px] text-gray-400 font-bold mt-0.5 uppercase tracking-wider">
                {brokerType} • {experience} Yrs Exp
              </p>
              
              <div className="flex items-center gap-1.5 mt-1.5">
                {brokerVerificationStatus === 'under_review' ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-amber-600 bg-amber-50 border border-amber-100 py-0.5 px-2 rounded-md">
                    <Shield className="w-3 h-3 fill-amber-600/10" />
                    Under Review
                  </span>
                ) : brokerVerificationStatus === 'verified' ? (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 py-0.5 px-2 rounded-md">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    Verified Agent
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[9px] font-black text-gray-500 bg-gray-50 border border-gray-100 py-0.5 px-2 rounded-md">
                    Pending Setup
                  </span>
                )}

                {reraNumber && (
                  <span className="text-[9px] font-bold text-gray-400 bg-gray-50 py-0.5 px-2 rounded-md border border-gray-100">
                    RERA: {reraNumber}
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => {
              setEditName(agencyName);
              setIsEditingBroker(true);
            }}
            className="text-[10px] font-black text-[#128A4E] bg-[#E8F5EE] py-1.5 px-3 rounded-xl hover:bg-[#128A4E]/10 cursor-pointer transition-colors"
          >
            Edit Hub ✎
          </button>
        </div>

        {/* Operating Areas list */}
        <div className="border-t border-gray-50 pt-3">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">Areas of Presence</span>
          <div className="flex flex-wrap gap-1 mt-1.5">
            {areas.map(area => (
              <span key={area} className="inline-flex items-center gap-0.5 text-[9px] font-extrabold text-[#128A4E] bg-[#E8F5EE] py-0.5 px-2 rounded-md border border-[#128A4E]/10">
                <MapPin size={8} />
                {area}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Broker Stats Bento Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-gray-100 p-3.5 rounded-2xl flex flex-col items-center text-center gap-0.5 shadow-2xs">
          <span className="text-base font-black text-gray-900">{myRooms.length}</span>
          <span className="text-[9px] font-bold text-[#128A4E] uppercase tracking-wider leading-none">My Listed</span>
          <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Properties</span>
        </div>

        <div className="bg-white border border-gray-100 p-3.5 rounded-2xl flex flex-col items-center text-center gap-0.5 shadow-2xs">
          <span className="text-base font-black text-gray-900">{brokerLeads.length}</span>
          <span className="text-[9px] font-bold text-[#128A4E] uppercase tracking-wider leading-none">Inquiries</span>
          <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Customer Leads</span>
        </div>

        <div className="bg-white border border-gray-100 p-3.5 rounded-2xl flex flex-col items-center text-center gap-0.5 shadow-2xs">
          <span className="text-base font-black text-gray-900">248</span>
          <span className="text-[9px] font-bold text-[#128A4E] uppercase tracking-wider leading-none">Views</span>
          <span className="text-[8px] text-gray-400 font-semibold mt-0.5">Profile Visits</span>
        </div>
      </div>

      {/* 3. My Listings Section */}
      <div className="flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
            <Building2 size={16} className="text-[#128A4E]" />
            Manage My Properties ({myRooms.length})
          </h3>
          <button
            onClick={() => setActiveTab('post')}
            className="text-xs font-black text-[#128A4E] flex items-center gap-0.5 hover:underline"
          >
            <Plus size={14} strokeWidth={3} /> Add New
          </button>
        </div>

        {myRooms.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 text-center flex flex-col items-center gap-2">
            <span className="text-2xl">🏢</span>
            <p className="text-xs font-bold text-gray-400">No rooms listed yet.</p>
            <button
              onClick={() => setActiveTab('post')}
              className="mt-1 px-4 py-2 bg-[#128A4E] text-white text-xs font-bold rounded-xl shadow-xs"
            >
              Post First Listing
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {myRooms.map(room => {
              const isDeactivated = deactivatedIds.includes(room.id);
              return (
                <div 
                  key={room.id}
                  className={`bg-white border rounded-2xl p-3.5 shadow-2xs flex gap-3 transition-all ${
                    isDeactivated ? 'border-gray-100 opacity-65' : 'border-gray-100 hover:border-gray-200'
                  }`}
                >
                  <img
                    src={room.images[0]}
                    alt={room.title}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="text-xs font-black text-[#0F172A] truncate flex-1 leading-tight">
                          {room.title}
                        </h4>
                        
                        {/* Status badges */}
                        {isDeactivated ? (
                          <span className="text-[8px] font-black text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            Deactivated
                          </span>
                        ) : brokerVerificationStatus === 'under_review' ? (
                          <span className="text-[8px] font-black text-amber-600 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            Under Review
                          </span>
                        ) : (
                          <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded-sm uppercase tracking-wide">
                            Live
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#128A4E] font-black mt-0.5">
                        ₹{room.rent}/month
                      </span>
                      <span className="text-[8px] text-gray-400 font-semibold truncate flex items-center gap-0.5 mt-0.5">
                        <MapPin size={8} /> {room.location}
                      </span>
                    </div>

                    {/* Quick actions row */}
                    <div className="flex gap-2 border-t border-gray-50 pt-2.5 mt-2.5">
                      <button
                        onClick={() => handleOpenEditListing(room)}
                        className="text-[9px] font-black text-[#128A4E] hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        <Edit3 size={10} /> Edit Details
                      </button>
                      <span className="text-gray-200">|</span>
                      <button
                        onClick={() => toggleListingActive(room.id)}
                        className="text-[9px] font-black text-gray-400 hover:text-red-500 hover:underline flex items-center gap-0.5 cursor-pointer"
                      >
                        {isDeactivated ? (
                          <>
                            <Eye size={10} /> Activate Live
                          </>
                        ) : (
                          <>
                            <EyeOff size={10} /> Deactivate Listing
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. Leads Section (Filtered Chats) */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-extrabold text-[#0F172A] flex items-center gap-1.5">
          <MessageSquare size={16} className="text-[#128A4E]" />
          Property Leads & Enquiries ({brokerLeads.length})
        </h3>

        {brokerLeads.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl p-5 text-center">
            <p className="text-xs text-gray-400 font-bold">No active inquiries on your listed properties yet.</p>
            <p className="text-[10px] text-gray-400 mt-1">Leads appear here as soon as a user taps "Contact Host" on your listings.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {brokerLeads.map(lead => (
              <button
                key={lead.id}
                onClick={() => handleOpenLead(lead)}
                className="w-full text-left bg-white border border-gray-100 hover:border-[#128A4E]/25 rounded-2xl p-3.5 shadow-2xs flex items-center justify-between group transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={lead.partner.photoUrl}
                      alt={lead.partner.name}
                      className="w-10 h-10 rounded-full object-cover border border-gray-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    {lead.unread && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#128A4E] rounded-full ring-2 ring-white" />
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-black text-gray-800 truncate">{lead.partner.name}</span>
                      <span className="text-[8px] text-gray-400 font-bold bg-slate-50 py-0.5 px-1.5 rounded-sm border border-gray-100">
                        {lead.partner.occupation}
                      </span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-semibold truncate leading-normal mt-0.5">
                      Property: "{lead.roomListing?.title}"
                    </span>
                    <span className="text-[10px] text-gray-500 font-medium truncate italic mt-0.5 leading-tight">
                      "{lead.messages[lead.messages.length - 1]?.text || 'No messages yet'}"
                    </span>
                  </div>
                </div>

                <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 group-hover:text-[#128A4E] transition-all" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 5. Support & Account settings */}
      <div className="bg-white border border-gray-100 rounded-2xl p-2.5 shadow-xs flex flex-col gap-1">
        {[
          { 
            title: 'Agent Help Desk', 
            desc: 'Connect with Relok Broker support team', 
            icon: '💬',
            action: () => showToast('Speak with our dedicated Agent Support Desk at: broker@relok.in') 
          },
          { 
            title: 'Verify Another Enterprise (RERA)', 
            desc: 'Check and update registered RERA licenses', 
            icon: '📜',
            action: () => showToast(`Current RERA registration: ${reraNumber || 'None provided.'}`) 
          },
          { 
            title: 'Log Out Agent Session', 
            desc: 'Safely clear cache and sign out', 
            icon: '🚪',
            action: onResetAll 
          }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-between group cursor-pointer"
          >
            <div className="flex gap-3 items-center min-w-0">
              <span className="text-base shrink-0 bg-slate-100 w-8 h-8 rounded-lg flex items-center justify-center">{item.icon}</span>
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-bold text-gray-800 leading-tight group-hover:text-[#128A4E] transition-colors">{item.title}</span>
                <span className="text-[10px] text-gray-400 font-semibold truncate mt-0.5">{item.desc}</span>
              </div>
            </div>
            <ChevronRight size={14} className="text-gray-300 group-hover:translate-x-1 transition-transform" />
          </button>
        ))}
      </div>

      {/* EDIT BROKER PROFILE MODAL */}
      {isEditingBroker && (
        <div className="fixed inset-0 bg-[#000]/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 shadow-xl animate-in slide-in-from-bottom duration-300 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F172A] flex items-center gap-1">
                <Award size={18} className="text-[#128A4E]" />
                Edit Broker Profile
              </h3>
              <button 
                onClick={() => setIsEditingBroker(false)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveBrokerProfile} className="flex flex-col gap-4">
              <FormInput
                label="Agency or Business Name"
                value={editName}
                onChange={setEditName}
              />

              <div className="bg-[#E8F5EE]/40 rounded-xl p-3 border border-[#128A4E]/10">
                <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                  Note: Updating agency details will not reset your verification status. Your current status remains <strong>{brokerVerificationStatus.toUpperCase().replace('_', ' ')}</strong>.
                </p>
              </div>

              <button
                type="submit"
                className="w-full h-12 bg-[#128A4E] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0F7A44] transition-all"
              >
                Save Details
              </button>
            </form>
          </div>
        </div>
      )}

      {/* QUICK EDIT PROPERTY LISTING MODAL */}
      {editingListing && (
        <div className="fixed inset-0 bg-[#000]/40 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-[430px] rounded-t-3xl p-6 shadow-xl animate-in slide-in-from-bottom duration-300 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-gray-100">
              <h3 className="text-base font-extrabold text-[#0F172A]">
                Edit Property Price & Title
              </h3>
              <button 
                onClick={() => setEditingListing(null)}
                className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveListingEdit} className="flex flex-col gap-4">
              <FormInput
                label="Property Listing Title"
                value={editListingTitle}
                onChange={setEditListingTitle}
              />

              <FormInput
                label="Monthly Rent (₹)"
                type="number"
                value={editListingRent}
                onChange={setEditListingRent}
              />

              <button
                type="submit"
                className="w-full h-12 bg-[#128A4E] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#0F7A44] transition-all"
              >
                Save Property Updates
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
