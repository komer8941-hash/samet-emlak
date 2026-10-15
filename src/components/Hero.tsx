import React from 'react';
import { Search, MapPin, Home, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { FilterState, AgencySettings } from '../types';

interface HeroProps {
  agency: AgencySettings;
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onResetFilters: () => void;
  totalResults: number;
}

export const Hero: React.FC<HeroProps> = ({
  agency,
  filters,
  onFilterChange,
  onResetFilters,
  totalResults
}) => {
  return (
    <div className="relative min-h-[480px] lg:min-h-[540px] flex items-center justify-center bg-slate-900 text-white overflow-hidden py-12 px-4">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={agency.heroImage}
          alt={agency.name}
          className="w-full h-full object-cover object-center opacity-35 scale-105 transition duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/75 to-slate-900/50" />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl w-full mx-auto text-center">
        {/* Badge */}
        <div className="inline-flex items-center space-x-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm mb-4">
          <Home className="w-3.5 h-3.5" />
          <span>{agency.name} Portföyü</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3">
          Hayalinizdeki Mülkü Güvenle Bulun
        </h2>
        <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto mb-8 font-normal">
          {agency.tagline}. Binlerce ilan arasından size en uygun gayrimenkulü filtreleyin ve doğrudan bizimle iletişime geçin.
        </p>

        {/* Search & Filter Card */}
        <div className="bg-white text-slate-800 rounded-2xl shadow-2xl p-4 sm:p-6 backdrop-blur-xl border border-white/20 text-left">
          {/* Status Tabs: Satılık / Kiralık / Tümü */}
          <div className="flex items-center space-x-2 mb-4 border-b border-slate-100 pb-3">
            {[
              { id: 'all', label: 'Tüm İlanlar' },
              { id: 'satilik', label: 'Satılık' },
              { id: 'kiralik', label: 'Kiralık' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => onFilterChange({ ...filters, status: tab.id })}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                  filters.status === tab.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* Search Query */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Kelime veya Ref No</label>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Kadıköy, Villa, YLM-101..."
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ ...filters, searchQuery: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                />
              </div>
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Gayrimenkul Tipi</label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange({ ...filters, type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="all">Tüm Tipler</option>
                <option value="konut">Konut / Daire</option>
                <option value="villa">Müstakil Villa</option>
                <option value="arsa">Arsa / Tarla</option>
                <option value="isyeri">Ticari / İş Yeri</option>
                <option value="rezidans">Rezidans</option>
              </select>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Şehir</label>
              <div className="relative">
                <MapPin className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <select
                  value={filters.city}
                  onChange={(e) => onFilterChange({ ...filters, city: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
                >
                  <option value="all">Tüm Şehirler</option>
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Muğla">Muğla (Bodrum)</option>
                  <option value="Antalya">Antalya</option>
                </select>
              </div>
            </div>

            {/* Min Rooms */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">Oda Sayısı</label>
              <select
                value={filters.minRooms}
                onChange={(e) => onFilterChange({ ...filters, minRooms: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
              >
                <option value="all">Farketmez</option>
                <option value="1+1">1+1</option>
                <option value="2+1">2+1</option>
                <option value="3+1">3+1</option>
                <option value="4+1">4+1 ve üzeri</option>
              </select>
            </div>
          </div>

          {/* Secondary Row: Sort & Reset */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center space-x-2 text-slate-500 font-medium">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Bulunan İlan Sayısı: <strong className="text-slate-900">{totalResults}</strong> ilan</span>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={filters.sortBy}
                onChange={(e) => onFilterChange({ ...filters, sortBy: e.target.value as any })}
                className="bg-slate-100 border-none rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none"
              >
                <option value="newest">En Yeniler</option>
                <option value="price-asc">Fiyat (Düşükten Yükseğe)</option>
                <option value="price-desc">Fiyat (Yüksekten Düşüğe)</option>
                <option value="area-desc">Metrekare (Büyükten Küçüğe)</option>
              </select>

              <button
                onClick={onResetFilters}
                className="text-slate-500 hover:text-rose-600 transition flex items-center font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-1" />
                Sıfırla
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
