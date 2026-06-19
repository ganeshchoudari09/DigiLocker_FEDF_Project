# DigiLocker Integration Platform

A premium futuristic SaaS dashboard for digital document management, built with React.js, featuring glassmorphism UI, purple-pink-lavender aesthetics, and full DigiLocker-style functionality.

## Features

- **Authentication** – Login/register with LocalStorage persistence
- **Document Vault** – Upload, view, delete documents
- **DigiLocker Sync** – Simulated government sync
- **QR Sharing** – Generate share links with QR codes
- **Validity Engine** – Document expiry checking
- **Notifications** – In-app notification center
- **Government Services** – Service linking (Admin)
- **Activity History** – Full audit trail
- **Export System** – JSON document export
- **Admin Dashboard** – Analytics & service management
- **Global Search** – Search across documents
- **Dark Mode** – Theme toggle with persistence
- **Analytics** – KPI cards, doughnut, bar, and line charts
- **AI Assistant** – Digi AI chat widget

## Tech Stack

- React 18+ (Functional Components & Hooks)
- React Router DOM
- Context API
- Framer Motion
- Recharts
- Axios (ready for API integration)
- qrcode.react
- Lucide React icons
- LocalStorage

## Getting Started

```bash
cd digilocker-platform
npm install
npm run dev
```

Open http://localhost:5173

**Demo Login:** Use any email and password to sign in.

## Build

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── dashboard/     # Hero, KPIs, Charts, AI, etc.
│   ├── layout/        # Sidebar, TopNav, Layout
│   └── modals/        # Upload, Share modals
├── context/           # Auth, Theme, Documents
├── data/              # Mock data
├── pages/             # Route pages
└── utils/             # Storage, validity engine
```

## Design

- Glassmorphism cards with backdrop blur
- Purple (#2D0B45) → Pink (#FF7BCB) gradient palette
- Floating document cards with hover tilt
- Framer Motion micro-interactions
- Fully responsive (mobile, tablet, desktop)
