import React from 'react';
import { X, Trash2, Scale } from 'lucide-react';
import { Property } from '../types';
import { formatPrice, getTypeLabel } from '../utils/formatters';

interface PropertyCompareModalProps {
  properties: Property[];
  onClose: () => void;
  onRemoveFromCompare: (id: string) => void;
  onSelectProperty: (property: Property) => void;
}

export const PropertyCompareModal: React.FC<PropertyCompareModalProps> = ({
  properties,
  onClose,
  onRemoveFromCompare,
  onSelectProperty
}) => {
  if (properties.length === 0) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto">
            <Scale className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Karşılaştırılacak İlan Yok</h3>
          <p className="text-xs text-slate-500">
            Karşılaştırmak istediğiniz ilanların üzerindeki terazi simgesine tıklayarak ekleyebilirsiniz.
          </p>
          <button
            onClick={onClose}
            className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-xl text-xs"
          >
            Kapat
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-5xl w-full p-6 shadow-2xl relative max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <Scale className="w-6 h-6 text-blue-600" />
            <h3 className="text-xl font-bold text-slate-900">İlan Karşılaştırma Tablosu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Table Container */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 bg-slate-50 font-bold text-slate-500 min-w-[140px]">Özellik</th>
                {properties.map(p => (
                  <th key={p.id} className="p-3 min-w-[220px] max-w-[260px] align-top">
                    <div className="relative group">
                      <button
                        onClick={() => onRemoveFromCompare(p.id)}
                        className="absolute top-1 right-1 bg-rose-100 text-rose-600 p-1 rounded-full hover:bg-rose-600 hover:text-white transition"
                        title="Kaldır"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <img
                        src={p.images[0]}
                        alt=""
                        className="w-full h-32 object-cover rounded-xl mb-2"
                      />
                      <h4
                        onClick={() => {
                          onClose();
                          onSelectProperty(p);
                        }}
                        className="font-bold text-slate-900 line-clamp-2 hover:text-amber-600 cursor-pointer"
                      >
                        {p.title}
                      </h4>
                      <div className="text-amber-600 font-extrabold text-sm mt-1">
                        {formatPrice(p.price, p.status)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Ref No</td>
                {properties.map(p => <td key={p.id} className="p-3 font-mono text-slate-800">{p.refCode}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Konum</td>
                {properties.map(p => <td key={p.id} className="p-3 font-medium text-slate-800">{p.district}, {p.city}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Mülk Tipi</td>
                {properties.map(p => <td key={p.id} className="p-3 font-medium text-slate-800">{getTypeLabel(p.type)}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Oda Sayısı</td>
                {properties.map(p => <td key={p.id} className="p-3 font-bold text-slate-900">{p.rooms || '-'}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Alan (m²)</td>
                {properties.map(p => <td key={p.id} className="p-3 font-bold text-slate-900">{p.area} m²</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Bina Yaşı</td>
                {properties.map(p => <td key={p.id} className="p-3 text-slate-800">{p.buildingAge || '-'}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Isınma</td>
                {properties.map(p => <td key={p.id} className="p-3 text-slate-800">{p.heating || '-'}</td>)}
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-500 bg-slate-50">Krediye Uygun</td>
                {properties.map(p => (
                  <td key={p.id} className={`p-3 font-bold ${p.creditEligible ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {p.creditEligible ? 'Evet' : 'Hayır'}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
