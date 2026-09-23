# Archroma Lab Capability Finder

An internal enterprise web application designed to consolidate all Archroma laboratory capability Excel workbooks into a searchable, auditable interface.

It answers the core question:
> **"Can this test/capability be performed, and if yes, at which lab, location, and country?"**

---

## 🚀 Quick Start

### 1. Run the Live Web Application
```bash
cd web
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 📁 Repository Structure

```
.
├── Lab capabilities Archroma 2026_Sep.xlsx       # Baseline Consolidated Master Workbook
├── Lab capabilities Archroma 2026 Liberec.xlsx   # Liberec Regional Additions (Blue Markings)
├── Lab capabilities Archroma 2026 Printing...xlsx # Castellbisbal Printing Additions
├── Lab capabilities Archroma 2026 USA.xlsx       # USA AATCC Standards (Charlotte)
├── Lab capabilities Archroma 2026 Pakistan.xlsx  # Pakistan Regional Supplement
├── Lab capabilities Archroma 2026 Bangpoo.xlsx   # Bangpoo Regional Supplement
├── Lab capabilities Archroma 2026 Langweid.xlsx  # Langweid Mechanical/Finishing Supplement
├── Lab capabilities Archroma 2026 South...xlsx   # Latin America Regional Supplement
├── Lab capabilities Archroma 2026 Turkey.xlsx    # Turkey Regional Supplement
├── Lab capabilities Archroma 2026.xlsx          # Baseline Reference
├── scripts/
│   └── ingest_excel.py                           # Python data ingestion & normalization pipeline
└── web/                                          # Next.js 16 Web Application
    ├── app/                                      # App Router screens & API routes
    ├── components/                               # UI & Provenance Modal components
    ├── lib/db.ts                                 # SQLite database & FTS5 search access layer
    └── data/
        ├── archroma.db                           # SQLite FTS5 database (21,793 records)
        ├── lab_master.json                       # Configurable Lab Master directory
        └── data_quality_report.json              # Data quality & audit log report
```

---

## 🔄 Data Ingestion & Rebuilding

### How Data Was Consolidated
1. **Master Baseline**: `Lab capabilities Archroma 2026_Sep.xlsx` provided the base structure across all 8 sheets (`Pretreatment & Sizing`, `Dyeing & Auxiliaries`, `Printing`, `Finishing & Coating`, `Mechanical technological testin`, `Fastness testing`, `Analytical`, `FR tests`).
2. **Regional Additions & Blue Markings**:
   - **Liberec**: 29+ added/updated capabilities retained (Pad Dry, Pad Bake, Jet dyeing, Pad Thermosol Automotive, Pad Jig, PV 1303, tendering DIN 54281, alkali solubility, extraction, fiber analysis ISO 1833, dynamic viscosity - Brookfield, DA tests, FAR 25.853, DIN 4102 B2).
   - **Castellbisbal**: Retained printing additions (Discharge, Fashion effects / Burn out, Pigment milling).
   - **USA (Charlotte)**: Retained AATCC TM 42 (Impact Penetration Test), AATCC TM 127 (Hydrostatic Pressure Test), AATCC TM 22 (Spray Test).
   - **Pakistan**: Retained 7 extra printing capabilities.
3. **Naming Normalization**:
   - Expanded `Pad Thermosol (reactive, disperse, pigments)` into Pad Thermofix (reactive), Pad Thermosol (disperse), Pad Fix (pigments).
   - Normalized `Pad Humidifix` to `Pad Humidity Fix`.
4. **Lab Master Decoupling (`data/lab_master.json`)**:
   - Maintained distinction between **Commercial Labs** and **R&T Labs** (e.g., Panyu Commercial vs Panyu R&T, Mumbai Commercial vs Mumbai R&T).
   - Mapped 26 labs across 15 countries and 4 global regions.

### How to Add Future Excel Files & Rebuild
When an updated Excel workbook arrives in the future:
1. Place the new `.xlsx` file into the root folder.
2. Run the ingestion pipeline:
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   pip install pandas openpyxl
   python3 scripts/ingest_excel.py
   ```
3. The SQLite database `web/data/archroma.db` will be updated automatically without rewriting any frontend code.

---

## 🔍 Features & Pages

- **🔍 Lab Capability Finder (`/`)**: Hero search bar with partial matching, quick search chips, combinable filters (Country, Region, Lab, Lab Type, Category, Availability), deduplicated card views, and clickable **Source Provenance Modal** showing confirming Excel workbooks, worksheet names, row numbers, source indicators (`X`, `(X)`, `O`), font color markings, and change types.
- **🏢 Master Lab Directory (`/labs` & `/labs/[id]`)**: Full list of 26 active laboratories with capability counts and regional addition highlights.
- **🌍 Country Directory (`/countries` & `/countries/[id]`)**: Answers *"What can our labs in India / Czech Republic / USA / Spain do?"*.
- **📁 Capability Categories (`/categories`)**: Detailed overview across the 8 standard Excel sheets.
- **📊 Analytics Dashboard (`/dashboard`)**: KPI metrics & Recharts visualizations.
- **🛡️ Data Quality Governance (`/data-quality`)**: Audit trail of detected workbooks, regional additions log, normalization log, and unmapped lab check.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **Database**: SQLite with FTS5 Full Text Search (`better-sqlite3`)
- **Data Ingestion**: Python (`openpyxl`, `pandas`)
