# 🚛 IbraPro | Gestion Garage

**Système complet de facturation et de gestion pour garage automobile.**

[![Live Demo](https://img.shields.io/badge/demo-online-green.svg)](https://ibrahima02ndiaye-debug.github.io/IBRAPRO-FACTURE/)
[![Build Status](https://github.com/ibrahima02ndiaye-debug/IBRAPRO-FACTURE/actions/workflows/deploy.yml/badge.svg)](https://github.com/ibrahima02ndiaye-debug/IBRAPRO-FACTURE/actions)

IbraPro est une application web moderne (SPA) conçue pour simplifier la gestion quotidienne d'un garage. Elle permet de gérer les clients, les factures et le catalogue de services avec une interface intuitive et professionnelle.

## ✨ Fonctionnalités Principales

- **📊 Tableau de Bord** : Vue d'ensemble du chiffre d'affaires, factures en attente, et conversion.
- **📄 Facturation Complète** : Création de factures détaillées avec calcul automatique des taxes (TPS/TVQ).
- **🖨️ Export PDF** : Génération de factures imprimables au format professionnel.
- **👥 Gestion Clients** : Répertoire complet avec historique des visites.
- **🔧 Catalogue Services** : Gestion des pièces et main d'œuvre.
- **💾 Base de Données Locale** : Toutes les données restent privées sur votre appareil (IndexedDB).
- **🔒 Sauvegarde/Restauration** : Export et import facile de vos données en JSON.

## 🛠️ Stack Technique

- **Framework** : [React 19](https://react.dev/)
- **Build Tool** : [Vite](https://vitejs.dev/)
- **Langage** : TypeScript
- **Styles** : [Tailwind CSS](https://tailwindcss.com/)
- **Base de Données** : [Dexie.js](https://dexie.org/) (Wrapper IndexedDB)
- **Graphiques** : Recharts
- **Icônes** : Lucide React

## 🚀 Installation Locale

1. **Cloner le projet**
   ```bash
   git clone https://github.com/ibrahima02ndiaye-debug/IBRAPRO-FACTURE.git
   cd IBRAPRO-FACTURE
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   # ou
   bun install
   ```

3. **Lancer le serveur de développement**
   ```bash
   npm run dev
   ```

L'application sera accessible sur `http://localhost:5173`.

## 📦 Déploiement (GitHub Pages)

Ce projet est configuré pour un déploiement automatique via GitHub Actions.

1. Pousser vos modifications sur la branche `main`.
2. Le workflow `.github/workflows/deploy.yml` se déclenche.
3. L'application est construite et déployée sur la branche `gh-pages`.

### Architecture de Déploiement

- **SPA Routing Fix** : Utilise `404.html` pour gérer le routing côté client sur GitHub Pages.
- **Base Path** : Configuré sur `/IBRAPRO-FACTURE/` dans `vite.config.ts`.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une Pull Request.

---

*Développé pour IbraPro Services Inc.*
