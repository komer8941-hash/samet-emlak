import React, { useState } from 'react';
import {
  Building2, Plus, Edit, Trash2, CheckCircle2, X, Eye, Phone,
  MessageSquare, Settings, BarChart3, Image, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Property, AgencySettings, ContactMessage, PropertyStatus, PropertyType } from '../types';
import { formatPrice, getTypeLabel } from '../utils/formatters';

interface AdminPanelProps {
  properties: Property[];
  agency: AgencySettings;
  messages: ContactMessage[];
  onAddProperty: (property: Property) => void;
  onUpdateProperty: (property: Property) => void;
  onDeleteProperty: (id: string) => void;
  onUpdateAgencySettings: (settings: AgencySettings) => void;
  onMarkMessageRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
  onResetToDefaultData: () => void;
  onCloseAdmin: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  properties,
  agency,
  messages,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  onUpdateAgencySettings,
  onMarkMessageRead,
  onDeleteMessage,
  onResetToDefaultData,
  onCloseAdmin
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'messages' | 'settings'>('properties');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  // Agency settings form state
  const [agencyForm, setAgencyForm] = useState<AgencySettings>({ ...agency });

  // Add/Edit Property Form State
  const [propForm, setPropForm] = useState<Partial<Property>>({
    title: '',
    description: '',
    price: 3500000,
    status: 'satilik',
    type: 'konut',
    city: 'İstanbul',
    district: 'Kadıköy',
    neighborhood: '',
    rooms: '3+1',
    bathrooms: 2,
    area: 120,
    floor: '4. Kat',
    buildingAge: '3',
    heating: 'Kombi (Doğalgaz)',
    balcony: true,
    furnished: false,
    creditEligible: true,
    swapEligible: false,
    featured: false,
    urgent: false,
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
  });

  // Calculate stats
  const totalPortfolioValue = properties.reduce((acc, p) => acc + p.price, 0);
  const activeSatilikCount = properties.filter(p => p.status === 'satilik').length;
  const activeKiralikCount = properties.filter(p => p.status === 'kiralik').length;
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  const handleOpenAdd = () => {
    setEditingProperty(null);
    setPropForm({
      title: '',
      description: '',
      price: 4500000,
      status: 'satilik',
      type: 'konut',
      city: 'İstanbul',
      district: 'Kadıköy',
      neighborhood: 'Caferağa',
      rooms: '3+1',
      bathrooms: 2,
      area: 135,
      floor: '3. Kat',
      buildingAge: '0 (Yeni)',
      heating: 'Kombi (Doğalgaz)',
      balcony: true,
      furnished: false,
      creditEligible: true,
      swapEligible: false,
      featured: true,
      urgent: false,
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (property: Property) => {
    setEditingProperty(property);
    setPropForm({ ...property });
    setIsAddModalOpen(true);
  };

  const handleSavePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propForm.title || !propForm.price) return;

    if (editingProperty) {
      onUpdateProperty({
        ...editingProperty,
        ...(propForm as Property)
      });
    } else {
      const newProp: Property = {
        ...(propForm as Property),
        id: `prop-${Date.now()}`,
        refCode: `YLM-${Math.floor(100 + Math.random() * 900)}`,
        createdAt: new Date().toISOString().split('T')[0]
      };
      onAddProperty(newProp);
    }
    setIsAddModalOpen(false);
  };

  const handleAgencySettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAgencySettings(agencyForm);
    alert('Firma ve site ayarları başarıyla güncellendi!');
  };

  return (
    <div className="bg-slate-100 min-h-screen py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Admin Header */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Building2 className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-xl font-bold">{agency.name} - Yönetim Paneli</h2>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] px-2 py-0.5 rounded font-mono uppercase">Admin</span>
              </div>
              <p className="text-xs text-slate-400">İlan yönetimi, müşteri talepleri ve site ayarları</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onResetToDefaultData}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-2 rounded-xl text-xs font-semibold transition flex items-center"
              title="Örnek verileri yeniden yükler"
            >
              <RefreshCw className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              Demo Verileri Sıfırla
            </button>
            <button
              onClick={onCloseAdmin}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition shadow-md"
            >
              Müşteri Görünümüne Dön
            </button>
          </div>
        </div>

        {/* Analytics Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold mb-1">
              <span>Toplam Portföy İlanı</span>
              <BarChart3 className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{properties.length} Adet</div>
            <span className="text-[11px] text-slate-400">Yayındaki tüm mülkler</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold mb-1">
              <span>Aktif Satılık / Kiralık</span>
              <Building2 className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">
              {activeSatilikCount} Satılık / {activeKiralikCount} Kiralık
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">Satışa hazır gayrimenkuller</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold mb-1">
              <span>Toplam Portföy Hacmi</span>
              <span className="text-amber-500 font-bold">₺</span>
            </div>
            <div className="text-xl font-black text-amber-600 truncate">{formatPrice(totalPortfolioValue)}</div>
            <span className="text-[11px] text-slate-400">Toplam gayrimenkul değeri</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-500 text-xs font-semibold mb-1">
              <span>Gelen Müşteri Talepleri</span>
              <MessageSquare className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-slate-900">{messages.length} Talep</div>
            {unreadMessagesCount > 0 ? (
              <span className="text-[11px] text-rose-600 font-bold">{unreadMessagesCount} adet okunmamış mesaj var!</span>
            ) : (
              <span className="text-[11px] text-slate-400">Tüm talepler incelendi</span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-300 space-x-4">
          <button
            onClick={() => setActiveTab('properties')}
            className={`pb-3 text-sm font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'properties'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>İlan Yönetimi ({properties.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`pb-3 text-sm font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'messages'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Müşteri Talepleri ({messages.length})</span>
            {unreadMessagesCount > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 text-sm font-bold transition flex items-center space-x-2 border-b-2 ${
              activeTab === 'settings'
                ? 'border-amber-500 text-amber-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Firma & Site Ayarları</span>
          </button>
        </div>

        {/* TAB 1: PROPERTIES MANAGEMENT */}
        {activeTab === 'properties' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Portföydeki İlanlar</h3>
                <p className="text-xs text-slate-500">Mevcut tüm ilanları ekleyin, güncelleyin veya duruma göre düzenleyin.</p>
              </div>
              <button
                onClick={handleOpenAdd}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center justify-center space-x-2 shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni İlan Ekle</span>
              </button>
            </div>

            {/* Properties Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-600 font-bold border-b border-slate-200">
                    <th className="p-3">Görsel & Başlık</th>
                    <th className="p-3">Ref No</th>
                    <th className="p-3">Konum</th>
                    <th className="p-3">Fiyat</th>
                    <th className="p-3">Durum</th>
                    <th className="p-3">Oda / m²</th>
                    <th className="p-3 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {properties.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-3">
                        <div className="flex items-center space-x-3">
                          <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover shrink-0" />
                          <div className="max-w-xs">
                            <span className="font-bold text-slate-900 line-clamp-1">{p.title}</span>
                            <span className="text-[11px] text-slate-400">{getTypeLabel(p.type)}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-mono font-bold text-slate-700">{p.refCode}</td>
                      <td className="p-3 text-slate-700">{p.district}, {p.city}</td>
                      <td className="p-3 font-extrabold text-amber-600">{formatPrice(p.price, p.status)}</td>
                      <td className="p-3">
                        <select
                          value={p.status}
                          onChange={(e) => onUpdateProperty({ ...p, status: e.target.value as PropertyStatus })}
                          className={`text-xs font-bold rounded-lg px-2 py-1 focus:outline-none border ${
                            p.status === 'satilik' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                            p.status === 'kiralik' ? 'bg-blue-50 text-blue-700 border-blue-300' :
                            p.status === 'satildi' ? 'bg-rose-50 text-rose-700 border-rose-300' : 'bg-slate-200 text-slate-800'
                          }`}
                        >
                          <option value="satilik">Satılık</option>
                          <option value="kiralik">Kiralık</option>
                          <option value="satildi">SATILDI</option>
                          <option value="kiralandi">KİRALANDI</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-700">{p.rooms || '-'} / {p.area} m²</td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition"
                            title="Düzenle"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`"${p.title}" ilanını silmek istediğinize emin misiniz?`)) {
                                onDeleteProperty(p.id);
                              }
                            }}
                            className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: MESSAGES MANAGEMENT */}
        {activeTab === 'messages' && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Müşteri İletişim & Randevu Talepleri</h3>
            {messages.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">Henüz gelen bir müşteri talebi yok.</p>
            ) : (
              <div className="space-y-3">
                {messages.map(m => (
                  <div
                    key={m.id}
                    className={`p-4 rounded-2xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      m.read ? 'bg-slate-50 border-slate-200' : 'bg-amber-50/50 border-amber-300'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-bold text-slate-900 text-sm">{m.name}</span>
                        <span className="text-xs text-slate-500 font-mono">{m.phone}</span>
                        {!m.read && (
                          <span className="bg-amber-500 text-slate-950 text-[10px] px-2 py-0.5 rounded-full font-bold">
                            YENİ
                          </span>
                        )}
                      </div>
                      {m.propertyTitle && (
                        <div className="text-xs text-amber-700 font-semibold">
                          İlgilendiği İlan: {m.propertyTitle} ({m.propertyRefCode})
                        </div>
                      )}
                      <p className="text-xs text-slate-600 italic">"{m.message}"</p>
                      <span className="text-[10px] text-slate-400">{m.createdAt}</span>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <a
                        href={`https://wa.me/${m.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center"
                      >
                        <MessageSquare className="w-3.5 h-3.5 mr-1" />
                        WhatsApp
                      </a>
                      <a
                        href={`tel:${m.phone}`}
                        className="bg-slate-800 text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center"
                      >
                        <Phone className="w-3.5 h-3.5 mr-1 text-amber-400" />
                        Ara
                      </a>
                      {!m.read && (
                        <button
                          onClick={() => onMarkMessageRead(m.id)}
                          className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-blue-200 transition"
                        >
                          Okundu Yap
                        </button>
                      )}
                      <button
                        onClick={() => onDeleteMessage(m.id)}
                        className="text-slate-400 hover:text-rose-600 p-1.5"
                        title="Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: AGENCY SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleAgencySettingsSubmit} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Emlak Ofisi & Web Sütü İletişim Bilgileri</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Emlak Ofisi / Marka Adı</label>
                <input
                  type="text"
                  value={agencyForm.name}
                  onChange={(e) => setAgencyForm({ ...agencyForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sorumlu Emlak Danışmanı Adı</label>
                <input
                  type="text"
                  value={agencyForm.ownerName}
                  onChange={(e) => setAgencyForm({ ...agencyForm, ownerName: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slogan / Slogan Başlığı</label>
                <input
                  type="text"
                  value={agencyForm.tagline}
                  onChange={(e) => setAgencyForm({ ...agencyForm, tagline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefon Numarası</label>
                <input
                  type="text"
                  value={agencyForm.phone}
                  onChange={(e) => setAgencyForm({ ...agencyForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">WhatsApp Numarası (Ülke kodlu örn: 90532...)</label>
                <input
                  type="text"
                  value={agencyForm.whatsapp}
                  onChange={(e) => setAgencyForm({ ...agencyForm, whatsapp: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-Posta Adresi</label>
                <input
                  type="email"
                  value={agencyForm.email}
                  onChange={(e) => setAgencyForm({ ...agencyForm, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Ofis Açık Adresi</label>
                <input
                  type="text"
                  value={agencyForm.address}
                  onChange={(e) => setAgencyForm({ ...agencyForm, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Hakkımızda Tanıtım Metni</label>
                <textarea
                  rows={3}
                  value={agencyForm.aboutText}
                  onChange={(e) => setAgencyForm({ ...agencyForm, aboutText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-xs transition shadow-md"
            >
              Ayarları Kaydet
            </button>
          </form>
        )}

        {/* MODAL: ADD / EDIT PROPERTY */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-3xl w-full p-6 shadow-2xl relative max-h-[92vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
                <h3 className="text-lg font-bold text-slate-900">
                  {editingProperty ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
                </h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSavePropertySubmit} className="overflow-y-auto space-y-4 text-xs pr-1 flex-1">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">İlan Başlığı *</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: Kadıköy'de Deniz Manzaralı Lüks 3+1 Daire"
                    value={propForm.title || ''}
                    onChange={(e) => setPropForm({ ...propForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Fiyat (TL) *</label>
                    <input
                      type="number"
                      required
                      value={propForm.price || ''}
                      onChange={(e) => setPropForm({ ...propForm, price: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-extrabold text-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">İlan Durumu</label>
                    <select
                      value={propForm.status || 'satilik'}
                      onChange={(e) => setPropForm({ ...propForm, status: e.target.value as PropertyStatus })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="satilik">Satılık</option>
                      <option value="kiralik">Kiralık</option>
                      <option value="satildi">SATILDI</option>
                      <option value="kiralandi">KİRALANDI</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mülk Tipi</label>
                    <select
                      value={propForm.type || 'konut'}
                      onChange={(e) => setPropForm({ ...propForm, type: e.target.value as PropertyType })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl font-bold"
                    >
                      <option value="konut">Konut / Daire</option>
                      <option value="villa">Müstakil Villa</option>
                      <option value="arsa">Arsa / Tarla</option>
                      <option value="isyeri">Ticari / İş Yeri</option>
                      <option value="rezidans">Rezidans</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Şehir</label>
                    <input
                      type="text"
                      value={propForm.city || ''}
                      onChange={(e) => setPropForm({ ...propForm, city: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">İlçe</label>
                    <input
                      type="text"
                      value={propForm.district || ''}
                      onChange={(e) => setPropForm({ ...propForm, district: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Mahalle</label>
                    <input
                      type="text"
                      value={propForm.neighborhood || ''}
                      onChange={(e) => setPropForm({ ...propForm, neighborhood: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Oda Sayısı</label>
                    <input
                      type="text"
                      placeholder="3+1"
                      value={propForm.rooms || ''}
                      onChange={(e) => setPropForm({ ...propForm, rooms: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Metrekare (m²)</label>
                    <input
                      type="number"
                      value={propForm.area || ''}
                      onChange={(e) => setPropForm({ ...propForm, area: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kat</label>
                    <input
                      type="text"
                      placeholder="4. Kat"
                      value={propForm.floor || ''}
                      onChange={(e) => setPropForm({ ...propForm, floor: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Bina Yaşı</label>
                    <input
                      type="text"
                      placeholder="0 (Sıfır)"
                      value={propForm.buildingAge || ''}
                      onChange={(e) => setPropForm({ ...propForm, buildingAge: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Görsel URL (Virgül ile ayırın)</label>
                  <textarea
                    rows={2}
                    value={Array.isArray(propForm.images) ? propForm.images.join(', ') : ''}
                    onChange={(e) => setPropForm({ ...propForm, images: e.target.value.split(',').map(s => s.trim()) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Açıklama Detayları</label>
                  <textarea
                    rows={4}
                    value={propForm.description || ''}
                    onChange={(e) => setPropForm({ ...propForm, description: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl"
                  />
                </div>

                <div className="flex flex-wrap gap-4 pt-2 border-t border-slate-100">
                  <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!propForm.featured}
                      onChange={(e) => setPropForm({ ...propForm, featured: e.target.checked })}
                      className="rounded accent-amber-500"
                    />
                    <span>Öne Çıkarılan İlan</span>
                  </label>

                  <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!propForm.urgent}
                      onChange={(e) => setPropForm({ ...propForm, urgent: e.target.checked })}
                      className="rounded accent-rose-500"
                    />
                    <span>Acil Satılık/Kiralık</span>
                  </label>

                  <label className="flex items-center space-x-2 font-bold text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={!!propForm.creditEligible}
                      onChange={(e) => setPropForm({ ...propForm, creditEligible: e.target.checked })}
                      className="rounded accent-emerald-500"
                    />
                    <span>Krediye Uygun</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 rounded-xl transition text-xs shadow-md mt-4"
                >
                  {editingProperty ? 'İlanı Güncelle' : 'İlanı Yayınla'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
