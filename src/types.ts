export interface UserProfile {
  fullName: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other' | '';
  occupation: string;
  education: string;
  bio: string;
  photoUrl: string;
}

export interface LifestylePreferences {
  sleepSchedule: 'Early Bird' | 'Night Owl' | '';
  cleanliness: 'Spick & Span' | 'Moderate' | 'Chill' | '';
  socializing: 'Extrovert' | 'Introvert' | 'Balanced' | '';
  dietary: 'Veg' | 'Non-Veg' | 'Any' | '';
  smoking: 'Never' | 'Occasionally' | 'Yes' | '';
  drinking: 'Never' | 'Occasionally' | 'Yes' | '';
}

export interface RoomPreferences {
  cities: string[];
  budgetMin: number;
  budgetMax: number;
  sharingType: 'Private Room' | 'Shared Room' | 'Entire Flat' | '';
  moveInDate?: string;
  preferredGender?: 'Male' | 'Female' | 'Other' | 'Any' | '';
  preferredLocality?: string;
  preferredAgeMin?: number;
  preferredAgeMax?: number;
  preferredLanguage?: string;
}

export interface LifestyleHabits {
  personality: 'Extrovert' | 'Introvert' | 'Balanced' | '';
  pets: 'No Pets' | 'Dog Lover' | 'Cat Lover' | "Don't mind" | '';
}

export interface HouseRules {
  guests: 'No Guests' | 'Daytime Only' | 'Guests Allowed' | '';
  loudMusic: 'Quiet Hours' | 'Flexible' | '';
  lateEntry: 'Before 11 PM' | 'Anytime' | '';
}

export interface RoommateCard {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  occupation: string;
  education: string;
  bio: string;
  matchPercentage: number;
  photoUrl: string;
  city: string;
  budget: string;
  sleepSchedule: 'Early Bird' | 'Night Owl';
  cleanliness: 'Spick & Span' | 'Moderate' | 'Chill';
  dietary: 'Veg' | 'Non-Veg' | 'Any';
  smoking: 'No Smoking' | 'Outside Only' | 'Okay';
}

export interface RoomListing {
  id: string;
  title: string;
  rent: number;
  location: string;
  city: string;
  sharingType: 'Private Room' | 'Shared Room' | 'Entire Flat';
  images: string[];
  amenities: string[];
  postedBy: {
    name: string;
    photoUrl: string;
  };
  description: string;
}

export interface Message {
  id: string;
  sender: 'me' | 'them';
  text: string;
  timestamp: string;
  status?: 'sent' | 'pending';
}

export interface ChatThread {
  id: string;
  partner: RoommateCard;
  messages: Message[];
  unread: boolean;
  roomListing?: RoomListing;
  isArchived?: boolean;
}
