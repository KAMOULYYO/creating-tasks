# 📋 TaskFlow — Gestionnaire de tâches du jour

> Application web full-stack de gestion de tâches, construite avec Next.js 16, Supabase et Claude AI.

## ✨ Features

- ✅ **Gestion de tâches** — ajout, édition, suppression, toggle done/pending
- 🎯 **Drag & Drop** — réordonne tes tâches en glisser-déposer
- 📊 **Statistiques** — graphiques de productivité par catégorie et priorité
- 🔔 **Notifications** — rappels navigateur 5 min avant chaque tâche planifiée
- 🎉 **Confetti** — célébration quand toutes les tâches sont terminées
- 🔥 **Streak** — compteur de jours consécutifs de productivité
- 🌙 **Dark mode** — thème clair/sombre persistant
- 📱 **PWA** — installable sur téléphone comme une vraie app
- ⏱️ **Pomodoro** — timer 25/5/15 min flottant et draggable
- ✨ **Suggestions IA** — Claude analyse tes tâches et suggère quoi faire
- 📄 **Export PDF** — rapport journalier professionnel en un clic
- 🔒 **Auth complète** — inscription / connexion par email + bcrypt

## 🛠 Stack

| Couche | Techno |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Langage | TypeScript |
| Style | Tailwind CSS + Claymorphism design |
| Animations | Framer Motion |
| Base de données | Supabase (PostgreSQL) |
| Auth | NextAuth.js v4 + bcryptjs |
| IA | Claude Haiku (Anthropic) |
| Charts | Recharts |
| DnD | @dnd-kit |
| PDF | jsPDF |

## 🚀 Installation

```bash
# 1. Clone
git clone https://github.com/KAMOULYYO/creating-tasks
cd creating-tasks

# 2. Dépendances
npm install

# 3. Variables d'environnement
cp .env.example .env.local
# Édite .env.local avec tes clés Supabase + Anthropic

# 4. Base de données
# Copie supabase/schema.sql dans l'éditeur SQL de Supabase et exécute

# 5. Lance
npm run dev
```

Ouvre [http://localhost:3000](http://localhost:3000)

## 📁 Structure

```
src/
├── app/
│   ├── api/auth/       → NextAuth + Register
│   ├── api/tasks/      → CRUD tâches (GET, POST, PATCH, DELETE)
│   ├── api/ai/suggest/ → Suggestions Claude AI
│   ├── dashboard/      → App principale
│   ├── login/          → Connexion
│   ├── register/       → Inscription
│   └── page.tsx        → Landing page
├── components/         → TaskCard, Modals, Charts, Pomodoro, AISuggest...
├── hooks/              → useNotifications, usePWA, useExportPDF
├── lib/                → Supabase client, NextAuth config, design tokens
└── types/              → TypeScript types
```

## 🗄 Base de données

Exécute `supabase/schema.sql` dans Supabase → SQL Editor.

---

Fait avec ❤️ et ☕
