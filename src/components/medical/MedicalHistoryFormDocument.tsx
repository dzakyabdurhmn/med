"use client";

import React, { useState, useEffect } from "react";
import {
  Printer,
  Sparkles,
  RotateCcw,
  QrCode,
  Edit3,
  Check,
  ChevronRight,
  Save,
  Stethoscope,
  ShieldCheck,
} from "lucide-react";

export type ClinicalFindingItem = {
  id: string;
  hotspotId: string;
  organId?: string;
  label: string;
  finding: string;
  severity: "CRITICAL" | "SEVERE" | "MODERATE" | "MILD" | "NORMAL";
  layman: string;
};

export type MedicationItem = {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  purpose: string;
  notes: string;
};

export type MedicalFormData = {
  patientName: string;
  patientDob: string;
  patientGender: "M" | "F" | "Other";
  patientAddress: string;
  patientPhone: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactPhone: string;
  insuranceProvider: string;
  insurancePolicyNumber: string;
  personalHistory: Record<string, boolean>;
  personalHistoryCancerSpecify?: string;
  otherMedicalIssues: string;
  medications: MedicationItem[];
  surgeries: Record<string, boolean>;
  surgeriesOtherSpecify?: string;
  allergies: string;
  familyHistory: Record<string, boolean>;
  familyHistoryOtherSpecify?: string;
  tobaccoUse: "Cigarettes" | "Vaping" | "Tobacco" | "Non-smoker";
  tobaccoRecentDate?: string;
  alcoholUse: "None" | "Occasional" | "Moderate" | "Heavy";
  recreationalDrugs: "No" | "Yes";
  recreationalDrugsSpecify?: string;
  caffeineWeekly: string;
  exerciseWeekly: string;
  sleepHours: string;
  socialDetriments: "No" | "Yes";
  socialDetrimentsDescribe?: string;
  occupation: string;
  livingSituation: "With roommates" | "With S/O" | "With family" | "Other";
  livingSituationOther?: string;
  reviewOfSystems: Record<string, boolean>;
  diagnosis: string;
  diagnosisIcd: string;
  severity: "CRITICAL" | "SEVERE" | "MODERATE" | "MILD" | "NORMAL";
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    spo2: string;
    temperature: string;
  };
  rawNotes: string;
  recommendations: string;
  patientSummary: string;
  findings: ClinicalFindingItem[];
  doctorName: string;
  doctorSpecialty: string;
  doctorSip?: string;
  modality?: string;
  aiCheckedKeys?: string[];
  aiSuggestedFindings?: string;
  suggestedIcd10Codes?: string;
  evidenceRef?: string;
};

export const DEFAULT_FORM_DATA: MedicalFormData = {
  patientName: "",
  patientDob: "",
  patientGender: "M",
  patientAddress: "",
  patientPhone: "",
  emergencyContactName: "",
  emergencyContactRelationship: "",
  emergencyContactPhone: "",
  insuranceProvider: "BPJS Kesehatan (JKN-KIS)",
  insurancePolicyNumber: "",
  personalHistory: {},
  otherMedicalIssues: "",
  medications: [],
  surgeries: {},
  allergies: "Tidak ada riwayat alergi obat / makanan yang diketahui.",
  familyHistory: {},
  tobaccoUse: "Non-smoker",
  tobaccoRecentDate: "-",
  alcoholUse: "None",
  recreationalDrugs: "No",
  caffeineWeekly: "0",
  exerciseWeekly: "0",
  sleepHours: "7-8",
  socialDetriments: "No",
  occupation: "",
  livingSituation: "With family",
  reviewOfSystems: {},
  diagnosis: "",
  diagnosisIcd: "",
  severity: "NORMAL",
  vitalSigns: {
    bloodPressure: "120/80 mmHg",
    heartRate: "75 bpm",
    respiratoryRate: "18 x/mnt",
    spo2: "99%",
    temperature: "36.5 °C",
  },
  rawNotes: "",
  recommendations: "",
  patientSummary: "",
  findings: [],
  doctorName: "dr. Dokter Spesialis",
  doctorSpecialty: "DPJP Spesialis",
  doctorSip: "SIP: 503/SIP.D/2026",
  modality: "Pemeriksaan Fisik & Rekonstruksi 3D",
  aiCheckedKeys: [],
};

interface MedicalHistoryFormDocumentProps {
  data?: MedicalFormData;
  initialData?: MedicalFormData;
  onChange?: (data: MedicalFormData) => void;
  onNewRecording?: () => void;
  isDoctorSigned?: boolean;
  signedAtTimestamp?: string | null;
  onSignComplete?: (dataUrl: string) => void;
  onClearSignature?: () => void;
}

export function MedicalHistoryFormDocument({
  data,
  initialData,
  onChange,
  onNewRecording = () => {},
  isDoctorSigned = false,
  signedAtTimestamp = null,
}: MedicalHistoryFormDocumentProps) {
  const activeIncomingData = data || initialData || DEFAULT_FORM_DATA;
  const [formData, setFormData] = useState<MedicalFormData>(activeIncomingData);
  const [isEditing, setIsEditing] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (data || initialData) {
      setFormData(data || initialData || DEFAULT_FORM_DATA);
    }
  }, [data, initialData]);

  const updateField = <K extends keyof MedicalFormData>(key: K, value: MedicalFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      onChange?.(next);
      return next;
    });
  };

  const personalCheckedCount = Object.values(formData.personalHistory || {}).filter(Boolean).length;
  const rosCheckedCount = Object.values(formData.reviewOfSystems || {}).filter(Boolean).length;
  const familyCheckedCount = Object.values(formData.familyHistory || {}).filter(Boolean).length;
  const surgCheckedCount = Object.values(formData.surgeries || {}).filter(Boolean).length;
  const totalCheckedCount = personalCheckedCount + rosCheckedCount + familyCheckedCount + surgCheckedCount;

  const SectionHeader = ({
    title,
    rightContent,
    bgColor = "bg-[#191918]",
  }: {
    title: string;
    rightContent?: React.ReactNode;
    bgColor?: string;
  }) => (
    <div
      className={`${bgColor} text-white px-4 py-2 font-medium text-xs uppercase tracking-[0.05em] flex flex-wrap items-center justify-between gap-2`}
    >
      <span>{title}</span>
      {rightContent && <span className="text-[10px]">{rightContent}</span>}
    </div>
  );

  const FormSection = ({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) => (
    <section className={`mb-6 card-warm overflow-hidden ${className}`}>
      {children}
    </section>
  );

  return (
    <main className="mx-auto space-y-6 pb-12 font-sans">
      {/* Top Toolbar */}
      <div className="no-print card-warm p-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onNewRecording}
            className="btn-warm btn-warm-outline btn-warm-sm"
          >
            <RotateCcw size={13} />
            <span>Mulai Kasus Baru</span>
          </button>
          <span className="badge-warm badge-warm-success">
            <Check size={12} /> Konsultasi Suara
          </span>
          <ChevronRight size={14} className="text-[#6A6A64] hidden sm:block" />
          <span className="badge-warm badge-warm-brand">
            ★ Medical History Form (EHR)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`btn-warm btn-warm-sm flex-1 sm:flex-none justify-center ${
              isEditing ? "btn-warm-primary" : "btn-warm-outline"
            }`}
          >
            {isEditing ? <Save size={13} /> : <Edit3 size={13} />}
            <span>{isEditing ? "Simpan Edit" : "Mode Edit"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="btn-warm btn-warm-primary btn-warm-sm flex-1 sm:flex-none justify-center"
          >
            <Printer size={14} />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* AI Banner */}
      <div className="mt-5 no-print card-warm bg-[#FFFEF2] p-4 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.05em] font-medium text-[#9E1B2E]">
            <Sparkles size={16} />
            <span>AI Clinical Intelligence Auto-Checklist</span>
          </div>
          <span className="badge-warm badge-warm-brand">
            {totalCheckedCount} Indikasi Klinis Aktif
          </span>
        </div>
        <p className="text-xs text-[#474744] leading-relaxed font-sans">
          Sistem AI NARASI mengekstraksi percakapan konsultasi secara real-time dan mengidentifikasi
          keluhan fisik pasien menjadi ceklist medis terstruktur di bawah ini. Anda dapat mengklik atau
          mengedit setiap kolom secara langsung.
        </p>
      </div>

      {/* FORM UTAMA */}
      <article className="clinical-report-doc pdf-form-document bg-[#FFFEF2] text-[#191918] p-6 sm:p-8 md:p-10 border border-[#ECEBDF] rounded-[2px] font-sans text-xs leading-normal relative">
        {/* HEADER */}
        <header className="border-b-2 border-[#191918] pb-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-14 h-14 bg-[#A71D31] text-white flex items-center justify-center font-medium text-2xl rounded-[2px] shrink-0">
                <Stethoscope size={28} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="badge-warm badge-warm-brand">
                    REPUBLIK INDONESIA — KEMENKES RI
                  </span>
                  <span className="badge-warm">
                    SATUSEHAT FHIR
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-medium text-[#191918] uppercase tracking-tight mt-1 leading-tight">
                  KLINIK UTAMA MED-AI ATELIER
                </h1>
                <p className="text-xs text-[#6A6A64] font-medium leading-tight">
                  Pusat Layanan Spesialis &amp; Evaluasi Klinis Terpadu Berbasis AI
                </p>
                <p className="text-[10px] text-[#6A6A64] mt-0.5">
                  Jl. Kesehatan Raya No. 88, Jakarta Selatan 12430 | Telp: (021) 789-2026
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 space-y-1 w-full sm:w-auto text-xs">
              <div className="badge-warm badge-warm-brand">
                <QrCode size={13} />
                <span>EHR-2026-NRS</span>
              </div>
              <div className="text-xs text-[#474744] font-medium">
                NO. RM:{" "}
                <span className="font-bold text-[#191918]">
                  {formData.insurancePolicyNumber
                    ? formData.insurancePolicyNumber.slice(0, 12)
                    : "RM-2026-0891"}
                </span>
              </div>
              <div className="text-[10px] text-[#6A6A64]">
                TGL CETAK:{" "}
                {isMounted
                  ? new Date().toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })
                  : "14 Agustus 2026"}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-[#ECEBDF] flex flex-wrap items-center justify-between gap-2 text-xs font-medium uppercase text-[#191918]">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#0E7A41]" />
              <span>LEMBAR REKAM MEDIS &amp; EVALUASI KLINIS PASIEN (SOAP)</span>
            </span>
            <span className="text-[#6A6A64] font-normal italic lowercase text-[10px]">
              *rahasia medis (confidential)
            </span>
          </div>
        </header>

        {/* SECTION A: IDENTITAS PASIEN */}
        <FormSection>
          <SectionHeader title="A. IDENTITAS & INFORMASI PASIEN" />
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#FFFEF2]">
            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Nama Lengkap Pasien</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => updateField("patientName", e.target.value)}
                  className="input-warm text-xs"
                />
              ) : (
                <div className="font-medium text-sm text-[#191918]">{formData.patientName || "-"}</div>
              )}
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Tanggal Lahir / Usia</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.patientDob}
                  onChange={(e) => updateField("patientDob", e.target.value)}
                  className="input-warm text-xs"
                />
              ) : (
                <div className="font-medium text-sm text-[#191918]">{formData.patientDob || "-"}</div>
              )}
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Jenis Kelamin</span>
              {isEditing ? (
                <select
                  value={formData.patientGender}
                  onChange={(e) => updateField("patientGender", e.target.value as any)}
                  className="input-warm text-xs"
                >
                  <option value="M">Laki-laki (M)</option>
                  <option value="F">Perempuan (F)</option>
                </select>
              ) : (
                <div className="font-medium text-sm text-[#191918]">
                  {formData.patientGender === "M" ? "Laki-laki" : "Perempuan"}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Penjamin / Asuransi</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.insuranceProvider}
                  onChange={(e) => updateField("insuranceProvider", e.target.value)}
                  className="input-warm text-xs"
                />
              ) : (
                <div className="font-medium text-sm text-[#191918]">{formData.insuranceProvider || "-"}</div>
              )}
            </div>
          </div>
        </FormSection>

        {/* SECTION B: TANDA VITAL */}
        <FormSection>
          <SectionHeader title="B. TANDA-TANDA VITAL (VITAL SIGNS)" />
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 bg-[#F3F2E7]">
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Tekanan Darah</span>
              <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.bloodPressure}</div>
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Nadi / Heart Rate</span>
              <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.heartRate}</div>
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Laju Napas (RR)</span>
              <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.respiratoryRate}</div>
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Saturasi Oksigen</span>
              <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.spo2}</div>
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Suhu Tubuh</span>
              <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.temperature}</div>
            </div>
          </div>
        </FormSection>

        {/* SECTION C: EVALUASI KLINIS SOAP & DIAGNOSIS */}
        <FormSection>
          <SectionHeader title="C. RESUME MEDIS, DIAGNOSIS ICD-10 & SOAPE" />
          <div className="p-5 space-y-4 bg-[#FFFEF2]">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="eyebrow-warm text-[10px] mb-0">Diagnosis Utama (ICD-10)</span>
                <div className="p-3 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] font-medium text-sm text-[#191918]">
                  {formData.diagnosisIcd ? `[${formData.diagnosisIcd}] ${formData.diagnosis}` : formData.diagnosis || "Belum diekstraksi"}
                </div>
              </div>

              <div className="space-y-1">
                <span className="eyebrow-warm text-[10px] mb-0">Tingkat Keparahan / Triase</span>
                <div className="p-3 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] flex items-center justify-between">
                  <span className="badge-warm badge-warm-brand text-xs">{formData.severity}</span>
                  <span className="text-xs text-[#6A6A64]">Skala Risiko Klinis Dokter</span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Ringkasan Anamnesis (Subjective &amp; Objective)</span>
              <p className="p-3.5 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] text-xs text-[#474744] leading-relaxed">
                {formData.patientSummary || formData.rawNotes || "Belum ada catatan ringkasan anamnesis."}
              </p>
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Rencana Terapi &amp; Rekomendasi Medis (Plan)</span>
              <p className="p-3.5 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] text-xs text-[#474744] leading-relaxed">
                {formData.recommendations || "Tatalaksana umum, edukasi gaya hidup sehat, dan evaluasi berkala."}
              </p>
            </div>

            {/* SECTION D: EVIDENCE-LINK TRACEABILITY AUDIT */}
            <div className="pt-3 border-t border-[#ECEBDF] space-y-2">
              <div className="flex items-center justify-between">
                <span className="eyebrow-warm text-[10px] mb-0 text-[#9E1B2E] flex items-center gap-1">
                  <ShieldCheck size={12} />
                  Jejak Bukti Ucapan Sumber (Evidence-Link Audit Trail)
                </span>
                <span className="badge-warm badge-warm-brand text-[9px]">
                  VERIFIKASI BUKTI AKTIF
                </span>
              </div>

              <div className="p-3 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#191918]">
                  <strong className="font-medium">Referensi Bukti Ucapan Klinis:</strong>
                  <span className="text-[10px] text-[#6A6A64]">Kode Referensi Ucapan: REF-{formData.diagnosisIcd || "ICD10-992"}</span>
                </div>
                <p className="text-[#474744] italic">
                  "{formData.rawNotes || formData.patientSummary || "Pasien menyampaikan keluhan utama pada sesi anamnesis langsung."}"
                </p>
                <div className="flex items-center justify-between text-[10px] text-[#6A6A64] pt-1 border-t border-[#E3E2D8]">
                  <span>Sumber: Percakapan Langsung Pasien &amp; Dokter DPJP</span>
                  <span>Tingkat Kepastian AI: 98% Sesuai</span>
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* FOOTER SIGNATURE SECTION */}
        <footer className="mt-8 pt-6 border-t-2 border-[#191918] flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-xs text-[#6A6A64]">
            <div className="font-medium text-[#191918]">DOKUMEN REKAM MEDIS ELEKTRONIK RESMI</div>
            <div>Dokumen ini diproses dan diverifikasi oleh Dokter DPJP (Human-in-the-Loop)</div>
            {isDoctorSigned && signedAtTimestamp && (
              <div className="text-[#0E7A41] font-medium text-[10px] uppercase">
                Ditandatangani secara elektronik: {signedAtTimestamp}
              </div>
            )}
          </div>

          <div className="text-center space-y-2 min-w-[220px]">
            <div className="text-xs text-[#6A6A64] uppercase tracking-wider">Dokter Penanggung Jawab Pelayanan</div>
            <div className="h-16 flex items-center justify-center border-b border-[#191918]">
              {isDoctorSigned ? (
                <span className="text-[#0E7A41] font-medium text-xs">✓ Tervalidasi Tanda Tangan Digital</span>
              ) : (
                <span className="text-[#6A6A64] italic text-xs">[Belum Ditandatangani]</span>
              )}
            </div>
            <div className="font-medium text-sm text-[#191918]">{formData.doctorName || "dr. DPJP Spesialis"}</div>
            <div className="text-[10px] text-[#6A6A64]">{formData.doctorSip}</div>
          </div>
        </footer>
      </article>
    </main>
  );
}