import fs from "fs";
import path from "path";

export type MedicalCodeItem = {
  code: string;
  display: string;
  system: "ICD10" | "ICD9CM" | "ICDO_MORPHOLOGY" | "ICDO_TOPOGRAPHY" | "ICD_MM" | "ICD_PM";
  version?: string;
};

let cachedCodes: MedicalCodeItem[] | null = null;

function parseLine(line: string): string[] {
  const res: string[] = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      if (inQ && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQ = !inQ;
      }
    } else if (c === "," && !inQ) {
      res.push(cur.trim());
      cur = "";
    } else {
      cur += c;
    }
  }
  res.push(cur.trim());
  return res;
}

export function loadAllIcdDatasets(): MedicalCodeItem[] {
  if (cachedCodes) return cachedCodes;

  const tempDir = path.resolve(process.cwd(), "temp");
  const items: MedicalCodeItem[] = [];

  const files = [
    { name: "[PUBLIC] ICD-10 e-klaim.xlsx - ICD10.csv", system: "ICD10" as const, codeIdx: 0, displayIdx: 1 },
    { name: "[PUBLIC] ICD-9CM e-klaim.xlsx - ICD9 CM.csv", system: "ICD9CM" as const, codeIdx: 0, displayIdx: 1 },
    { name: "Morphology (ICD-O-3 2nd Revision) - Morphology ICD-O.csv", system: "ICDO_MORPHOLOGY" as const, codeIdx: 0, displayIdx: 1 },
    { name: "Topography (ICD-O) - Topography ICD-O.csv", system: "ICDO_TOPOGRAPHY" as const, codeIdx: 0, displayIdx: 1 },
    { name: "[PUBLIC] ICD-MM (Maternal Mortality) - ICD-MM [SHARE].csv", system: "ICD_MM" as const, codeIdx: 1, displayIdx: 2 },
    { name: "[PUBLIC] ICD-PM (Perinatal Mortality) - ICD-10 PM SHARE.csv", system: "ICD_PM" as const, codeIdx: 0, displayIdx: 1 },
  ];

  for (const f of files) {
    const fullPath = path.join(tempDir, f.name);
    if (!fs.existsSync(fullPath)) continue;

    const content = fs.readFileSync(fullPath, "utf-8");
    const lines = content.split(/\r?\n/);
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = parseLine(line);
      const code = cols[f.codeIdx];
      const display = cols[f.displayIdx];
      if (code && display && code.toUpperCase() !== "CODE") {
        items.push({
          code,
          display,
          system: f.system,
          version: cols[2] || undefined,
        });
      }
    }
  }

  cachedCodes = items;
  return items;
}

export function searchMedicalCodes(query: string, limit = 20): MedicalCodeItem[] {
  const all = loadAllIcdDatasets();
  if (!query.trim()) return all.slice(0, limit);
  const q = query.toLowerCase();
  return all
    .filter((item) => item.code.toLowerCase().includes(q) || item.display.toLowerCase().includes(q))
    .slice(0, limit);
}
