import React from 'react';
import { X, Heart, ChevronRight, Trash2 } from 'lucide-react';
import { Property, AgencySettings } from '../types';
import { formatPrice } from '../utils/formatters';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: Property[];
  agency: AgencySettings;
  onRemoveFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const FavoritesDrawer: React.FC<FavoritesDrawerProps> = ({
  isOpen,
  onClose,
  favorites,
  onRemoveFavorite,
  onSelectProperty
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-xs flex justify-end">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
        {/* Drawer Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h3 className="font-bold text-base">Favori İlanlarım ({favorites.length})</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded-lg">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favorites.length === 0 ? (
            <div className="text-center py-12 text-slate-400 space-y-3">
              <Heart className="w-12 h-12 mx-auto text-slate-300 stroke-1" />
              <p className="text-sm font-medium">Henüz favori ilan eklemediniz.</p>
              <p className="text-xs text-slate-500">
                Beğendiğiniz ilanların üzerindeki kalp simgesine tıklayarak buraya kaydedebilirsiniz.
              </p>
            </div>
          ) : (
            favorites.map(p => (
              <div
                key={p.id}
                className="flex space-x-3 p-2.5 rounded-xl border border-slate-200 hover:border-amber-400 transition bg-slate-50/50 relative group"
              >
                <img
                  src={p.images[0]}
                  alt=""
                  className="w-20 h-20 rounded-lg object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <h4
                      onClick={() => {
                        onClose();
                        onSelectProperty(p);
                      }}
                      className="font-bold text-xs text-slate-900 truncate hover:text-amber-600 cursor-pointer"
                    >
                      {p.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">{p.district}, {p.city}</p>
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-amber-600 font-extrabold text-xs">
                      {formatPrice(p.price, p.status)}
                    </span>

                    <div className="flex items-center space-x-1">
                      <button
                        onClick={() => onRemoveFavorite(p.id)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                        title="Favorilerden Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectProperty(p);
                        }}
                        className="bg-slate-900 text-white p-1 rounded-md"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
