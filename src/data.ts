import { RoommateCard, RoomListing, ChatThread } from './types';

export const INDIAN_CITIES = [
  'Bengaluru',
  'Mumbai',
  'Delhi NCR',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata'
];

export const PRESET_ROOMMATES: RoommateCard[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    age: 24,
    gender: 'Male',
    occupation: 'Software Engineer at Flipkart',
    education: 'B.Tech, IIT Madras',
    bio: 'Chill developer looking for a flatmate in HSR Layout. I play guitar, love FIFA on weekends, and maintain a quiet, clean space during weekdays.',
    matchPercentage: 96,
    photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200',
    city: 'Bengaluru',
    budget: '₹15,000 - ₹20,000',
    sleepSchedule: 'Night Owl',
    cleanliness: 'Spick & Span',
    dietary: 'Veg',
    smoking: 'No Smoking'
  },
  {
    id: '2',
    name: 'Riya Patel',
    age: 23,
    gender: 'Female',
    occupation: 'Product Designer',
    education: 'NID Ahmedabad',
    bio: 'Looking for a shared 2BHK around Indiranagar or Koramangala. Love plants, painting, and occasional cooking. Friendly, respect privacy, and keep things tidy!',
    matchPercentage: 92,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200',
    city: 'Bengaluru',
    budget: '₹12,000 - ₹18,000',
    sleepSchedule: 'Early Bird',
    cleanliness: 'Spick & Span',
    dietary: 'Any',
    smoking: 'Outside Only'
  },
  {
    id: '3',
    name: 'Kabir Mehta',
    age: 26,
    gender: 'Male',
    occupation: 'Financial Analyst',
    education: 'MBA, NMIMS',
    bio: 'Looking for a private room in a 3BHK in Bandra or Andheri West. Very social, gym-goer, non-smoker. Respectful of household rules and timely with bills.',
    matchPercentage: 88,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200',
    city: 'Mumbai',
    budget: '₹25,000 - ₹35,000',
    sleepSchedule: 'Night Owl',
    cleanliness: 'Moderate',
    dietary: 'Non-Veg',
    smoking: 'No Smoking'
  },
  {
    id: '4',
    name: 'Ananya Sen',
    age: 25,
    gender: 'Female',
    occupation: 'Marketing Manager',
    education: 'DU (Lady Shri Ram College)',
    bio: 'Outgoing, foodie, and cat lover. Looking to share a nice apartment in Gachibowli or Jubilee Hills. I respect boundaries and love to host brunch sometimes.',
    matchPercentage: 85,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200',
    city: 'Hyderabad',
    budget: '₹10,000 - ₹15,000',
    sleepSchedule: 'Night Owl',
    cleanliness: 'Moderate',
    dietary: 'Non-Veg',
    smoking: 'Okay'
  },
  {
    id: '5',
    name: 'Ishaan Verma',
    age: 22,
    gender: 'Male',
    occupation: 'Data Scientist',
    education: 'BITS Pilani',
    bio: 'Simple and quiet guy looking for a roommates in Koregaon Park or Kalyani Nagar. Focused on work, love watching sci-fi movies, and keep my room neat.',
    matchPercentage: 81,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200&h=200',
    city: 'Pune',
    budget: '₹8,000 - ₹14,000',
    sleepSchedule: 'Early Bird',
    cleanliness: 'Chill',
    dietary: 'Veg',
    smoking: 'No Smoking'
  }
];

export const PRESET_ROOMS: RoomListing[] = [
  {
    id: 'room-1',
    title: 'Spacious Master Bedroom with Balcony in HSR',
    rent: 14500,
    location: 'Sector 3, HSR Layout',
    city: 'Bengaluru',
    sharingType: 'Private Room',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=600&h=400'
    ],
    amenities: ['Wi-Fi', 'AC', 'Kitchen', 'Washing Machine', 'Power Backup'],
    postedBy: {
      name: 'Aarav Sharma',
      photoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200&h=200'
    },
    description: 'Fully furnished Master Bedroom in a beautiful 3BHK flat. Looking for a friendly flatmate. Maid and cook services are already in place and divided equally.'
  },
  {
    id: 'room-2',
    title: 'Cozy Shared Room in Modern Flat near Metro',
    rent: 8500,
    location: 'Indiranagar Metro Station Road',
    city: 'Bengaluru',
    sharingType: 'Shared Room',
    images: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=600&h=400'
    ],
    amenities: ['Wi-Fi', 'Kitchen', 'Gym', 'Washing Machine', '24/7 Security'],
    postedBy: {
      name: 'Riya Patel',
      photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200'
    },
    description: 'Sharing a large double bedroom with me. The apartment is very close to Indiranagar metro station, super convenient for daily commuters. Chill environment.'
  },
  {
    id: 'room-3',
    title: 'Luxury Private Room with Attached Bath in Bandra',
    rent: 28000,
    location: 'Carter Road, Bandra West',
    city: 'Mumbai',
    sharingType: 'Private Room',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&q=80&w=600&h=400'
    ],
    amenities: ['Wi-Fi', 'AC', 'Kitchen', 'Gym', 'Swimming Pool', 'Sea View'],
    postedBy: {
      name: 'Kabir Mehta',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200'
    },
    description: 'Premium sea-facing apartment on Carter Road. Rent includes all bills and housekeeping. Best for professionals working in BKC or Bandra.'
  },
  {
    id: 'room-4',
    title: 'Gated Society 1BHK Flat in Gachibowli',
    rent: 16000,
    location: 'DLF Cyber City, Gachibowli',
    city: 'Hyderabad',
    sharingType: 'Entire Flat',
    images: [
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=600&h=400'
    ],
    amenities: ['Wi-Fi', 'AC', 'Parking', 'Kitchen', 'Gym', 'Clubhouse'],
    postedBy: {
      name: 'Ananya Sen',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200&h=200'
    },
    description: 'Independent 1BHK apartment in a prime tech corridor. Looking for a quiet tenant. Society has excellent amenities and active security checks.'
  }
];

export const PRESET_CHATS: ChatThread[] = [
  {
    id: 'chat-1',
    partner: PRESET_ROOMMATES[0], // Aarav
    messages: [
      { id: 'm1', sender: 'them', text: 'Hey there! Saw you are looking for roommates in HSR Layout. What is your daily schedule like?', timestamp: 'Yesterday' },
      { id: 'm2', sender: 'me', text: 'Hi Aarav! Mostly work from office 10am-7pm, pretty chill. What about you?', timestamp: 'Yesterday' },
      { id: 'm3', sender: 'them', text: 'I write code at night sometimes but maintain quiet hours after 11 PM! Let me know if you would like to visit the flat this weekend.', timestamp: '10:45 AM' }
    ],
    unread: true,
    roomListing: PRESET_ROOMS[0]
  },
  {
    id: 'chat-2',
    partner: PRESET_ROOMMATES[1], // Riya
    messages: [
      { id: 'm4', sender: 'them', text: 'Hey! I loved your bio! Are you still looking for roommates near Indiranagar?', timestamp: '2 days ago' },
      { id: 'm5', sender: 'me', text: 'Yes Riya! Still looking. Let me check your room listing.', timestamp: '2 days ago' },
      { id: 'm6', sender: 'them', text: 'Sure, let me know if the location and budget work for you! I keep the apartment clean and have a lot of plants.', timestamp: 'Yesterday' }
    ],
    unread: false
  },
  {
    id: 'chat-3',
    partner: PRESET_ROOMMATES[2], // Kabir
    messages: [
      { id: 'm7', sender: 'them', text: 'Hi, is the Bandra room still available? I can visit this Saturday.', timestamp: '3 days ago' }
    ],
    unread: false,
    isArchived: true
  }
];
