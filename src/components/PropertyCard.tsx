import React from 'react';
import { Heart, Scale, MapPin, Maximize2, BedDouble, Bath, ChevronRight, MessageSquare, Flame } from 'lucide-react';
import { Property, AgencySettings } from '../types';
import { formatPrice, getStatusBadge, createWhatsAppUrl } from '../utils/formatters';

interface PropertyCardProps {
  property: Property;
  agency: AgencySettings;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: string) => void;
  onToggleCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  agency,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelectProperty
}) => {
  const badge = getStatusBadge(property.status);
  const mainImage = property.images[0] || 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const whatsappMsg = `Merhaba, web sitenizdeki "${property.title}" (Ref: ${property.refCode}) ilanı hakkında detaylı bilgi almak istiyorum.`;
  const whatsappUrl = createWhatsAppUrl(agency.whatsapp, whatsappMsg);

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group">
      {/* Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img
          src={mainImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-108 transition duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-black/20 opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 items-center">
          <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold uppercase shadow-sm ${badge.bg}`}>
            {badge.label}
          </span>
          {property.urgent && (
            <span className="bg-amber-500 text-slate-950 px-2 py-1 rounded-lg text-xs font-bold flex items-center shadow-sm">
              <Flame className="w-3 h-3 mr-0.5 fill-slate-950" />
              ACİL
            </span>
          )}
          {property.featured && (
            <span className="bg-purple-600 text-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm">
              Fırsat
            </span>
          )}
        </div>

        {/* Top Action Buttons (Favorite & Compare) */}
        <div className="absolute top-3 right-3 flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(property.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition ${
              isCompared
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title="Karşılaştır"
          >
            <Scale className="w-4 h-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(property.id);
            }}
            className={`p-2 rounded-xl backdrop-blur-md transition ${
              isFavorite
                ? 'bg-rose-600 text-white shadow-md'
                : 'bg-black/40 text-white hover:bg-black/60'
            }`}
            title="Favorilere Ekle"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Price Tag on Image Bottom */}
        <div className="absolute bottom-3 left-3">
          <div className="text-white text-lg sm:text-xl font-black drop-shadow-md">
            {formatPrice(property.price, property.status)}
          </div>
          <span className="text-[10px] text-slate-300 font-medium bg-black/40 px-1.5 py-0.5 rounded">
            Ref: {property.refCode}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Location */}
          <div className="flex items-center text-slate-500 text-xs font-medium mb-1.5">
            <MapPin className="w-3.5 h-3.5 mr-1 text-amber-500 shrink-0" />
            <span className="truncate">{property.district}, {property.city}</span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProperty(property)}
            className="font-bold text-slate-900 text-base line-clamp-2 hover:text-amber-600 cursor-pointer transition leading-snug mb-3"
          >
            {property.title}
          </h3>
        </div>

        <div>
          {/* Specs Bar */}
          <div className="grid grid-cols-3 gap-2 py-2.5 px-3 bg-slate-50 rounded-xl text-slate-600 text-xs mb-4">
            {property.rooms && (
              <div className="flex items-center space-x-1" title="Oda Sayısı">
                <BedDouble className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{property.rooms}</span>
              </div>
            )}
            <div className="flex items-center space-x-1" title="Metrekare">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-semibold text-slate-800">{property.area} m²</span>
            </div>
            {property.bathrooms && (
              <div className="flex items-center space-x-1" title="Banyo Sayısı">
                <Bath className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="font-semibold text-slate-800">{property.bathrooms} Banyo</span>
              </div>
            )}
          </div>

          {/* Action Buttons Row */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectProperty(property)}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs py-2.5 px-3 rounded-xl transition flex items-center justify-center space-x-1 shadow-xs"
            >
              <span>Detayları Gör</span>
              <ChevronRight className="w-4 h-4" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-xl transition flex items-center justify-center shadow-xs"
              title="WhatsApp İle Sor"
            >
              <MessageSquare className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
