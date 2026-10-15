import React from 'react';
import { Building2, Heart, Scale, Phone, MessageSquare, ShieldCheck, PlusCircle } from 'lucide-react';
import { AgencySettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface NavbarProps {
  agency: AgencySettings;
  favoritesCount: number;
  compareCount: number;
  onOpenFavorites: () => void;
  onOpenCompare: () => void;
  onOpenMortgage: () => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
  onSelectSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  agency,
  favoritesCount,
  compareCount,
  onOpenFavorites,
  onOpenCompare,
  onOpenMortgage,
  isAdminOpen,
  onToggleAdmin,
  onSelectSection
}) => {
  const quickWhatsAppMsg = `Merhaba ${agency.name}, web sitenizden ulaşıyorum. Portföyünüz hakkında bilgi alabilir miyim?`;
  const whatsappUrl = createWhatsAppUrl(agency.whatsapp, quickWhatsAppMsg);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Info Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Yetkili Emlak & Gayrimenkul Ofisi
            </span>
            <span>{agency.workingHours}</span>
          </div>
          <div className="flex items-center space-x-4">
            <a href={`tel:${agency.phone}`} className="hover:text-white transition flex items-center">
              <Phone className="w-3 h-3 mr-1 text-emerald-400" />
              {agency.phone}
            </a>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-0.5 rounded font-medium transition flex items-center"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              WhatsApp İletişim
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <div
          onClick={() => onSelectSection('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center text-white shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-tight text-slate-900 group-hover:text-amber-600 transition">
              {agency.name}
            </h1>
            <p className="text-xs text-slate-500 font-medium">{agency.tagline}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-slate-700">
          <button
            onClick={() => onSelectSection('properties')}
            className="hover:text-amber-600 transition"
          >
            Tüm İlanlar
          </button>
          <button
            onClick={() => onSelectSection('featured')}
            className="hover:text-amber-600 transition flex items-center"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse"></span>
            Öne Çıkanlar
          </button>
          <button
            onClick={onOpenMortgage}
            className="hover:text-amber-600 transition"
          >
            Kredi Hesapla
          </button>
          <button
            onClick={() => onSelectSection('about')}
            className="hover:text-amber-600 transition"
          >
            Hakkımızda
          </button>
          <button
            onClick={() => onSelectSection('contact')}
            className="hover:text-amber-600 transition"
          >
            İletişim
          </button>
        </nav>

        {/* Quick Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Compare Button */}
          <button
            onClick={onOpenCompare}
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
            title="İlan Karşılaştır"
          >
            <Scale className="w-5 h-5" />
            {compareCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            )}
          </button>

          {/* Favorites Button */}
          <button
            onClick={onOpenFavorites}
            className="relative p-2 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition"
            title="Favori İlanlar"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {favoritesCount}
              </span>
            )}
          </button>

          {/* Admin Dashboard Toggle Button */}
          <button
            onClick={onToggleAdmin}
            className={`px-3 py-2 rounded-lg font-semibold text-xs transition flex items-center shadow-xs ${
              isAdminOpen
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'bg-amber-500 hover:bg-amber-600 text-slate-950'
            }`}
          >
            <PlusCircle className="w-4 h-4 mr-1.5" />
            {isAdminOpen ? 'Müşteri Görünümü' : 'Yönetim Paneli'}
          </button>
        </div>
      </div>
    </header>
  );
};
