import fs from "fs";
import path from "path";
import readline from "readline";
import { prisma } from "../src/db.js";

async function ensureTableExists() {
  console.log("Ensuring MedicalCode table exists in PostgreSQL database...");
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "public"."MedicalCode" (
      "id" TEXT NOT NULL,
      "code" TEXT NOT NULL,
      "display" TEXT NOT NULL,
      "system" TEXT NOT NULL,
      "version" TEXT,
      "groupName" TEXT,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT "MedicalCode_pkey" PRIMARY KEY ("id")
    );
  `);

  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "MedicalCode_code_idx" ON "public"."MedicalCode"("code");
  `);
  await prisma.$executeRawUnsafe(`
    CREATE INDEX IF NOT EXISTS "MedicalCode_system_idx" ON "public"."MedicalCode"("system");
  `);
  console.log("Table MedicalCode confirmed ready.");
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

async function seedFile(filePath: string, systemName: string, mapping: { codeCol: number; displayCol: number; versionCol?: number; groupCol?: number }) {
  if (!fs.existsSync(filePath)) {
    console.log(`Skipping file (not found): ${filePath}`);
    return;
  }

  console.log(`Starting seed for: ${path.basename(filePath)} (${systemName})...`);

  const fileStream = fs.createReadStream(filePath, { encoding: "utf-8" });
  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let isHeader = true;
  let batch: Array<{
    code: string;
    display: string;
    system: string;
    version?: string;
    groupName?: string;
  }> = [];

  let count = 0;
  let currentGroup = "";

  for await (const line of rl) {
    if (!line.trim()) continue;

    if (isHeader) {
      isHeader = false;
      continue;
    }

    const cols = parseCSVLine(line);

    // Track group header lines in ICD-MM / ICD-PM
    if (cols.length >= 2 && cols[0] === "" && cols[1].startsWith("GROUP-")) {
      currentGroup = cols[2] || cols[1];
      continue;
    }

    const code = cols[mapping.codeCol];
    const display = cols[mapping.displayCol];
    const version = mapping.versionCol !== undefined ? cols[mapping.versionCol] : undefined;
    const groupName = mapping.groupCol !== undefined ? cols[mapping.groupCol] : currentGroup;

    if (code && display && code.toUpperCase() !== "CODE") {
      batch.push({
        code: code.slice(0, 50),
        display: display,
        system: systemName,
        version: version ? version.slice(0, 50) : undefined,
        groupName: groupName ? groupName.slice(0, 255) : undefined,
      });

      count++;

      if (batch.length >= 500) {
        await prisma.medicalCode.createMany({
          data: batch,
          skipDuplicates: true,
        });
        batch = [];
        process.stdout.write(`Inserted ${count} rows for ${systemName}...\r`);
      }
    }
  }

  if (batch.length > 0) {
    await prisma.medicalCode.createMany({
      data: batch,
      skipDuplicates: true,
    });
  }

  console.log(`\nCompleted ${systemName}: ${count} total records seeded.`);
}

async function main() {
  console.log("=========================================");
  console.log("NARASI ICD Medical Codes Database Seeder");
  console.log("=========================================");

  await ensureTableExists();

  const tempDir = path.resolve(process.cwd(), "temp");

  // 1. ICD-10 e-klaim
  await seedFile(
    path.join(tempDir, "[PUBLIC] ICD-10 e-klaim.xlsx - ICD10.csv"),
    "ICD10",
    { codeCol: 0, displayCol: 1, versionCol: 2 }
  );

  // 2. ICD-9CM e-klaim
  await seedFile(
    path.join(tempDir, "[PUBLIC] ICD-9CM e-klaim.xlsx - ICD9 CM.csv"),
    "ICD9CM",
    { codeCol: 0, displayCol: 1, versionCol: 2 }
  );

  // 3. Morphology ICD-O
  await seedFile(
    path.join(tempDir, "Morphology (ICD-O-3 2nd Revision) - Morphology ICD-O.csv"),
    "ICDO_MORPHOLOGY",
    { codeCol: 0, displayCol: 1, versionCol: 2 }
  );

  // 4. Topography ICD-O
  await seedFile(
    path.join(tempDir, "Topography (ICD-O) - Topography ICD-O.csv"),
    "ICDO_TOPOGRAPHY",
    { codeCol: 0, displayCol: 1, versionCol: 2 }
  );

  // 5. ICD-MM (Maternal Mortality)
  await seedFile(
    path.join(tempDir, "[PUBLIC] ICD-MM (Maternal Mortality) - ICD-MM [SHARE].csv"),
    "ICD_MM",
    { codeCol: 1, displayCol: 2, versionCol: 3 }
  );

  // 6. ICD-PM (Perinatal Mortality)
  await seedFile(
    path.join(tempDir, "[PUBLIC] ICD-PM (Perinatal Mortality) - ICD-10 PM SHARE.csv"),
    "ICD_PM",
    { codeCol: 0, displayCol: 1, versionCol: 2 }
  );

  console.log("=========================================");
  console.log("All ICD Medical Code datasets successfully seeded!");
  console.log("=========================================");
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
