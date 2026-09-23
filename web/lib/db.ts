import Database from 'better-sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'archroma.db');
let dbInstance: Database.Database | null = null;

function getDb(): Database.Database {
  if (!dbInstance) {
    dbInstance = new Database(dbPath, { readonly: true });
  }
  return dbInstance;
}

export interface SourceProvenance {
  source_file: string;
  source_sheet: string;
  source_row: number;
  source_indicator: string;
  source_color?: string;
  change_type?: string;
}

export interface CapabilityRecord {
  capability_id: string;
  capability_name: string;
  normalized_name: string;
  category: string;
  subcategory?: string;
  material?: string;
  method?: string;
  standard?: string;
  regulation?: string;
  end_use?: string;
  lab_id: string;
  lab_name: string;
  lab_type: string;
  country: string;
  region: string;
  city?: string;
  availability_status: string;
  source_indicator?: string;
  source_file: string;
  source_sheet: string;
  source_row: number;
  source_color?: string;
  change_type?: string;
  all_sources?: SourceProvenance[];
  source_count?: number;
}

export interface LabMasterRecord {
  lab_id: string;
  lab_name: string;
  lab_type: string;
  city: string;
  country: string;
  region: string;
  is_active: number;
  notes?: string;
  capability_count?: number;
}

export interface SearchOptions {
  query?: string;
  country?: string;
  region?: string;
  labId?: string;
  labType?: string;
  category?: string;
  availability?: string;
  limit?: number;
  offset?: number;
}

function sanitizeFtsQuery(q: string): string {
  const clean = q.replace(/[^a-zA-Z0-9\s]/g, ' ').trim();
  if (!clean) return '';
  const tokens = clean.split(/\s+/).filter(t => t.length > 0);
  if (tokens.length === 0) return '';
  return tokens.map(t => `"${t}"*`).join(' AND ');
}

export function searchCapabilities(options: SearchOptions = {}) {
  const db = getDb();
  const { query, country, region, labId, labType, category, availability, limit = 200, offset = 0 } = options;

  let ftsJoin = '';
  const whereClauses: string[] = [];
  const params: any[] = [];

  if (query && query.trim()) {
    const ftsTerm = sanitizeFtsQuery(query.trim());
    if (ftsTerm) {
      ftsJoin = ` JOIN capabilities_fts fts ON c.capability_id = fts.capability_id `;
      whereClauses.push(`capabilities_fts MATCH ?`);
      params.push(ftsTerm);
    } else {
      whereClauses.push(`(
        c.capability_name LIKE ? OR 
        c.normalized_name LIKE ? OR 
        c.standard LIKE ? OR 
        c.method LIKE ? OR 
        c.category LIKE ? OR 
        c.subcategory LIKE ? OR 
        c.end_use LIKE ?
      )`);
      const lq = `%${query.trim()}%`;
      params.push(lq, lq, lq, lq, lq, lq, lq);
    }
  }

  if (country && country !== 'all') {
    whereClauses.push(`c.country = ?`);
    params.push(country);
  }

  if (region && region !== 'all') {
    whereClauses.push(`c.region = ?`);
    params.push(region);
  }

  if (labId && labId !== 'all') {
    whereClauses.push(`c.lab_id = ?`);
    params.push(labId);
  }

  if (labType && labType !== 'all') {
    whereClauses.push(`c.lab_type = ?`);
    params.push(labType);
  }

  if (category && category !== 'all') {
    whereClauses.push(`c.category = ?`);
    params.push(category);
  }

  if (availability && availability !== 'all') {
    whereClauses.push(`c.availability_status = ?`);
    params.push(availability);
  }

  const whereSql = whereClauses.length > 0 ? ` WHERE ` + whereClauses.join(' AND ') : '';

  // DEDUPLICATED QUERY: Group by (normalized_name, category, lab_id)
  // We prioritize 'Master Baseline' or regional additions to represent the primary record
  const dedupSql = `
    SELECT 
      c.capability_id,
      c.capability_name,
      c.normalized_name,
      c.category,
      c.subcategory,
      c.material,
      c.method,
      c.standard,
      c.regulation,
      c.end_use,
      c.lab_id,
      c.lab_name,
      c.lab_type,
      c.country,
      c.region,
      c.city,
      c.availability_status,
      c.source_indicator,
      c.source_file,
      c.source_sheet,
      c.source_row,
      c.source_color,
      c.change_type,
      COUNT(DISTINCT c.source_file) as source_count,
      GROUP_CONCAT(c.source_file || '||' || c.source_sheet || '||' || c.source_row || '||' || c.source_indicator || '||' || COALESCE(c.source_color,'') || '||' || COALESCE(c.change_type,''), ';;') as raw_sources
    FROM capabilities c
    ${ftsJoin}
    ${whereSql}
    GROUP BY c.normalized_name, c.category, c.lab_id
    ORDER BY c.country ASC, c.lab_name ASC, c.normalized_name ASC
    LIMIT ? OFFSET ?
  `;

  const queryParams = [...params, limit, offset];
  const rawResults: any[] = db.prepare(dedupSql).all(...queryParams);

  const records: CapabilityRecord[] = rawResults.map((r) => {
    const sourcesList: SourceProvenance[] = [];
    if (r.raw_sources) {
      const entries = r.raw_sources.split(';;');
      const seen = new Set<string>();
      for (const entry of entries) {
        const parts = entry.split('||');
        if (parts.length >= 4) {
          const sfile = parts[0];
          const key = `${sfile}_${parts[1]}_${parts[2]}`;
          if (!seen.has(key)) {
            seen.add(key);
            sourcesList.push({
              source_file: sfile,
              source_sheet: parts[1],
              source_row: parseInt(parts[2], 10) || 0,
              source_indicator: parts[3],
              source_color: parts[4] || '',
              change_type: parts[5] || ''
            });
          }
        }
      }
    }

    return {
      capability_id: r.capability_id,
      capability_name: r.capability_name,
      normalized_name: r.normalized_name,
      category: r.category,
      subcategory: r.subcategory,
      material: r.material,
      method: r.method,
      standard: r.standard,
      regulation: r.regulation,
      end_use: r.end_use,
      lab_id: r.lab_id,
      lab_name: r.lab_name,
      lab_type: r.lab_type,
      country: r.country,
      region: r.region,
      city: r.city,
      availability_status: r.availability_status,
      source_indicator: r.source_indicator,
      source_file: r.source_file,
      source_sheet: r.source_sheet,
      source_row: r.source_row,
      source_color: r.source_color,
      change_type: r.change_type,
      all_sources: sourcesList,
      source_count: sourcesList.length
    };
  });

  // Group by Country -> Lab -> Capabilities
  const grouped: Record<string, any> = {};
  for (const r of records) {
    if (!grouped[r.country]) {
      grouped[r.country] = {
        country: r.country,
        region: r.region,
        labs: {}
      };
    }
    const countryObj = grouped[r.country];
    if (!countryObj.labs[r.lab_id]) {
      countryObj.labs[r.lab_id] = {
        lab_id: r.lab_id,
        lab_name: r.lab_name,
        lab_type: r.lab_type,
        city: r.city,
        country: r.country,
        capabilities: []
      };
    }
    countryObj.labs[r.lab_id].capabilities.push(r);
  }

  const countryList = Object.values(grouped).map((c: any) => ({
    country: c.country,
    region: c.region,
    labs: Object.values(c.labs)
  }));

  // Deduplicated total count query
  const countSql = `
    SELECT COUNT(*) as total FROM (
      SELECT c.capability_id 
      FROM capabilities c
      ${ftsJoin}
      ${whereSql}
      GROUP BY c.normalized_name, c.category, c.lab_id
    )
  `;
  const totalRes = db.prepare(countSql).get(...params) as { total: number };

  return {
    total: totalRes ? totalRes.total : records.length,
    records,
    grouped: countryList
  };
}

export function getCapabilityById(id: string) {
  const db = getDb();
  const cap = db.prepare(`SELECT * FROM capabilities WHERE capability_id = ?`).get(id) as CapabilityRecord | undefined;
  if (!cap) return null;

  const labsSupporting = db.prepare(`
    SELECT * FROM capabilities 
    WHERE normalized_name = ? 
    GROUP BY lab_id, category
    ORDER BY country ASC, lab_name ASC
  `).all(cap.normalized_name) as CapabilityRecord[];

  const related = db.prepare(`
    SELECT DISTINCT capability_id, capability_name, normalized_name, category, standard, method 
    FROM capabilities 
    WHERE category = ? AND normalized_name != ? 
    GROUP BY normalized_name
    LIMIT 12
  `).all(cap.category, cap.normalized_name) as CapabilityRecord[];

  return {
    capability: cap,
    labsSupporting,
    related
  };
}

export function getLabs() {
  const db = getDb();
  const labs = db.prepare(`
    SELECT lm.*, COUNT(DISTINCT c.normalized_name || '_' || c.category) as capability_count 
    FROM lab_master lm 
    LEFT JOIN capabilities c ON lm.lab_id = c.lab_id 
    GROUP BY lm.lab_id 
    ORDER BY lm.country ASC, lm.lab_name ASC
  `).all() as LabMasterRecord[];
  return labs;
}

export function getLabById(labId: string) {
  const db = getDb();
  const lab = db.prepare(`SELECT * FROM lab_master WHERE lab_id = ?`).get(labId) as LabMasterRecord | undefined;
  if (!lab) return null;

  const capabilities = db.prepare(`
    SELECT * FROM capabilities 
    WHERE lab_id = ? 
    GROUP BY normalized_name, category
    ORDER BY category ASC, normalized_name ASC
  `).all(labId) as CapabilityRecord[];

  const categoryCounts = db.prepare(`
    SELECT category, COUNT(DISTINCT normalized_name) as count 
    FROM capabilities 
    WHERE lab_id = ? 
    GROUP BY category
  `).all(labId) as { category: string; count: number }[];

  const regionalAdditions = db.prepare(`
    SELECT * FROM capabilities 
    WHERE lab_id = ? AND change_type = 'Regional Addition'
    GROUP BY normalized_name
  `).all(labId) as CapabilityRecord[];

  return {
    lab,
    capabilities,
    categoryCounts,
    regionalAdditions
  };
}

export function getCountries() {
  const db = getDb();
  const countries = db.prepare(`
    SELECT country, region, COUNT(DISTINCT lab_id) as lab_count, COUNT(DISTINCT normalized_name || '_' || category) as capability_count 
    FROM capabilities 
    GROUP BY country 
    ORDER BY country ASC
  `).all() as { country: string; region: string; lab_count: number; capability_count: number }[];

  return countries;
}

export function getCountryByName(countryName: string) {
  const db = getDb();
  const decoded = decodeURIComponent(countryName);
  const labs = db.prepare(`
    SELECT lm.*, COUNT(DISTINCT c.normalized_name || '_' || c.category) as capability_count 
    FROM lab_master lm 
    LEFT JOIN capabilities c ON lm.lab_id = c.lab_id 
    WHERE lm.country = ? 
    GROUP BY lm.lab_id
  `).all(decoded) as LabMasterRecord[];

  const categoryBreakdown = db.prepare(`
    SELECT category, COUNT(DISTINCT normalized_name) as count 
    FROM capabilities 
    WHERE country = ? 
    GROUP BY category
  `).all(decoded) as { category: string; count: number }[];

  const capabilities = db.prepare(`
    SELECT * FROM capabilities 
    WHERE country = ? 
    GROUP BY normalized_name, category
    LIMIT 300
  `).all(decoded) as CapabilityRecord[];

  return {
    country: decoded,
    labs,
    categoryBreakdown,
    capabilities
  };
}

export function getCategories() {
  const db = getDb();
  const categories = db.prepare(`
    SELECT category, COUNT(DISTINCT normalized_name) as unique_capabilities, COUNT(DISTINCT normalized_name || '_' || lab_id) as total_records, COUNT(DISTINCT lab_id) as lab_count 
    FROM capabilities 
    GROUP BY category 
    ORDER BY category ASC
  `).all() as { category: string; unique_capabilities: number; total_records: number; lab_count: number }[];

  return categories;
}

export function getDashboardStats() {
  const db = getDb();

  const totalLabs = db.prepare(`SELECT COUNT(*) as count FROM lab_master`).get() as { count: number };
  const totalCountries = db.prepare(`SELECT COUNT(DISTINCT country) as count FROM lab_master`).get() as { count: number };
  const commercialLabs = db.prepare(`SELECT COUNT(*) as count FROM lab_master WHERE lab_type = 'Commercial Lab'`).get() as { count: number };
  const rtLabs = db.prepare(`SELECT COUNT(*) as count FROM lab_master WHERE lab_type = 'R&T Lab'`).get() as { count: number };
  const totalCapabilities = db.prepare(`SELECT COUNT(DISTINCT normalized_name) as count FROM capabilities`).get() as { count: number };
  const totalRecords = db.prepare(`SELECT COUNT(DISTINCT normalized_name || '_' || category || '_' || lab_id) as count FROM capabilities`).get() as { count: number };

  const labsByCountry = db.prepare(`
    SELECT country, COUNT(*) as count FROM lab_master GROUP BY country ORDER BY count DESC
  `).all();

  const capabilitiesByCategory = db.prepare(`
    SELECT category, COUNT(DISTINCT normalized_name) as count FROM capabilities GROUP BY category ORDER BY count DESC
  `).all();

  const capabilitiesByLab = db.prepare(`
    SELECT lab_name || ' (' || lab_type || ')' as lab_label, COUNT(DISTINCT normalized_name || '_' || category) as count 
    FROM capabilities 
    GROUP BY lab_id 
    ORDER BY count DESC LIMIT 10
  `).all();

  const coverageByCountry = db.prepare(`
    SELECT country, COUNT(DISTINCT normalized_name) as count 
    FROM capabilities 
    GROUP BY country 
    ORDER BY count DESC
  `).all();

  return {
    kpis: {
      totalLabs: totalLabs.count,
      totalCountries: totalCountries.count,
      commercialLabs: commercialLabs.count,
      rtLabs: rtLabs.count,
      totalCapabilities: totalCapabilities.count,
      totalRecords: totalRecords.count
    },
    charts: {
      labsByCountry,
      capabilitiesByCategory,
      capabilitiesByLab,
      coverageByCountry
    }
  };
}

export function getDataQualityReport() {
  const db = getDb();
  const summary = db.prepare(`
    SELECT log_type, COUNT(*) as count FROM data_quality_log GROUP BY log_type
  `).all() as { log_type: string; count: number }[];

  const logs = db.prepare(`
    SELECT * FROM data_quality_log ORDER BY log_id DESC LIMIT 100
  `).all();

  const labsAudit = db.prepare(`
    SELECT lm.lab_id, lm.lab_name, lm.lab_type, lm.country, lm.city, COUNT(DISTINCT c.normalized_name || '_' || c.category) as records_count 
    FROM lab_master lm 
    LEFT JOIN capabilities c ON lm.lab_id = c.lab_id 
    GROUP BY lm.lab_id 
    ORDER BY lm.country ASC, lm.lab_name ASC
  `).all();

  return {
    summary,
    logs,
    labsAudit
  };
}
