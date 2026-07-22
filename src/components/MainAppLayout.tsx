import React, { useState, useEffect, useRef } from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { 
  Home as HomeIcon, 
  Users, 
  PlusCircle, 
  MessageSquare, 
  User as UserIcon, 
  MapPin, 
  Search, 
  Sparkles, 
  DollarSign, 
  ChevronRight, 
  Send, 
  X, 
  Check, 
  Plus, 
  Info,
  Calendar,
  Briefcase,
  GraduationCap
} from 'lucide-react';
import { 
  UserProfile, 
  LifestylePreferences, 
  RoomPreferences, 
  LifestyleHabits, 
  HouseRules,
  RoommateCard,
  RoomListing,
  ChatThread,
  Message
} from '../types';
import { INDIAN_CITIES } from '../data';
import { PrimaryButton, SecondaryButton, FormInput, FormTextarea, PillSelector } from './Common';
import { OCCUPATIONS, COLLEGES } from '../data/autocompleteData';
import { AutocompleteInput } from './AutocompleteInput';
import { GooglePlacesAutocompleteInput } from './GooglePlacesAutocompleteInput';
import { BrokerDashboard } from './BrokerDashboard';

interface MainAppLayoutProps {
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
  roommates: RoommateCard[];
  roomListings: RoomListing[];
  setRoomListings: React.Dispatch<React.SetStateAction<RoomListing[]>>;
  chats: ChatThread[];
  setChats: React.Dispatch<React.SetStateAction<ChatThread[]>>;
  onResetAll: () => void;
  hasCompletedOnboarding: boolean;
  setHasCompletedOnboarding: (val: boolean) => void;
  
  // NEW INTENT / BROKER PROPS:
  initialActiveTab?: 'home' | 'matches' | 'post' | 'chats' | 'profile';
  initialHomeFilter?: 'all' | 'rooms' | 'roommates' | 'my';
  initialSharingTypeFilter?: 'Private Room' | 'Shared Room' | '';
  isBroker?: boolean;
  setIsBroker?: (val: boolean) => void;
  brokerVerificationStatus?: 'pending' | 'under_review' | 'verified';
  setBrokerVerificationStatus?: (val: 'pending' | 'under_review' | 'verified') => void;
  agencyName?: string;
  setAgencyName?: (val: string) => void;
  brokerDetails?: {
    agencyName: string;
    brokerType: 'Individual Agent' | 'Agency';
    experience: string;
    areas: string[];
    reraNumber: string;
  } | null;
}

export const MainAppLayout: React.FC<MainAppLayoutProps> = ({
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
  roommates,
  roomListings,
  setRoomListings,
  chats,
  setChats,
  onResetAll,
  hasCompletedOnboarding,
  setHasCompletedOnboarding,
  
  initialActiveTab = 'home',
  initialHomeFilter = 'all',
  initialSharingTypeFilter = '',
  isBroker = false,
  setIsBroker,
  brokerVerificationStatus = 'pending',
  setBrokerVerificationStatus,
  agencyName = '',
  setAgencyName,
  brokerDetails = null,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'matches' | 'post' | 'chats' | 'profile'>(initialActiveTab);
  const [selectedCity, setSelectedCity] = useState<string>('Bengaluru');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [homeFilter, setHomeFilter] = useState<'all' | 'rooms' | 'roommates' | 'my'>(initialHomeFilter);
  const [roomSharingFilter, setRoomSharingFilter] = useState<'Private Room' | 'Shared Room' | ''>(initialSharingTypeFilter);
  const [showCityDropdown, setShowCityDropdown] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialActiveTab) {
      setActiveTab(initialActiveTab);
    }
  }, [initialActiveTab]);

  useEffect(() => {
    if (initialHomeFilter) {
      setHomeFilter(initialHomeFilter);
    }
  }, [initialHomeFilter]);

  useEffect(() => {
    if (initialSharingTypeFilter !== undefined) {
      setRoomSharingFilter(initialSharingTypeFilter);
    }
  }, [initialSharingTypeFilter]);
  const [showRewardsBanner, setShowRewardsBanner] = useState<boolean>(true);
  const [savedRooms, setSavedRooms] = useState<string[]>([]);
  const [deactivatedRooms, setDeactivatedRooms] = useState<string[]>([]);

  // Detail Modal States
  const [selectedRoommate, setSelectedRoommate] = useState<RoommateCard | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<RoommateCard | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomListing | null>(null);
  const [activeChatThread, setActiveChatThread] = useState<ChatThread | null>(null);
  const [chatFilter, setChatFilter] = useState<'all' | 'unread' | 'matches' | 'messages' | 'system'>('all');
  const [chatInputText, setChatInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Form State for 5-Step Posting Room Wizard
  const [createStep, setCreateStep] = useState<1 | 2 | 3 | 4 | 5 | 'published'>(1);
  const [listingType, setListingType] = useState<'Room' | '1BHK' | '2BHK' | 'Shared Room'>('Room');
  const [listingTitle, setListingTitle] = useState('');
  const [monthlyRent, setMonthlyRent] = useState('');
  const [securityDeposit, setSecurityDeposit] = useState('');
  const [availableFrom, setAvailableFrom] = useState('');
  const [stayDuration, setStayDuration] = useState('6 Months');
  const [description, setDescription] = useState('');
  
  // Step 2
  const [listingPhotos, setListingPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600&h=400'
  ]);
  
  // Step 3
  const [newRoomAmenities, setNewRoomAmenities] = useState<string[]>([]);
  const [lifestylePrefs, setLifestylePrefs] = useState<string[]>([]);
  const [roommateGender, setRoommateGender] = useState<'Male' | 'Female' | 'Any'>('Any');
  const [preferredAgeMin, setPreferredAgeMin] = useState<number>(18);
  const [preferredAgeMax, setPreferredAgeMax] = useState<number>(60);
  
  // Step 4
  const [address, setAddress] = useState('');
  const [pinAccuracy, setPinAccuracy] = useState<'Exact' | 'Near Exact' | 'Approximate'>('Exact');
  const [landmark, setLandmark] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 12.9116, lng: 77.6389 });

  const GOOGLE_MAPS_API_KEY = 
    (process.env as any).GOOGLE_MAPS_PLATFORM_KEY || 
    (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY || 
    '';

  const chatEndRef = useRef<HTMLDivElement>(null);

  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPromo, setShowInstallPromo] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<any[]>([]);

  // Proximity calculations and data mappings
  const getItemCoordinates = (location: string, city: string) => {
    const loc = (location || '').toLowerCase();
    const c = (city || '').toLowerCase();
    
    if (c.includes('bengaluru') || c.includes('bangalore')) {
      if (loc.includes('hsr')) return { lat: 12.9116, lng: 77.6389 };
      if (loc.includes('indiranagar')) return { lat: 12.9784, lng: 77.6408 };
      if (loc.includes('koramangala')) return { lat: 12.9279, lng: 77.6271 };
      return { lat: 12.9716, lng: 77.5946 };
    }
    if (c.includes('mumbai')) {
      if (loc.includes('bandra')) return { lat: 19.0600, lng: 72.8229 };
      if (loc.includes('andheri')) return { lat: 19.1136, lng: 72.8697 };
      return { lat: 19.0760, lng: 72.8777 };
    }
    if (c.includes('hyderabad')) {
      if (loc.includes('gachibowli')) return { lat: 17.4416, lng: 78.3489 };
      if (loc.includes('jubilee')) return { lat: 17.4325, lng: 78.4071 };
      return { lat: 17.3850, lng: 78.4867 };
    }
    if (c.includes('pune')) {
      if (loc.includes('koregaon')) return { lat: 18.5362, lng: 73.8940 };
      if (loc.includes('kalyani')) return { lat: 18.5463, lng: 73.9033 };
      return { lat: 18.5204, lng: 73.8567 };
    }
    if (c.includes('delhi')) {
      return { lat: 28.6139, lng: 77.2090 };
    }
    return { lat: 12.9116, lng: 77.6389 }; // Default to HSR
  };

  const calculateDistanceInKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Radius of the earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const d = R * c; // Distance in km
    return Number(d.toFixed(1));
  };

  const getItemDistance = (location: string, city: string) => {
    if (!userLocation) return null;
    const itemCoords = getItemCoordinates(location, city);
    return calculateDistanceInKm(userLocation.lat, userLocation.lng, itemCoords.lat, itemCoords.lng);
  };

  const handleToggleNearMe = () => {
    if (userLocation) {
      setUserLocation(null);
      showToast("Near Me mode deactivated");
    } else {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setUserLocation({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
            showToast("📍 Near Me activated using GPS location!");
          },
          (error) => {
            console.log("Geolocation error:", error);
            let fallbackCoords = { lat: 12.9116, lng: 77.6389 }; // HSR
            if (selectedCity === 'Mumbai') fallbackCoords = { lat: 19.0600, lng: 72.8229 };
            else if (selectedCity === 'Hyderabad') fallbackCoords = { lat: 17.4416, lng: 78.3489 };
            else if (selectedCity === 'Pune') fallbackCoords = { lat: 18.5362, lng: 73.8940 };
            
            setUserLocation(fallbackCoords);
            showToast(`📍 Near Me activated for ${selectedCity}!`);
          }
        );
      } else {
        let fallbackCoords = { lat: 12.9116, lng: 77.6389 };
        if (selectedCity === 'Mumbai') fallbackCoords = { lat: 19.0600, lng: 72.8229 };
        else if (selectedCity === 'Hyderabad') fallbackCoords = { lat: 17.4416, lng: 78.3489 };
        else if (selectedCity === 'Pune') fallbackCoords = { lat: 18.5362, lng: 73.8940 };
        setUserLocation(fallbackCoords);
        showToast(`📍 Near Me activated for ${selectedCity}!`);
      }
    }
  };

  useEffect(() => {
    if (!isOffline && offlineQueue.length > 0) {
      // Sync pending messages
      const updatedChats = chats.map(chat => {
        const hasPending = chat.messages.some(m => m.status === 'pending');
        if (hasPending) {
          return {
            ...chat,
            messages: chat.messages.map(m => m.status === 'pending' ? { ...m, status: 'sent' as 'sent' } : m)
          };
        }
        return chat;
      });
      setChats(updatedChats);
      
      // Update active chat thread if it has pending messages
      if (activeChatThread) {
        const hasPending = activeChatThread.messages.some(m => m.status === 'pending');
        if (hasPending) {
          setActiveChatThread({
            ...activeChatThread,
            messages: activeChatThread.messages.map(m => m.status === 'pending' ? { ...m, status: 'sent' as 'sent' } : m)
          });
        }
      }

      showToast(`Connected! Synced ${offlineQueue.length} offline actions successfully.`);
      setOfflineQueue([]);
    }
  }, [isOffline, offlineQueue]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (localStorage.getItem('skipped_onboarding') === 'true') {
      localStorage.removeItem('skipped_onboarding');
      setTimeout(() => {
        showToast("Welcome to Relok! Fill out your profile details anytime from your Profile tab.");
      }, 800);
    }

    const handleInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPromo(true);
    };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    // iOS Web App check
    if (isIosDevice && !(window.navigator as any).standalone) {
      setShowInstallPromo(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          showToast('Relok successfully installed!');
        }
        setDeferredPrompt(null);
        setShowInstallPromo(false);
      });
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChatThread, isTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Helper to calculate dynamic compatibility score
  const getDynamicCompatibility = (rm: RoommateCard) => {
    // If the user has skipped profile setup and has empty fields, default to a robust calculation
    let score = 70;
    
    if (userProfile.fullName) {
      if (lifestylePref.sleepSchedule === rm.sleepSchedule) score += 10;
      if (lifestylePref.cleanliness === rm.cleanliness) score += 10;
      if (lifestylePref.dietary === rm.dietary || rm.dietary === 'Any') score += 10;
      
      // Gender compatibility matches (same gender or any)
      if (userProfile.gender === rm.gender) score += 5;
      
      // City match
      if (selectedCity === rm.city) score += 5;
    } else {
      // Return their default preset match percentage
      return rm.matchPercentage;
    }
    
    return Math.min(score, 99);
  };

  // Filter listings & roommates based on active selection & search
  const filteredRoommates = roommates.filter(rm => {
    const matchesCity = rm.city === selectedCity;
    const matchesSearch = 
      rm.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rm.occupation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rm.bio.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const filteredRooms = roomListings.filter(room => {
    const matchesCity = room.city === selectedCity;
    const matchesSearch = 
      room.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSharing = !roomSharingFilter || room.sharingType === roomSharingFilter;
    const isNotDeactivated = !deactivatedRooms.includes(room.id);
    return matchesCity && matchesSearch && matchesSharing && isNotDeactivated;
  });

  const sortedRoommates = [...filteredRoommates].sort((a, b) => {
    if (!userLocation) return 0;
    const distA = getItemDistance(a.bio, a.city) ?? 9999;
    const distB = getItemDistance(b.bio, b.city) ?? 9999;
    return distA - distB;
  });

  const sortedRooms = [...filteredRooms].sort((a, b) => {
    if (!userLocation) return 0;
    const distA = getItemDistance(a.location, a.city) ?? 9999;
    const distB = getItemDistance(b.location, b.city) ?? 9999;
    return distA - distB;
  });

  const myRooms = roomListings.filter(room => room.postedBy.name === userProfile.fullName);

  // Helper functions for auto-generating title & description fallbacks
  const getPropertyTypeLabel = (type: string) => {
    switch (type) {
      case '1BHK': return '1 BHK Flat';
      case '2BHK': return '2 BHK Flat';
      case 'Shared Room': return 'Shared Room';
      case 'Room': return 'Single Room';
      default: return type;
    }
  };

  const getLocality = () => {
    if (!address || !address.trim()) {
      return selectedCity || 'Locality';
    }
    const parts = address.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length > 1 && (parts[parts.length - 1].toLowerCase().includes('bengaluru') || parts[parts.length - 1].toLowerCase().includes('bangalore') || parts[parts.length - 1].toLowerCase().includes('mumbai') || parts[parts.length - 1].toLowerCase().includes('delhi') || parts[parts.length - 1].toLowerCase().includes('hyderabad') || parts[parts.length - 1].toLowerCase().includes('pune'))) {
      parts.pop();
    }
    return parts.join(', ') || address.trim();
  };

  const getEffectiveListingTitle = () => {
    if (listingTitle && listingTitle.trim() !== '') {
      return listingTitle.trim();
    }
    const propType = getPropertyTypeLabel(listingType);
    const locality = getLocality();
    return `${propType} in ${locality}`;
  };

  const getEffectiveDescription = () => {
    if (description && description.trim() !== '') {
      return description.trim();
    }
    const propType = getPropertyTypeLabel(listingType);
    const availDate = availableFrom && availableFrom.trim() ? availableFrom.trim() : 'Immediate';
    const amenitiesList = newRoomAmenities.length > 0 
      ? newRoomAmenities.join(', ') 
      : 'Wi-Fi, Kitchen, AC';
    return `Furnished ${propType} available from ${availDate}. Amenities: ${amenitiesList}.`;
  };

  // Posting room handler
  const handlePostRoom = () => {
    if (!monthlyRent || !securityDeposit || !availableFrom || !stayDuration || !address) {
      showToast('Please fill out all required fields.');
      return;
    }

    const finalTitle = getEffectiveListingTitle();
    const finalDescription = getEffectiveDescription();

    const newRoom: RoomListing = {
      id: `room-${Date.now()}`,
      title: finalTitle,
      rent: Number(monthlyRent),
      location: `${address}${landmark ? ', ' + landmark : ''}, ${selectedCity}`,
      city: selectedCity,
      sharingType: listingType === 'Shared Room' ? 'Shared Room' : 'Private Room',
      images: listingPhotos.length > 0 ? listingPhotos : ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600&h=400'],
      amenities: newRoomAmenities.length > 0 ? newRoomAmenities : ['Wi-Fi', 'Kitchen'],
      postedBy: {
        name: userProfile.fullName || 'Anonymous User',
        photoUrl: userProfile.photoUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200&h=200'
      },
      description: finalDescription
    };

    setRoomListings([newRoom, ...roomListings]);
    setCreateStep('published');

    if (isOffline) {
      setOfflineQueue(prev => [...prev, { type: 'listing', listingId: newRoom.id }]);
      showToast('Offline: Listing created locally & queued for sync! ⏳');
    } else {
      showToast('Listing published successfully! 🎉');
    }
  };

  const handleResetForm = () => {
    setListingTitle('');
    setMonthlyRent('');
    setSecurityDeposit('');
    setAvailableFrom('');
    setDescription('');
    setListingPhotos(['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600&h=400']);
    setNewRoomAmenities([]);
    setLifestylePrefs([]);
    setRoommateGender('Any');
    setAddress('');
    setLandmark('');
    setCreateStep(1);
  };

  const toggleAmenity = (amenity: string) => {
    if (newRoomAmenities.includes(amenity)) {
      setNewRoomAmenities(newRoomAmenities.filter(a => a !== amenity));
    } else {
      setNewRoomAmenities([...newRoomAmenities, amenity]);
    }
  };

  // Open Chat thread helper
  const handleStartChatWithRoommate = (partner: RoommateCard) => {
    // Close detail modals
    setSelectedRoommate(null);
    setSelectedRoom(null);
    
    // Check if chat thread already exists
    let existingThread = chats.find(c => c.partner.id === partner.id);
    
    if (!existingThread) {
      const newThread: ChatThread = {
        id: `chat-${partner.id}`,
        partner: partner,
        messages: [
          { 
            id: `m-init-${Date.now()}`, 
            sender: 'them', 
            text: `Hey! I am ${partner.name}. Let's chat about shared flat preferences!`, 
            timestamp: 'Just now' 
          }
        ],
        unread: false
      };
      setChats([newThread, ...chats]);
      existingThread = newThread;
    }
    
    setActiveChatThread(existingThread);
    setActiveTab('chats');
  };

  // Chat message sending handler with interactive typing response
  const handleSendMessage = () => {
    if (!chatInputText.trim() || !activeChatThread) return;

    const myMessage: Message = {
      id: `my-${Date.now()}`,
      sender: 'me',
      text: chatInputText,
      timestamp: 'Just now',
      status: isOffline ? 'pending' : 'sent'
    };

    const updatedMessages = [...activeChatThread.messages, myMessage];
    const updatedThread = {
      ...activeChatThread,
      messages: updatedMessages,
      unread: false
    };

    // Update global chats array
    const updatedChats = chats.map(c => c.id === activeChatThread.id ? updatedThread : c);
    setChats(updatedChats);
    setActiveChatThread(updatedThread);
    setChatInputText('');

    if (isOffline) {
      setOfflineQueue(prev => [...prev, { type: 'message', messageId: myMessage.id, threadId: activeChatThread.id }]);
      showToast('Offline: Message queued for sync! ⏳');
      return;
    }

    // Trigger flatmate reply simulation after 1.5 seconds if online
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      let responseText = "That sounds perfect! Let's schedule a call or meet up this weekend to discuss rules.";
      if (chatInputText.toLowerCase().includes('rent') || chatInputText.toLowerCase().includes('budget') || chatInputText.toLowerCase().includes('money')) {
        responseText = `Yes, the rent of ₹${activeChatThread.partner.budget} fits well. We divide utility bills equally, usually about ₹1,500 extra per person.`;
      } else if (chatInputText.toLowerCase().includes('clean') || chatInputText.toLowerCase().includes('cook')) {
        responseText = `I agree completely. Having a clean house is super important to me! I prefer hiring a cook so we get fresh home-cooked meals easily.`;
      } else if (chatInputText.toLowerCase().includes('smoke') || chatInputText.toLowerCase().includes('drink')) {
        responseText = `Absolutely. I prefer ${activeChatThread.partner.smoking === 'No Smoking' ? 'no smoking inside the house at all' : 'only smoking in the balcony'}. Glad we are on the same page!`;
      }

      const replyMessage: Message = {
        id: `reply-${Date.now()}`,
        sender: 'them',
        text: responseText,
        timestamp: 'Just now'
      };

      const finalMessages = [...updatedMessages, replyMessage];
      const finalThread = {
        ...updatedThread,
        messages: finalMessages
      };

      setChats(chats.map(c => c.id === activeChatThread.id ? finalThread : c));
      setActiveChatThread(finalThread);
    }, 1500);
  };

  return (
    <div className="w-full flex flex-col min-h-screen pb-24 text-[#0F172A] relative">
      
      {/* Offline Status indicator */}
      {isOffline && (
        <div className="bg-amber-500 text-white text-[11px] font-black py-2 px-4 flex items-center justify-between gap-2 shadow-xs sticky top-0 z-40 animate-pulse">
          <div className="flex items-center gap-1.5">
            <span className="text-sm">⚠️</span>
            <span>You are currently offline. Working with local offline-ready database.</span>
          </div>
          <button 
            onClick={() => {
              if (navigator.onLine) {
                setIsOffline(false);
                showToast("Connected to server successfully!");
              } else {
                showToast("Still offline. Trying again...");
              }
            }}
            className="bg-white/20 hover:bg-white/35 text-white text-[9px] font-black px-2 py-1 rounded-md transition-all uppercase tracking-wider cursor-pointer active:scale-95"
          >
            Check Sync
          </button>
        </div>
      )}

      {/* PWA App Installation Promo Banner */}
      {showInstallPromo && (
        <div className="mx-6 mt-4 bg-slate-900 text-white rounded-2xl p-4 shadow-md relative overflow-hidden flex flex-col gap-2 border border-slate-800 animate-in slide-in-from-top-4 duration-300">
          <button 
            onClick={() => setShowInstallPromo(false)}
            className="absolute top-3 right-3 text-white/50 hover:text-white cursor-pointer transition-colors"
          >
            <X size={14} />
          </button>
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-[#128A4E] text-white font-extrabold px-2 py-0.5 rounded-md">PWA INSTANT</span>
            <p className="text-[10px] font-black tracking-wider uppercase text-emerald-400">Install Relok App ✨</p>
          </div>
          <h4 className="text-xs font-bold leading-relaxed max-w-[85%] text-slate-200">
            {isIOS 
              ? "To install Relok Co-Living on your iPhone, tap Safari's Share button and select 'Add to Home Screen' for standalone access!"
              : "Install Relok on your device home screen for lightning-fast matching and offline message access."
            }
          </h4>
          {!isIOS && (
            <div className="flex gap-2 mt-1">
              <button 
                onClick={handleInstallClick} 
                className="text-[10px] font-extrabold bg-[#128A4E] hover:bg-[#0D6D3B] text-white px-3.5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                Install App
              </button>
              <button 
                onClick={() => setShowInstallPromo(false)} 
                className="text-[10px] font-extrabold bg-white/10 hover:bg-white/15 text-white px-3.5 py-2 rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                Maybe Later
              </button>
            </div>
          )}
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-[#128A4E] text-white px-5 py-3.5 rounded-2xl shadow-lg z-50 flex items-center gap-2 border border-white/20 animate-bounce">
          <Check size={18} strokeWidth={3} />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* VIEW CONTROLLER CONTENT SCROLLBOX */}
      <main className="px-6 py-4 flex-1">
        
        {/* TAB 1: HOME */}
        {activeTab === 'home' && (
          <div className="flex flex-col gap-5">
            {/* 1. Greeting Row */}
            <div className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] text-[#128A4E] font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles size={11} className="text-[#128A4E]" />
                  Relok Match Engine Active
                </span>
                <h1 className="text-base font-extrabold text-[#0F172A] tracking-tight">
                  {new Date().getHours() < 12 ? 'Good Morning' : new Date().getHours() < 17 ? 'Good Afternoon' : 'Good Evening'}, {userProfile.fullName ? userProfile.fullName.split(' ')[0] : 'Flatmate'} 👋
                </h1>
              </div>

              {/* Indian City Selection Dropdown (integrated here, inline!) */}
              <div className="relative">
                <button 
                  onClick={() => setShowCityDropdown(!showCityDropdown)}
                  className="flex items-center gap-1 text-[11px] font-extrabold text-[#128A4E] hover:text-[#0F7A44] transition-colors py-1.5 px-2.5 rounded-xl bg-[#E8F5EE] cursor-pointer border border-[#128A4E]/10"
                >
                  <MapPin size={12} />
                  <span>{selectedCity}</span>
                </button>

                {showCityDropdown && (
                  <>
                    <div 
                      className="fixed inset-0 z-40 bg-black/5" 
                      onClick={() => setShowCityDropdown(false)} 
                    />
                    <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-lg z-50 py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-3 py-1.5 text-[9px] font-bold text-gray-400 bg-gray-50 border-b border-gray-100 uppercase tracking-wider">
                        SELECT METRO CITY
                      </div>
                      {INDIAN_CITIES.map((city) => (
                        <button
                          key={city}
                          onClick={() => {
                            setSelectedCity(city);
                            setShowCityDropdown(false);
                            showToast(`Location switched to ${city}`);
                          }}
                          className={`w-full text-left px-3 py-2 text-xs font-bold hover:bg-gray-50 transition-colors flex items-center justify-between ${
                            selectedCity === city ? 'text-[#128A4E] bg-[#E8F5EE]/40 font-extrabold' : 'text-gray-700'
                          }`}
                        >
                          <span>{city}</span>
                          {selectedCity === city && <Check size={12} className="text-[#128A4E]" />}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 2. Clean Search Bar */}
            <div className="flex gap-2 w-full">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search flatmates or rooms"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 bg-white border border-gray-200 rounded-xl text-xs pl-11 pr-10 focus:outline-none focus:border-[#128A4E] text-[#0F172A] placeholder-[#9CA3AF] shadow-sm font-semibold"
                />
                {searchQuery ? (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                ) : (
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[#128A4E] cursor-pointer" onClick={() => showToast("Apply customized filter parameters in search.")}>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={handleToggleNearMe}
                className={`h-11 px-3 rounded-xl border text-[10px] font-black tracking-wider uppercase transition-all flex items-center gap-1 shrink-0 shadow-sm cursor-pointer ${
                  userLocation 
                    ? 'border-[#128A4E] bg-[#E8F5EE] text-[#128A4E] ring-1 ring-[#128A4E]' 
                    : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                }`}
              >
                <span>📍</span>
                <span>{userLocation ? 'Near Me' : 'Near Me'}</span>
              </button>
            </div>

            {roomSharingFilter && (
              <div className="flex items-center gap-1.5 self-start bg-[#E8F5EE] border border-[#128A4E]/20 text-[#128A4E] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs mt-1 animate-in fade-in slide-in-from-top-1 duration-200">
                <span>Filter: {roomSharingFilter}</span>
                <button 
                  onClick={() => setRoomSharingFilter('')}
                  className="p-0.5 hover:bg-[#128A4E]/10 rounded-full transition-colors cursor-pointer"
                  type="button"
                >
                  <X size={10} strokeWidth={3} />
                </button>
              </div>
            )}

            {/* 3. Category Navigation Tabs */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
              {[
                { key: 'all', label: 'All Listings' },
                { key: 'roommates', label: 'Compatible Mates' },
                { key: 'rooms', label: 'Available Rooms' },
                { key: 'my', label: 'My Posted Rooms' }
              ].map((pill) => (
                <button
                  key={pill.key}
                  onClick={() => setHomeFilter(pill.key as any)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full border text-xs font-bold transition-all shrink-0 cursor-pointer ${
                    homeFilter === pill.key
                      ? 'border-[#128A4E] text-[#128A4E] bg-[#E8F5EE] font-extrabold shadow-2xs'
                      : 'border-gray-200 text-gray-500 bg-white hover:border-gray-300'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* ALL LISTINGS: HORIZONTAL SCROLL DASHBOARD */}
            {homeFilter === 'all' && (
              <div className="flex flex-col gap-6 mt-1">
                {/* A. Roommate Candidates Scroll Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-gray-950 flex items-center gap-1.5">
                      <Users size={16} className="text-[#128A4E]" />
                      Highly Compatible Matches
                    </h3>
                    <button 
                      onClick={() => setHomeFilter('roommates')}
                      className="text-xs font-extrabold text-[#128A4E] hover:underline cursor-pointer"
                    >
                      See All
                    </button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth no-scrollbar">
                    {sortedRoommates.map((rm) => {
                      const matchPct = getDynamicCompatibility(rm);
                      const distance = getItemDistance(rm.bio, rm.city);
                      return (
                        <div 
                          key={rm.id}
                          onClick={() => setSelectedRoommate(rm)}
                          className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:border-[#128A4E]/30 shrink-0 w-64 snap-start cursor-pointer transition-all duration-200 flex flex-col gap-3 relative"
                        >
                          <div className="absolute top-4 right-4 bg-[#E8F5EE] text-[#128A4E] font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                            <Sparkles size={8} />
                            <span>{matchPct}% Match</span>
                          </div>

                          <div className="flex gap-3 items-center">
                            <img 
                              src={rm.photoUrl} 
                              alt={rm.name} 
                              className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex flex-col">
                              <h4 className="text-xs font-extrabold text-[#0F172A] leading-tight truncate w-32">{rm.name}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold">{rm.age} yrs • {rm.occupation.split(' at ')[0]}</p>
                              {userLocation && distance !== null && (
                                <p className="text-[9px] font-bold text-[#128A4E] mt-0.5">
                                  📍 {distance} km away
                                </p>
                              )}
                            </div>
                          </div>

                          <p className="text-[10px] text-gray-500 line-clamp-2 italic leading-relaxed">
                            "{rm.bio}"
                          </p>

                          <div className="flex justify-between items-center border-t border-gray-50 pt-2.5 mt-0.5">
                            <span className="text-[9px] font-black text-[#128A4E] bg-[#E8F5EE] px-1.5 py-0.5 rounded">
                              Budget: {rm.budget}/mo
                            </span>
                            <span className="text-[9px] font-bold text-gray-400">
                              {rm.city}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* B. Available Properties Scroll Section */}
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-extrabold text-gray-950 flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-[#128A4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      Featured Properties
                    </h3>
                    <button 
                      onClick={() => setHomeFilter('rooms')}
                      className="text-xs font-extrabold text-[#128A4E] hover:underline cursor-pointer"
                    >
                      See All
                    </button>
                  </div>

                  <div className="flex gap-4 overflow-x-auto pb-3 pt-1 snap-x scroll-smooth no-scrollbar">
                    {sortedRooms.map((room) => {
                      const distance = getItemDistance(room.location, room.city);
                      return (
                        <div 
                          key={room.id}
                          onClick={() => setSelectedRoom(room)}
                          className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-[#128A4E]/30 shrink-0 w-64 snap-start cursor-pointer transition-all duration-200"
                        >
                          <div className="relative h-28 bg-gray-100">
                            <img 
                              src={room.images[0]} 
                              alt={room.title} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 bg-black/60 text-white font-extrabold text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                              {room.sharingType}
                            </div>
                            <div className="absolute bottom-2 right-2 bg-[#128A4E] text-white font-extrabold text-[10px] px-2 py-0.5 rounded">
                              ₹{room.rent.toLocaleString('en-IN')}/mo
                            </div>
                          </div>

                          <div className="p-3 flex flex-col gap-1">
                            <h4 className="text-xs font-extrabold text-[#0F172A] truncate leading-tight">{room.title}</h4>
                            <p className="text-[10px] text-gray-400 font-semibold truncate flex items-center gap-0.5">
                              <MapPin size={10} className="text-[#128A4E] shrink-0" />
                              <span>{room.location}</span>
                            </p>
                            {userLocation && distance !== null && (
                              <p className="text-[9px] font-bold text-[#128A4E] flex items-center gap-0.5 mt-0.5">
                                📍 {distance} km away
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>


              </div>
            )}

            {/* DEDICATED GRIDS FOR SELECTED CATEGORIES */}
            {homeFilter !== 'all' && (
              <div className="flex flex-col gap-4 mt-1">
                {/* 1. ROOMMATES LIST VIEW */}
                {homeFilter === 'roommates' && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Compatible Roommates</h3>
                      <span className="text-[10px] bg-[#E8F5EE] text-[#128A4E] font-bold px-2 py-0.5 rounded-full">{sortedRoommates.length} found</span>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {sortedRoommates.map((rm) => {
                        const matchPct = getDynamicCompatibility(rm);
                        const distance = getItemDistance(rm.bio, rm.city);
                        return (
                          <div 
                            key={rm.id}
                            onClick={() => setSelectedRoommate(rm)}
                            className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm hover:border-[#128A4E]/35 cursor-pointer relative flex flex-col gap-3 transition-all"
                          >
                            <div className="absolute top-4 right-4 bg-[#E8F5EE] text-[#128A4E] font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5">
                              <Sparkles size={8} />
                              <span>{matchPct}% Match</span>
                            </div>

                            <div className="flex gap-3">
                              <img 
                                src={rm.photoUrl} 
                                alt={rm.name} 
                                className="w-12 h-12 rounded-full object-cover border border-gray-100 shrink-0"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex flex-col">
                                <h4 className="text-xs font-extrabold text-[#0F172A]">{rm.name}</h4>
                                <p className="text-[10px] text-gray-400 font-semibold">{rm.age} yrs • {rm.occupation}</p>
                                {userLocation && distance !== null && (
                                  <p className="text-[9px] font-bold text-[#128A4E] mt-0.5 flex items-center gap-0.5">
                                    📍 {distance} km away
                                  </p>
                                )}
                                <span className="text-[10px] font-black text-[#128A4E] mt-1 bg-[#E8F5EE] self-start px-2 py-0.5 rounded">
                                  Budget: {rm.budget}/mo
                                </span>
                              </div>
                            </div>

                            <p className="text-[10px] text-gray-500 italic line-clamp-2 leading-relaxed">
                              "{rm.bio}"
                            </p>

                            <div className="flex gap-1.5 flex-wrap pt-2.5 border-t border-gray-50">
                              <span className="text-[9px] bg-slate-50 text-gray-500 font-extrabold px-2 py-0.5 rounded border border-gray-100">{rm.sleepSchedule}</span>
                              <span className="text-[9px] bg-slate-50 text-gray-500 font-extrabold px-2 py-0.5 rounded border border-gray-100">{rm.cleanliness}</span>
                              <span className="text-[9px] bg-slate-50 text-gray-500 font-extrabold px-2 py-0.5 rounded border border-gray-100">{rm.dietary}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 2. PROPERTIES LIST VIEW */}
                {(homeFilter === 'rooms' || homeFilter === 'my') && (
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                        {homeFilter === 'my' ? 'My Posted Rooms' : 'Available Rooms'}
                      </h3>
                      <span className="text-[10px] bg-[#E8F5EE] text-[#128A4E] font-bold px-2 py-0.5 rounded-full">
                        {(homeFilter === 'my' ? myRooms : sortedRooms).length} listed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {(homeFilter === 'my' ? myRooms : sortedRooms).map((room) => {
                        const distance = getItemDistance(room.location, room.city);
                        return (
                          <div 
                            key={room.id}
                            onClick={() => setSelectedRoom(room)}
                            className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:border-[#128A4E]/35 cursor-pointer transition-all flex flex-col"
                          >
                            <div className="relative h-40 bg-gray-100">
                              <img 
                                src={room.images[0]} 
                                alt={room.title} 
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                              <div className="absolute top-2 left-2 bg-black/60 text-white font-extrabold text-[8px] px-2 py-0.5 rounded uppercase tracking-wider">
                                {room.sharingType}
                              </div>
                              <div className="absolute bottom-2 right-2 bg-[#128A4E] text-white font-extrabold text-xs px-2.5 py-1 rounded">
                                ₹{room.rent.toLocaleString('en-IN')}/mo
                              </div>
                            </div>

                            <div className="p-4 flex flex-col gap-2">
                              <h4 className="text-xs font-extrabold text-[#0F172A]">{room.title}</h4>
                              <p className="text-[10px] text-gray-400 font-semibold flex items-center gap-0.5">
                                <MapPin size={11} className="text-[#128A4E] shrink-0" />
                                <span>{room.location}</span>
                              </p>
                              {userLocation && distance !== null && (
                                <p className="text-[9px] font-bold text-[#128A4E] flex items-center gap-0.5">
                                  📍 {distance} km away
                                </p>
                              )}
                              <p className="text-[10px] text-gray-500 line-clamp-2 leading-relaxed italic">
                                "{room.description}"
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: MATCHES */}
        {activeTab === 'matches' && (
          <div className="flex flex-col gap-4">
            {!selectedMatch ? (
              // SUBVIEW 1: MATCHES (LIST)
              <div className="flex flex-col gap-4">
                {/* Screen Header */}
                <div className="flex flex-col gap-1.5 pb-2.5 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-gray-950 flex items-center gap-2">
                    <Sparkles size={18} className="text-[#128A4E]" />
                    Highly Compatible Matches
                  </h2>
                  <p className="text-xs text-gray-400 font-semibold leading-relaxed">
                    Dynamic AI matchmaking running against your lifestyle preferences and habits.
                  </p>
                </div>

                {/* Show highest compatible roommates ordered by score */}
                <div className="flex flex-col gap-3.5">
                  {roommates
                    .map(rm => ({ ...rm, dynamicScore: getDynamicCompatibility(rm) }))
                    .sort((a, b) => b.dynamicScore - a.dynamicScore)
                    .map((rm) => (
                      <div 
                        key={rm.id}
                        onClick={() => setSelectedMatch(rm)}
                        className="bg-white rounded-2xl border border-gray-200 hover:border-[#128A4E]/30 p-4 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col gap-3.5 cursor-pointer relative group"
                      >
                        {/* Percentage badge */}
                        <div className="absolute top-4 right-4 bg-[#E8F5EE] text-[#128A4E] font-black text-xs px-2.5 py-1 rounded-full flex items-center gap-0.5">
                          <Sparkles size={11} />
                          <span>{rm.dynamicScore}% Match</span>
                        </div>

                        <div className="flex gap-4">
                          <img 
                            src={rm.photoUrl} 
                            alt={rm.name} 
                            className="w-14 h-14 rounded-full object-cover border border-gray-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 pr-16 flex flex-col gap-0.5 justify-center">
                            <h4 className="text-xs font-black text-[#0F172A] flex items-center gap-1">
                              {rm.name}
                              <span className="text-[10px] text-gray-400 font-bold">• {rm.age}</span>
                            </h4>
                            <p className="text-[10px] text-gray-400 font-semibold truncate w-44">{rm.occupation.split(' at ')[0]}</p>
                            <span className="text-[9px] font-black text-[#128A4E] bg-[#E8F5EE] px-2 py-0.5 rounded self-start mt-1">
                              Budget: {rm.budget}/mo
                            </span>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-gray-100" />

                        {/* Key indicators */}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-3 text-[10px] text-gray-400 font-semibold">
                            <span className="flex items-center gap-1 text-gray-500">
                              <span className={`w-1.5 h-1.5 rounded-full ${lifestylePref.sleepSchedule === rm.sleepSchedule ? 'bg-green-500' : 'bg-amber-400'}`} />
                              {rm.sleepSchedule}
                            </span>
                            <span className="flex items-center gap-1 text-gray-500">
                              <span className={`w-1.5 h-1.5 rounded-full ${lifestylePref.cleanliness === rm.cleanliness ? 'bg-green-500' : 'bg-amber-400'}`} />
                              {rm.cleanliness}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-[#128A4E] group-hover:translate-x-1.5 transition-transform duration-300 flex items-center gap-0.5">
                            Details <ChevronRight size={13} strokeWidth={2.5} />
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ) : (
              // SUBVIEW 2: MATCH PROFILE (DETAIL)
              <div className="flex flex-col gap-5">
                {/* Immersive Header Row */}
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <button 
                    onClick={() => setSelectedMatch(null)}
                    className="flex items-center text-xs font-black text-[#128A4E] hover:underline cursor-pointer"
                  >
                    ← Back to Matches
                  </button>
                  <span className="text-[11px] font-black text-gray-400 uppercase tracking-widest">Candidate Profile</span>
                </div>

                {/* Massive Avatar Area with gradient/slate backdrop */}
                <div className="relative bg-gradient-to-br from-[#E8F5EE] to-slate-100 rounded-3xl p-6 shadow-xs border border-gray-100 flex flex-col items-center text-center gap-4">
                  <div className="relative">
                    <img 
                      src={selectedMatch.photoUrl} 
                      alt={selectedMatch.name} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-[#128A4E] text-white p-1.5 rounded-full border-2 border-white shadow-sm">
                      <Sparkles size={14} className="text-white" />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-black text-[#0F172A]">{selectedMatch.name}, {selectedMatch.age}</h3>
                    <p className="text-xs text-gray-400 font-semibold">{selectedMatch.occupation} • {selectedMatch.city}</p>
                  </div>

                  {/* Massive score pill */}
                  <div className="bg-[#128A4E] text-white font-black text-xs px-4 py-2 rounded-full shadow-sm flex items-center gap-1">
                    <span>{getDynamicCompatibility(selectedMatch)}% Compatibility Match Score</span>
                  </div>
                </div>

                {/* Bio Card */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-2.5 shadow-sm">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">About Me</h4>
                  <p className="text-xs text-gray-600 font-semibold leading-relaxed italic">
                    "{selectedMatch.bio}"
                  </p>
                </div>

                {/* Compatibility Score Breakdown */}
                <div className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Match Compatibility Parameters</h4>
                  
                  <div className="flex flex-col gap-2.5 text-xs">
                    {[
                      { 
                        label: 'Sleep Schedule', 
                        userVal: lifestylePref.sleepSchedule, 
                        matchVal: selectedMatch.sleepSchedule, 
                        matched: lifestylePref.sleepSchedule === selectedMatch.sleepSchedule 
                      },
                      { 
                        label: 'Cleanliness Level', 
                        userVal: lifestylePref.cleanliness, 
                        matchVal: selectedMatch.cleanliness, 
                        matched: lifestylePref.cleanliness === selectedMatch.cleanliness 
                      },
                      { 
                        label: 'Dietary Preference', 
                        userVal: lifestylePref.dietary, 
                        matchVal: selectedMatch.dietary, 
                        matched: lifestylePref.dietary === selectedMatch.dietary || selectedMatch.dietary === 'Any' 
                      },
                      { 
                        label: 'Smoking', 
                        userVal: lifestylePref.smoking, 
                        matchVal: selectedMatch.smoking, 
                        matched: lifestylePref.smoking === selectedMatch.smoking 
                      }
                    ].map((param, i) => (
                      <div key={i} className="flex justify-between items-center bg-slate-50/60 p-2.5 rounded-xl border border-gray-100">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-bold text-gray-800 text-xs">{param.label}</span>
                          <span className="text-[10px] text-gray-400 font-semibold">
                            You: {param.userVal} • {selectedMatch.name}: {param.matchVal}
                          </span>
                        </div>
                        <span className={`text-[10px] font-black px-2.5 py-1 rounded-full ${
                          param.matched 
                            ? 'bg-[#E8F5EE] text-[#128A4E]' 
                            : 'bg-amber-50 text-amber-600'
                        }`}>
                          {param.matched ? 'Perfect ✓' : 'Moderate'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Action sticky-like row */}
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <button
                    onClick={() => {
                      showToast(`Match request dismissed`);
                      setSelectedMatch(null);
                    }}
                    className="w-full h-11 rounded-xl text-xs font-bold border border-gray-300 bg-white text-gray-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Dismiss Seeker
                  </button>
                  <PrimaryButton
                    text="Send Direct Message"
                    onClick={() => handleStartChatWithRoommate(selectedMatch)}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: POST ROOM LISTING (5-STEP WIZARD) */}
        {activeTab === 'post' && (
          <div className="flex flex-col gap-4">
            {/* PROGRESS WIZARD INDICATOR */}
            {createStep !== 'published' && (
              <div className="flex items-center justify-between px-2 py-4 bg-[#F8FAFC] rounded-2xl border border-gray-100 shadow-2xs mb-2">
                {[1, 2, 3, 4, 5].map((step) => (
                  <div key={step} className="flex flex-col items-center flex-1 relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300 z-10 ${
                      createStep === step 
                        ? 'bg-[#128A4E] text-white ring-4 ring-[#128A4E]/25'
                        : typeof createStep === 'number' && createStep > step
                        ? 'bg-[#128A4E] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {typeof createStep === 'number' && createStep > step ? '✓' : step}
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 mt-1 uppercase tracking-wider">
                      {step === 1 ? 'Details' : step === 2 ? 'Photos' : step === 3 ? 'Prefs' : step === 4 ? 'Location' : 'Review'}
                    </span>
                    {step < 5 && (
                      <div className={`absolute top-4 left-[60%] right-[-40%] h-0.5 -z-0 ${
                        typeof createStep === 'number' && createStep > step ? 'bg-[#128A4E]' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1: BASIC DETAILS */}
            {createStep === 1 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold text-gray-950">Basic Property Details</h3>
                  <p className="text-xs text-gray-400 font-semibold">Start with the fundamental listings specs.</p>
                </div>

                {/* Listing Type Selectable Cards */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Listing Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { key: 'Room', label: 'Single Room', desc: 'Private room in a shared flat' },
                      { key: '1BHK', label: '1 BHK Flat', desc: 'Independent 1 BHK apartment' },
                      { key: '2BHK', label: '2 BHK Flat', desc: 'Independent 2 BHK apartment' },
                      { key: 'Shared Room', label: 'Shared Room', desc: 'Shared bedroom with flatmate' }
                    ].map((type) => (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => setListingType(type.key as any)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col gap-1 ${
                          listingType === type.key 
                            ? 'border-[#128A4E] bg-[#E8F5EE]/40 ring-1 ring-[#128A4E]' 
                            : 'border-gray-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-xs font-bold text-gray-900">{type.label}</span>
                        <span className="text-[10px] text-gray-400">{type.desc}</span>
                        {listingType === type.key && (
                          <div className="absolute top-2.5 right-2.5 w-4 h-4 rounded-full bg-[#128A4E] flex items-center justify-center text-white text-[9px] font-bold">✓</div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <FormInput
                  label="Listing Title"
                  placeholder="e.g. Modern Private Room in Premium Society, HSR"
                  value={listingTitle}
                  onChange={setListingTitle}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Monthly Rent (INR)"
                    placeholder="e.g. 18000"
                    type="number"
                    value={monthlyRent}
                    onChange={setMonthlyRent}
                    icon={<span className="text-xs font-bold text-gray-400">₹</span>}
                  />

                  <FormInput
                    label="Security Deposit (INR)"
                    placeholder="e.g. 50000"
                    type="number"
                    value={securityDeposit}
                    onChange={setSecurityDeposit}
                    icon={<span className="text-xs font-bold text-gray-400">₹</span>}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Available From</label>
                    <input
                      type="date"
                      value={availableFrom}
                      onChange={(e) => setAvailableFrom(e.target.value)}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl text-xs px-4 focus:outline-none focus:border-[#128A4E] text-[#0F172A] font-semibold"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Stay Duration</label>
                    <select
                      value={stayDuration}
                      onChange={(e) => setStayDuration(e.target.value)}
                      className="w-full h-12 bg-white border border-gray-200 rounded-xl text-xs px-4 focus:outline-none focus:border-[#128A4E] text-[#0F172A] font-semibold"
                    >
                      <option value="Flexible">Flexible Duration</option>
                      <option value="3 Months">3 Months Minimum</option>
                      <option value="6 Months">6 Months Minimum</option>
                      <option value="12 Months">12 Months Minimum</option>
                    </select>
                  </div>
                </div>

                <FormTextarea
                  label="Description of Room & Flatmates"
                  placeholder="Tell potential flatmates about the room, house regulations, flatmates, cook facility, current setup..."
                  value={description}
                  onChange={setDescription}
                  maxLength={350}
                />

                <div className="pt-2">
                  <PrimaryButton
                    onClick={() => setCreateStep(2)}
                    text="Continue →"
                    disabled={!monthlyRent || !securityDeposit || !availableFrom || !stayDuration}
                  />
                </div>
              </div>
            )}

            {/* STEP 2: PHOTOS */}
            {createStep === 2 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold text-gray-950">Add Photos</h3>
                  <p className="text-xs text-gray-400 font-semibold">Upload quality photos to get up to 5x higher matches.</p>
                </div>

                {/* Photo Upload Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Living Room', icon: '📺' },
                    { label: 'Bedroom', icon: '🛏️', filled: true },
                    { label: 'Kitchen', icon: '🍳' },
                    { label: 'Bathroom', icon: '🚿' },
                    { label: 'Balcony', icon: '🌿' },
                    { label: 'Building', icon: '🏢' }
                  ].map((category, idx) => {
                    const isSelected = idx === 1; // Bedroom is filled as preset mockup
                    return (
                      <div 
                        key={idx}
                        onClick={() => {
                          showToast(`Simulated photo selection for ${category.label}`);
                        }}
                        className={`h-24 rounded-xl border border-dashed flex flex-col items-center justify-center gap-1.5 cursor-pointer relative overflow-hidden transition-all ${
                          isSelected 
                            ? 'border-[#128A4E] bg-[#E8F5EE]/40' 
                            : 'border-gray-200 hover:border-gray-400 bg-slate-50/55'
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <img 
                              src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=150&h=150" 
                              alt="Mock" 
                              className="absolute inset-0 w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center text-white text-[9px] font-bold">
                              Bedroom ✓
                            </div>
                          </>
                        ) : (
                          <>
                            <span className="text-lg">{category.icon}</span>
                            <span className="text-[9px] text-gray-500 font-bold uppercase">{category.label}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Photo Tips Banner */}
                <div className="bg-amber-50/70 border border-amber-100 rounded-xl p-3.5 flex gap-2.5 items-start">
                  <span className="text-sm shrink-0">💡</span>
                  <div className="flex flex-col gap-0.5">
                    <p className="text-[11px] font-bold text-amber-800">Photo tips for higher success:</p>
                    <p className="text-[10px] text-amber-700 leading-relaxed font-semibold">
                      Use plenty of natural daylight. Shoot wide angles from corners to show space. Keep areas clean and uncluttered. Include kitchen and washroom spaces as seekers heavily value them!
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <SecondaryButton
                    text="← Back"
                    onClick={() => setCreateStep(1)}
                  />
                  <PrimaryButton
                    text="Continue →"
                    onClick={() => setCreateStep(3)}
                  />
                </div>
              </div>
            )}

            {/* STEP 3: PREFERENCES */}
            {createStep === 3 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold text-gray-950">Amenities & Rules</h3>
                  <p className="text-xs text-gray-400 font-semibold">Specify amenities and preferred flatmate rules.</p>
                </div>

                {/* Amenities Chip Checklist */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Amenities Included</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['Wi-Fi', 'AC', 'Kitchen', 'Washing Machine', 'Power Backup', 'Gym', 'Parking', 'Security'].map((amenity) => {
                      const isSel = newRoomAmenities.includes(amenity);
                      return (
                        <button
                          key={amenity}
                          type="button"
                          onClick={() => toggleAmenity(amenity)}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#128A4E] text-[#128A4E] bg-[#E8F5EE]'
                              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {amenity} {isSel ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Lifestyle Rules Checklist */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">House Rules</label>
                  <div className="flex flex-wrap gap-1.5">
                    {['No Smoking', 'No Pets Allowed', 'Vegetarian Only', 'Guests Allowed', 'Quiet Hours (10PM)'].map((rule) => {
                      const isSel = lifestylePrefs.includes(rule);
                      return (
                        <button
                          key={rule}
                          type="button"
                          onClick={() => {
                            if (isSel) {
                              setLifestylePrefs(lifestylePrefs.filter(r => r !== rule));
                            } else {
                              setLifestylePrefs([...lifestylePrefs, rule]);
                            }
                          }}
                          className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                            isSel
                              ? 'border-[#128A4E] text-[#128A4E] bg-[#E8F5EE]'
                              : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {rule} {isSel ? '✓' : '+'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Gender Preference */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferred Flatmate Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Male', 'Female', 'Any'].map((gender) => (
                      <button
                        key={gender}
                        type="button"
                        onClick={() => setRoommateGender(gender as any)}
                        className={`h-11 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                          roommateGender === gender 
                            ? 'border-[#128A4E] text-[#128A4E] bg-[#E8F5EE] font-extrabold' 
                            : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50'
                        }`}
                      >
                        {gender}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preferred Age Range */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Preferred Flatmate Age</label>
                    <span className="text-xs font-bold text-[#128A4E]">
                      {preferredAgeMin} – {preferredAgeMax} years
                    </span>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-gray-100">
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400">Min Age</span>
                        <input
                          type="number"
                          min="18"
                          max="60"
                          value={preferredAgeMin}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPreferredAgeMin(Math.max(18, Math.min(val, preferredAgeMax - 1)));
                          }}
                          className="w-14 text-center px-1 py-0.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-[#128A4E]"
                        />
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={preferredAgeMin}
                        onChange={(e) => {
                          const minVal = Number(e.target.value);
                          setPreferredAgeMin(Math.min(minVal, preferredAgeMax - 1));
                        }}
                        className="w-full accent-[#128A4E] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 flex flex-col gap-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-400">Max Age</span>
                        <input
                          type="number"
                          min="18"
                          max="60"
                          value={preferredAgeMax}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setPreferredAgeMax(Math.min(60, Math.max(val, preferredAgeMin + 1)));
                          }}
                          className="w-14 text-center px-1 py-0.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 focus:outline-none focus:border-[#128A4E]"
                        />
                      </div>
                      <input
                        type="range"
                        min="18"
                        max="60"
                        value={preferredAgeMax}
                        onChange={(e) => {
                          const maxVal = Number(e.target.value);
                          setPreferredAgeMax(Math.max(maxVal, preferredAgeMin + 1));
                        }}
                        className="w-full accent-[#128A4E] h-1.5 bg-gray-200 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <SecondaryButton
                    text="← Back"
                    onClick={() => setCreateStep(2)}
                  />
                  <PrimaryButton
                    text="Continue →"
                    onClick={() => setCreateStep(4)}
                  />
                </div>
              </div>
            )}

            {/* STEP 4: LOCATION */}
            {createStep === 4 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold text-gray-950">Property Location</h3>
                  <p className="text-xs text-gray-400 font-semibold">Enter accurate location info and position the map pin.</p>
                </div>

                <GooglePlacesAutocompleteInput
                  label="Locality / Address"
                  placeholder="e.g. Sector 2, Lane 4, HSR Layout"
                  value={address}
                  onChange={(val, coords) => {
                    setAddress(val);
                    if (coords) {
                      setMapCenter(coords);
                    }
                  }}
                  icon={<MapPin size={18} className="text-[#128A4E]" />}
                  cityContext={selectedCity}
                />

                <GooglePlacesAutocompleteInput
                  label="Nearby Landmarks (optional)"
                  placeholder="e.g. Beside Star Biryani or HSR Club"
                  value={landmark}
                  onChange={(val) => setLandmark(val)}
                  cityContext={selectedCity}
                />

                {/* Simulated Map with Pin */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pin Location on Map</label>
                  <div className="h-40 rounded-xl overflow-hidden border border-gray-200 relative">
                    {GOOGLE_MAPS_API_KEY ? (
                      <APIProvider apiKey={GOOGLE_MAPS_API_KEY} version="weekly">
                        <Map
                          defaultCenter={mapCenter}
                          defaultZoom={15}
                          mapId="DEMO_MAP_ID"
                          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                          style={{ width: '100%', height: '100%' }}
                          onCenterChanged={(ev) => {
                            if (ev.detail.center) {
                              setMapCenter(ev.detail.center);
                            }
                          }}
                        >
                          <AdvancedMarker
                            position={mapCenter}
                            draggable={true}
                            onDragEnd={(ev) => {
                              if (ev.latLng) {
                                setMapCenter({ lat: ev.latLng.lat(), lng: ev.latLng.lng() });
                              }
                            }}
                          >
                            <Pin background="#128A4E" glyphColor="#fff" borderColor="#0D6D3B" />
                          </AdvancedMarker>
                        </Map>
                      </APIProvider>
                    ) : (
                      <iframe
                        title="OSM Map"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapCenter.lng - 0.005}%2C${mapCenter.lat - 0.003}%2C${mapCenter.lng + 0.005}%2C${mapCenter.lat + 0.003}&layer=mapnik&marker=${mapCenter.lat}%2C${mapCenter.lng}`}
                      />
                    )}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center gap-1 pointer-events-none">
                      <MapPin size={28} className="text-red-500 fill-red-200 animate-bounce" />
                      <span className="bg-slate-900/80 backdrop-blur-xs text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-md">
                        Draggable Pin
                      </span>
                    </div>
                    <button 
                      type="button"
                      onClick={() => {
                        setMapCenter({ lat: 12.9116, lng: 77.6389 });
                        setAddress('Sector 3, HSR Layout');
                        setLandmark('Near Sector 3 Park');
                        showToast("Auto-filled HSR Layout!");
                      }}
                      className="absolute bottom-2.5 right-2.5 bg-white border border-gray-200 hover:border-gray-300 text-[10px] font-extrabold text-gray-700 py-1.5 px-2.5 rounded-lg shadow-sm flex items-center gap-1 cursor-pointer transition-all z-20"
                    >
                      <span>📍 Use My Location</span>
                    </button>
                  </div>
                </div>

                {/* Pin Accuracy radio selections */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Pin Display Accuracy</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { key: 'Exact', label: 'Exact Pin', desc: 'Displays exact home pin' },
                      { key: 'Near Exact', label: 'Near Exact', desc: 'Displays within 50m radius' },
                      { key: 'Approximate', label: 'Approximate', desc: 'Displays locality only' }
                    ].map((mode) => (
                      <button
                        key={mode.key}
                        type="button"
                        onClick={() => setPinAccuracy(mode.key as any)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col gap-1 ${
                          pinAccuracy === mode.key 
                            ? 'border-[#128A4E] bg-[#E8F5EE]/40 ring-1 ring-[#128A4E]' 
                            : 'border-gray-200 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-[10px] font-bold text-gray-900">{mode.label}</span>
                        <span className="text-[8px] text-gray-400 font-semibold leading-tight">{mode.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-2">
                  <SecondaryButton
                    text="← Back"
                    onClick={() => setCreateStep(3)}
                  />
                  <PrimaryButton
                    text="Continue →"
                    onClick={() => setCreateStep(5)}
                    disabled={!address}
                  />
                </div>
              </div>
            )}

            {/* STEP 5: REVIEW & PREVIEW */}
            {createStep === 5 && (
              <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <h3 className="text-base font-extrabold text-gray-950">Review Your Listing</h3>
                  <p className="text-xs text-gray-400 font-semibold">Take a quick look to verify details before publishing.</p>
                </div>

                {/* Review Read-only Block */}
                <div className="border border-gray-200 rounded-xl overflow-hidden flex flex-col divide-y divide-gray-100 text-xs">
                  <div className="relative h-28 bg-gray-100">
                    <img 
                      src="https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600&h=400" 
                      alt="Listing Preview" 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 bg-black/60 text-white text-[9px] font-bold py-0.5 px-2 rounded-full">
                      ₹{monthlyRent || '18000'}/month
                    </div>
                  </div>

                  <div className="p-3 flex flex-col gap-1 relative">
                    <button onClick={() => setCreateStep(1)} className="absolute top-2 right-3 text-[#128A4E] font-bold text-[10px] hover:underline cursor-pointer">Edit</button>
                    <span className="text-[9px] text-[#128A4E] font-black uppercase tracking-wider">{listingType}</span>
                    <p className="font-extrabold text-gray-950 text-sm">{getEffectiveListingTitle()}</p>
                    <p className="text-[10px] text-gray-400 font-semibold">⏰ Available: {availableFrom || 'Immediate'} • Stay: {stayDuration}</p>
                  </div>

                  <div className="p-3 flex flex-col gap-1 relative">
                    <button onClick={() => setCreateStep(3)} className="absolute top-2 right-3 text-[#128A4E] font-bold text-[10px] hover:underline cursor-pointer">Edit</button>
                    <p className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Amenities Include</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(newRoomAmenities.length > 0 ? newRoomAmenities : ['Wi-Fi', 'Kitchen', 'AC']).map((amenity) => (
                        <span key={amenity} className="text-[9px] bg-[#E8F5EE] text-[#128A4E] px-2 py-0.5 rounded font-extrabold">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 flex flex-col gap-1 relative">
                    <button onClick={() => setCreateStep(4)} className="absolute top-2 right-3 text-[#128A4E] font-bold text-[10px] hover:underline cursor-pointer">Edit</button>
                    <p className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Locality & Landmark</p>
                    <p className="font-bold text-gray-900 mt-0.5">📍 {address || 'Sector 2, HSR Layout'}</p>
                    {landmark && <p className="text-[10px] text-gray-400 font-semibold">Landmark: {landmark}</p>}
                  </div>

                  <div className="p-3 flex flex-col gap-1 relative">
                    <button onClick={() => setCreateStep(1)} className="absolute top-2 right-3 text-[#128A4E] font-bold text-[10px] hover:underline cursor-pointer">Edit</button>
                    <p className="font-bold text-gray-400 text-[10px] uppercase tracking-wider">Property Description</p>
                    <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic">"{getEffectiveDescription()}"</p>
                  </div>
                </div>

                {/* Congratulations Badge Banner */}
                <div className="bg-[#E8F5EE] border border-[#128A4E]/10 rounded-xl p-3 flex gap-2.5 items-center">
                  <span className="text-base shrink-0">✨</span>
                  <p className="text-[11px] font-bold text-[#128A4E]">Your listing looks incredibly professional and clean!</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button 
                    type="button"
                    onClick={() => {
                      showToast("Draft saved successfully!");
                      setActiveTab('home');
                      setHomeFilter('my');
                    }}
                    className="w-full h-11 rounded-xl text-xs font-bold border border-gray-300 bg-white text-gray-700 hover:bg-slate-50 active:scale-98 transition-all cursor-pointer"
                  >
                    Save Draft
                  </button>
                  <PrimaryButton
                    text="Publish Listing"
                    onClick={handlePostRoom}
                  />
                </div>
              </div>
            )}

            {/* LISTING PUBLISHED SUCCESS SCREEN */}
            {createStep === 'published' && (
              <div className="bg-white rounded-2xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col items-center text-center gap-6 py-10">
                {/* Checkmark Animation Circle */}
                <div className="w-16 h-16 rounded-full bg-[#E8F5EE] border-2 border-[#128A4E] flex items-center justify-center text-[#128A4E] text-2xl animate-bounce">
                  ✓
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="text-xl font-extrabold text-gray-950">Listing Published! 🎉</h3>
                  <p className="text-xs text-gray-400 font-semibold max-w-xs">
                    Your property is now live and fully discoverable on Relok!
                  </p>
                </div>

                {/* Three verification bullet cards */}
                <div className="flex flex-col gap-2 w-full max-w-xs text-left">
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-sm shrink-0">👁️</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">Visible to thousands</span>
                      <span className="text-[9px] text-gray-400">Discoverable instantly across Metro Cities</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-sm shrink-0">⚡</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">AI Match engine activated</span>
                      <span className="text-[9px] text-gray-400">Scores matched against roommate seekers</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 bg-slate-50 border border-slate-100 rounded-xl p-2.5">
                    <span className="text-sm shrink-0">🔔</span>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-800">Instant Alerts dispatched</span>
                      <span className="text-[9px] text-gray-400">Dispatched directly to HSR/Koramangala leads</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3.5 w-full mt-2">
                  <PrimaryButton
                    text="View My Listing"
                    onClick={() => {
                      // Find the newly posted room listing or fallback
                      const postedRoom = roomListings[0];
                      if (postedRoom) {
                        setSelectedRoom(postedRoom);
                      }
                      setActiveTab('home');
                      setHomeFilter('my');
                    }}
                  />
                  <SecondaryButton
                    text="Browse Matches"
                    onClick={() => {
                      handleResetForm();
                      setActiveTab('matches');
                    }}
                  />
                  <button 
                    onClick={() => {
                      handleResetForm();
                      setActiveTab('home');
                      setHomeFilter('all');
                    }}
                    className="text-xs font-bold text-[#128A4E] hover:underline cursor-pointer"
                  >
                    Go to Home
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: CHATS */}
        {activeTab === 'chats' && (
          <div className="flex flex-col gap-4">
            {/* Thread detail screen or thread listing */}
            {activeChatThread ? (
              <div className="fixed inset-0 bg-white z-40 flex flex-col justify-between max-w-[430px] mx-auto shadow-xl">
                {/* Chat Partner Header */}
                <header className="px-4 py-3 bg-white border-b border-[#E5E7EB] flex items-center gap-3 sticky top-0">
                  <button 
                    onClick={() => setActiveChatThread(null)}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-[#0F172A] hover:bg-gray-100 active:scale-95"
                  >
                    <ChevronRight size={24} className="rotate-180" />
                  </button>

                  <img 
                    src={activeChatThread.partner.photoUrl} 
                    alt={activeChatThread.partner.name} 
                    className="w-10 h-10 rounded-full object-cover border border-[#E5E7EB]"
                    referrerPolicy="no-referrer"
                  />

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#0F172A] leading-tight">
                      {activeChatThread.partner.name}
                    </h3>
                    <p className="text-[10px] text-[#128A4E] font-semibold">
                      {activeChatThread.partner.matchPercentage}% Compatibility Match
                    </p>
                  </div>

                  <button 
                    onClick={() => setSelectedRoommate(activeChatThread.partner)}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-gray-400 hover:text-[#128A4E] hover:bg-gray-100"
                    title="View Compatibility Profiles"
                  >
                    <Info size={18} />
                  </button>
                </header>

                {/* PREMIUM LISTING INQUIRY BANNER */}
                {activeChatThread.roomListing && (
                  <div className="bg-[#E8F5EE] border-b border-[#128A4E]/15 px-4 py-2 flex items-center gap-3 shrink-0">
                    <img 
                      src={activeChatThread.roomListing.images[0]} 
                      alt={activeChatThread.roomListing.title} 
                      className="w-10 h-10 rounded-lg object-cover shrink-0 border border-white shadow-sm"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="bg-[#128A4E]/10 text-[#128A4E] text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wider">Listing Inquiry</span>
                        <span className="text-[10px] text-[#128A4E] font-black">₹{activeChatThread.roomListing.rent}/mo</span>
                      </div>
                      <p className="text-[10px] text-gray-800 font-extrabold truncate mt-0.5">
                        {activeChatThread.roomListing.title}
                      </p>
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedRoom(activeChatThread.roomListing!);
                        setActiveChatThread(null);
                        setActiveTab('home');
                      }}
                      className="shrink-0 text-[10px] font-black text-[#128A4E] hover:underline bg-white px-2 py-1 rounded border border-gray-100 shadow-xs cursor-pointer"
                    >
                      View Details →
                    </button>
                  </div>
                )}

                {/* Messages Container Box */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-3">
                  <div className="mx-auto my-2 bg-[#E8F5EE] text-[#128A4E] text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    Secure Conversation Powered by Relok
                  </div>

                  {activeChatThread.messages.map((m) => {
                    const isMe = m.sender === 'me';
                    return (
                      <div 
                        key={m.id}
                        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs flex flex-col gap-0.5 ${
                          isMe 
                            ? 'bg-[#128A4E] text-white self-end rounded-tr-none' 
                            : 'bg-white text-[#0F172A] self-start rounded-tl-none border border-gray-100'
                        }`}
                      >
                        <p>{m.text}</p>
                        <span className={`text-[9px] self-end mt-1 flex items-center gap-1 ${isMe ? 'text-white/70' : 'text-gray-400'}`}>
                          <span>{m.timestamp}</span>
                          {m.status === 'pending' && <span className="text-[10px] animate-pulse">⏳ (queued)</span>}
                        </span>
                      </div>
                    );
                  })}

                  {/* Typing simulator indicator */}
                  {isTyping && (
                    <div className="bg-white text-gray-500 text-xs px-4 py-3 rounded-2xl rounded-tl-none self-start border border-gray-100 flex items-center gap-1.5 italic shadow-xs">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                      <span>{activeChatThread.partner.name} is typing...</span>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                {/* Send input message bar */}
                <footer className="p-3 bg-white border-t border-[#E5E7EB] flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type a secure message..."
                    value={chatInputText}
                    onChange={(e) => setChatInputText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleSendMessage();
                    }}
                    className="flex-1 h-12 bg-gray-50 border border-[#E5E7EB] rounded-xl text-sm px-4 focus:outline-none focus:border-[#128A4E] text-[#0F172A]"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!chatInputText.trim()}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all ${
                      chatInputText.trim()
                        ? 'bg-[#128A4E] hover:bg-[#0F7A44]'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <Send size={18} />
                  </button>
                </footer>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Chats List Screen Header */}
                <div className="pb-1 border-b border-gray-100">
                  <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-1.5">
                    <svg className="w-5 h-5 text-[#128A4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Chats Inbox
                  </h2>
                </div>

                {/* Filter Tabs Row */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {[
                    { id: 'all', label: 'All' },
                    { id: 'unread', label: 'Unread' },
                    { id: 'matches', label: 'Matches' },
                    { id: 'messages', label: 'Messages' },
                    { id: 'system', label: 'System' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setChatFilter(tab.id as any)}
                      className={`text-[10px] font-black px-3.5 py-2 rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                        chatFilter === tab.id
                          ? 'bg-[#128A4E] text-white shadow-xs'
                          : 'bg-slate-100 text-gray-500 hover:bg-slate-200'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-1">
                  {(() => {
                    const filtered = chats.filter(chat => {
                      if (chatFilter === 'all') return !chat.isArchived;
                      if (chatFilter === 'unread') return chat.unread && !chat.isArchived;
                      if (chatFilter === 'matches') return !chat.roomListing && !chat.isArchived;
                      if (chatFilter === 'messages') return !!chat.roomListing && !chat.isArchived;
                      if (chatFilter === 'system') return false;
                      return true;
                    });

                    if (chatFilter === 'system') {
                      return (
                        <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-3 shadow-sm">
                          <div className="flex items-center gap-2.5 pb-2.5 border-b border-gray-50">
                            <div className="w-8 h-8 rounded-full bg-[#E8F5EE] flex items-center justify-center text-[#128A4E] text-xs font-bold">
                              📢
                            </div>
                            <div>
                              <h5 className="text-xs font-black text-gray-900">Relok Support</h5>
                              <p className="text-[10px] text-gray-400 font-semibold">System Notification</p>
                            </div>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed font-semibold">
                            Welcome to Relok V1! Your account setup is complete. Explore our platform to find highly compatible matches, message potential flatmates, and post listings.
                          </p>
                          <span className="text-[9px] text-gray-400 font-bold self-end">Just now</span>
                        </div>
                      );
                    }

                    if (filtered.length === 0) {
                      return (
                        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center flex flex-col items-center gap-2">
                          <MessageSquare size={32} className="text-gray-300" />
                          <p className="text-sm font-semibold text-[#0F172A]">No chats match filter</p>
                          <p className="text-xs text-gray-400">Try checking other filter categories above.</p>
                        </div>
                      );
                    }

                    return filtered.map((chat) => (
                      <div
                        key={chat.id}
                        onClick={() => {
                          // Mark as read
                          const updatedChats = chats.map(c => c.id === chat.id ? { ...c, unread: false } : c);
                          setChats(updatedChats);
                          setActiveChatThread(chat);
                        }}
                        className="bg-white rounded-2xl border border-[#E5E7EB] hover:border-[#128A4E]/30 p-4 shadow-sm hover:shadow transition-all duration-200 flex items-center gap-4 cursor-pointer relative"
                      >
                        {chat.unread && (
                          <div className="absolute top-4 right-4 w-2.5 h-2.5 bg-[#128A4E] rounded-full" />
                        )}

                        <img
                          src={chat.partner.photoUrl}
                          alt={chat.partner.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#E5E7EB]"
                          referrerPolicy="no-referrer"
                        />

                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-center pr-4">
                            <h4 className="text-sm font-bold text-[#0F172A] truncate">{chat.partner.name}</h4>
                            <span className="text-[10px] text-gray-400 shrink-0">{chat.messages[chat.messages.length - 1]?.timestamp || 'Now'}</span>
                          </div>
                          <p className="text-xs text-gray-500 truncate mt-1">
                            {chat.messages[chat.messages.length - 1]?.text || 'No messages yet'}
                          </p>
                          {chat.roomListing && (
                            <div className="inline-flex items-center gap-1 mt-1.5 bg-[#E8F5EE] text-[#128A4E] text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider">
                              🏠 inquiry: {chat.roomListing.title}
                            </div>
                          )}
                          {chat.isArchived && (
                            <div className="inline-flex items-center gap-1 mt-1.5 bg-gray-100 text-gray-500 text-[8px] font-black px-1.5 py-0.5 rounded tracking-wider">
                              📦 archived thread
                            </div>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: PROFILE & SIMULATOR OPTIONS */}
        {activeTab === 'profile' && (
          isBroker ? (
            <BrokerDashboard
              agencyName={agencyName}
              setAgencyName={setAgencyName!}
              brokerType={brokerDetails?.brokerType || 'Individual Agent'}
              experience={brokerDetails?.experience || '1'}
              areas={brokerDetails?.areas || ['Bengaluru']}
              reraNumber={brokerDetails?.reraNumber || ''}
              brokerVerificationStatus={brokerVerificationStatus}
              setBrokerVerificationStatus={setBrokerVerificationStatus!}
              myRooms={myRooms}
              setRoomListings={setRoomListings}
              chats={chats}
              setChats={setChats}
              setActiveChatThread={setActiveChatThread}
              setActiveTab={setActiveTab}
              onResetAll={onResetAll}
              showToast={showToast}
            />
          ) : (
            <div className="flex flex-col gap-5">
              {/* 1. Header with Title & Edit Toggle */}
              <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                <h2 className="text-lg font-extrabold text-[#0F172A] flex items-center gap-1.5">
                  <svg className="w-5 h-5 text-[#128A4E]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile Hub
                </h2>
                <button 
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="text-xs font-black text-[#128A4E] hover:underline flex items-center gap-1 bg-[#E8F5EE] py-1.5 px-3 rounded-xl cursor-pointer"
                >
                  {isEditingProfile ? 'Done Editing ✓' : 'Edit Profile ✎'}
                </button>
              </div>

              {/* Profile editing mode vs dashboard mode */}
              {isEditingProfile ? (
                // EDITING VIEW
                <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm flex flex-col gap-4">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Edit Profile Attributes</h4>
                  
                  <FormInput
                    label="Full Name"
                    value={userProfile.fullName}
                    onChange={(val) => setUserProfile({ ...userProfile, fullName: val })}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Age"
                      value={userProfile.age}
                      onChange={(val) => setUserProfile({ ...userProfile, age: val })}
                      type="number"
                    />
                    <AutocompleteInput
                      label="Occupation"
                      value={userProfile.occupation}
                      onChange={(val) => setUserProfile({ ...userProfile, occupation: val })}
                      suggestions={OCCUPATIONS}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">Bio Biography</label>
                    <textarea
                      rows={3}
                      value={userProfile.bio}
                      onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                      placeholder="Tell prospective roommates about your lifestyle, vibes, and expectations..."
                      className="w-full bg-[#F8FAFC] border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:border-[#128A4E] font-semibold text-[#0F172A]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">My Sleep Schedule</label>
                    <select
                      value={lifestylePref.sleepSchedule}
                      onChange={(e) => setLifestylePref({ ...lifestylePref, sleepSchedule: e.target.value as any })}
                      className="bg-[#FFF] border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 font-extrabold"
                    >
                      <option value="Early Bird">Early Bird</option>
                      <option value="Night Owl">Night Owl</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-extrabold text-gray-500 uppercase tracking-wider">My Cleanliness Level</label>
                    <select
                      value={lifestylePref.cleanliness}
                      onChange={(e) => setLifestylePref({ ...lifestylePref, cleanliness: e.target.value as any })}
                      className="bg-[#FFF] border border-gray-200 rounded-xl p-2.5 text-xs text-gray-700 font-extrabold"
                    >
                      <option value="Spick & Span">Spick & Span</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Chill">Chill</option>
                    </select>
                  </div>

                  <button 
                    onClick={() => {
                      setIsEditingProfile(false);
                      showToast('Profile changes saved!');
                    }}
                    className="w-full h-11 rounded-xl text-xs font-bold bg-[#128A4E] hover:bg-[#0D6D3B] text-white cursor-pointer shadow-sm active:scale-95 transition-all"
                  >
                    Save Profile Info
                  </button>
                </div>
              ) : (
                // HUB DASHBOARD VIEW
                <div className="flex flex-col gap-5">
                  {/* 2. Profile Card */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs flex gap-4 items-center">
                    <div className="relative shrink-0">
                      <img 
                        src={userProfile.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'} 
                        alt={userProfile.fullName || 'User'} 
                        className="w-14 h-14 rounded-full object-cover border border-gray-100"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-0 right-0 bg-[#128A4E] text-white p-0.5 rounded-full border border-white">
                        <Check size={11} strokeWidth={3} />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-black text-[#0F172A] truncate">
                        {userProfile.fullName || 'Guest Account'}
                      </h3>
                      <p className="text-[10px] text-gray-400 font-bold truncate">
                        {userProfile.occupation || 'Configure details'} • {userProfile.age || '25'} yrs
                      </p>
                      <span className="inline-flex items-center gap-0.5 text-[9px] font-black text-[#128A4E] bg-[#E8F5EE] py-0.5 px-2 rounded-md mt-1.5">
                        <MapPin size={9} />
                        {selectedCity}
                      </span>
                    </div>
                  </div>

                  {/* 3. Completion Card */}
                  <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col gap-2 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Profile Completeness</span>
                      <span className="text-[10px] font-black text-[#128A4E]">85% Completed</span>
                    </div>
                    {/* Slim progress bar */}
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#128A4E] rounded-full" style={{ width: '85%' }} />
                    </div>
                    <button 
                      onClick={() => setIsEditingProfile(true)}
                      className="text-[10px] font-black text-[#128A4E] text-left hover:underline cursor-pointer"
                    >
                      Complete remaining traits to hit 100% →
                    </button>
                  </div>

                  {/* 4. Stats Row (Bento Grid Style) */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'Compatible', count: roommates.length, tag: 'Matches' },
                      { label: 'My Listed', count: myRooms.length, tag: 'Properties' },
                      { label: 'Conversations', count: chats.length, tag: 'Chats' }
                    ].map((stat, idx) => (
                      <div key={idx} className="bg-white border border-gray-100 p-3 rounded-xl flex flex-col items-center text-center gap-0.5">
                        <span className="text-base font-black text-gray-900">{stat.count}</span>
                        <span className="text-[9px] font-bold text-[#128A4E] uppercase tracking-wider leading-none">{stat.label}</span>
                        <span className="text-[8px] text-gray-400 font-semibold">{stat.tag}</span>
                      </div>
                    ))}
                  </div>

                  {/* 5. Sections List */}
                  <div className="bg-white border border-gray-200 rounded-2xl p-2.5 shadow-sm flex flex-col gap-1">
                    {[
                      { 
                        title: 'Account Settings & Bio', 
                        desc: 'Update email, phone, bio and socials', 
                        icon: '👤',
                        action: () => setIsEditingProfile(true) 
                      },
                      { 
                        title: 'Lifestyle Preferences', 
                        desc: 'Fine-tune matching parameters', 
                        icon: '⚙️',
                        action: () => setIsEditingProfile(true) 
                      },
                      { 
                        title: 'Help & Support Desk', 
                        desc: 'Speak to Relok team 24/7', 
                        icon: '💬',
                        action: () => showToast('Speak with our support team at: support@relok.in') 
                      },
                      { 
                        title: 'Log Out Session', 
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
                </div>
              )}
            </div>
          )
        )}
      </main>

      {/* DETAIL MODAL: ROOMMATE DETAILS */}
      {selectedRoommate && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedRoommate(null)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-[400px] max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto flex-1">
                {/* Photo backdrop */}
                <div className="relative h-48 w-full bg-slate-100">
                  <img 
                    src={selectedRoommate.photoUrl} 
                    alt={selectedRoommate.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setSelectedRoommate(null)}
                    className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-xs cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-[#128A4E] text-white font-bold text-xs px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                    <Sparkles size={12} />
                    <span>{getDynamicCompatibility(selectedRoommate)}% Match Score</span>
                  </div>
                </div>

                {/* Contents block */}
                <div className="px-5 py-6 flex flex-col gap-4">
                  <div className="flex flex-col">
                    <h3 className="text-xl font-bold text-[#0F172A]">{selectedRoommate.name}</h3>
                    <p className="text-xs font-medium text-gray-500 mt-1 flex items-center gap-1">
                      <span>{selectedRoommate.age} years old</span>
                      <span>•</span>
                      <span>{selectedRoommate.gender}</span>
                      <span>•</span>
                      <span>{selectedRoommate.city}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-2.5 bg-[#E8F5EE]/40 rounded-2xl p-4 border border-[#128A4E]/10">
                    <p className="text-[11px] font-bold text-[#128A4E] uppercase tracking-wider">Lifestyle Breakdown</p>
                    <div className="grid grid-cols-2 gap-y-2 text-xs text-gray-700">
                      <p>⏰ <strong>Sleep:</strong> {selectedRoommate.sleepSchedule}</p>
                      <p>✨ <strong>Clean:</strong> {selectedRoommate.cleanliness}</p>
                      <p>🥦 <strong>Diet:</strong> {selectedRoommate.dietary}</p>
                      <p>🚭 <strong>Smoke:</strong> {selectedRoommate.smoking}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">About</h4>
                    <p className="text-sm text-gray-600 leading-relaxed font-normal">
                      {selectedRoommate.bio}
                    </p>
                  </div>

                  <div className="flex flex-col gap-1 text-xs text-gray-500 mt-1">
                    <p className="flex items-center gap-2"><Briefcase size={14} className="text-[#128A4E]" /> {selectedRoommate.occupation}</p>
                    <p className="flex items-center gap-2 mt-1"><GraduationCap size={14} className="text-[#128A4E]" /> {selectedRoommate.education}</p>
                  </div>

                  <div className="grid grid-cols-1 mt-4">
                    <PrimaryButton
                      onClick={() => handleStartChatWithRoommate(selectedRoommate)}
                      text={`Chat with ${selectedRoommate.name.split(' ')[0]}`}
                      icon={<MessageSquare size={16} />}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* DETAIL MODAL: ROOM LISTING DETAILS */}
      {selectedRoom && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-50 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setSelectedRoom(null)}
          >
            <div 
              className="bg-white rounded-3xl w-full max-w-[400px] max-h-[85vh] overflow-hidden shadow-2xl flex flex-col border border-gray-100 animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="overflow-y-auto flex-1">
                {/* Photo backdrop */}
                <div className="relative h-48 w-full bg-slate-100">
                  <img 
                    src={selectedRoom.images[0]} 
                    alt={selectedRoom.title} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <button 
                    onClick={() => setSelectedRoom(null)}
                    className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white backdrop-blur-xs cursor-pointer"
                  >
                    <X size={18} />
                  </button>
                  <div className="absolute bottom-4 left-4 bg-black/60 text-white font-bold text-xs px-3 py-1.5 rounded-full uppercase tracking-wider">
                    {selectedRoom.sharingType}
                  </div>
                  <div className="absolute bottom-4 right-4 bg-white text-[#128A4E] font-extrabold text-sm px-3.5 py-1.5 rounded-xl shadow-md">
                    ₹{selectedRoom.rent.toLocaleString('en-IN')}/mo
                  </div>
                </div>

                {/* Contents block */}
                <div className="px-5 py-6 flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <h3 className="text-base font-extrabold text-[#0F172A] leading-tight">{selectedRoom.title}</h3>
                    <p className="text-xs font-semibold text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin size={13} className="text-[#128A4E]" />
                      <span>{selectedRoom.location}</span>
                    </p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Amenities Include</h4>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedRoom.amenities.map((amenity) => (
                        <span key={amenity} className="text-[10px] bg-[#E8F5EE] text-[#128A4E] px-2.5 py-1 rounded-full font-bold">
                          ✓ {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Property Description</h4>
                    <p className="text-xs text-gray-600 leading-relaxed font-normal">
                      {selectedRoom.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-1">
                    <img 
                      src={selectedRoom.postedBy.photoUrl} 
                      alt={selectedRoom.postedBy.name} 
                      className="w-10 h-10 rounded-full object-cover border border-gray-100"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#0F172A]">{selectedRoom.postedBy.name}</p>
                      <p className="text-[10px] text-gray-400">Verified Landlord/Flatmate</p>
                    </div>
                  </div>

                  {selectedRoom.postedBy.name !== userProfile.fullName && (
                    <div className="grid grid-cols-1 mt-2">
                      <PrimaryButton
                        onClick={() => {
                          const dummyRoommate: RoommateCard = {
                            id: `rm-${Date.now()}`,
                            name: selectedRoom.postedBy.name,
                            age: 24,
                            gender: 'Male',
                            occupation: 'Relok Listed Host',
                            education: 'University',
                            bio: 'Host of listed properties on Relok.',
                            matchPercentage: 95,
                            photoUrl: selectedRoom.postedBy.photoUrl,
                            city: selectedRoom.city,
                            budget: `₹${selectedRoom.rent}`,
                            sleepSchedule: 'Early Bird',
                            cleanliness: 'Spick & Span',
                            dietary: 'Any',
                            smoking: 'No Smoking'
                          };
                          handleStartChatWithRoommate(dummyRoommate);
                        }}
                        text="Contact Lister"
                        icon={<MessageSquare size={16} />}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* FIXED BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] h-20 bg-white border-t border-[#E5E7EB] flex items-center justify-around z-30 shadow-lg px-2">
        <button
          onClick={() => {
            setActiveTab('home');
            setActiveChatThread(null);
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors cursor-pointer ${
            activeTab === 'home' ? 'text-[#128A4E]' : 'text-[#9CA3AF] hover:text-gray-500'
          }`}
        >
          <HomeIcon size={20} />
          <span className="text-[10px] font-bold tracking-wide">Home</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('matches');
            setActiveChatThread(null);
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors cursor-pointer ${
            activeTab === 'matches' ? 'text-[#128A4E]' : 'text-[#9CA3AF] hover:text-gray-500'
          }`}
        >
          <Users size={20} />
          <span className="text-[10px] font-bold tracking-wide">Matches</span>
        </button>

        {/* Raised center '+' button */}
        <button
          onClick={() => {
            setActiveTab('post');
            setActiveChatThread(null);
          }}
          className="relative -top-3 flex flex-col items-center justify-center w-14 h-14 bg-[#128A4E] hover:bg-[#0F7A44] text-white rounded-full shadow-lg border-4 border-white transition-transform active:scale-95 cursor-pointer"
          aria-label="Post flatmate or room request"
        >
          <Plus size={26} strokeWidth={3} />
        </button>

        <button
          onClick={() => {
            setActiveTab('chats');
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors cursor-pointer relative ${
            activeTab === 'chats' ? 'text-[#128A4E]' : 'text-[#9CA3AF] hover:text-gray-500'
          }`}
        >
          {chats.some(c => c.unread) && (
            <div className="absolute top-1.5 right-4 w-2 h-2 bg-[#128A4E] rounded-full ring-2 ring-white" />
          )}
          <MessageSquare size={20} />
          <span className="text-[10px] font-bold tracking-wide">Chats</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('profile');
            setActiveChatThread(null);
          }}
          className={`flex flex-col items-center gap-1 py-1.5 px-3 transition-colors cursor-pointer ${
            activeTab === 'profile' ? 'text-[#128A4E]' : 'text-[#9CA3AF] hover:text-gray-500'
          }`}
        >
          <UserIcon size={20} />
          <span className="text-[10px] font-bold tracking-wide">Profile</span>
        </button>
      </nav>

    </div>
  );
};
