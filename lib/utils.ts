
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('fr-CA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount).replace(/\s/g, ' ') + ' $';
};

export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  const [year, month, day] = dateString.split('-');
  return `${year}/${month}/${day}`;
};

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

export const generateInvoiceNumber = (count: number): string => {
  // Matching the 7-digit style from the image (11000XXX)
  return (11000100 + count).toString();
};

export const calculateTotals = (items: any[]) => {
  const subTotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const tps = subTotal * 0.05;
  const tvq = subTotal * 0.09975;
  return {
    subTotal,
    tps,
    tvq,
    total: subTotal + tps + tvq
  };
};
