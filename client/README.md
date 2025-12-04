# BJJ Träningsapp - Next.js Frontend

En modern webbapp för BJJ-utövare att logga träningar, lära sig tekniker och följa progression.

## 🥋 Funktioner

- **Träningslogg**: Dokumentera och hantera dina träningspass
- **Teknikbibliotek**: Utforska och sök bland BJJ-tekniker
- **Statistik**: Se din progression och träningshistorik
- **Responsiv design**: Fungerar på mobil, tablet och desktop

## 🚀 Kom igång

### 1. Installera dependencies

```bash
npm install
```

### 2. Starta Express backend

I en separat terminal, från rot-mappen:

```bash
npm run dev
```

Backend körs på: `http://localhost:5001`

### 3. Starta Next.js frontend

Från client-mappen:

```bash
npm run dev
```

Frontend körs på: `http://localhost:3000`

## 📁 Projektstruktur

```
client/
├── app/                    # Next.js App Router
│   ├── layout.js          # Root layout med navigation
│   ├── page.js            # Startsida
│   ├── globals.css        # Global Tailwind CSS
│   ├── trainings/         # Träningslogg-sidor
│   │   ├── page.js        # Lista alla träningar
│   │   ├── new/           # Skapa ny träning
│   │   └── [id]/          # Se/redigera träning
│   ├── techniques/        # Teknikbibliotek
│   └── stats/             # Statistik-sida
├── lib/
│   └── api.js            # API-funktioner för backend-kommunikation
├── tailwind.config.js    # Tailwind-konfiguration
└── package.json
```

## 🎨 Tekniker som används

- **Next.js 15** - React framework med App Router
- **React 18** - JavaScript bibliotek för UI
- **Tailwind CSS** - Utility-first CSS framework
- **Fetch API** - För kommunikation med Express backend

## 🔌 API-kommunikation

Frontend kommunicerar med Express backend via REST API:

- `GET /api/trainings` - Hämta alla träningar
- `POST /api/trainings` - Skapa ny träning
- `GET /api/trainings/:id` - Hämta specifik träning
- `PUT /api/trainings/:id` - Uppdatera träning
- `DELETE /api/trainings/:id` - Ta bort träning

API-URL konfigureras i `.env.local`:

```
NEXT_PUBLIC_API_URL=http://localhost:5001/api
```

## 💡 Nästa steg

### Förbättringar du kan göra:

1. **Utöka datamodellen**
   - Lägg till datum, duration, notes till Training-modellen
   - Skapa User-modell för autentisering
   - Lägg till Belt/rank tracking

2. **Lägg till fler funktioner**
   - Sparring-logg med resultat
   - Teknik-anteckningar och videolänkar
   - Träningsschema/kalender
   - Export av data (PDF, CSV)

3. **Förbättra UI/UX**
   - Lägg till bilder/ikoner
   - Animationer och transitions
   - Dark mode
   - Toast notifications för feedback

4. **Backend-förbättringar**
   - Autentisering (JWT)
   - Bild-upload för tekniker
   - Sök och filtrering i backend
   - Pagination för stora datamängder

## 📝 Anteckningar

- Detta är en grundläggande implementation för att komma igång
- Teknikbiblioteket använder hårdkodad data - kan flyttas till databas
- Ingen autentisering implementerad ännu
- Statistiken är enkel - kan utökas med grafer (Chart.js, Recharts)

## 🤝 Utvecklad för BJJ-utövare

Appen är byggd med fokus på enkelhet och användarvänlighet, perfekt för att komma igång med digital träningsloggning!
