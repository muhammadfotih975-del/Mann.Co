# Mann Co. Mess Hall & Tactical Logistics 🥪

Mid-century military rations depot and combat forum requisition system with real-time SQLite database persistence and a classified `/admin` management terminal.

![TF2 Style](https://img.shields.io/badge/Theme-Mann%20Co.%20%28TF2%29-B8383B?style=for-the-badge)
![React](https://img.shields.io/badge/React-19-35637F?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![SQLite](https://img.shields.io/badge/Database-SQLite%203-003B57?style=for-the-badge&logo=sqlite)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss)

---

## 🌟 Key Features

1. **Mid-Century Industrial Combat Logistics UI**:
   - Styled according to the vintage TF2 *Mann Co. Mess Hall* specification.
   - RED Munitions (`#B8383B`) vs BLU Steel (`#5885A2`) team alignments.
   - Stamped manila dossiers, chamfered mechanical edges, ink drop shadows, and 45° caution hazard tape.
   - Anton display typography with Work Sans and Space Mono.

2. **Public Tactical Requisition Forum (Saved to SQL)**:
   - Mercenaries can submit combat ration orders (*The Sandvich, Buffalo Steak, Dalokohs Bar, Second Banana, etc.*).
   - All form submissions are persisted directly into an embedded **SQLite database** (`requisitions` table).
   - Live real-time stream of all frontline orders with likes, status stamps, and sector coordinates.

3. **Classified Admin Management Portal (`/admin`)**:
   - Direct route navigation: visit `/admin` in the browser or click the **ADMIN PANEL** button.
   - **Credentials:**
     - **Username:** `admin`
     - **Password:** `admin`
   - **Requisition Manager:** Approve, Dispatch, or Deny soldier rations, write Quartermaster notes, and delete records from SQL.
   - **Live SQL Console & Inspector:** Execute raw SQL queries (`SELECT`, `PRAGMA`, `GROUP BY`) directly from the browser with interactive table results and database schema visualization.
   - **Inventory Stockpile:** Adjust ration stock units in real-time.
   - **Audit Logs:** Full administrative trace stored in `admin_logs`.

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v20 or v22+ recommended)
- npm or bun

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/mann-co-mess-hall.git
cd mann-co-mess-hall
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 4. Build for production
```bash
npm run build
npm start
```

---

## 📂 Project Structure

```
├── data/                    # SQLite database storage (auto-created)
│   └── messhall.sqlite
├── src/
│   ├── components/
│   │   ├── AdminPage.tsx    # /admin gate, SQL console, and requisition manager
│   │   ├── Footer.tsx       # Brand footer with /admin link
│   │   ├── ForumFeed.tsx    # Live SQL records feed
│   │   ├── ForumOrderForm.tsx # User requisition form (saves to SQL)
│   │   ├── Header.tsx       # Top navigation & faction switch
│   │   ├── Hero.tsx         # Military banner
│   │   ├── MessSchedule.tsx # Tactical chow timetable
│   │   └── RationsCatalog.tsx # Edible munitions grid
│   ├── server/
│   │   └── db.ts            # SQLite database initialization & queries
│   ├── App.tsx              # Main routing & state controller
│   ├── index.css            # Vintage industrial styling tokens
│   ├── main.tsx             # React DOM root
│   └── types.ts             # TypeScript interfaces
├── server.ts                # Express backend + Vite middleware
├── package.json
└── vite.config.ts
```

---

## 🔒 Admin Access
To access the admin panel, navigate to `/admin` in your browser:
- **Login:** `admin`
- **Password:** `admin`

---

## 📜 License
Licensed under Apache 2.0. Assets inspired by Team Fortress 2 (Valve Corp).
