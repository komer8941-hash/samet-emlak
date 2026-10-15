import React, { useState, useEffect, useMemo } from 'react';
import { Property, AgencySettings, ContactMessage, FilterState } from './types';
import { INITIAL_PROPERTIES, INITIAL_AGENCY_SETTINGS, INITIAL_MESSAGES } from './data/mockData';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { PropertyCompareModal } from './components/PropertyCompareModal';
import { MortgageCalculator } from './components/MortgageCalculator';
import { FavoritesDrawer } from './components/FavoritesDrawer';
import { AdminPanel } from './components/AdminPanel';
import { Footer } from './components/Footer';
import { MapPin, Phone, Mail, Clock, Send, ShieldCheck, Award, Users, CheckCircle2, MessageSquare, Building2 } from 'lucide-react';
import { createWhatsAppUrl } from './utils/formatters';

export const App: React.FC = () => {
  // LocalStorage Persistence State
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('emlak_properties_v2');
    return saved ? JSON.parse(saved) : INITIAL_PROPERTIES;
  });

  const [agency, setAgency] = useState<AgencySettings>(() => {
    const saved = localStorage.getItem('emlak_agency_v2');
    return saved ? JSON.parse(saved) : INITIAL_AGENCY_SETTINGS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('emlak_messages_v2');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('emlak_favorites_v2');
    return saved ? JSON.parse(saved) : ['prop-1', 'prop-2'];
  });

  const [comparedIds, setComparedIds] = useState<string[]>([]);

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('emlak_properties_v2', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('emlak_agency_v2', JSON.stringify(agency));
  }, [agency]);

  useEffect(() => {
    localStorage.setItem('emlak_messages_v2', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('emlak_favorites_v2', JSON.stringify(favorites));
  }, [favorites]);

  // UI Views & Modals State
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);
  const [isMortgageOpen, setIsMortgageOpen] = useState(false);

  // Filters State
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    status: 'all',
    type: 'all',
    city: 'all',
    district: 'all',
    minPrice: '',
    maxPrice: '',
    minRooms: 'all',
    minArea: '',
    sortBy: 'newest'
  });

  // Contact Form State (Public Site)
  const [contactForm, setContactForm] = useState({ name: '', phone: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);

  // Toggle handlers
  const handleToggleFavorite = (id: string) => {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleCompare = (id: string) => {
    setComparedIds(prev => {
      if (prev.includes(id)) return prev.filter(item => item !== id);
      if (prev.length >= 4) {
        alert('En fazla 4 ilanı aynı anda karşılaştırabilirsiniz.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSendMessage = (msgData: { name: string; phone: string; email?: string; message: string; propertyTitle?: string; propertyRefCode?: string }) => {
    const newMsg: ContactMessage = {
      id: `msg-${Date.now()}`,
      name: msgData.name,
      phone: msgData.phone,
      email: msgData.email,
      propertyTitle: msgData.propertyTitle,
      propertyRefCode: msgData.propertyRefCode,
      message: msgData.message,
      createdAt: new Date().toLocaleString('tr-TR'),
      read: false
    };
    setMessages(prev => [newMsg, ...prev]);
  };

  const handlePublicContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.phone) return;
    handleSendMessage(contactForm);
    setContactSent(true);
    setTimeout(() => {
      setContactSent(false);
      setContactForm({ name: '', phone: '', email: '', message: '' });
    }, 4000);
  };

  // Reset demo data
  const handleResetToDefaultData = () => {
    if (confirm('Tüm verileri varsayılan örnek veriler ile değiştirmek istediğinize emin misiniz?')) {
      setProperties(INITIAL_PROPERTIES);
      setAgency(INITIAL_AGENCY_SETTINGS);
      setMessages(INITIAL_MESSAGES);
      setFavorites(['prop-1', 'prop-2']);
      setComparedIds([]);
      localStorage.clear();
      alert('Sistem varsayılan demo verilerine sıfırlandı!');
    }
  };

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return properties.filter(p => {
      // Search Query
      if (filters.searchQuery) {
        const q = filters.searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(q);
        const matchRef = p.refCode.toLowerCase().includes(q);
        const matchLoc = `${p.city} ${p.district} ${p.neighborhood}`.toLowerCase().includes(q);
        if (!matchTitle && !matchRef && !matchLoc) return false;
      }

      // Status
      if (filters.status !== 'all' && p.status !== filters.status) return false;

      // Type
      if (filters.type !== 'all' && p.type !== filters.type) return false;

      // City
      if (filters.city !== 'all' && p.city !== filters.city) return false;

      // Rooms
      if (filters.minRooms !== 'all' && p.rooms && !p.rooms.includes(filters.minRooms)) return false;

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'area-desc') return b.area - a.area;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [properties, filters]);

  const featuredProperties = useMemo(() => {
    return properties.filter(p => p.featured || p.urgent);
  }, [properties]);

  const favoriteObjects = useMemo(() => {
    return properties.filter(p => favorites.includes(p.id));
  }, [properties, favorites]);

  const comparedObjects = useMemo(() => {
    return properties.filter(p => comparedIds.includes(p.id));
  }, [properties, comparedIds]);

  const scrollToSection = (sectionId: string) => {
    setIsAdminOpen(false);
    const elem = document.getElementById(sectionId);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        agency={agency}
        favoritesCount={favorites.length}
        compareCount={comparedIds.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        onOpenCompare={() => setIsCompareOpen(true)}
        onOpenMortgage={() => setIsMortgageOpen(true)}
        isAdminOpen={isAdminOpen}
        onToggleAdmin={() => setIsAdminOpen(!isAdminOpen)}
        onSelectSection={scrollToSection}
      />

      {/* Main View Switch: Admin Panel vs Public Website */}
      {isAdminOpen ? (
        <AdminPanel
          properties={properties}
          agency={agency}
          messages={messages}
          onAddProperty={(newProp) => setProperties(prev => [newProp, ...prev])}
          onUpdateProperty={(updatedProp) => setProperties(prev => prev.map(p => p.id === updatedProp.id ? updatedProp : p))}
          onDeleteProperty={(id) => setProperties(prev => prev.filter(p => p.id !== id))}
          onUpdateAgencySettings={(newSettings) => setAgency(newSettings)}
          onMarkMessageRead={(msgId) => setMessages(prev => prev.map(m => m.id === msgId ? { ...m, read: true } : m))}
          onDeleteMessage={(msgId) => setMessages(prev => prev.filter(m => m.id !== msgId))}
          onResetToDefaultData={handleResetToDefaultData}
          onCloseAdmin={() => setIsAdminOpen(false)}
        />
      ) : (
        <main className="flex-1">
          {/* Section 1: Hero & Search Bar */}
          <div id="home">
            <Hero
              agency={agency}
              filters={filters}
              onFilterChange={setFilters}
              onResetFilters={() => setFilters({
                searchQuery: '',
                status: 'all',
                type: 'all',
                city: 'all',
                district: 'all',
                minPrice: '',
                maxPrice: '',
                minRooms: 'all',
                minArea: '',
                sortBy: 'newest'
              })}
              totalResults={filteredProperties.length}
            />
          </div>

          {/* Section 2: All Properties Grid */}
          <section id="properties" className="max-w-7xl mx-auto px-4 py-12 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-200 pb-4 gap-2">
              <div>
                <span className="text-xs font-extrabold text-amber-600 uppercase tracking-wider">Portföyümüz</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  {filters.status === 'satilik' ? 'Satılık İlanlar' : filters.status === 'kiralik' ? 'Kiralık İlanlar' : 'Güncel İlan Portföyü'}
                </h2>
              </div>
              <p className="text-xs text-slate-500 font-medium">
                Toplam <strong>{filteredProperties.length}</strong> gayrimenkul listeleniyor
              </p>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-4">
                <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
                  <Building2 className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800">Aramanıza Uygun İlan Bulunamadı</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Filtreleme kriterlerinizi esnetebilir veya sıfırlayarak tüm portföyümüzü tekrar inceleyebilirsiniz.
                </p>
                <button
                  onClick={() => setFilters({
                    searchQuery: '', status: 'all', type: 'all', city: 'all',
                    district: 'all', minPrice: '', maxPrice: '', minRooms: 'all', minArea: '', sortBy: 'newest'
                  })}
                  className="bg-amber-500 text-slate-950 font-bold px-4 py-2 rounded-xl text-xs"
                >
                  Filtreleri Sıfırla
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map(property => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    agency={agency}
                    isFavorite={favorites.includes(property.id)}
                    isCompared={comparedIds.includes(property.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onToggleCompare={handleToggleCompare}
                    onSelectProperty={setSelectedProperty}
                  />
                ))}
              </div>
            )}
          </section>

          {/* Section 3: Featured Opportunities Banner */}
          {featuredProperties.length > 0 && (
            <section id="featured" className="bg-slate-900 text-white py-16 px-4">
              <div className="max-w-7xl mx-auto space-y-8">
                <div className="text-center max-w-2xl mx-auto space-y-2">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase">
                    Kaçırılmayacak Fırsatlar
                  </span>
                  <h2 className="text-3xl font-extrabold text-white">Öne Çıkan & Acil İlanlar</h2>
                  <p className="text-slate-400 text-xs sm:text-sm">
                    Danışmanlarımızın en çok tavsiye ettiği, yatırım değeri yüksek ve acil satılık mülkler.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {featuredProperties.map(property => (
                    <PropertyCard
                      key={property.id}
                      property={property}
                      agency={agency}
                      isFavorite={favorites.includes(property.id)}
                      isCompared={comparedIds.includes(property.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onToggleCompare={handleToggleCompare}
                      onSelectProperty={setSelectedProperty}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Section 4: About Agency */}
          <section id="about" className="max-w-7xl mx-auto px-4 py-16">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 space-y-6 flex flex-col justify-center">
                <div className="space-y-2">
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Kurumsal Profil</span>
                  <h2 className="text-3xl font-extrabold text-slate-900">{agency.name}</h2>
                  <p className="text-slate-600 text-sm leading-relaxed">{agency.aboutText}</p>
                </div>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Şeffaf & Güvenli Sözleşme</h4>
                      <p className="text-slate-500 text-[11px]">Resmi alım, satım ve kiralama prosedürü</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
                    <Award className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Ekspertiz & Değerleme</h4>
                      <p className="text-slate-500 text-[11px]">Gerçek piyasa analizi ve fiyat takdiri</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
                    <Users className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">Uzman Danışman Kadrosu</h4>
                      <p className="text-slate-500 text-[11px]">Bölgeye hakim profesyonel temsilciler</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
                    <MessageSquare className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-slate-900">7/24 Kesintisiz Destek</h4>
                      <p className="text-slate-500 text-[11px]">WhatsApp ve telefon iletişimi</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[300px] bg-slate-900">
                <img
                  src={agency.heroImage}
                  alt={agency.ownerName}
                  className="w-full h-full object-cover opacity-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-8">
                  <div className="text-white space-y-1">
                    <h3 className="text-xl font-bold">{agency.ownerName}</h3>
                    <p className="text-xs text-amber-400 font-medium">{agency.name} Kurucusu</p>
                    <p className="text-xs text-slate-300">"{agency.tagline}"</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 5: Contact & Location Form */}
          <section id="contact" className="bg-slate-100 py-16 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Information */}
              <div className="bg-slate-900 text-white rounded-3xl p-8 space-y-6 flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-extrabold mb-2">Bize Ulaşın</h3>
                  <p className="text-xs text-slate-400 mb-6">
                    Gayrimenkul satmak, kiralamak veya doğru yatırımı yapmak için hemen danışmanlarımızla görüşün.
                  </p>

                  <div className="space-y-4 text-xs">
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Adresimiz</span>
                        <span className="text-slate-400">{agency.address}</span>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Telefon / Mobil</span>
                        <a href={`tel:${agency.phone}`} className="text-slate-300 font-mono hover:text-white">
                          {agency.phone}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Mail className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">E-Posta</span>
                        <a href={`mailto:${agency.email}`} className="text-slate-300 hover:text-white">
                          {agency.email}
                        </a>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Çalışma Saatleri</span>
                        <span className="text-slate-400">{agency.workingHours}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800">
                  <a
                    href={createWhatsAppUrl(agency.whatsapp, `Merhaba, ofisinizle görüşmek istiyorum.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 text-xs"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp İle Anında İletişim</span>
                  </a>
                </div>
              </div>

              {/* Public Form */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-slate-200 shadow-xl space-y-6">
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 mb-1">Sizi Arayalım</h3>
                  <p className="text-xs text-slate-500">
                    Aşağıdaki formu doldurun, aradığınız gayrimenkul kriterlerini belirtin, uzman ekibimiz size ulaşsın.
                  </p>
                </div>

                {contactSent ? (
                  <div className="bg-emerald-50 text-emerald-800 p-6 rounded-2xl border border-emerald-200 space-y-2 text-center">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-base">Mesajınız Alındı!</h4>
                    <p className="text-xs text-emerald-700">
                      Talebiniz ekibimize iletildi. En kısa süre içerisinde verdiğiniz iletişim bilgilerinden geri dönüş yapılacaktır.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handlePublicContactSubmit} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Adınız Soyadınız *</label>
                        <input
                          type="text"
                          required
                          placeholder="Ahmet Yılmaz"
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Telefon Numaranız *</label>
                        <input
                          type="tel"
                          required
                          placeholder="0532 000 00 00"
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">E-Posta Adresiniz (Opsiyonel)</label>
                      <input
                        type="email"
                        placeholder="ahmet@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Aradığınız Veya Satmak İstediğiniz Mülk Detayı</label>
                      <textarea
                        rows={4}
                        placeholder="Örn: Kadıköy bölgesinde max 10 milyon TL bütçe ile satılık 2+1 bakımlı daire arıyorum..."
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 px-6 rounded-xl transition text-xs flex items-center justify-center space-x-2 shadow-md w-full sm:w-auto"
                    >
                      <Send className="w-4 h-4" />
                      <span>Formu Gönder</span>
                    </button>
                  </form>
                )}
              </div>
            </div>
          </section>
        </main>
      )}

      {/* Modals & Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        agency={agency}
        isFavorite={selectedProperty ? favorites.includes(selectedProperty.id) : false}
        isCompared={selectedProperty ? comparedIds.includes(selectedProperty.id) : false}
        onClose={() => setSelectedProperty(null)}
        onToggleFavorite={handleToggleFavorite}
        onToggleCompare={handleToggleCompare}
        onSendMessage={handleSendMessage}
      />

      {isCompareOpen && (
        <PropertyCompareModal
          properties={comparedObjects}
          onClose={() => setIsCompareOpen(false)}
          onRemoveFromCompare={handleToggleCompare}
          onSelectProperty={setSelectedProperty}
        />
      )}

      {isMortgageOpen && (
        <MortgageCalculator
          onClose={() => setIsMortgageOpen(false)}
          defaultPrice={selectedProperty ? selectedProperty.price : 5000000}
        />
      )}

      <FavoritesDrawer
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favoriteObjects}
        agency={agency}
        onRemoveFavorite={handleToggleFavorite}
        onSelectProperty={setSelectedProperty}
      />

      {/* Footer */}
      <Footer
        agency={agency}
        onSelectSection={scrollToSection}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />
    </div>
  );
};

export default App;
