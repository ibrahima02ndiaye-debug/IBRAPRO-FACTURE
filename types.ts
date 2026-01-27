
export enum InvoiceStatus {
  DRAFT = 'Brouillon',
  SENT = 'Envoyée',
  PAID = 'Payée',
  OVERDUE = 'En retard',
  CANCELLED = 'Annulée'
}

export interface CompanyInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  tps: string;
  tvq: string;
  logo?: string; // Base64 string
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  taxRate: number;
}

export interface InvoiceItem {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface VehicleInfo {
  year: string;
  model: string;
  vin: string;
  mileage: string;
}

export interface Invoice {
  id: string;
  number: string;
  clientId: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  status: InvoiceStatus;
  notes?: string;
  vehicle?: VehicleInfo;
  subTotal: number;
  tps: number;
  tvq: number;
  total: number;
}

export type ViewState = 'DASHBOARD' | 'INVOICES' | 'CLIENTS' | 'PRODUCTS' | 'SETTINGS' | 'CREATE_INVOICE' | 'VIEW_INVOICE';
