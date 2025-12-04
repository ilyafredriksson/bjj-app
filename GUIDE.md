# BJJ Träningsapp - Komplett Guide

## 🎯 Översikt

Du har nu en komplett fullstack BJJ-träningsapp med:
- **Backend**: Node.js + Express + MongoDB
- **Frontend**: Next.js + React + Tailwind CSS

## 📋 Snabbstart

### Steg 1: Starta MongoDB

Se till att MongoDB är igång. Om du använder MongoDB Atlas, kontrollera att anslutningen fungerar.

### Steg 2: Starta Backend (Express)

Öppna terminal i rot-mappen och kör:

```bash
npm run dev
```

Backend kommer köra på: **http://localhost:5001**

### Steg 3: Starta Frontend (Next.js)

Öppna en NY terminal i `client`-mappen och kör:

```bash
cd client
npm run dev
```

Frontend kommer köra på: **http://localhost:3000**

### Steg 4: Öppna i webbläsaren

Gå till **http://localhost:3000** och börja använda appen!

## 🏗️ Projektstruktur

```
bjj-app/
├── src/                          # Backend (Express)
│   ├── server.js                # Huvudserver
│   ├── models/
│   │   └── training.js          # MongoDB schema för träningar
│   ├── controllers/
│   │   └── trainingController.js # Business logic
│   └── routes/
│       └── trainingRoutes.js    # API endpoints
│
├── client/                       # Frontend (Next.js)
│   ├── app/                     # Next.js App Router
│   │   ├── page.js              # Startsida
│   │   ├── layout.js            # Layout med navigation
│   │   ├── globals.css          # Tailwind styles
│   │   ├── trainings/           # Träningslogg
│   │   │   ├── page.js          # Lista träningar
│   │   │   ├── new/page.js      # Ny träning
│   │   │   └── [id]/page.js     # Detaljvy/edit
│   │   ├── techniques/          # Teknikbibliotek
│   │   │   └── page.js
│   │   └── stats/               # Statistik
│   │       └── page.js
│   ├── lib/
│   │   └── api.js               # API-kommunikation
│   └── package.json
│
├── .env                         # Backend miljövariabler
└── package.json                 # Backend dependencies
```

## 🎨 Funktioner som är implementerade

### ✅ Träningslogg
- Lista alla träningar
- Skapa ny träning (teknik + instruktör)
- Visa träningsdetaljer
- Redigera träning
- Ta bort träning
- Automatisk timestamp (skapandedatum)

### ✅ Teknikbibliotek
- Lista tekniker (exempel-data)
- Sök efter tekniker
- Filtrera efter kategori (Submissions, Sweeps, etc.)
- Filtrera efter svårighetsgrad
- Favoritmarkering (sparas lokalt i browser)

### ✅ Statistik
- Totalt antal träningar
- Unika instruktörer
- Olika tekniker
- Topp 5 instruktörer
- Mest tränade tekniker

### ✅ Design
- Responsiv (fungerar på mobil, tablet, desktop)
- Tailwind CSS med custom färger för BJJ-tema
- Enhetlig navigation
- Loading states
- Error handling

## 🔧 Teknisk implementation

### Backend API Endpoints

```
GET    /api/trainings      # Hämta alla träningar
POST   /api/trainings      # Skapa ny träning
GET    /api/trainings/:id  # Hämta specifik träning
PUT    /api/trainings/:id  # Uppdatera träning
DELETE /api/trainings/:id  # Ta bort träning
```

### Frontend Pages

```
/                    # Startsida med översikt
/trainings           # Lista alla träningar
/trainings/new       # Formulär för ny träning
/trainings/[id]      # Detaljvy för träning
/techniques          # Teknikbibliotek med filter
/stats               # Statistik och progression
```

### Dataflöde

1. **Frontend** (Next.js) gör fetch-anrop till backend
2. **lib/api.js** innehåller alla API-funktioner
3. **Backend** (Express) tar emot request
4. **Controller** hanterar business logic
5. **Model** (Mongoose) kommunicerar med MongoDB
6. Data returneras tillbaka till frontend
7. React uppdaterar UI

## 💡 Förklaring av kodval

### Varför App Router (Next.js)?
- Modern och rekommenderad av Next.js
- Enklare filbaserad routing
- Bättre performance med Server Components (kan användas senare)
- Du behöver inte konfigurera routing manuellt

### Varför 'use client' i komponenterna?
- Eftersom vi använder React hooks (useState, useEffect)
- App Router gör components till Server Components by default
- Client Components behövs för interaktivitet

### Varför Tailwind CSS?
- Snabbt att utveckla med utility classes
- Ingen CSS-fil per komponent behövs
- Responsivt by design
- Lätt att anpassa (se custom colors i tailwind.config.js)

### Varför separata API-funktioner i lib/api.js?
- Återanvändbar kod
- Lättare att uppdatera API_BASE_URL på ett ställe
- Separation of concerns (komponenter ska inte veta om fetch-detaljer)
- Enklare att lägga till error handling och authentication senare

## 🚀 Nästa steg - Förbättringar

### 1. Utöka Training Model

Lägg till fler fält i backend:

```javascript
// src/models/training.js
const TrainingSchema = new mongoose.Schema({
    technique: { type: String, required: true },
    instructor: { type: String, required: true },
    date: { type: Date, default: Date.now },
    duration: { type: Number }, // minuter
    notes: { type: String },
    type: { type: String, enum: ['Gi', 'No-Gi', 'Drilling', 'Sparring'] },
    beltLevel: { type: String },
    mood: { type: Number, min: 1, max: 5 },
    energy: { type: Number, min: 1, max: 5 },
}, { timestamps: true });
```

### 2. Lägg till User-autentisering

```javascript
// Använd Next-Auth för frontend
// JWT tokens för backend
```

### 3. Spara tekniker i databas

Skapa Technique-modell istället för hårdkodad data

### 4. Lägg till bilder/videor

```javascript
// Använd Cloudinary eller AWS S3
// För att ladda upp teknik-videor
```

### 5. Grafer och diagram

```bash
npm install recharts
# Lägg till visuella grafer i statistik-sidan
```

### 6. Dark Mode

```javascript
// Använd next-themes package
npm install next-themes
```

### 7. PWA Support

```javascript
// Gör appen installerbar på mobil
// Använd next-pwa
```

## 🐛 Felsökning

### Problem: "Cannot connect to MongoDB"
- Kontrollera att MongoDB är igång
- Kolla .env filen har rätt MONGO_URI
- Testa anslutningen i MongoDB Compass

### Problem: "Failed to fetch"
- Kontrollera att backend körs på port 5001
- Kolla att NEXT_PUBLIC_API_URL är rätt i .env.local
- Öppna http://localhost:5001/api/trainings i browser för att testa

### Problem: CORS errors
- Backend har redan CORS aktiverat
- Om problem kvarstår, lägg till specific origin i server.js

## 📚 Lär dig mer

### Next.js
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)

### Tailwind CSS
- [Tailwind Documentation](https://tailwindcss.com/docs)
- [Tailwind UI Components](https://tailwindui.com/)

### MongoDB
- [MongoDB Manual](https://docs.mongodb.com/manual/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)

## ✨ Tips för utveckling

1. **Använd React Developer Tools** - För att debugga components
2. **Använd Network Tab** - För att se API-anrop
3. **Använd console.log** - För att förstå dataflödet
4. **Testa API endpoints först** - Använd Postman eller Thunder Client
5. **Commit ofta** - Small commits med tydliga meddelanden
6. **Läs error messages** - De är ofta mer hjälpsamma än du tror!

---

## 🥋 Lycka till med din BJJ-app!

Du har nu en solid grund att bygga vidare på. Utforska, experimentera och anpassa efter dina behov!
