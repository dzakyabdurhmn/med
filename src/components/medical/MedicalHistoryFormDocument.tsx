"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  QrCode,
  Check,
  ShieldCheck,
  Plus,
  Trash2,
  AlertTriangle,
  Search,
  Database,
  X,
  BadgeCheck,
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
  isDoctorSigned?: boolean;
  signedAtTimestamp?: string | null;
  onSignComplete?: (dataUrl: string) => void;
  onClearSignature?: () => void;
}

export function MedicalHistoryFormDocument({
  data,
  initialData,
  onChange,
  isDoctorSigned = false,
  signedAtTimestamp = null,
}: MedicalHistoryFormDocumentProps) {
  const activeIncomingData = data || initialData || DEFAULT_FORM_DATA;
  const [formData, setFormData] = useState<MedicalFormData>(activeIncomingData);
  const [isEditing] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [showIcdModal, setShowIcdModal] = useState(false);
  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [icdSearchResults, setIcdSearchResults] = useState<
    Array<{ code: string; display: string; system: string; groupName?: string | null }>
  >([]);
  const [isSearchingIcd, setIsSearchingIcd] = useState(false);

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

  const updateVitalSign = (key: keyof MedicalFormData["vitalSigns"], value: string) => {
    setFormData((prev) => {
      const next = {
        ...prev,
        vitalSigns: { ...prev.vitalSigns, [key]: value },
      };
      onChange?.(next);
      return next;
    });
  };

  const toggleCheckbox = (
    category: "personalHistory" | "surgeries" | "familyHistory" | "reviewOfSystems",
    key: string
  ) => {
    setFormData((prev) => {
      const current = prev || DEFAULT_FORM_DATA;
      const catObj = current[category] || {};
      const next = {
        ...current,
        [category]: { ...catObj, [key]: !catObj[key] },
      };
      onChange?.(next);
      return next;
    });
  };

  const handleMedicationChange = (id: string, field: keyof MedicationItem, value: string) => {
    setFormData((prev) => {
      const current = prev || DEFAULT_FORM_DATA;
      const meds = current.medications || [];
      const next = {
        ...current,
        medications: meds.map((m) => (m.id === id ? { ...m, [field]: value } : m)),
      };
      onChange?.(next);
      return next;
    });
  };

  const handleAddMedication = () => {
    const newMed: MedicationItem = {
      id: "med-" + Date.now(),
      name: "",
      dosage: "",
      frequency: "",
      purpose: "",
      notes: "",
    };
    setFormData((prev) => {
      const current = prev || DEFAULT_FORM_DATA;
      const next = {
        ...current,
        medications: [...(current.medications || []), newMed],
      };
      onChange?.(next);
      return next;
    });
  };

  const handleRemoveMedication = (id: string) => {
    setFormData((prev) => {
      const current = prev || DEFAULT_FORM_DATA;
      const next = {
        ...current,
        medications: (current.medications || []).filter((m) => m.id !== id),
      };
      onChange?.(next);
      return next;
    });
  };

  const handleSearchIcd = async (queryStr: string) => {
    setIcdSearchQuery(queryStr);
    if (!queryStr.trim()) {
      setIcdSearchResults([]);
      return;
    }
    setIsSearchingIcd(true);
    try {
      // Simulasi search - ganti dengan implementasi real
      const mockResults = [
        { code: "I10", display: "Hipertensi Esensial (Primer)", system: "ICD-10", groupName: "Sistem Kardiovaskular" },
        { code: "I20.9", display: "Angina Pektoris Tak Stabil", system: "ICD-10", groupName: "Sistem Kardiovaskular" },
        { code: "J06.9", display: "Infeksi Saluran Pernapasan Akut", system: "ICD-10", groupName: "Sistem Respirasi" },
        { code: "J18.9", display: "Pneumonia, Tidak Spesifik", system: "ICD-10", groupName: "Sistem Respirasi" },
        { code: "J45.9", display: "Asma Bronkial", system: "ICD-10", groupName: "Sistem Respirasi" },
        { code: "K29.7", display: "Gastritis Akut", system: "ICD-10", groupName: "Sistem Pencernaan" },
        { code: "K21.9", display: "Gastro-Esophageal Reflux Disease", system: "ICD-10", groupName: "Sistem Pencernaan" },
        { code: "E11.9", display: "Diabetes Melitus Tipe 2", system: "ICD-10", groupName: "Sistem Metabolik" },
        { code: "R51", display: "Cephalgia (Sakit Kepala)", system: "ICD-10", groupName: "Sistem Saraf" },
        { code: "I63.9", display: "Stroke Iskemik Akut", system: "ICD-10", groupName: "Sistem Saraf" },
      ];
      setIcdSearchResults(mockResults.filter(r => 
        r.code.includes(queryStr) || 
        r.display.toLowerCase().includes(queryStr.toLowerCase()) ||
        r.groupName?.toLowerCase().includes(queryStr.toLowerCase())
      ));
    } catch (e) {
      console.warn("ICD search error:", e);
    } finally {
      setIsSearchingIcd(false);
    }
  };

  const selectIcdCodeItem = (code: string, display: string) => {
    updateField("diagnosisIcd", code);
    if (!formData.diagnosis || formData.diagnosis === "Evaluasi Klinis Terstruktur") {
      updateField("diagnosis", display);
    }
    setShowIcdModal(false);
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

  const CustomCheckbox = ({
    isChecked,
    label,
    onToggle,
    isAiKey = false,
  }: {
    isChecked: boolean;
    label: string;
    onToggle: () => void;
    isAiKey?: boolean;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`group flex items-center justify-between p-2 border text-xs text-left transition-all duration-150 select-none w-full rounded-[2px] ${
        isChecked
          ? "bg-[#191918] text-white border-[#191918]"
          : "bg-[#FFFEF2] text-[#191918] border-[#E3E2D8] hover:border-[#6A6A64] hover:bg-[#F3F2E7]"
      }`}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div
          className={`w-4 h-4 rounded-[2px] flex items-center justify-center shrink-0 border transition-all ${
            isChecked
              ? "bg-[#0E7A41] border-[#0E7A41] text-white"
              : "bg-white border-[#E3E2D8] group-hover:border-[#6A6A64]"
          }`}
        >
          {isChecked && <Check size={12} strokeWidth={3} />}
        </div>
        <span className={`truncate ${isChecked ? "font-medium" : "font-medium"}`}>
          {label}
        </span>
      </div>
      {isChecked && isAiKey && (
        <span className="shrink-0 ml-1.5 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-[#0E7A41] text-white flex items-center gap-0.5">
          <Sparkles size={8} /> AI
        </span>
      )}
    </button>
  );

  return (
    <main className="mx-auto space-y-6 pb-12 font-sans">
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
                  PUSKESMAS/KLINIK PRATAMA
                </h1>
                <p className="text-xs text-[#6A6A64] font-medium leading-tight">
                  Pencatatan Konsultasi Rawat Jalan Berbasis AI
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
                  placeholder="Ketik nama pasien..."
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
                  placeholder="14 Mei 1978"
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
              <span className="eyebrow-warm text-[10px] mb-0">Alamat</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.patientAddress}
                  onChange={(e) => updateField("patientAddress", e.target.value)}
                  className="input-warm text-xs"
                  placeholder="Alamat lengkap..."
                />
              ) : (
                <div className="font-medium text-sm text-[#191918]">{formData.patientAddress || "-"}</div>
              )}
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">No. Telepon</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.patientPhone}
                  onChange={(e) => updateField("patientPhone", e.target.value)}
                  className="input-warm text-xs"
                  placeholder="0812-..."
                />
              ) : (
                <div className="font-medium text-sm text-[#191918]">{formData.patientPhone || "-"}</div>
              )}
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Kontak Darurat</span>
              {isEditing ? (
                <div className="flex flex-col gap-1">
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => updateField("emergencyContactName", e.target.value)}
                    className="input-warm text-xs"
                    placeholder="Nama kerabat"
                  />
                  <input
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
                    className="input-warm text-xs"
                    placeholder="Hubungan"
                  />
                  <input
                    type="text"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                    className="input-warm text-xs"
                    placeholder="No. HP"
                  />
                </div>
              ) : (
                <div className="font-medium text-sm text-[#191918]">
                  {formData.emergencyContactName || "-"} {formData.emergencyContactRelationship ? `(${formData.emergencyContactRelationship})` : ""}
                  {formData.emergencyContactPhone && <span className="block text-xs text-[#6A6A64]">{formData.emergencyContactPhone}</span>}
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

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">No. Polis / Kartu</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.insurancePolicyNumber}
                  onChange={(e) => updateField("insurancePolicyNumber", e.target.value)}
                  className="input-warm text-xs"
                />
              ) : (
                <div className="font-medium text-sm text-[#191918]">{formData.insurancePolicyNumber || "-"}</div>
              )}
            </div>
          </div>
        </FormSection>

        {/* SECTION B: TANDA VITAL */}
        <FormSection>
          <SectionHeader title="B. TANDA-TANDA VITAL (VITAL SIGNS)" />
          <div className="p-4 grid grid-cols-2 sm:grid-cols-5 gap-3 bg-[#F3F2E7]">
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Tekanan Darah</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => updateVitalSign("bloodPressure", e.target.value)}
                  className="input-warm text-sm font-medium"
                />
              ) : (
                <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.bloodPressure}</div>
              )}
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Nadi / Heart Rate</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => updateVitalSign("heartRate", e.target.value)}
                  className="input-warm text-sm font-medium"
                />
              ) : (
                <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.heartRate}</div>
              )}
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Laju Napas (RR)</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={(e) => updateVitalSign("respiratoryRate", e.target.value)}
                  className="input-warm text-sm font-medium"
                />
              ) : (
                <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.respiratoryRate}</div>
              )}
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Saturasi Oksigen</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.vitalSigns.spo2}
                  onChange={(e) => updateVitalSign("spo2", e.target.value)}
                  className="input-warm text-sm font-medium"
                />
              ) : (
                <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.spo2}</div>
              )}
            </div>
            <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Suhu Tubuh</span>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => updateVitalSign("temperature", e.target.value)}
                  className="input-warm text-sm font-medium"
                />
              ) : (
                <div className="font-medium text-base text-[#191918]">{formData.vitalSigns.temperature}</div>
              )}
            </div>
          </div>
        </FormSection>

        {/* SECTION C: PERSONAL HISTORY */}
        <FormSection>
          <SectionHeader 
            title="C. RIWAYAT PENYAKIT PRIBADI (PERSONAL HISTORY)" 
            rightContent={<span className="text-[#0E7A41]">{personalCheckedCount} Indikasi Ditemukan</span>}
          />
          <div className="p-4 bg-[#FFFEF2] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {[
                { key: "acid_reflux", label: "Acid Reflux / GERD" },
                { key: "anemia", label: "Anemia" },
                { key: "anxiety", label: "Anxiety / Cemas" },
                { key: "asthma", label: "Asthma / Asma" },
                { key: "cancer", label: "Cancer / Kanker" },
                { key: "congestive_heart_failure", label: "Congestive Heart Failure" },
                { key: "copd", label: "COPD / PPOK" },
                { key: "depression", label: "Depression / Depresi" },
                { key: "diabetes_type1", label: "Diabetes Type 1" },
                { key: "diabetes_type2", label: "Diabetes Type 2" },
                { key: "heart_disease", label: "Heart Disease / Jantung" },
                { key: "hepatitis", label: "Hepatitis" },
                { key: "high_blood_pressure", label: "High Blood Pressure (Hipertensi)" },
                { key: "high_cholesterol", label: "High Cholesterol (Dislipidemia)" },
                { key: "kidney_disease", label: "Kidney Disease (Gagal Ginjal)" },
                { key: "liver_disease", label: "Liver Disease" },
                { key: "stroke", label: "Stroke / TIA" },
                { key: "thyroid_disease", label: "Thyroid Disease" },
              ].map((item) => (
                <CustomCheckbox
                  key={item.key}
                  label={item.label}
                  isChecked={!!formData.personalHistory[item.key]}
                  onToggle={() => toggleCheckbox("personalHistory", item.key)}
                  isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                />
              ))}
            </div>

            <div className="space-y-1">
              <span className="eyebrow-warm text-[10px] mb-0">Catatan Anamnesis / Other Medical Issues:</span>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.otherMedicalIssues}
                  onChange={(e) => updateField("otherMedicalIssues", e.target.value)}
                  className="input-warm text-xs w-full"
                  placeholder="Tambahkan catatan riwayat penyakit atau keluhan tambahan..."
                />
              ) : (
                <p className="p-2.5 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] text-xs text-[#474744] leading-relaxed">
                  {formData.otherMedicalIssues || "Tidak ada catatan tambahan."}
                </p>
              )}
            </div>
          </div>
        </FormSection>

        {/* SECTION D: MEDICATIONS */}
        <FormSection>
          <SectionHeader 
            title="D. RESEP & TERAPI OBAT AKTIF" 
            rightContent={
              <button
                type="button"
                onClick={handleAddMedication}
                className="no-print text-[11px] font-medium bg-[#0E7A41] text-white px-2.5 py-0.5 rounded-[2px] hover:bg-[#0A5D32] transition flex items-center gap-1"
              >
                <Plus size={12} /> Tambah Obat
              </button>
            }
          />
          <div className="overflow-x-auto bg-[#FFFEF2]">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#F3F2E7] border-b-2 border-[#191918] text-[#191918]">
                  <th className="p-2.5 border-r border-[#ECEBDF] font-medium min-w-[120px]">Nama Obat / Terapi</th>
                  <th className="p-2.5 border-r border-[#ECEBDF] font-medium min-w-[80px]">Dosis</th>
                  <th className="p-2.5 border-r border-[#ECEBDF] font-medium min-w-[100px]">Frekuensi</th>
                  <th className="p-2.5 border-r border-[#ECEBDF] font-medium min-w-[120px]">Indikasi Medis</th>
                  <th className="p-2.5 font-medium text-center no-print min-w-[50px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ECEBDF]">
                {formData.medications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-[#6A6A64] italic">
                      Belum ada obat yang ditambahkan. Klik "Tambah Obat" atau jalankan AI Extraction.
                    </td>
                  </tr>
                ) : (
                  formData.medications.map((med) => (
                    <tr key={med.id} className="hover:bg-[#F3F2E7] transition">
                      <td className="p-2 border-r border-[#ECEBDF]">
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(med.id, "name", e.target.value)}
                          placeholder="Nama Obat"
                          className="w-full font-medium text-[#191918] bg-transparent outline-none border-b border-transparent focus:border-[#191918]"
                          disabled={!isEditing}
                        />
                      </td>
                      <td className="p-2 border-r border-[#ECEBDF]">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(med.id, "dosage", e.target.value)}
                          placeholder="5 mg"
                          className="w-full text-[#191918] bg-transparent outline-none border-b border-transparent focus:border-[#191918]"
                          disabled={!isEditing}
                        />
                      </td>
                      <td className="p-2 border-r border-[#ECEBDF]">
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) => handleMedicationChange(med.id, "frequency", e.target.value)}
                          placeholder="1x1 tablet / hari"
                          className="w-full text-[#191918] bg-transparent outline-none border-b border-transparent focus:border-[#191918]"
                          disabled={!isEditing}
                        />
                      </td>
                      <td className="p-2 border-r border-[#ECEBDF]">
                        <input
                          type="text"
                          value={med.purpose}
                          onChange={(e) => handleMedicationChange(med.id, "purpose", e.target.value)}
                          placeholder="Indikasi Terapi"
                          className="w-full text-[#191918] bg-transparent outline-none border-b border-transparent focus:border-[#191918]"
                          disabled={!isEditing}
                        />
                      </td>
                      <td className="p-2 text-center no-print">
                        {isEditing && (
                          <button
                            type="button"
                            onClick={() => handleRemoveMedication(med.id)}
                            className="text-[#9E1B2E] hover:text-[#7A1523] p-1 rounded hover:bg-[#FCEEEF] transition"
                            title="Hapus Obat"
                          >
                            <Trash2 size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </FormSection>

        {/* SECTION E: SURGERIES & ALLERGIES */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-7 card-warm overflow-hidden">
            <div className="bg-[#191918] text-white px-3.5 py-2 font-medium text-xs uppercase tracking-[0.05em]">
              E1. RIWAYAT OPERASI (SURGERIES)
            </div>
            <div className="p-3 grid grid-cols-2 gap-2 bg-[#FFFEF2]">
              {[
                { key: "heart_surgery", label: "Heart surgery" },
                { key: "cholecystectomy", label: "Cholecystectomy" },
                { key: "appendectomy", label: "Appendectomy" },
                { key: "c_section", label: "C-section" },
                { key: "hysterectomy", label: "Hysterectomy" },
                { key: "bladder", label: "Bladder" },
                { key: "colonoscopy", label: "Colonoscopy" },
                { key: "joint", label: "Joint" },
              ].map((surg) => (
                <CustomCheckbox
                  key={surg.key}
                  label={surg.label}
                  isChecked={!!formData.surgeries[surg.key]}
                  onToggle={() => toggleCheckbox("surgeries", surg.key)}
                  isAiKey={formData.aiCheckedKeys?.includes(surg.key)}
                />
              ))}
            </div>
          </div>

          <div className="md:col-span-5 card-warm overflow-hidden border border-[#9E1B2E]/30">
            <div className="bg-[#9E1B2E] text-white px-3.5 py-2 font-medium text-xs uppercase tracking-[0.05em] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-[#FCD34D]" />
                E2. RIWAYAT ALERGI (ALLERGIES)
              </span>
              <span className="text-[10px] text-[#FECACA]">Wajib Diisi</span>
            </div>
            <div className="p-3 space-y-2 bg-[#FFFEF2]">
              <div className="flex flex-wrap gap-1 no-print">
                {[
                  "Penisilin",
                  "Sefalosporin",
                  "Sulfa",
                  "NSAID / Aspirin",
                  "Seafood",
                  "Tanpa Alergi",
                ].map((al) => (
                  <button
                    key={al}
                    type="button"
                    onClick={() => {
                      const current = formData.allergies || "";
                      if (al === "Tanpa Alergi") {
                        updateField(
                          "allergies",
                          "Tidak ada riwayat alergi obat / makanan yang diketahui."
                        );
                      } else if (!current.includes(al)) {
                        updateField(
                          "allergies",
                          current ? `${current}, Alergi: ${al}` : `Alergi: ${al}`
                        );
                      }
                    }}
                    className="px-2 py-0.5 rounded bg-white border border-[#FECACA] hover:bg-[#FCEEEF] text-[10px] font-medium text-[#9E1B2E] transition"
                  >
                    + {al}
                  </button>
                ))}
              </div>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={formData.allergies}
                  onChange={(e) => updateField("allergies", e.target.value)}
                  className="input-warm text-xs w-full"
                  placeholder="Ketikkan riwayat alergi obat, makanan, debu..."
                />
              ) : (
                <p className="p-2.5 bg-[#F3F2E7] border border-[#ECEBDF] rounded-[2px] text-xs text-[#474744] leading-relaxed">
                  {formData.allergies}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* SECTION F: FAMILY HISTORY */}
        <FormSection>
          <SectionHeader 
            title="F. RIWAYAT KESEHATAN KELUARGA (FAMILY HISTORY)" 
            rightContent={<span className="text-[#0E7A41]">{familyCheckedCount} Teridentifikasi</span>}
          />
          <div className="p-4 bg-[#FFFEF2] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {[
              { key: "cancer", label: "Kanker / Cancer" },
              { key: "diabetes", label: "Diabetes" },
              { key: "heart_disease", label: "Penyakit Jantung" },
              { key: "high_blood_pressure", label: "Hipertensi" },
              { key: "high_cholesterol", label: "Dislipidemia" },
              { key: "stroke", label: "Stroke" },
              { key: "thyroid_disease", label: "Tiroid" },
              { key: "kidney_disease", label: "Gagal Ginjal" },
            ].map((fam) => (
              <CustomCheckbox
                key={fam.key}
                label={fam.label}
                isChecked={!!formData.familyHistory[fam.key]}
                onToggle={() => toggleCheckbox("familyHistory", fam.key)}
                isAiKey={formData.aiCheckedKeys?.includes(fam.key)}
              />
            ))}
          </div>
        </FormSection>

        {/* SECTION G: SOCIAL HISTORY */}
        <FormSection>
          <SectionHeader title="G. GAYA HIDUP & FAKTOR SOSIAL (SOCIAL HISTORY)" />
          <div className="p-4 bg-[#FFFEF2] space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF]">
              <span className="sm:col-span-3 font-medium text-[#191918]">Merokok (Tobacco):</span>
              <div className="sm:col-span-9 flex flex-wrap items-center gap-4">
                {["Non-smoker", "Cigarettes", "Vaping", "Tobacco"].map((item) => (
                  <label key={item} className="flex items-center gap-1.5 cursor-pointer font-medium text-xs">
                    <input
                      type="radio"
                      name="tobacco"
                      checked={formData.tobaccoUse === item}
                      onChange={() => updateField("tobaccoUse", item as any)}
                      className="accent-[#191918]"
                      disabled={!isEditing}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF]">
              <span className="sm:col-span-3 font-medium text-[#191918]">Konsumsi Alkohol:</span>
              <div className="sm:col-span-9 flex flex-wrap items-center gap-4">
                {["None", "Occasional", "Moderate", "Heavy"].map((item) => (
                  <label key={item} className="flex items-center gap-1.5 cursor-pointer font-medium text-xs">
                    <input
                      type="radio"
                      name="alcohol"
                      checked={formData.alcoholUse === item}
                      onChange={() => updateField("alcoholUse", item as any)}
                      className="accent-[#191918]"
                      disabled={!isEditing}
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[#191918] text-xs">Pekerjaan (Occupation):</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.occupation || "Wiraswasta"}
                    onChange={(e) => updateField("occupation", e.target.value)}
                    className="input-warm text-xs flex-1 min-w-[100px]"
                  />
                ) : (
                  <span className="font-medium text-sm text-[#191918]">{formData.occupation || "Wiraswasta"}</span>
                )}
              </div>
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-[#191918] text-xs">Tempat Tinggal:</span>
                {isEditing ? (
                  <select
                    value={formData.livingSituation}
                    onChange={(e) => updateField("livingSituation", e.target.value as any)}
                    className="input-warm text-xs flex-1 min-w-[100px]"
                  >
                    <option value="With family">Bersama Keluarga (With family)</option>
                    <option value="With S/O">Bersama Pasangan (With S/O)</option>
                    <option value="With roommates">Bersama Teman (With roommates)</option>
                    <option value="Other">Lainnya (Other)</option>
                  </select>
                ) : (
                  <span className="font-medium text-sm text-[#191918]">
                    {formData.livingSituation === "With family" ? "Bersama Keluarga" :
                     formData.livingSituation === "With S/O" ? "Bersama Pasangan" :
                     formData.livingSituation === "With roommates" ? "Bersama Teman" :
                     formData.livingSituation}
                  </span>
                )}
              </div>
            </div>
          </div>
        </FormSection>

        {/* SECTION H: REVIEW OF SYSTEMS */}
        <FormSection>
          <SectionHeader 
            title="H. SKRINING GEJALA ORGAN (REVIEW OF SYSTEMS - ROS)" 
            rightContent={<span className="text-[#0E7A41] font-medium">{rosCheckedCount} Gejala Positif</span>}
          />
          <div className="p-4 bg-[#FFFEF2] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* General */}
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-2">
                <span className="font-medium uppercase text-[11px] text-[#191918] border-b border-[#ECEBDF] pb-1 block">
                  Sistem Umum (General)
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "ros_fatigue", label: "Fatigue / Lelah" },
                    { key: "ros_fever", label: "Fever / Demam" },
                    { key: "ros_weight", label: "Weight loss / gain" },
                  ].map((item) => (
                    <CustomCheckbox
                      key={item.key}
                      label={item.label}
                      isChecked={!!formData.reviewOfSystems[item.key]}
                      onToggle={() => toggleCheckbox("reviewOfSystems", item.key)}
                      isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                    />
                  ))}
                </div>
              </div>

              {/* EENT */}
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-2">
                <span className="font-medium uppercase text-[11px] text-[#191918] border-b border-[#ECEBDF] pb-1 block">
                  Kepala & THT (EENT)
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "ros_vision", label: "Vision changes / Pandangan" },
                    { key: "ros_hearing", label: "Hearing loss / Berdenging" },
                    { key: "ros_throat", label: "Sore throat / Serak" },
                  ].map((item) => (
                    <CustomCheckbox
                      key={item.key}
                      label={item.label}
                      isChecked={!!formData.reviewOfSystems[item.key]}
                      onToggle={() => toggleCheckbox("reviewOfSystems", item.key)}
                      isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Cardiovascular */}
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-2">
                <span className="font-medium uppercase text-[11px] text-[#191918] border-b border-[#ECEBDF] pb-1 block">
                  Kardiovaskular (Cardio)
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "ros_chest_pain", label: "Chest pain / Nyeri Dada" },
                    { key: "ros_palpitations", label: "Palpitations / Berdebar" },
                    { key: "ros_swelling", label: "Swelling / Bengkak Kaki" },
                  ].map((item) => (
                    <CustomCheckbox
                      key={item.key}
                      label={item.label}
                      isChecked={!!formData.reviewOfSystems[item.key]}
                      onToggle={() => toggleCheckbox("reviewOfSystems", item.key)}
                      isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Respiratory */}
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-2">
                <span className="font-medium uppercase text-[11px] text-[#191918] border-b border-[#ECEBDF] pb-1 block">
                  Respirasi / Paru (Pulmo)
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "ros_sob", label: "Shortness of breath / Sesak" },
                    { key: "ros_cough", label: "Chronic cough / Batuk" },
                    { key: "ros_wheezing", label: "Wheezing / Mengi" },
                  ].map((item) => (
                    <CustomCheckbox
                      key={item.key}
                      label={item.label}
                      isChecked={!!formData.reviewOfSystems[item.key]}
                      onToggle={() => toggleCheckbox("reviewOfSystems", item.key)}
                      isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Gastrointestinal */}
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-2">
                <span className="font-medium uppercase text-[11px] text-[#191918] border-b border-[#ECEBDF] pb-1 block">
                  Pencernaan (Gastro)
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "ros_abdo_pain", label: "Abdominal pain / Nyeri Perut" },
                    { key: "ros_nausea", label: "Nausea / Mual Muntah" },
                    { key: "ros_diarrhea", label: "Diarrhea / Diare" },
                  ].map((item) => (
                    <CustomCheckbox
                      key={item.key}
                      label={item.label}
                      isChecked={!!formData.reviewOfSystems[item.key]}
                      onToggle={() => toggleCheckbox("reviewOfSystems", item.key)}
                      isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                    />
                  ))}
                </div>
              </div>

              {/* Genitourinary */}
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-2">
                <span className="font-medium uppercase text-[11px] text-[#191918] border-b border-[#ECEBDF] pb-1 block">
                  Kemih & Ginjal (Uro)
                </span>
                <div className="space-y-1.5">
                  {[
                    { key: "ros_incontinence", label: "Incontinence" },
                    { key: "ros_burning", label: "Burning / Perih Kencing" },
                    { key: "ros_hematuria", label: "Blood in urine / Darah" },
                  ].map((item) => (
                    <CustomCheckbox
                      key={item.key}
                      label={item.label}
                      isChecked={!!formData.reviewOfSystems[item.key]}
                      onToggle={() => toggleCheckbox("reviewOfSystems", item.key)}
                      isAiKey={formData.aiCheckedKeys?.includes(item.key)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* SECTION I: CLINICAL ASSESSMENT */}
        <FormSection>
          <SectionHeader 
            title="I. DIAGNOSA MEDIS & TANDA VITAL (PRIMARY ASSESSMENT)" 
            rightContent={
              <select
                value={formData.severity}
                onChange={(e) => updateField("severity", e.target.value as any)}
                className="text-[10px] bg-[#0E7A41] text-white font-bold uppercase px-2.5 py-0.5 rounded-[2px] outline-none cursor-pointer"
                disabled={!isEditing}
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="SEVERE">SEVERE</option>
                <option value="MODERATE">MODERATE</option>
                <option value="MILD">MILD</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            }
          />
          <div className="p-4 bg-[#FFFEF2] space-y-4">
            {/* ICD-10 Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 no-print bg-[#F3F2E7] p-2.5 rounded-[2px] border border-[#ECEBDF]">
              <div className="flex flex-wrap items-center gap-1 text-[10px]">
                <span className="font-medium text-[#474744] uppercase mr-1">Preset ICD-10:</span>
                {[
                  { code: "I10", label: "Hipertensi", name: "Hipertensi Esensial" },
                  { code: "I20.9", label: "Angina SKA", name: "Suspek Sindrom Koroner Akut (SKA)" },
                  { code: "J06.9", label: "ISPA", name: "Infeksi Saluran Pernapasan Akut (ISPA)" },
                  { code: "J18.9", label: "Pneumonia", name: "Pneumonia Lobaris" },
                  { code: "J45.9", label: "Asma", name: "Asma Bronkial" },
                  { code: "K29.7", label: "Gastritis", name: "Gastritis Akut / Dispepsia" },
                  { code: "K21.9", label: "GERD", name: "Gastro-Esophageal Reflux Disease" },
                  { code: "E11.9", label: "Diabetes T2", name: "Diabetes Melitus Tipe 2" },
                  { code: "R51", label: "Cephalgia", name: "Cephalgia Akut" },
                  { code: "I63.9", label: "Stroke", name: "Stroke Iskemik Akut" },
                ].map((preset) => (
                  <button
                    key={preset.code}
                    type="button"
                    onClick={() => {
                      updateField("diagnosisIcd", preset.code);
                      updateField("diagnosis", preset.name);
                    }}
                    className="px-2 py-0.5 rounded bg-[#191918] text-white font-medium hover:bg-[#2A2A28] transition whitespace-nowrap text-[10px]"
                  >
                    {preset.code} ({preset.label})
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowIcdModal(true);
                  if (formData.diagnosis) {
                    handleSearchIcd(formData.diagnosis);
                  }
                }}
                className="px-3 py-1 bg-[#191918] text-white rounded-[2px] font-medium text-[11px] hover:bg-[#2A2A28] transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <Search size={13} className="text-[#0E7A41]" />
                <span>Cari ICD-10</span>
              </button>
            </div>

            {/* Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-9 bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-1">
                <span className="eyebrow-warm text-[10px] mb-0">Diagnosa Klinis Utama</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.diagnosis}
                    onChange={(e) => updateField("diagnosis", e.target.value)}
                    className="input-warm text-base font-medium"
                    placeholder="Ketikkan nama diagnosa medis..."
                  />
                ) : (
                  <div className="font-medium text-base text-[#191918]">{formData.diagnosis || "Belum ditentukan"}</div>
                )}
              </div>
              <div className="sm:col-span-3 bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-1">
                <span className="eyebrow-warm text-[10px] mb-0">Kode ICD-10</span>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.diagnosisIcd}
                    onChange={(e) => updateField("diagnosisIcd", e.target.value)}
                    className="input-warm text-sm font-mono font-medium"
                    placeholder="I20.9 / J06.9"
                  />
                ) : (
                  <div className="font-mono font-medium text-base text-[#191918]">{formData.diagnosisIcd || "-"}</div>
                )}
              </div>
            </div>

            {/* Recommendations & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-1">
                <span className="eyebrow-warm text-[10px] mb-0">Tata Laksana Medis & Anjuran DPJP:</span>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.recommendations}
                    onChange={(e) => updateField("recommendations", e.target.value)}
                    className="input-warm text-xs w-full"
                    placeholder="Instruksi pengobatan & rencana penanganan..."
                  />
                ) : (
                  <p className="p-2.5 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] text-xs text-[#474744] leading-relaxed">
                    {formData.recommendations || "Tatalaksana umum, edukasi gaya hidup sehat, dan evaluasi berkala."}
                  </p>
                )}
              </div>
              <div className="bg-[#F3F2E7] p-3 rounded-[2px] border border-[#ECEBDF] space-y-1">
                <span className="eyebrow-warm text-[10px] mb-0">Ringkasan Untuk Pasien (Bahasa Awam):</span>
                {isEditing ? (
                  <textarea
                    rows={3}
                    value={formData.patientSummary}
                    onChange={(e) => updateField("patientSummary", e.target.value)}
                    className="input-warm text-xs w-full"
                    placeholder="Penjelasan ringkas kondisi pasien..."
                  />
                ) : (
                  <p className="p-2.5 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] text-xs text-[#474744] leading-relaxed">
                    {formData.patientSummary || "Belum ada ringkasan."}
                  </p>
                )}
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
              <div className="text-[#0E7A41] font-medium text-[10px] uppercase flex items-center gap-1">
                <BadgeCheck size={12} />
                Ditandatangani secara elektronik: {signedAtTimestamp}
              </div>
            )}
          </div>

          <div className="text-center space-y-2 min-w-[220px]">
            <div className="text-xs text-[#6A6A64] uppercase tracking-wider">Dokter Penanggung Jawab Pelayanan</div>
            <div className="h-16 flex items-center justify-center border-b border-[#191918]">
              {isDoctorSigned ? (
                <span className="text-[#0E7A41] font-medium text-xs flex items-center gap-1">
                  <Check size={14} /> Tervalidasi Tanda Tangan Digital
                </span>
              ) : (
                <span className="text-[#6A6A64] italic text-xs">[Belum Ditandatangani]</span>
              )}
            </div>
            {isEditing ? (
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => updateField("doctorName", e.target.value)}
                className="input-warm text-sm font-medium text-center"
                placeholder="Nama Dokter"
              />
            ) : (
              <div className="font-medium text-sm text-[#191918]">{formData.doctorName || "dr. DPJP Spesialis"}</div>
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.doctorSip || ""}
                onChange={(e) => updateField("doctorSip", e.target.value)}
                className="input-warm text-[10px] text-center text-[#6A6A64]"
                placeholder="SIP: ..."
              />
            ) : (
              <div className="text-[10px] text-[#6A6A64]">{formData.doctorSip}</div>
            )}
            {isEditing ? (
              <input
                type="text"
                value={formData.doctorSpecialty}
                onChange={(e) => updateField("doctorSpecialty", e.target.value)}
                className="input-warm text-[10px] text-center text-[#6A6A64]"
                placeholder="Spesialis"
              />
            ) : (
              <div className="text-[10px] text-[#6A6A64]">{formData.doctorSpecialty}</div>
            )}
          </div>
        </footer>
      </article>

      {/* ICD-10 Modal */}
      {showIcdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191918]/80 backdrop-blur-sm no-print">
          <div className="bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] p-4 sm:p-6 max-w-xl w-full shadow-xl space-y-4 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between border-b-2 border-[#191918] pb-3 font-medium gap-2">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-[#0E7A41]" />
                <h3 className="font-medium text-sm uppercase text-[#191918]">
                  Pencarian Kode ICD-10
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIcdModal(false)}
                className="p-1 rounded text-[#6A6A64] hover:text-[#191918] hover:bg-[#F3F2E7] transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={icdSearchQuery}
                onChange={(e) => handleSearchIcd(e.target.value)}
                placeholder="Ketikkan diagnosa atau kode ICD-10 (mis. I10, J06, Gastritis)..."
                className="w-full pl-9 pr-4 py-2.5 bg-[#F3F2E7] border border-[#ECEBDF] rounded-[2px] font-medium text-[#191918] text-xs focus:outline-none focus:border-[#191918]"
                autoFocus
              />
              <Search size={16} className="absolute left-3 top-3 text-[#6A6A64]" />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-[#ECEBDF] border border-[#ECEBDF] rounded-[2px]">
              {isSearchingIcd ? (
                <div className="p-6 text-center text-[#6A6A64] font-medium animate-pulse">
                  Mencari data ICD-10 di Database...
                </div>
              ) : icdSearchResults.length === 0 ? (
                <div className="p-6 text-center text-[#6A6A64] italic">
                  {icdSearchQuery
                    ? "Tidak ditemukan kode ICD-10 yang cocok."
                    : "Ketik kata kunci untuk mencari di database ICD-10."}
                </div>
              ) : (
                icdSearchResults.map((item) => (
                  <button
                    key={item.code + item.display}
                    type="button"
                    onClick={() => selectIcdCodeItem(item.code, item.display)}
                    className="w-full p-3 text-left hover:bg-[#F3F2E7] transition flex flex-wrap items-center justify-between gap-2 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-[#191918] text-sm group-hover:text-[#0E7A41] flex flex-wrap items-center gap-2">
                        <span className="font-mono font-bold">{item.code}</span>
                        {item.groupName && (
                          <span className="text-[10px] bg-[#F3F2E7] text-[#6A6A64] px-1.5 py-0.5 rounded border border-[#ECEBDF] font-sans font-normal">
                            {item.groupName}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-[#474744] font-medium truncate">
                        {item.display}
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-1 text-[10px] font-medium bg-[#191918] text-white rounded group-hover:bg-[#0E7A41]">
                      Pilih
                    </span>
                  </button>
                ))
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowIcdModal(false)}
                className="px-4 py-2 bg-[#F3F2E7] hover:bg-[#E3E2D8] text-[#191918] font-medium rounded-[2px] uppercase text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}