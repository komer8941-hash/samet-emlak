export type PropertyStatus = 'satilik' | 'kiralik' | 'satildi' | 'kiralandi';
export type PropertyType = 'konut' | 'villa' | 'arsa' | 'isyeri' | 'rezidans';

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  status: PropertyStatus;
  type: PropertyType;
  city: string;
  district: string;
  neighborhood: string;
  rooms?: string; // e.g. "3+1", "2+1", "4+2"
  bathrooms?: number;
  area: number; // m²
  floor?: string; // e.g. "4. Kat", "Giriş Kat", "Müstakil"
  totalFloors?: number;
  buildingAge?: string; // e.g. "0 (Yeni)", "5-10 arası"
  heating?: string; // e.g. "Kombi (Doğalgaz)", "Merkezi Sistem"
  balcony?: boolean;
  furnished?: boolean;
  creditEligible?: boolean;
  swapEligible?: boolean;
  images: string[];
  featured?: boolean;
  urgent?: boolean;
  createdAt: string;
  refCode: string;
}

export interface FilterState {
  searchQuery: string;
  status: string; // 'all' | 'satilik' | 'kiralik'
  type: string; // 'all' | PropertyType
  city: string;
  district: string;
  minPrice: string;
  maxPrice: string;
  minRooms: string;
  minArea: string;
  sortBy: 'newest' | 'price-asc' | 'price-desc' | 'area-desc';
}

export interface ContactMessage {
  id: string;
  name: string;
  phone: string;
  email?: string;
  propertyTitle?: string;
  propertyRefCode?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface AgencySettings {
  name: string;
  ownerName: string;
  tagline: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  city: string;
  logoUrl: string;
  heroImage: string;
  aboutText: string;
  workingHours: string;
}
