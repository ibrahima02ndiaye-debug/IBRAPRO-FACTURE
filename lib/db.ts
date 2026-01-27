
import { Dexie, type Table } from 'dexie';
import { Invoice, Client, Product, CompanyInfo } from '../types';

// Use named export for Dexie to ensure TypeScript correctly identifies inherited instance methods like version() and transaction()
export class IbraProDatabase extends Dexie {
  invoices!: Table<Invoice>;
  clients!: Table<Client>;
  products!: Table<Product>;
  company!: Table<CompanyInfo & { id: string }>;

  constructor() {
    super('IbraProDB');
    // Fix for line 15: Define the database schema using the versioning system inherited from Dexie base class
    this.version(1).stores({
      invoices: '++id, number, clientId, date, status',
      clients: '++id, name, email',
      products: '++id, name',
      company: 'id'
    });
  }
}

// Create a single instance of the database to be used throughout the application
export const db = new IbraProDatabase();

export const dbService = {
  async exportBackup() {
    const backup = {
      invoices: await db.invoices.toArray(),
      clients: await db.clients.toArray(),
      products: await db.products.toArray(),
      company: await db.company.get('config')
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sauvegarde_ibra_pro_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  },

  async importBackup(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          // Fix for line 49: Execute transaction on the database instance; using table references directly ensures type safety
          await db.transaction('rw', [db.invoices, db.clients, db.products, db.company], async () => {
            if (data.invoices) { await db.invoices.clear(); await db.invoices.bulkAdd(data.invoices); }
            if (data.clients) { await db.clients.clear(); await db.clients.bulkAdd(data.clients); }
            if (data.products) { await db.products.clear(); await db.products.bulkAdd(data.products); }
            if (data.company) { await db.company.put({ ...data.company, id: 'config' }); }
          });
          resolve(true);
        } catch (err) {
          console.error("Erreur critique d'importation", err);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }
};
