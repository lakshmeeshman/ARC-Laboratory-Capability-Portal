# Archroma Lab Capability Finder

An internal enterprise web application designed to consolidate all Archroma laboratory capability Excel workbooks into a searchable, auditable interface.

Supports both **Standalone Web Application Mode** and **Microsoft SharePoint Integration Mode**.

It answers the core question:
> **"Can this test/capability be performed, and if yes, at which lab, location, and country?"**

---

## 🚀 Quick Start — Standalone Mode

```bash
cd web
npm install
npm run dev
```
Open **`http://localhost:3000`** in your browser.

---

## 🏢 SharePoint Integration Modes

The application supports two SharePoint deployment paths without modifying the underlying dataset or breaking the standalone app:

### Path A — Hosted Web App via SharePoint Embed Web Part (5 Minutes)
1. Deploy Next.js `./web` app to your internal server / Azure App Service.
2. Add the SharePoint Embed Web Part to your SharePoint page:
   ```html
   <iframe src="https://lab-finder.archroma.internal/?embedded=true" width="100%" height="800px" frameborder="0"></iframe>
   ```
3. Passing `?embedded=true` automatically collapses the standalone sidebar and adapts the interface to fit SharePoint page containers cleanly.

### Path B — Native SharePoint Framework (SPFx) Web Part
1. Build the SPFx package in `./spfx`:
   ```bash
   cd spfx
   npm install
   gulp bundle --ship
   gulp package-solution --ship
   ```
2. Upload `spfx/sharepoint/solution/archroma-lab-capability-finder.sppkg` to your organization's **SharePoint Tenant App Catalog**.

For full administrator setup instructions, see **[SHAREPOINT_DEPLOYMENT.md](SHAREPOINT_DEPLOYMENT.md)**.

---

## 📁 Repository Structure

```
.
├── SHAREPOINT_DEPLOYMENT.md                       # Comprehensive SharePoint Deployment Guide
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
├── spfx/                                         # SharePoint Framework (SPFx v1.18+) Web Part Package
│   ├── config/package-solution.json              # Solution package settings (.sppkg)
│   └── src/webparts/labCapabilityFinder/         # SPFx React component & manifest
└── web/                                          # Next.js 16 Web Application
    ├── app/                                      # App Router screens & API routes (with CORS & ?embedded=true)
    ├── components/                               # UI & Provenance Modal components
    ├── lib/
    │   ├── db.ts                                 # SQLite database & FTS5 search access layer
    │   └── auth.ts                               # Microsoft Entra ID token validation module
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

---

## 🛠️ Tech Stack & Governance

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Recharts
- **SharePoint Component**: SPFx v1.18.2, React 18, TypeScript, Fluent UI
- **Database**: SQLite with FTS5 Full Text Search (`better-sqlite3`)
- **Authentication**: Microsoft Entra ID (Azure AD) JWT Bearer token validation
- **Data Ingestion**: Python (`openpyxl`, `pandas`)
