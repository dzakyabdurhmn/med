import type { Color, PDFDocument, PDFFont, PDFImage, PDFPage } from "pdf-lib";
import type { MedicalFormData, MedicationItem } from "../components/medical/MedicalHistoryFormDocument";

/**
 * Official hospital document generator (server-side PDF).
 * Builds a standalone A4 PDF from the raw form data — it never captures
 * or screenshots any part of the web UI. pdf-lib is imported lazily so it
 * never ships to the browser bundle.
 */

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;

const INK = { r: 0.098, g: 0.098, b: 0.094 } as const; // #191918
const GRAY = { r: 0.42, g: 0.42, b: 0.4 } as const; // #6A6A64
const SOFT = { r: 0.28, g: 0.28, b: 0.27 } as const; // #474744
const ROW_BG = { r: 0.953, g: 0.953, b: 0.906 } as const; // #F3F2E7
const BORDER = { r: 0.89, g: 0.888, b: 0.847 } as const; // #E3E2D8
const WHITE = { r: 1, g: 1, b: 1 } as const;
const GREEN = { r: 0.055, g: 0.478, b: 0.255 } as const; // #0E7A41

type RgbLike = { r: number; g: number; b: number };

function toColor(rgb: (red: number, green: number, blue: number) => Color, c: RgbLike): Color {
  return rgb(c.r, c.g, c.b);
}

const SEVERITY_LABELS: Record<MedicalFormData["severity"], string> = {
  CRITICAL: "KRITIS",
  SEVERE: "BERAT",
  MODERATE: "SEDANG",
  MILD: "RINGAN",
  NORMAL: "NORMAL",
};

const SEVERITY_COLOR: Record<MedicalFormData["severity"], RgbLike> = {
  CRITICAL: { r: 0.62, g: 0.11, b: 0.11 },
  SEVERE: { r: 0.83, g: 0.36, b: 0.05 },
  MODERATE: { r: 0.72, g: 0.55, b: 0.06 },
  MILD: { r: 0.2, g: 0.35, b: 0.6 },
  NORMAL: GREEN,
};

const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function sanitize(value: string): string {
  return String(value ?? "")
    .replace(/\u2014|\u2013/g, "-")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\u2192/g, ">")
    .replace(/[^\x20-\xFF\n\t]/g, "")
    .trim();
}

function formatDateId(input?: string): string {
  if (input && !/\d/.test(input)) return sanitize(input);
  const d = input ? new Date(input) : new Date();
  if (isNaN(d.getTime())) return sanitize(input || "-");
  return `${d.getDate()} ${INDONESIAN_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function capitalizeWords(value: string): string {
  return sanitize(value)
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

const KEY_LABELS: Record<string, string> = {
  acid_reflux: "Acid Reflux / GERD",
  anemia: "Anemia",
  anxiety: "Anxiety / Cemas",
  asthma: "Asma",
  cancer: "Kanker",
  congestive_heart_failure: "Gagal Jantung Kongestif",
  copd: "COPD / PPOK",
  depression: "Depresi",
  diabetes_type1: "Diabetes Melitus Tipe 1",
  diabetes_type2: "Diabetes Melitus Tipe 2",
  eating_disorder: "Gangguan Makan",
  heart_disease: "Penyakit Jantung",
  hepatitis: "Hepatitis",
  high_blood_pressure: "Hipertensi",
  high_cholesterol: "Dislipidemia",
  hiv_aids: "HIV/AIDS",
  kidney_disease: "Gagal Ginjal",
  liver_disease: "Penyakit Hati",
  osteoporosis: "Osteoporosis",
  seizures: "Epilepsi / Kejang",
  stroke: "Stroke / TIA",
  thyroid_disease: "Penyakit Tiroid",
  heart_surgery: "Operasi Jantung",
  cholecystectomy: "Kolesistektomi",
  appendectomy: "Apendektomi",
  c_section: "Operasi Caesar",
  hysterectomy: "Histerektomi",
  bladder: "Operasi Kandung Kemih",
  colonoscopy: "Kolonoskopi",
  egd: "EGD / Endoskopi",
  joint: "Operasi Sendi",
  ros_fatigue: "Fatigue / Lelah",
  ros_fever: "Demam",
  ros_weight: "Perubahan Berat Badan",
  ros_vision: "Gangguan Penglihatan",
  ros_hearing: "Gangguan Pendengaran",
  ros_throat: "Tenggorokan / Radang",
  ros_chest_pain: "Nyeri Dada",
  ros_palpitations: "Palpitasi / Berdebar",
  ros_swelling: "Bengkak / Edema",
  ros_sob: "Sesak Napas",
  ros_cough: "Batuk",
  ros_wheezing: "Mengi",
  ros_abdo_pain: "Nyeri Perut",
  ros_nausea: "Mual / Muntah",
  ros_diarrhea: "Diare",
  ros_incontinence: "Inkontinensia",
  ros_burning: "Perih Kencing",
  ros_hematuria: "Darah dalam Urine",
};

function labelForKey(key: string): string {
  return KEY_LABELS[key] || capitalizeWords(key);
}

function checkedLabels(record: Record<string, boolean> | undefined, max = 12): string[] {
  if (!record) return [];
  const keys = Object.keys(record).filter((k) => record[k]);
  return keys.slice(0, max).map(labelForKey);
}

function wrapText(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const clean = sanitize(text);
  if (!clean) return [""];
  const lines: string[] = [];
  for (const paragraph of clean.split("\n")) {
    const words = paragraph.split(" ").filter((w) => w.length > 0);
    if (words.length === 0) {
      lines.push("");
      continue;
    }
    let current = "";
    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (font.widthOfTextAtSize(candidate, size) <= maxWidth) {
        current = candidate;
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

type Row = { label: string; value: string };

interface PdfBuilder {
  doc: PDFDocument;
  fonts: Record<"reg" | "bold" | "italic" | "boldItalic", PDFFont>;
  page: PDFPage;
  y: number;
  rgb: (red: number, green: number, blue: number) => Color;
  color: (c: RgbLike) => Color;
}

async function createBuilder(): Promise<PdfBuilder> {
  const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
  const doc = await PDFDocument.create();
  const reg = await doc.embedStandardFont(StandardFonts.TimesRoman);
  const bold = await doc.embedStandardFont(StandardFonts.TimesRomanBold);
  const italic = await doc.embedStandardFont(StandardFonts.TimesRomanItalic);
  const boldItalic = await doc.embedStandardFont(StandardFonts.TimesRomanBoldItalic);
  return {
    doc,
    fonts: { reg, bold, italic, boldItalic },
    page: doc.addPage([PAGE_W, PAGE_H]),
    y: PAGE_H - MARGIN,
    rgb,
    color: (c) => toColor(rgb, c),
  };
}

function ensureSpace(b: PdfBuilder, needed: number): void {
  if (b.y - needed < MARGIN) {
    b.page = b.doc.addPage([PAGE_W, PAGE_H]);
    b.y = PAGE_H - MARGIN;
  }
}

function line(b: PdfBuilder, x1: number, y: number, x2: number, color: RgbLike = INK, thickness = 1): void {
  b.page.drawLine({ start: { x: x1, y }, end: { x: x2, y }, thickness, color: b.color(color) });
}

function drawText(
  b: PdfBuilder,
  textValue: string,
  x: number,
  y: number,
  font: PDFFont,
  size: number,
  color: RgbLike = INK
): void {
  b.page.drawText(sanitize(textValue), { x, y, size, font, color: b.color(color) });
}

function centeredText(
  b: PdfBuilder,
  textValue: string,
  y: number,
  font: PDFFont,
  size: number,
  color: RgbLike = INK
): void {
  const width = font.widthOfTextAtSize(sanitize(textValue), size);
  drawText(b, textValue, (PAGE_W - width) / 2, y, font, size, color);
}

function rightText(
  b: PdfBuilder,
  textValue: string,
  y: number,
  font: PDFFont,
  size: number,
  color: RgbLike = INK
): void {
  const width = font.widthOfTextAtSize(sanitize(textValue), size);
  drawText(b, textValue, PAGE_W - MARGIN - width, y, font, size, color);
}

function fillRect(b: PdfBuilder, x: number, y: number, w: number, h: number, color: RgbLike): void {
  b.page.drawRectangle({ x, y, width: w, height: h, color: b.color(color) });
}

function sectionHeader(b: PdfBuilder, title: string): void {
  ensureSpace(b, 24);
  b.y -= 8;
  fillRect(b, MARGIN, b.y - 16, CONTENT_W, 18, INK);
  drawText(b, title, MARGIN + 8, b.y - 11, b.fonts.bold, 9.5, WHITE);
  b.y -= 24;
}

function paragraphBlock(b: PdfBuilder, label: string, value: string): void {
  const lines = wrapText(value, b.fonts.reg, 9.5, CONTENT_W - 16);
  const height = 16 + lines.length * 12.5;
  ensureSpace(b, height);
  const top = b.y;
  b.y -= 6;
  drawText(b, label, MARGIN + 6, b.y, b.fonts.bold, 9, GRAY);
  b.y -= 15;
  for (const ln of lines) {
    drawText(b, ln, MARGIN + 6, b.y, b.fonts.reg, 9.5, SOFT);
    b.y -= 12.5;
  }
  b.y = top - height - 4;
}

function fieldTable(b: PdfBuilder, rows: Row[]): void {
  const labelW = 165;
  const valueW = CONTENT_W - labelW;
  const rowHeights = rows.map((r) => {
    const lines = wrapText(r.value, b.fonts.reg, 9.5, valueW - 12);
    return Math.max(17, 10 + lines.length * 12.5);
  });
  const total = rowHeights.reduce((a, c) => a + c, 0);
  ensureSpace(b, total + 2);
  const startY = b.y;
  let cy = startY;
  rows.forEach((r, i) => {
    const h = rowHeights[i];
    if (i % 2 === 1) {
      fillRect(b, MARGIN, cy - h, CONTENT_W, h, ROW_BG);
    }
    b.page.drawRectangle({ x: MARGIN, y: cy - h, width: CONTENT_W, height: h, borderColor: b.color(BORDER), borderWidth: 0.75 });
    const topPad = (h - 10) / 2;
    drawText(b, r.label, MARGIN + 6, cy - topPad - 9, b.fonts.bold, 9, INK);
    const vLines = wrapText(r.value, b.fonts.reg, 9.5, valueW - 12);
    let vy = cy - topPad - 8;
    for (const ln of vLines) {
      drawText(b, ln, MARGIN + labelW + 6, vy, b.fonts.reg, 9.5, SOFT);
      vy -= 12.5;
    }
    cy -= h;
  });
  b.y = cy - 4;
}

function severityBadge(b: PdfBuilder, severity: MedicalFormData["severity"]): void {
  const label = SEVERITY_LABELS[severity] || "NORMAL";
  const color = SEVERITY_COLOR[severity] || GREEN;
  const boxW = Math.max(64, b.fonts.bold.widthOfTextAtSize(label, 8.5) + 16);
  ensureSpace(b, 18);
  fillRect(b, MARGIN + CONTENT_W - boxW, b.y - 14, boxW, 14, color);
  centeredText(b, label, b.y - 10, b.fonts.bold, 8.5, WHITE);
  b.y -= 16;
}

function medTable(b: PdfBuilder, meds: MedicationItem[]): void {
  const cols = [
    { header: "Nama Obat", w: 118 },
    { header: "Dosis", w: 62 },
    { header: "Frekuensi", w: 80 },
    { header: "Indikasi / Tujuan", w: 118 },
    { header: "Catatan", w: 105 },
  ];
  const headerH = 16;
  const list = meds.length > 0 ? meds : [];
  const data = list.map((m) => [
    m.name || "-",
    m.dosage || "-",
    m.frequency || "-",
    m.purpose || "-",
    m.notes || "-",
  ]);
  const rowHeights = data.map((cells) => {
    let maxLines = 1;
    cells.forEach((c, i) => {
      maxLines = Math.max(maxLines, wrapText(c, b.fonts.reg, 8.5, cols[i].w - 8).length);
    });
    return Math.max(15, 8 + maxLines * 11.5);
  });
  const total = headerH + rowHeights.reduce((a, c) => a + c, 0);
  ensureSpace(b, total + 2);
  const startY = b.y;
  fillRect(b, MARGIN, startY - headerH, CONTENT_W, headerH, INK);
  let x = MARGIN;
  for (const c of cols) {
    drawText(b, c.header, x + 4, startY - 11, b.fonts.bold, 8.5, WHITE);
    x += c.w;
  }
  let cy = startY - headerH;
  data.forEach((cells, ri) => {
    const h = rowHeights[ri];
    if (ri % 2 === 1) {
      fillRect(b, MARGIN, cy - h, CONTENT_W, h, ROW_BG);
    }
    let cx = MARGIN;
    cells.forEach((cellText, ci) => {
      const lines = wrapText(cellText, b.fonts.reg, 8.5, cols[ci].w - 8);
      let vy = cy - 9;
      for (const ln of lines) {
        drawText(b, ln, cx + 4, vy, b.fonts.reg, 8.5, SOFT);
        vy -= 11.5;
      }
      cx += cols[ci].w;
    });
    cy -= h;
  });
  if (list.length === 0) {
    ensureSpace(b, 16);
    drawText(b, "Tidak ada obat aktif yang tercatat.", MARGIN + 6, cy - 12, b.fonts.italic, 9, GRAY);
    cy -= 16;
  }
  b.y = cy - 4;
}

async function signatureBlock(
  b: PdfBuilder,
  doctorName: string,
  doctorSip: string,
  doctorSpecialty: string,
  isSigned: boolean,
  signedAtTimestamp: string | null,
  signatureDataUrl: string | null,
  printDate: string
): Promise<void> {
  ensureSpace(b, 150);
  b.y -= 10;
  rightText(b, `Jakarta, ${printDate}`, b.y, b.fonts.bold, 10, INK);
  b.y -= 14;
  rightText(b, "Dokter Penanggung Jawab Pelayanan (DPJP)", b.y, b.fonts.bold, 9, INK);
  b.y -= 52;
  if (isSigned && signatureDataUrl && signatureDataUrl.startsWith("data:image/png")) {
    try {
      const base64 = signatureDataUrl.split(",")[1];
      const img: PDFImage = await b.doc.embedPng(base64);
      b.page.drawImage(img, { x: MARGIN + 172, y: b.y - 36, width: 96, height: 42 });
    } catch {
      /* ignore signature image errors */
    }
  }
  line(b, MARGIN + 165, b.y - 42, MARGIN + CONTENT_W - 8, INK, 1);
  drawText(b, doctorName || "dr. DPJP Spesialis", MARGIN + 168, b.y - 54, b.fonts.bold, 9.5, INK);
  drawText(b, doctorSpecialty || "-", MARGIN + 168, b.y - 66, b.fonts.reg, 9, SOFT);
  drawText(b, doctorSip || "-", MARGIN + 168, b.y - 78, b.fonts.reg, 9, SOFT);
  if (isSigned && signedAtTimestamp) {
    b.y -= 98;
    drawText(b, `DITANDATANGANI SECARA ELEKTRONIK: ${sanitize(signedAtTimestamp)}`, MARGIN + 168, b.y, b.fonts.bold, 8.5, GREEN);
  }
  b.y -= 14;
}

export async function buildOfficialReportPdf(input: {
  formData: MedicalFormData;
  isDoctorSigned: boolean;
  signedAtTimestamp: string | null;
  signatureDataUrl: string | null;
}): Promise<Uint8Array> {
  const { formData: d, isDoctorSigned, signedAtTimestamp, signatureDataUrl } = input;
  const b = await createBuilder();

  const reportNumber =
    d.insurancePolicyNumber || `RME-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`;
  const printDate = formatDateId();

  // ============ KOP SURAT ============
  line(b, MARGIN, b.y, PAGE_W - MARGIN, INK, 2);
  b.y -= 4;
  line(b, MARGIN, b.y, PAGE_W - MARGIN, INK, 0.5);
  b.y -= 18;
  centeredText(b, "KEMENTERIAN KESEHATAN REPUBLIK INDONESIA", b.y, b.fonts.bold, 7.5, GRAY);
  b.y -= 13;
  centeredText(b, "PUSKESMAS/KLINIK PRATAMA", b.y, b.fonts.bold, 18, INK);
  b.y -= 14;
  centeredText(b, " Pencatatan Konsultasi Rawat Jalan Berbasis AI", b.y, b.fonts.reg, 9, GRAY);
  b.y -= 12;
  centeredText(
    b,
    "Jl. Kesehatan Raya No. 88, Jakarta Selatan 12430  |  Telp: (021) 789-2026  |  info@medai-atelier.id",
    b.y,
    b.fonts.reg,
    8,
    GRAY
  );
  b.y -= 7;
  line(b, MARGIN, b.y, PAGE_W - MARGIN, INK, 0.5);
  b.y -= 2;
  line(b, MARGIN, b.y, PAGE_W - MARGIN, INK, 2);
  b.y -= 20;

  // ============ JUDUL DOKUMEN ============
  centeredText(b, "REKAM MEDIS ELEKTRONIK", b.y, b.fonts.bold, 13, INK);
  b.y -= 14;
  centeredText(b, "(ELECTRONIC HEALTH RECORD - EHR)", b.y, b.fonts.bold, 10, INK);
  b.y -= 12;
  centeredText(b, "LEMBAR EVALUASI KLINIS TERSTRUKTUR (SOAP)", b.y, b.fonts.reg, 9, SOFT);
  b.y -= 13;
  const numberBoxW = 200;
  b.page.drawRectangle({
    x: (PAGE_W - numberBoxW) / 2,
    y: b.y - 13,
    width: numberBoxW,
    height: 15,
    borderColor: b.color(INK),
    borderWidth: 1,
  });
  centeredText(b, `Nomor: ${reportNumber}`, b.y - 10, b.fonts.bold, 8.5, INK);
  b.y -= 34;

  // ============ META INFO ============
  const meta = [
    { label: "No. Rekam Medis", value: reportNumber },
    { label: "Tanggal Cetak", value: printDate },
    { label: "Status Dokumen", value: isDoctorSigned ? "SAH (DIVERIFIKASI DPJP)" : "DRAFT" },
    { label: "Sistem Rekam Medis", value: "SATUSEHAT FHIR - Kemenkes RI" },
  ];
  meta.forEach((m) => {
    ensureSpace(b, 14);
    drawText(b, m.label, MARGIN, b.y, b.fonts.bold, 8.5, GRAY);
    drawText(b, `: ${m.value}`, MARGIN + 130, b.y, b.fonts.reg, 9, INK);
    b.y -= 13;
  });
  b.y -= 10;
  line(b, MARGIN, b.y, PAGE_W - MARGIN, INK, 0.5);
  b.y -= 14;

  // ============ A. IDENTITAS PASIEN ============
  sectionHeader(b, "A. IDENTITAS & INFORMASI PASIEN");
  fieldTable(b, [
    { label: "Nama Pasien", value: d.patientName || "-" },
    {
      label: "Jenis Kelamin",
      value: d.patientGender === "F" ? "Perempuan" : d.patientGender === "M" ? "Laki-laki" : "Lainnya",
    },
    { label: "Tanggal Lahir", value: formatDateId(d.patientDob) },
    { label: "No. Telp / HP", value: d.patientPhone || "-" },
    { label: "Alamat", value: d.patientAddress || "-" },
    { label: "Penjamin / Asuransi", value: `${d.insuranceProvider || "-"} (${d.insurancePolicyNumber || "-"})` },
    {
      label: "Kontak Darurat",
      value: d.emergencyContactName
        ? `${d.emergencyContactName} (${d.emergencyContactRelationship || "-"}) - ${d.emergencyContactPhone || "-"}`
        : "-",
    },
  ]);
  b.y -= 8;

  // ============ B. TANDA VITAL ============
  sectionHeader(b, "B. TANDA-TANDA VITAL (VITAL SIGNS)");
  fieldTable(b, [
    { label: "Tekanan Darah", value: d.vitalSigns.bloodPressure || "-" },
    { label: "Nadi (Heart Rate)", value: d.vitalSigns.heartRate || "-" },
    { label: "Frekuensi Napas", value: d.vitalSigns.respiratoryRate || "-" },
    { label: "SpO2 (Sat. Oksigen)", value: d.vitalSigns.spo2 || "-" },
    { label: "Suhu Tubuh", value: d.vitalSigns.temperature || "-" },
  ]);
  b.y -= 8;

  // ============ C. DIAGNOSA ============
  sectionHeader(b, "C. DIAGNOSA MEDIS & EVALUASI KLINIS (PRIMARY ASSESSMENT)");
  fieldTable(b, [
    { label: "Diagnosa Klinis Utama", value: d.diagnosis || "Belum ditentukan" },
    { label: "Kode ICD-10", value: d.diagnosisIcd || "-" },
    { label: "Tingkat Keparahan", value: SEVERITY_LABELS[d.severity] || "NORMAL" },
  ]);
  severityBadge(b, d.severity || "NORMAL");
  b.y -= 8;

  // ============ D. ANAMNESIS ============
  sectionHeader(b, "D. ANAMNESIS & RINGKASAN KLINIS");
  paragraphBlock(b, "Ringkasan Anamnesis", d.patientSummary || d.rawNotes || "Belum ada catatan ringkasan anamnesis.");
  b.y -= 8;

  // ============ E. TERAPI OBAT ============
  sectionHeader(b, "E. RESEP & TERAPI OBAT AKTIF");
  medTable(b, d.medications || []);
  b.y -= 8;

  // ============ F. KONTEKS KLINIS ============
  sectionHeader(b, "F. RIWAYAT & KONTEKS KLINIS");
  const personal = checkedLabels(d.personalHistory);
  const family = checkedLabels(d.familyHistory);
  const surgeries = checkedLabels(d.surgeries);
  const ros = checkedLabels(d.reviewOfSystems);
  const social = [
    `Merokok/Tembakau: ${d.tobaccoUse || "-"}`,
    `Alkohol: ${d.alcoholUse || "-"}`,
    `Pekerjaan: ${d.occupation || "-"}`,
    `Tempat Tinggal: ${d.livingSituation || "-"}`,
  ].join("; ");
  fieldTable(b, [
    { label: "Alergi", value: d.allergies || "Tidak ada riwayat alergi obat / makanan yang diketahui." },
    { label: "Riwayat Penyakit Pribadi", value: personal.length ? personal.join(", ") : "Tidak ada indikasi" },
    { label: "Riwayat Penyakit Keluarga", value: family.length ? family.join(", ") : "Tidak ada indikasi" },
    { label: "Riwayat Operasi", value: surgeries.length ? surgeries.join(", ") : "Tidak ada" },
    { label: "Skrining Gejala Organ (ROS)", value: ros.length ? ros.join(", ") : "Tidak ada gejala teridentifikasi" },
    { label: "Riwayat Sosial", value: social },
    { label: "Catatan Medis Tambahan", value: d.otherMedicalIssues || "-" },
  ]);
  b.y -= 8;

  // ============ G. RENCANA TERAPI ============
  sectionHeader(b, "G. RENCANA TERAPI & REKOMENDASI DPJP");
  paragraphBlock(
    b,
    "Tata Laksana & Anjuran",
    d.recommendations || "Tatalaksana umum, edukasi gaya hidup sehat, dan evaluasi berkala."
  );
  b.y -= 8;

  // ============ SIGNATURE ============
  await signatureBlock(
    b,
    d.doctorName || "dr. DPJP Spesialis",
    d.doctorSip || "",
    d.doctorSpecialty || "",
    isDoctorSigned,
    signedAtTimestamp,
    signatureDataUrl,
    printDate
  );

  // ============ LEGAL FOOTER ============
  b.y -= 8;
  line(b, MARGIN, b.y, PAGE_W - MARGIN, INK, 2);
  b.y -= 13;
  drawText(b, "DOKUMEN REKAM MEDIS ELEKTRONIK RESMI", MARGIN, b.y, b.fonts.bold, 9, INK);
  b.y -= 12;
  drawText(
    b,
    "Dokumen ini merupakan Rekam Medis Elektronik (RME) yang sah dan telah diproses oleh sistem informasi sesuai ketentuan yang berlaku.",
    MARGIN,
    b.y,
    b.fonts.reg,
    8,
    GRAY
  );
  b.y -= 12;
  drawText(
    b,
    "Dasar Hukum: Permenkes RI No. 24 Tahun 2022 tentang Rekam Medis; UU No. 29 Tahun 2004 tentang Praktik Kedokteran; Standar SATUSEHAT FHIR R4.",
    MARGIN,
    b.y,
    b.fonts.reg,
    8,
    GRAY
  );

  const bytes = await b.doc.save();
  return bytes;
}

export function officialReportFileName(reportNumber: string): string {
  return `RekamMedis-EHR-${sanitize(reportNumber).replace(/[^A-Za-z0-9-]+/g, "_")}.pdf`;
}

export function buildReportResponse(pdfBytes: Uint8Array, reportNumber: string): Response {
  const copy = new Uint8Array(pdfBytes);
  return new Response(copy, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${officialReportFileName(reportNumber)}"`,
      "Cache-Control": "no-store",
    },
  });
}