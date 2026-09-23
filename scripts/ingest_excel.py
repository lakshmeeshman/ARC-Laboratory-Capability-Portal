import os
import openpyxl
import sqlite3
import json
import re

workspace_dir = "/Users/lucky/Desktop/LAB CAPABILTIES_Archroma"
web_data_dir = os.path.join(workspace_dir, "web", "data")
os.makedirs(web_data_dir, exist_ok=True)

db_path = os.path.join(web_data_dir, "archroma.db")
json_lab_master_path = os.path.join(web_data_dir, "lab_master.json")
json_quality_report_path = os.path.join(web_data_dir, "data_quality_report.json")

# 1. Configurable Lab Master Dictionary
LAB_MASTER_CONFIG = [
    {"lab_id": "liberec_commercial", "lab_name": "Liberec", "lab_type": "Commercial Lab", "city": "Liberec", "country": "Czech Republic", "region": "Europe", "notes": "Primary regional lab for Central/Eastern Europe with blue-highlighted added capabilities."},
    {"lab_id": "langweid_commercial", "lab_name": "Langweid", "lab_type": "Commercial Lab", "city": "Langweid", "country": "Germany", "region": "Europe", "notes": "Main textile testing lab in Germany."},
    {"lab_id": "panyu_commercial", "lab_name": "Panyu", "lab_type": "Commercial Lab", "city": "Panyu", "country": "China", "region": "Asia Pacific", "notes": "Commercial customer support lab in Southern China."},
    {"lab_id": "shanghai_commercial", "lab_name": "Shanghai", "lab_type": "Commercial Lab", "city": "Shanghai", "country": "China", "region": "Asia Pacific", "notes": "Commercial lab in Shanghai, China."},
    {"lab_id": "bangpoo_commercial", "lab_name": "Bangpoo", "lab_type": "Commercial Lab", "city": "Bangpoo", "country": "Thailand", "region": "Asia Pacific", "notes": "Commercial lab servicing South East Asia."},
    {"lab_id": "taipei_commercial", "lab_name": "Taipei", "lab_type": "Commercial Lab", "city": "Taipei", "country": "Taiwan", "region": "Asia Pacific", "notes": "Commercial lab in Taiwan."},
    {"lab_id": "mumbai_commercial", "lab_name": "Mumbai", "lab_type": "Commercial Lab", "city": "Mumbai", "country": "India", "region": "Asia Pacific", "notes": "Commercial lab servicing Indian subcontinent."},
    {"lab_id": "charlotte_commercial", "lab_name": "Charlotte", "lab_type": "Commercial Lab", "city": "Charlotte", "country": "USA", "region": "North America", "notes": "Commercial lab in USA with AATCC capabilities."},
    {"lab_id": "santa_clara_commercial", "lab_name": "Santa Clara", "lab_type": "Commercial Lab", "city": "Santa Clara", "country": "Mexico", "region": "Latin America", "notes": "Commercial lab in Mexico."},
    {"lab_id": "fraijanes_commercial", "lab_name": "Fraijanes", "lab_type": "Commercial Lab", "city": "Fraijanes", "country": "Guatemala", "region": "Latin America", "notes": "Commercial lab in Guatemala."},
    {"lab_id": "san_pedro_sula_commercial", "lab_name": "San Pedro Sula", "lab_type": "Commercial Lab", "city": "San Pedro Sula", "country": "Honduras", "region": "Latin America", "notes": "Commercial lab in Honduras."},
    {"lab_id": "resende_commercial", "lab_name": "Resede", "lab_type": "Commercial Lab", "city": "Resende", "country": "Brazil", "region": "Latin America", "notes": "Commercial lab in Brazil."},
    {"lab_id": "bogota_commercial", "lab_name": "Bogota", "lab_type": "Commercial Lab", "city": "Bogota", "country": "Colombia", "region": "Latin America", "notes": "Commercial lab in Colombia."},
    {"lab_id": "castellbisbal_commercial", "lab_name": "Castelbisball", "lab_type": "Commercial Lab", "city": "Castellbisbal", "country": "Spain", "region": "Europe", "notes": "Commercial lab & specialized printing hub in Spain."},
    {"lab_id": "gebze_commercial", "lab_name": "Gebze", "lab_type": "Commercial Lab", "city": "Gebze", "country": "Turkey", "region": "Europe", "notes": "Commercial lab in Turkey."},
    {"lab_id": "karachi_commercial", "lab_name": "Karachi", "lab_type": "Commercial Lab", "city": "Karachi", "country": "Pakistan", "region": "Asia Pacific", "notes": "Commercial lab in Pakistan."},
    {"lab_id": "lima_commercial", "lab_name": "Lima", "lab_type": "Commercial Lab", "city": "Lima", "country": "Peru", "region": "Latin America", "notes": "Commercial lab in Peru."},
    # R&T Labs
    {"lab_id": "panyu_rt", "lab_name": "Panyu", "lab_type": "R&T Lab", "city": "Panyu", "country": "China", "region": "Asia Pacific", "notes": "Research & Technology innovation center in Panyu."},
    {"lab_id": "mumbai_rt", "lab_name": "Mumbai", "lab_type": "R&T Lab", "city": "Mumbai", "country": "India", "region": "Asia Pacific", "notes": "Research & Technology center in Mumbai."},
    {"lab_id": "langweid_rt", "lab_name": "Langweid", "lab_type": "R&T Lab", "city": "Langweid", "country": "Germany", "region": "Europe", "notes": "Research & Technology development center in Langweid."},
    {"lab_id": "castellbisbal_rt", "lab_name": "Castelbisball", "lab_type": "R&T Lab", "city": "Castellbisbal", "country": "Spain", "region": "Europe", "notes": "Global Printing R&T Competence Center."},
    {"lab_id": "lamotte_rt", "lab_name": "Lamotte", "lab_type": "R&T Lab", "city": "Lamotte", "country": "France", "region": "Europe", "notes": "Research & Technology lab in Lamotte, France."},
    {"lab_id": "gendorf_rt", "lab_name": "Gendorf", "lab_type": "R&T Lab", "city": "Gendorf", "country": "Germany", "region": "Europe", "notes": "Fluorochemical & Finishing R&T center in Gendorf."},
    {"lab_id": "charlotte_rt", "lab_name": "Charlotte", "lab_type": "R&T Lab", "city": "Charlotte", "country": "USA", "region": "North America", "notes": "R&T Center in USA."},
    {"lab_id": "resende_rt", "lab_name": "Resede", "lab_type": "R&T Lab", "city": "Resende", "country": "Brazil", "region": "Latin America", "notes": "R&T Center in Brazil."},
    {"lab_id": "bogota_rt", "lab_name": "Bogota", "lab_type": "R&T Lab", "city": "Bogota", "country": "Colombia", "region": "Latin America", "notes": "R&T Center in Colombia."}
]

# Write lab_master.json
with open(json_lab_master_path, "w", encoding="utf-8") as f:
    json.dump(LAB_MASTER_CONFIG, f, indent=2)

print(f"Saved lab master configuration to {json_lab_master_path}")

# Build map for fast lookup: (lab_name_clean, lab_type) -> lab object
LAB_LOOKUP = {}
for item in LAB_MASTER_CONFIG:
    key = (item["lab_name"].strip().lower(), item["lab_type"].strip().lower())
    LAB_LOOKUP[key] = item

excel_files = [
    "Lab capabilities Archroma 2026_Sep.xlsx",
    "Lab capabilities Archroma 2026 Liberec.xlsx",
    "Lab capabilities Archroma 2026 Printing Lab Castellbisbal.xlsx",
    "Lab capabilities Archroma 2026 USA.xlsx",
    "Lab capabilities Archroma 2026  Pakistan.xlsx",
    "Lab capabilities Archroma 2026 Bangpoo.xlsx",
    "Lab capabilities Archroma 2026 Langweid.xlsx",
    "Lab capabilities Archroma 2026 South Americas.xlsx",
    "Lab capabilities Archroma 2026 Turkey.xlsx",
    "Lab capabilities Archroma 2026.xlsx"
]

# Re-create database
if os.path.exists(db_path):
    os.remove(db_path)

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.executescript("""
CREATE TABLE lab_master (
    lab_id TEXT PRIMARY KEY,
    lab_name TEXT NOT NULL,
    lab_type TEXT NOT NULL,
    city TEXT,
    country TEXT,
    region TEXT,
    is_active INTEGER DEFAULT 1,
    notes TEXT
);

CREATE TABLE capabilities (
    capability_id TEXT PRIMARY KEY,
    capability_name TEXT NOT NULL,
    normalized_name TEXT NOT NULL,
    category TEXT NOT NULL,
    subcategory TEXT,
    material TEXT,
    method TEXT,
    standard TEXT,
    regulation TEXT,
    end_use TEXT,
    lab_id TEXT NOT NULL,
    lab_name TEXT NOT NULL,
    lab_type TEXT NOT NULL,
    country TEXT NOT NULL,
    region TEXT NOT NULL,
    city TEXT,
    availability_status TEXT NOT NULL,
    source_indicator TEXT,
    source_file TEXT NOT NULL,
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL,
    source_color TEXT,
    change_type TEXT,
    FOREIGN KEY(lab_id) REFERENCES lab_master(lab_id)
);

CREATE VIRTUAL TABLE capabilities_fts USING fts5(
    capability_id UNINDEXED,
    capability_name,
    normalized_name,
    category,
    subcategory,
    material,
    method,
    standard,
    regulation,
    end_use,
    lab_name,
    country,
    source_file
);

CREATE TABLE data_quality_log (
    log_id INTEGER PRIMARY KEY AUTOINCREMENT,
    log_type TEXT NOT NULL,
    source_file TEXT NOT NULL,
    source_sheet TEXT NOT NULL,
    source_row INTEGER NOT NULL,
    description TEXT NOT NULL
);
""")

# Populate lab_master table
for item in LAB_MASTER_CONFIG:
    cursor.execute("""
        INSERT INTO lab_master (lab_id, lab_name, lab_type, city, country, region, is_active, notes)
        VALUES (?, ?, ?, ?, ?, ?, 1, ?)
    """, (item["lab_id"], item["lab_name"], item["lab_type"], item["city"], item["country"], item["region"], item["notes"]))

quality_logs = []
extracted_count = 0
unique_keys_seen = set()

for fn in excel_files:
    fp = os.path.join(workspace_dir, fn)
    wb = openpyxl.load_workbook(fp, data_only=True)
    wb_font = openpyxl.load_workbook(fp, data_only=False)
    
    is_master = (fn == "Lab capabilities Archroma 2026_Sep.xlsx")
    
    for sname in wb.sheetnames:
        ws = wb[sname]
        ws_f = wb_font[sname]
        rows = list(ws.iter_rows(values_only=True))
        if len(rows) < 3: continue
        
        r1 = rows[0]
        r2 = rows[1]
        
        # Determine lab columns for this sheet
        lab_cols = []
        curr_type = "Commercial Lab"
        for c_idx in range(len(r2)):
            if c_idx < len(r1) and r1[c_idx]:
                h_val = str(r1[c_idx]).strip().upper()
                if "COMMERCIAL" in h_val:
                    curr_type = "Commercial Lab"
                elif "R&T" in h_val or "R & T" in h_val:
                    curr_type = "R&T Lab"
            
            lname = str(r2[c_idx]).strip() if r2[c_idx] else ""
            if lname and lname not in ["ID", "Method", "Norm", "Standard", "Regulation", "Specification", "End use", "Type of test", "Test"]:
                lab_cols.append({
                    "col_idx": c_idx,
                    "lab_name": lname,
                    "lab_type": curr_type
                })
                
        last_group_header = ""
        
        for r_idx in range(2, len(rows)):
            row = rows[r_idx]
            if not any(c is not None for c in row): continue
            
            c0 = str(row[0]).strip() if len(row) > 0 and row[0] is not None else ""
            c1 = str(row[1]).strip() if len(row) > 1 and row[1] is not None else ""
            c2 = str(row[2]).strip() if len(row) > 2 and row[2] is not None else ""
            c3 = str(row[3]).strip() if len(row) > 3 and row[3] is not None else ""
            
            # Subcategory group header detection
            if c0 and not c1 and not c2 and not c3 and not any(row[lc['col_idx']] for lc in lab_cols if lc['col_idx'] < len(row)):
                last_group_header = c0
                continue
                
            cap_name = ""
            method = ""
            standard = ""
            regulation = ""
            end_use = ""
            material = ""
            subcategory = last_group_header
            
            if sname in ["Pretreatment & Sizing", "Dyeing & Auxiliaries", "Printing", "Finishing & Coating"]:
                cap_name = c0
                if last_group_header and last_group_header != c0:
                    subcategory = last_group_header
            elif sname == "Mechanical technological testin":
                cap_name = c0
                standard = c1
            elif sname == "Fastness testing":
                cap_name = c1
                standard = c2
            elif sname == "Analytical":
                cap_name = c1
                regulation = c2
                standard = c3
            elif sname == "FR tests":
                cap_name = c0
                end_use = c1
                method = c2
                
            if not cap_name or cap_name in ["ID", "Method", "Norm", "Standard", "Regulation", "Specification"]:
                continue
                
            # Naming normalization logic
            norm_name = cap_name
            if "Pad Humidifix" in cap_name:
                norm_name = cap_name.replace("Pad Humidifix", "Pad Humidity Fix")
                quality_logs.append({"log_type": "Naming Normalization", "source_file": fn, "source_sheet": sname, "source_row": r_idx+1, "description": f"Normalized '{cap_name}' to '{norm_name}'"})
            elif cap_name == "Pad Thermosol (reactive, disperse, pigments)":
                norm_name = "Pad Thermofix (reactive) / Pad Thermosol (disperse) / Pad Fix (pigments)"
                quality_logs.append({"log_type": "Naming Normalization", "source_file": fn, "source_sheet": sname, "source_row": r_idx+1, "description": "Expanded Pad Thermosol variants into Pad Thermofix / Pad Thermosol / Pad Fix"})
            elif "Tendering (DIN 54281)" in cap_name:
                norm_name = "Tendering (DIN 54281)"
                quality_logs.append({"log_type": "Regional Addition", "source_file": fn, "source_sheet": sname, "source_row": r_idx+1, "description": "Liberec clarification preserved: Tendering (DIN 54281)"})
                
            # Material detection heuristic
            if "cellulose" in cap_name.lower():
                material = "Cellulose"
            elif "polyester" in cap_name.lower():
                material = "Polyester"
            elif "polyamide" in cap_name.lower():
                material = "Polyamide"
            elif "wool" in cap_name.lower():
                material = "Wool"
                
            # Font/Fill color audit
            row_color = ""
            for col_i in range(min(4, len(row))):
                cell_font = ws_f.cell(row=r_idx+1, column=col_i+1)
                if cell_font.font and cell_font.font.color:
                    c_rgb = str(cell_font.font.color.rgb or cell_font.font.color.theme)
                    if c_rgb in ['FF0000FF', '0000FF', 'FF002060', '002060', 'FF0070C0']:
                        row_color = "Blue (Regional addition)"
                        quality_logs.append({"log_type": "Regional Addition", "source_file": fn, "source_sheet": sname, "source_row": r_idx+1, "description": f"Blue font marked test detected: '{cap_name}'"})
                        break
                        
            change_type = "Master Baseline" if is_master else ("Regional Addition" if row_color else "Regional Supplement")
            
            # Iterate lab availability columns
            for lc in lab_cols:
                col_i = lc["col_idx"]
                if col_i >= len(row): continue
                raw_val = row[col_i]
                if raw_val is None: continue
                val_str = str(raw_val).strip()
                if not val_str: continue
                
                # Availability status mapping
                if val_str == "X":
                    status = "Available"
                elif val_str == "(X)":
                    status = "Conditional / Special"
                elif val_str == "O":
                    status = "Planned / Optional"
                else:
                    status = f"Source indicator: {val_str}"
                    
                lab_key = (lc["lab_name"].strip().lower(), lc["lab_type"].strip().lower())
                lab_obj = LAB_LOOKUP.get(lab_key)
                if not lab_obj:
                    # fallback lookup by name only
                    found = [v for k, v in LAB_LOOKUP.items() if k[0] == lab_key[0]]
                    if found:
                        lab_obj = found[0]
                    else:
                        lab_obj = {
                            "lab_id": f"{lc['lab_name'].lower().replace(' ', '_')}_{lc['lab_type'].lower().replace(' ', '_')}",
                            "lab_name": lc["lab_name"],
                            "lab_type": lc["lab_type"],
                            "country": "Country mapping requires validation",
                            "region": "Unknown",
                            "city": lc["lab_name"]
                        }
                        quality_logs.append({"log_type": "Unmapped Lab", "source_file": fn, "source_sheet": sname, "source_row": r_idx+1, "description": f"Unmapped lab instance: {lc['lab_name']} ({lc['lab_type']})"})
                        
                record_id = f"cap_{extracted_count+1}"
                
                # Deduplication key across files to handle updates gracefully
                unique_key = (norm_name.lower(), sname.lower(), lab_obj["lab_id"])
                
                if unique_key in unique_keys_seen and not is_master:
                    # Conflict / regional update
                    quality_logs.append({"log_type": "Conflict / Update", "source_file": fn, "source_sheet": sname, "source_row": r_idx+1, "description": f"Updated availability for '{norm_name}' at {lab_obj['lab_name']} ({lab_obj['lab_type']}) to '{status}' ({val_str})"})
                
                unique_keys_seen.add(unique_key)
                extracted_count += 1
                
                cursor.execute("""
                    INSERT INTO capabilities (
                        capability_id, capability_name, normalized_name, category, subcategory,
                        material, method, standard, regulation, end_use, lab_id, lab_name,
                        lab_type, country, region, city, availability_status, source_indicator,
                        source_file, source_sheet, source_row, source_color, change_type
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    record_id, cap_name, norm_name, sname, subcategory, material, method, standard,
                    regulation, end_use, lab_obj["lab_id"], lab_obj["lab_name"], lab_obj["lab_type"],
                    lab_obj["country"], lab_obj["region"], lab_obj["city"], status, val_str,
                    fn, sname, r_idx+1, row_color, change_type
                ))
                
                cursor.execute("""
                    INSERT INTO capabilities_fts (
                        capability_id, capability_name, normalized_name, category, subcategory,
                        material, method, standard, regulation, end_use, lab_name, country, source_file
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (
                    record_id, cap_name, norm_name, sname, subcategory, material, method, standard,
                    regulation, end_use, lab_obj["lab_name"], lab_obj["country"], fn
                ))

# Populate quality log table
for q in quality_logs:
    cursor.execute("""
        INSERT INTO data_quality_log (log_type, source_file, source_sheet, source_row, description)
        VALUES (?, ?, ?, ?, ?)
    """, (q["log_type"], q["source_file"], q["source_sheet"], q["source_row"], q["description"]))

conn.commit()

# Save JSON Quality Report
summary_report = {
    "total_records_ingested": extracted_count,
    "unique_capabilities": cursor.execute("SELECT COUNT(DISTINCT normalized_name) FROM capabilities").fetchone()[0],
    "total_labs": len(LAB_MASTER_CONFIG),
    "total_countries": cursor.execute("SELECT COUNT(DISTINCT country) FROM lab_master").fetchone()[0],
    "total_quality_logs": len(quality_logs),
    "logs_sample": quality_logs[:50]
}

with open(json_quality_report_path, "w", encoding="utf-8") as f:
    json.dump(summary_report, f, indent=2)

print(f"\nIngestion Complete! Ingested {extracted_count} capability records into {db_path}")
print(f"Total Unique Capabilities: {summary_report['unique_capabilities']}")
print(f"Data Quality Report saved to {json_quality_report_path}")

conn.close()
