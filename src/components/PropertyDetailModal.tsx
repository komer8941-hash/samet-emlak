import React, { useState } from 'react';
import { X, MapPin, BedDouble, Bath, Maximize2, Calendar, Phone, MessageSquare, ShieldCheck, Check, Share2, Heart, Scale } from 'lucide-react';
import { Property, AgencySettings } from '../types';
import { formatPrice, getStatusBadge, getTypeLabel, createWhatsAppUrl } from '../utils/formatters';

interface PropertyDetailModalProps {
  property: Property | null;
  agency: AgencySettings;
  isFavorite: boolean;
  isCompared: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSendMessage: (msg: { name: string; phone: string; message: string; propertyTitle: string; propertyRefCode: string }) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  agency,
  isFavorite,
  isCompared,
  onClose,
  onToggleFavorite,
  onToggleCompare,
  onSendMessage
}) => {
  if (!property) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });

  const badge = getStatusBadge(property.status);
  const whatsappMsg = `Merhaba ${agency.name}, "${property.title}" (Ref: ${property.refCode}) ilanı hakkında bilgi almak ve randevu oluşturmak istiyorum.`;
  const whatsappUrl = createWhatsAppUrl(agency.whatsapp, whatsappMsg);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    onSendMessage({
      ...formData,
      propertyTitle: property.title,
      propertyRefCode: property.refCode
    });
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: '', phone: '', message: '' });
    }, 4000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `${property.title} - ${formatPrice(property.price)}`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('İlan bağlantısı kopyalandı!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full overflow-hidden shadow-2xl my-8 relative flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <span className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${badge.bg}`}>
              {badge.label}
            </span>
            <span className="text-xs text-slate-400 font-mono">Ref No: {property.refCode}</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="text-slate-400 hover:text-white p-1.5 rounded-lg transition"
              title="Paylaş"
            >
              <Share2 className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleCompare(property.id)}
              className={`p-1.5 rounded-lg transition ${isCompared ? 'text-blue-400' : 'text-slate-400 hover:text-white'}`}
              title="Karşılaştır"
            >
              <Scale className="w-5 h-5" />
            </button>
            <button
              onClick={() => onToggleFavorite(property.id)}
              className={`p-1.5 rounded-lg transition ${isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-white'}`}
              title="Favorilere Ekle"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="bg-slate-800 hover:bg-slate-700 text-white p-1.5 rounded-xl transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-6 space-y-8 flex-1">
          {/* Gallery Section */}
          <div className="space-y-3">
            <div className="relative h-80 sm:h-[420px] rounded-2xl overflow-hidden bg-slate-950">
              <img
                src={property.images[activeImageIndex] || property.images[0]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-semibold">
                {activeImageIndex + 1} / {property.images.length} Fotoğraf
              </div>
            </div>

            {/* Thumbnails */}
            {property.images.length > 1 && (
              <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-none">
                {property.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                      activeImageIndex === idx ? 'border-amber-500 scale-95' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title & Price Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center text-slate-500 text-sm font-medium mb-1">
                <MapPin className="w-4 h-4 mr-1 text-amber-500" />
                <span>{property.neighborhood}, {property.district} / {property.city}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                {property.title}
              </h2>
            </div>
            <div className="md:text-right shrink-0">
              <div className="text-3xl sm:text-4xl font-black text-amber-600">
                {formatPrice(property.price, property.status)}
              </div>
              <span className="text-xs text-slate-500 font-medium">Fiyat Güncelleme: {property.createdAt}</span>
            </div>
          </div>

          {/* Specs Highlights */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-2xl text-slate-800">
            {property.rooms && (
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-amber-100 text-amber-700 rounded-xl">
                  <BedDouble className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium">Oda Sayısı</span>
                  <span className="font-bold text-slate-900">{property.rooms}</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
                <Maximize2 className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Net / Brüt Alan</span>
                <span className="font-bold text-slate-900">{property.area} m²</span>
              </div>
            </div>

            {property.bathrooms && (
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Bath className="w-6 h-6" />
                </div>
                <div>
                  <span className="block text-xs text-slate-500 font-medium">Banyo Sayısı</span>
                  <span className="font-bold text-slate-900">{property.bathrooms} Banyo</span>
                </div>
              </div>
            )}

            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <span className="block text-xs text-slate-500 font-medium">Bina Yaşı</span>
                <span className="font-bold text-slate-900">{property.buildingAge || 'Sıfır Bina'}</span>
              </div>
            </div>
          </div>

          {/* Main Grid: Details vs Contact Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Description & Specs Table */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">İlan Açıklaması</h3>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {property.description}
                </p>
              </div>

              {/* Detailed Specs Table */}
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">Gayrimenkul Detayları</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-sm">
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Mülk Tipi:</span>
                    <span className="font-semibold text-slate-900">{getTypeLabel(property.type)}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Bulunduğu Kat:</span>
                    <span className="font-semibold text-slate-900">{property.floor || 'Belirtilmedi'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Isınma Tipi:</span>
                    <span className="font-semibold text-slate-900">{property.heating || 'Kombi'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Balkon:</span>
                    <span className="font-semibold text-slate-900">{property.balcony ? 'Var' : 'Yok'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Eşya Durumu:</span>
                    <span className="font-semibold text-slate-900">{property.furnished ? 'Eşyalı' : 'Boş'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Krediye Uygunluk:</span>
                    <span className="font-semibold text-emerald-600">{property.creditEligible ? 'Evet (Uygun)' : 'Hayır'}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span className="text-slate-500 font-medium">Takas:</span>
                    <span className="font-semibold text-slate-900">{property.swapEligible ? 'Değerlendirilir' : 'Yok'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Contact Agent Box */}
            <div className="space-y-6">
              <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-xl space-y-5">
                <div className="flex items-center space-x-4 border-b border-slate-800 pb-4">
                  <div className="w-14 h-14 rounded-full bg-amber-500 overflow-hidden shrink-0 border-2 border-amber-400">
                    <img src={agency.logoUrl} alt={agency.ownerName} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-white">{agency.ownerName}</h4>
                    <p className="text-xs text-amber-400 font-medium">{agency.name}</p>
                    <div className="flex items-center text-[11px] text-slate-400 mt-1">
                      <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
                      Lisanslı Emlak Danışmanı
                    </div>
                  </div>
                </div>

                {/* Direct Action Buttons */}
                <div className="space-y-2.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 text-sm shadow-md"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>WhatsApp İle Bilgi Al</span>
                  </a>

                  <a
                    href={`tel:${agency.phone}`}
                    className="w-full bg-slate-800 hover:bg-slate-700 text-white font-bold py-3 px-4 rounded-xl transition flex items-center justify-center space-x-2 text-sm border border-slate-700"
                  >
                    <Phone className="w-4 h-4 text-amber-400" />
                    <span>Hemen Ara: {agency.phone}</span>
                  </a>
                </div>

                {/* Contact Form */}
                <div className="pt-3 border-t border-slate-800">
                  <h5 className="font-semibold text-xs text-slate-300 mb-3">İlan Hakkında Mesaj Bırakın</h5>
                  {formSubmitted ? (
                    <div className="bg-emerald-500/20 text-emerald-300 p-3 rounded-xl text-xs font-semibold flex items-center space-x-2">
                      <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                      <span>Talebiniz başarıyla iletildi! Danışmanımız en kısa sürede sizi arayacaktır.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-2.5">
                      <input
                        type="text"
                        placeholder="Adınız Soyadınız"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <input
                        type="tel"
                        placeholder="Telefon Numaranız (05...)"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                      <textarea
                        rows={2}
                        placeholder="Notunuz (Opsiyonel)"
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      ></textarea>
                      <button
                        type="submit"
                        className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs transition"
                      >
                        Beni Arayın / Randevu İstiyorum
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
