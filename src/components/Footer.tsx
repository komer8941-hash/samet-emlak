import React from 'react';
import { Building2, Phone, Mail, MapPin, MessageSquare, ShieldCheck, Heart } from 'lucide-react';
import { AgencySettings } from '../types';
import { createWhatsAppUrl } from '../utils/formatters';

interface FooterProps {
  agency: AgencySettings;
  onSelectSection: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ agency, onSelectSection, onOpenAdmin }) => {
  const whatsappUrl = createWhatsAppUrl(agency.whatsapp, `Merhaba ${agency.name}, web sitenizden ulaşıyorum.`);

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-900 pt-12 pb-8 px-4 text-xs">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        {/* Col 1: Brand Info */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-white">{agency.name}</h3>
          </div>
          <p className="text-slate-400 leading-relaxed">
            {agency.aboutText}
          </p>
          <div className="flex items-center space-x-2 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>Taşınmaz Ticareti Yetki Belgeli Ofis</span>
          </div>
        </div>

        {/* Col 2: Hızlı Bağlantılar */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 text-sm">Hızlı Bağlantılar</h4>
          <ul className="space-y-2">
            <li>
              <button onClick={() => onSelectSection('home')} className="hover:text-amber-400 transition">
                Ana Sayfa
              </button>
            </li>
            <li>
              <button onClick={() => onSelectSection('properties')} className="hover:text-amber-400 transition">
                Tüm İlan Portföyü
              </button>
            </li>
            <li>
              <button onClick={() => onSelectSection('featured')} className="hover:text-amber-400 transition">
                Öne Çıkan Fırsat İlanlar
              </button>
            </li>
            <li>
              <button onClick={() => onSelectSection('about')} className="hover:text-amber-400 transition">
                Hakkımızda & Ekibimiz
              </button>
            </li>
            <li>
              <button onClick={() => onSelectSection('contact')} className="hover:text-amber-400 transition">
                İletişim & Adres
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Gayrimenkul Kriterleri */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 text-sm">İlan Kategorileri</h4>
          <ul className="space-y-2 text-slate-400">
            <li>Satılık Daireler & Rezidanslar</li>
            <li>Müstakil Havuzlu Lüks Villalar</li>
            <li>Yatırımlık Arsa & Zeytinlikler</li>
            <li>Kiralık Ofis & Ticari İş Yerleri</li>
            <li>Devren Satılık Gayrimenkuller</li>
          </ul>
        </div>

        {/* Col 4: İletişim Bilgileri */}
        <div className="space-y-3">
          <h4 className="font-bold text-slate-200 text-sm">İletişim & Adres</h4>
          <div className="space-y-2.5">
            <div className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <span>{agency.address}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
              <a href={`tel:${agency.phone}`} className="hover:text-white transition font-mono">
                {agency.phone}
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-blue-400 shrink-0" />
              <a href={`mailto:${agency.email}`} className="hover:text-white transition">
                {agency.email}
              </a>
            </div>
          </div>

          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl transition text-xs shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Danışma Hattı</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
        <div>
          © {new Date().getFullYear()} {agency.name}. Tüm hakları saklıdır.
        </div>

        <div className="flex items-center space-x-4">
          <span>{agency.workingHours}</span>
          <button
            onClick={onOpenAdmin}
            className="hover:text-amber-400 transition font-semibold underline underline-offset-2"
          >
            Yönetim Girişi
          </button>
        </div>
      </div>
    </footer>
  );
};
