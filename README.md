# 🏠 Bantu Real Estate Platform

Bantu Real Estate is a **full-featured property platform** built with modern technologies, offering real estate listing, management, subscription services, and rich utility tools — all tailored to support brokers, tenants, investors, and buyers.

This project includes:

- Property listing & filtering
- Unlockable property details with Stripe integration
- Role-based dashboards (Admin, Owner/Broker, Client)
- $5/month Property Management SaaS for landlords
- Maintenance, rent, and lease tracking
- PDF/CSV export, SEO, multi-language support (🇬🇧 English & 🇷🇼 Kinyarwanda)
- Email notifications and analytics

---

## 🚀 Features

### ✅ Property Listing & Browsing

- Advanced filters (location, type, price, etc.)
- Responsive UI with cards and maps
- Property details page with unlock system ($2 via Stripe)

### ✅ Stripe Integration

- $2 property unlock payment
- $5/month recurring Property Management SaaS
- Webhooks and secure transaction tracking

### ✅ Role-Based Dashboards

- **Admin**: Manage users, listings, payments
- **Owner/Broker**: List properties, track leases & tenants
- **Client**: Unlock, favorite, and explore properties

### ✅ Property Management SaaS

- Automated rent collection
- Lease & tenant tracking
- Maintenance ticketing system
- Income/expense reports
- Mobile Money & bank payment support

### ✅ Tools & Enhancements

- ROI, Mortgage, Rent Affordability calculators
- Currency converter (USD, RWF, EUR, GBP)
- Multi-language support: English & Kinyarwanda
- SEO-optimized with `react-helmet-async`
- Analytics with Plausible
- Email notifications using SMTP (Zoho)

---

## 📦 Tech Stack

- **Frontend**: React + TypeScript + Zustand
- **Backend**: Supabase (PostgreSQL, Edge Functions)
- **Payments**: Stripe API
- **Exports**: jsPDF + PapaParse
- **Notifications**: SMTP Email via Zoho
- **Analytics**: Plausible (privacy-friendly GA alternative)

---

## 🛠 Setup Instructions

### 🔑 Environment Variables (`.env`)

Create a `.env` file in the root with the following:

````env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key


### For email via SMTP
Set these using SUpabase secrets

```smtp
supabase secrets set SMTP_USER=your-email@domain.com
supabase secrets set SMTP_PASSWORD=your-smtp-password
supabase secrets set SMTP_HOST=smtp.zoho.com


### Stripe .env

```stripe
STRIPE_SECRET_KEY=your-stripe-secret-key
STRIPE_WEBHOOK_SECRET=your-webhook-secret
````
