import { Property, AgencySettings, ContactMessage } from '../types';

export const INITIAL_AGENCY_SETTINGS: AgencySettings = {
  name: "Samet Yılmaz",
  ownerName: "Samet Yılmaz",
  tagline: "Bölgenizin Güvenilir Gayrimenkul & Yatırım Danışmanı",
  phone: "+90 532 555 0199",
  whatsapp: "905325550199",
  email: "info@sametyilmaz.com",
  address: "Bağdat Caddesi No: 245/A, Kadıköy / İstanbul",
  city: "İstanbul",
  logoUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1920&q=80",
  aboutText: "10 yılı aşkın bölgesel tecrübem ve profesyonel yaklaşımımla konut, arsa, lüks villa ve ticari gayrimenkul alım, satım ve kiralama süreçlerinizde kişiye özel, şeffaf ve güvenilir danışmanlık hizmeti sunuyorum.",
  workingHours: "Pazartesi - Cumartesi: 09:00 - 19:30 | Pazar: Randevulu"
};

export const INITIAL_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    refCode: "SMT-101",
    title: "Kadıköy Fenerbahçe'de Deniz Manzaralı Lüks 3+1 Daire",
    description: "Fenerbahçe Marina'ya 3 dakika yürüme mesafesinde, tamamen yenilenmiş, ankastre mutfaklı, kapalı otoparklı, kesintisiz deniz manzaralı prestijli daire.",
    price: 14500000,
    status: "satilik",
    type: "konut",
    city: "İstanbul",
    district: "Kadıköy",
    neighborhood: "Fenerbahçe",
    rooms: "3+1",
    bathrooms: 2,
    area: 165,
    floor: "7. Kat",
    totalFloors: 10,
    buildingAge: "3",
    heating: "Kombi (Doğalgaz)",
    balcony: true,
    furnished: false,
    creditEligible: true,
    swapEligible: false,
    featured: true,
    urgent: true,
    createdAt: "2026-10-01",
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "prop-2",
    refCode: "SMT-102",
    title: "Bodrum Yalıkavak'ta Müstakil Havuzlu Sıfır Lüks Villa",
    description: "Panoramik marina ve gün batımı manzaralı, müstakil sonsuzluk havuzlu, 500m² arsa içinde 4+1 özel yapım akıllı ev villası.",
    price: 32000000,
    status: "satilik",
    type: "villa",
    city: "Muğla",
    district: "Bodrum",
    neighborhood: "Yalıkavak",
    rooms: "4+1",
    bathrooms: 4,
    area: 280,
    floor: "Müstakil",
    totalFloors: 2,
    buildingAge: "0 (Yeni)",
    heating: "Yerden Isıtma & VRF",
    balcony: true,
    furnished: true,
    creditEligible: true,
    swapEligible: true,
    featured: true,
    urgent: false,
    createdAt: "2026-10-03",
    images: [
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80"
    ]
  },
  {
    id: "prop-3",
    refCode: "SMT-103",
    title: "Çankaya Gaziosmanpaşa'da Kiralık Eşyalı Modern 2+1 Daire",
    description: "Elçilikler bölgesinde, güvenlikli site içerisinde, kapalı otopark ve spor salonu imkanı olan full eşyalı lüks konut.",
    price: 45000,
    status: "kiralik",
    type: "konut",
    city: "Ankara",
    district: "Çankaya",
    neighborhood: "Gaziosmanpaşa",
    rooms: "2+1",
    bathrooms: 1,
    area: 95,
    floor: "3. Kat",
    totalFloors: 6,
    buildingAge: "2",
    heating: "Merkezi (Pay Ölçer)",
    balcony: true,
    furnished: true,
    creditEligible: true,
    swapEligible: false,
    featured: false,
    urgent: false,
    createdAt: "2026-10-04",
    images: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
    ]
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: "msg-1",
    name: "Mehmet Kaya",
    phone: "0533 111 22 33",
    email: "mehmet.kaya@email.com",
    propertyTitle: "Kadıköy Fenerbahçe'de Deniz Manzaralı Lüks 3+1 Daire",
    propertyRefCode: "SMT-101",
    message: "Merhaba Samet Bey, Fenerbahçe'deki daireyi bu cumartesi saat 14:00'te görmek istiyoruz. Randevu verebilir misiniz?",
    createdAt: "2026-10-06 14:30",
    read: false
  }
];
