export const formatPrice = (price: number, status?: string): string => {
  const formatted = new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    maximumFractionDigits: 0
  }).format(price);

  if (status === 'kiralik') {
    return `${formatted} / ay`;
  }
  return formatted;
};

export const createWhatsAppUrl = (phone: string, message: string): string => {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedMsg}`;
};

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'satilik':
      return { label: 'Satılık', bg: 'bg-emerald-600 text-white' };
    case 'kiralik':
      return { label: 'Kiralık', bg: 'bg-blue-600 text-white' };
    case 'satildi':
      return { label: 'SATILDI', bg: 'bg-rose-600 text-white' };
    case 'kiralandi':
      return { label: 'KİRALANDI', bg: 'bg-slate-700 text-white' };
    default:
      return { label: status, bg: 'bg-slate-500 text-white' };
  }
};

export const getTypeLabel = (type: string): string => {
  switch (type) {
    case 'konut': return 'Konut / Daire';
    case 'villa': return 'Müstakil Villa';
    case 'arsa': return 'Arsa / Tarla';
    case 'isyeri': return 'Ticari / İş Yeri';
    case 'rezidans': return 'Rezidans';
    default: return type;
  }
};
