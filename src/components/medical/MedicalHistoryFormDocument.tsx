"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  Sparkles,
  RotateCcw,
  QrCode,
  Edit3,
  Plus,
  Trash2,
  Check,
  ChevronRight,
  AlertTriangle,
  Save,
  Stethoscope,
  BadgeCheck,
  User,
  Search,
  Database,
  ShieldCheck,
  X,
} from "lucide-react";
import type { OrganId } from "../../lib/anatomy-data";
import { searchIcd10Codes } from "../../server/medical-db";

export type ClinicalFindingItem = {
  id: string;
  hotspotId: string;
  organId: OrganId;
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
  doctorSip: string;
  modality: string;
  aiCheckedKeys?: string[];
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
  onOpen3DStation?: () => void;
  onOpen3DHotspot?: (hotspotId: string, findingId: string) => void;
  onSelectFinding?: (hotspotId: string, findingId: string) => void;
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
  onOpen3DStation = () => {},
  onNewRecording = () => {},
  isDoctorSigned: externalIsDoctorSigned,
  signedAtTimestamp: externalSignedAtTimestamp,
  onSignComplete: externalOnSignComplete,
  onClearSignature: externalOnClearSignature,
}: MedicalHistoryFormDocumentProps) {
  const activeIncomingData = data || initialData || DEFAULT_FORM_DATA;
  const [formData, setFormData] = useState<MedicalFormData>(activeIncomingData);
  const [isEditing, setIsEditing] = useState(false);
  const [internalSigned, setInternalSigned] = useState(false);
  const [internalTimestamp, setInternalTimestamp] = useState<string | null>(null);
  const [showIcdModal, setShowIcdModal] = useState(false);
  const [icdSearchQuery, setIcdSearchQuery] = useState("");
  const [icdSearchResults, setIcdSearchResults] = useState<
    Array<{ code: string; display: string; system: string; groupName?: string | null }>
  >([]);
  const [isSearchingIcd, setIsSearchingIcd] = useState(false);

  const isDoctorSigned = externalIsDoctorSigned ?? internalSigned;
  const signedAtTimestamp = externalSignedAtTimestamp ?? internalTimestamp;
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  // ==================== HANDLERS ====================
  const handleSearchIcd = async (queryStr: string) => {
    setIcdSearchQuery(queryStr);
    if (!queryStr.trim()) {
      setIcdSearchResults([]);
      return;
    }
    setIsSearchingIcd(true);
    try {
      const results = await searchIcd10Codes({ data: { query: queryStr, limit: 25 } });
      setIcdSearchResults(results || []);
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

  useEffect(() => {
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

  // ==================== SIGNATURE DRAWING ====================
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    setIsDrawing(true);
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const completeSignature = (dataUrl: string) => {
    setInternalSigned(true);
    setInternalTimestamp(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    );
    externalOnSignComplete?.(dataUrl);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = sigCanvasRef.current;
    if (canvas) {
      completeSignature(canvas.toDataURL());
    }
  };

  const handleUseRegisteredSignature = () => {
    const canvas = sigCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "#000000";
    ctx.moveTo(25, 45);
    ctx.bezierCurveTo(45, 10, 80, 15, 95, 48);
    ctx.bezierCurveTo(110, 65, 140, 18, 175, 38);
    ctx.bezierCurveTo(190, 52, 230, 20, 260, 42);
    ctx.stroke();
    completeSignature(canvas.toDataURL());
  };

  const handleClear = () => {
    const canvas = sigCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
    setInternalSigned(false);
    setInternalTimestamp(null);
    externalOnClearSignature?.();
  };

  // ==================== HELPERS ====================
  const personalCheckedCount = Object.values(formData.personalHistory || {}).filter(Boolean).length;
  const rosCheckedCount = Object.values(formData.reviewOfSystems || {}).filter(Boolean).length;
  const familyCheckedCount = Object.values(formData.familyHistory || {}).filter(Boolean).length;
  const surgCheckedCount = Object.values(formData.surgeries || {}).filter(Boolean).length;
  const totalCheckedCount = personalCheckedCount + rosCheckedCount + familyCheckedCount + surgCheckedCount;

  // ==================== COMPONENTS ====================
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
      className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs font-sans text-left transition-all duration-150 select-none w-full ${
        isChecked
          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
          : "bg-white text-slate-700 border-slate-200 hover:border-slate-400 hover:bg-slate-50"
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        <div
          className={`w-4 h-4 rounded flex items-center justify-center shrink-0 border transition-all ${
            isChecked
              ? "bg-emerald-400 border-emerald-400 text-slate-950 font-bold"
              : "bg-white border-slate-300 group-hover:border-slate-500"
          }`}
        >
          {isChecked && <Check size={12} strokeWidth={3} />}
        </div>
        <span className={`truncate ${isChecked ? "font-semibold text-white" : "font-medium"}`}>
          {label}
        </span>
      </div>
      {isChecked && isAiKey && (
        <span className="shrink-0 ml-1.5 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase rounded bg-emerald-400 text-slate-950 flex items-center gap-0.5">
          <Sparkles size={8} /> AI
        </span>
      )}
    </button>
  );

  const SectionHeader = ({
    title,
    rightContent,
    bgColor = "bg-slate-900",
  }: {
    title: string;
    rightContent?: React.ReactNode;
    bgColor?: string;
  }) => (
    <div
      className={`${bgColor} text-white px-4 py-2 font-bold text-xs uppercase tracking-wider flex flex-wrap items-center justify-between gap-2 font-mono`}
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
    <section className={`mb-6 rounded-xl border-2 border-slate-900 overflow-hidden shadow-xs ${className}`}>
      {children}
    </section>
  );

  // ==================== RENDER ====================
  return (
    <main className="mx-auto space-y-6 pb-12 font-sans">
      {/* Top Toolbar */}
      <div className="flow-stepper-bar no-print flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onNewRecording}
            className="px-3.5 py-1.5 rounded-lg border-2 border-black bg-white text-xs font-mono font-bold text-black hover:bg-neutral-100 flex items-center gap-1.5 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <RotateCcw size={13} />
            <span>Mulai Kasus Baru</span>
          </button>
          <span className="step-chip completed text-xs font-mono font-bold flex items-center gap-1 text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-300">
            <Check size={12} /> Konsultasi Suara
          </span>
          <ChevronRight size={14} className="text-neutral-400 hidden sm:block" />
          <span className="step-chip active text-xs font-mono font-bold text-white bg-black px-3 py-1 rounded-lg">
            ★ Medical History Form (EHR)
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 font-mono font-bold text-xs">
          <button
            type="button"
            onClick={onOpen3DStation}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-100 text-black hover:bg-neutral-200 border-2 border-black flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition"
          >
            <Sparkles size={14} />
            <span>🧬 Inspeksi 3D</span>
          </button>
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-1.5 rounded-lg border-2 border-black flex items-center gap-1.5 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
              isEditing
                ? "bg-emerald-600 text-white border-emerald-800"
                : "bg-white text-black hover:bg-neutral-100"
            }`}
          >
            {isEditing ? <Save size={13} /> : <Edit3 size={13} />}
            <span>{isEditing ? "Simpan Edit" : "Mode Edit"}</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-lg bg-black text-white hover:bg-neutral-800 flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] transition uppercase tracking-wider"
          >
            <Printer size={14} />
            <span>Cetak PDF</span>
          </button>
        </div>
      </div>

      {/* AI Banner */}
      <div className="mt-5 no-print bg-slate-900 text-white rounded-2xl p-4 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <Sparkles size={16} className="animate-pulse" />
            <span>AI Clinical Intelligence Auto-Checklist</span>
          </div>
          <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            {totalCheckedCount} Indikasi Klinis Aktif
          </span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          Sistem AI NARASI mengekstraksi percakapan konsultasi secara real-time dan mengidentifikasi
          keluhan fisik pasien menjadi ceklist medis terstruktur di bawah ini. Anda dapat mengklik atau
          mengedit setiap kolom secara langsung.
        </p>
      </div>

      {/* ================================================================
          FORM UTAMA
          ================================================================ */}
      <article className="clinical-report-doc pdf-form-document bg-white text-slate-900 p-6 sm:p-8 md:p-10 border-2 border-slate-900 shadow-2xl rounded-2xl font-sans text-[13px] leading-normal relative">
        {/* HEADER */}
        <header className="border-b-4 border-slate-950 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-950 text-white flex items-center justify-center font-bold text-3xl shadow-md shrink-0 border-2 border-emerald-400">
                <Stethoscope size={32} className="text-emerald-400" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase bg-slate-900 text-emerald-400 px-2 py-0.5 rounded">
                    REPUBLIK INDONESIA — KEMENKES RI
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-mono font-bold tracking-widest uppercase bg-slate-100 text-slate-900 border border-slate-300 px-2 py-0.5 rounded">
                    SATUSEHAT FHIR
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-slate-950 uppercase tracking-tight font-serif mt-1 leading-tight">
                  KLINIK UTAMA MED-AI ATELIER
                </h1>
                <p className="text-[10px] sm:text-[11px] font-mono text-slate-700 font-bold leading-tight">
                  Pusat Layanan Spesialis & Evaluasi Klinis Terpadu Berbasis AI
                </p>
                <p className="text-[9px] sm:text-[10px] text-slate-600 font-sans mt-0.5">
                  Jl. Kesehatan Raya No. 88, Jakarta Selatan 12430 | Telp: (021) 789-2026
                </p>
              </div>
            </div>

            <div className="text-right shrink-0 font-mono space-y-1 w-full sm:w-auto">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-white font-bold text-xs uppercase tracking-wider rounded border border-slate-800">
                <QrCode size={14} className="text-emerald-400" />
                <span>EHR-2026-NRS</span>
              </div>
              <div className="text-[10px] text-slate-800 font-bold">
                NO. RM:{" "}
                <span className="font-extrabold text-slate-950">
                  {formData.insurancePolicyNumber
                    ? formData.insurancePolicyNumber.slice(0, 12)
                    : "RM-2026-0891"}
                </span>
              </div>
              <div className="text-[10px] text-slate-600 font-medium">
                TGL CETAK:{" "}
                {new Date().toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2.5 border-t border-slate-300 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-[11px] font-mono font-bold uppercase text-slate-900">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" />
              <span>LEMBAR REKAM MEDIS & EVALUASI KLINIS PASIEN (SOAP)</span>
            </span>
            <span className="text-slate-500 font-normal italic lowercase text-[9px] sm:text-[10px]">
              *rahasia medis (confidential)
            </span>
          </div>
        </header>

        {/* ================================================================
            SECTION 1: PATIENT INFORMATION
            ================================================================ */}
        <FormSection>
          <SectionHeader
            title="1. Identitas Pasien (Patient Information)"
            rightContent={
              <span className="text-slate-300">
                No. RM:{" "}
                {formData.insurancePolicyNumber
                  ? formData.insurancePolicyNumber.slice(0, 12)
                  : "RM-2026-0891"}
              </span>
            }
          />
          <div className="p-4 bg-slate-50/50 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                  Nama Pasien / Patient Name
                </label>
                <input
                  type="text"
                  value={formData.patientName}
                  onChange={(e) => updateField("patientName", e.target.value)}
                  placeholder="Ketik nama pasien..."
                  className="font-serif font-bold text-slate-900 text-sm w-full bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                />
              </div>
              <div className="sm:col-span-3 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                  Tgl Lahir / DOB
                </label>
                <input
                  type="text"
                  value={formData.patientDob}
                  onChange={(e) => updateField("patientDob", e.target.value)}
                  placeholder="14 Mei 1978"
                  className="font-mono text-xs w-full bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                />
              </div>
              <div className="sm:col-span-3 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                  Jenis Kelamin / Gender
                </label>
                <select
                  value={formData.patientGender}
                  onChange={(e) => updateField("patientGender", e.target.value as any)}
                  className="font-bold text-xs w-full bg-transparent outline-none"
                >
                  <option value="M">Laki-laki (Male)</option>
                  <option value="F">Perempuan (Female)</option>
                  <option value="Other">Lainnya (Other)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-8 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                  Alamat Pasien / Address
                </label>
                <input
                  type="text"
                  value={formData.patientAddress}
                  onChange={(e) => updateField("patientAddress", e.target.value)}
                  placeholder="Alamat lengkap..."
                  className="text-xs w-full bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                />
              </div>
              <div className="sm:col-span-4 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-0.5">
                  No. Telepon / Phone
                </label>
                <input
                  type="text"
                  value={formData.patientPhone}
                  onChange={(e) => updateField("patientPhone", e.target.value)}
                  placeholder="0812-..."
                  className="font-mono text-xs w-full bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
              <div className="sm:col-span-6 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Kontak Darurat / Emergency Contact
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={formData.emergencyContactName}
                    onChange={(e) => updateField("emergencyContactName", e.target.value)}
                    placeholder="Nama Kerabat"
                    className="font-semibold text-xs flex-1 min-w-[80px] bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                  />
                  <input
                    type="text"
                    value={formData.emergencyContactRelationship}
                    onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
                    placeholder="Hubungan"
                    className="text-xs flex-1 min-w-[60px] bg-transparent outline-none border-b border-transparent focus:border-slate-900 text-slate-500"
                  />
                  <input
                    type="text"
                    value={formData.emergencyContactPhone}
                    onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                    placeholder="No. HP"
                    className="font-mono text-xs flex-1 min-w-[80px] bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                  />
                </div>
              </div>
              <div className="sm:col-span-6 bg-white p-3 rounded-lg border border-slate-300">
                <label className="text-[10px] font-bold uppercase text-slate-500 block mb-1">
                  Penjamin / Insurance Provider & Policy
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <input
                    type="text"
                    value={formData.insuranceProvider}
                    onChange={(e) => updateField("insuranceProvider", e.target.value)}
                    placeholder="BPJS / Asuransi"
                    className="font-semibold text-xs flex-1 min-w-[100px] bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                  />
                  <input
                    type="text"
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => updateField("insurancePolicyNumber", e.target.value)}
                    placeholder="No. Polis / Kartu"
                    className="font-mono text-xs flex-1 min-w-[100px] bg-transparent outline-none border-b border-transparent focus:border-slate-900 font-bold text-slate-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </FormSection>

        {/* ================================================================
            SECTION 2: PERSONAL HISTORY
            ================================================================ */}
        <FormSection>
          <SectionHeader
            title="2. Riwayat Penyakit Pribadi (Personal History)"
            rightContent={
              <span className="text-emerald-400">{personalCheckedCount} Indikasi Ditemukan AI</span>
            }
          />
          <div className="p-4 bg-slate-50/50 space-y-4">
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

            <div className="bg-white p-3 rounded-lg border border-slate-300 space-y-1">
              <label className="font-bold text-xs uppercase tracking-wider text-slate-700 block">
                Catatan Anamnesis / Other Medical Issues:
              </label>
              <textarea
                rows={2}
                value={formData.otherMedicalIssues}
                onChange={(e) => updateField("otherMedicalIssues", e.target.value)}
                placeholder="Tambahkan catatan riwayat penyakit atau keluhan tambahan..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-serif text-slate-900 text-xs focus:outline-none focus:border-slate-900"
              />
            </div>
          </div>
        </FormSection>

        {/* ================================================================
            SECTION 3: MEDICATIONS
            ================================================================ */}
        <FormSection>
          <SectionHeader
            title="3. Resep & Terapi Obat Aktif (Current Medications)"
            rightContent={
              <button
                type="button"
                onClick={handleAddMedication}
                className="no-print text-[11px] font-bold text-slate-950 bg-emerald-400 px-2.5 py-0.5 rounded hover:bg-emerald-300 transition flex items-center gap-1"
              >
                <Plus size={12} /> Tambah Obat
              </button>
            }
          />
          <div className="overflow-x-auto bg-white">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b-2 border-slate-900 text-slate-900 font-mono">
                  <th className="p-2.5 border-r border-slate-300 font-bold min-w-[120px]">
                    Nama Obat / Terapi
                  </th>
                  <th className="p-2.5 border-r border-slate-300 font-bold min-w-[80px]">Dosis</th>
                  <th className="p-2.5 border-r border-slate-300 font-bold min-w-[100px]">
                    Frekuensi
                  </th>
                  <th className="p-2.5 border-r border-slate-300 font-bold min-w-[120px]">
                    Indikasi Medis
                  </th>
                  <th className="p-2.5 font-bold text-center no-print min-w-[50px]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {formData.medications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-slate-500 italic font-serif">
                      Belum ada obat yang ditambahkan. Klik "Tambah Obat" atau jalankan AI Extraction.
                    </td>
                  </tr>
                ) : (
                  formData.medications.map((med) => (
                    <tr key={med.id} className="hover:bg-slate-50 transition">
                      <td className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          value={med.name}
                          onChange={(e) => handleMedicationChange(med.id, "name", e.target.value)}
                          placeholder="Nama Obat"
                          className="w-full font-bold text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          value={med.dosage}
                          onChange={(e) => handleMedicationChange(med.id, "dosage", e.target.value)}
                          placeholder="5 mg"
                          className="w-full text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-900 font-mono text-xs"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          value={med.frequency}
                          onChange={(e) =>
                            handleMedicationChange(med.id, "frequency", e.target.value)
                          }
                          placeholder="1x1 tablet / hari"
                          className="w-full text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                        />
                      </td>
                      <td className="p-2 border-r border-slate-200">
                        <input
                          type="text"
                          value={med.purpose}
                          onChange={(e) =>
                            handleMedicationChange(med.id, "purpose", e.target.value)
                          }
                          placeholder="Indikasi Terapi"
                          className="w-full text-slate-900 bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                        />
                      </td>
                      <td className="p-2 text-center no-print">
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(med.id)}
                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                          title="Hapus Obat"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </FormSection>

        {/* ================================================================
            SECTION 4: SURGERIES & ALLERGIES
            ================================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">
          <div className="md:col-span-7 rounded-xl border-2 border-slate-900 overflow-hidden shadow-xs bg-slate-50/50">
            <div className="bg-slate-900 text-white px-3.5 py-2 font-bold text-xs uppercase tracking-wider font-mono">
              4A. Riwayat Operasi (Surgeries)
            </div>
            <div className="p-3 grid grid-cols-2 gap-2">
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

          <div className="md:col-span-5 rounded-xl border-2 border-red-900 overflow-hidden shadow-xs bg-red-50/30 flex flex-col justify-between">
            <div className="bg-red-900 text-white px-3.5 py-2 font-bold text-xs uppercase tracking-wider font-mono flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <AlertTriangle size={14} className="text-yellow-400" />
                4B. Riwayat Alergi (Allergies)
              </span>
              <span className="text-[10px] text-red-200">Wajib Diisi</span>
            </div>
            <div className="p-3 space-y-2 flex-1">
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
                    className="px-2 py-0.5 rounded bg-white border border-red-300 hover:bg-red-100 text-[10px] font-semibold text-red-950 transition"
                  >
                    + {al}
                  </button>
                ))}
              </div>
              <textarea
                rows={3}
                value={formData.allergies}
                onChange={(e) => updateField("allergies", e.target.value)}
                placeholder="Ketikkan riwayat alergi obat, makanan, debu..."
                className="w-full p-2.5 bg-white border border-red-300 rounded-lg font-serif text-slate-900 text-xs focus:outline-none focus:border-red-900 shadow-inner"
              />
            </div>
          </div>
        </div>

        {/* ================================================================
            SECTION 5: FAMILY HISTORY
            ================================================================ */}
        <FormSection>
          <SectionHeader
            title="5. Riwayat Kesehatan Keluarga (Family History)"
            rightContent={
              <span className="text-slate-300">{familyCheckedCount} Teridentifikasi</span>
            }
          />
          <div className="p-4 bg-slate-50/50 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
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

        {/* ================================================================
            SECTION 6: SOCIAL HISTORY
            ================================================================ */}
        <FormSection>
          <SectionHeader title="6. Gaya Hidup & Faktor Sosial (Social History)" />
          <div className="p-4 bg-slate-50/50 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-slate-200">
              <span className="sm:col-span-3 font-bold text-slate-900">Merokok (Tobacco):</span>
              <div className="sm:col-span-9 flex flex-wrap items-center gap-4">
                {["Non-smoker", "Cigarettes", "Vaping", "Tobacco"].map((item) => (
                  <label key={item} className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="tobacco"
                      checked={formData.tobaccoUse === item}
                      onChange={() => updateField("tobaccoUse", item as any)}
                      className="accent-slate-950"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center bg-white p-3 rounded-lg border border-slate-200">
              <span className="sm:col-span-3 font-bold text-slate-900">Konsumsi Alkohol:</span>
              <div className="sm:col-span-9 flex flex-wrap items-center gap-4">
                {["None", "Occasional", "Moderate", "Heavy"].map((item) => (
                  <label key={item} className="flex items-center gap-1.5 cursor-pointer font-medium">
                    <input
                      type="radio"
                      name="alcohol"
                      checked={formData.alcoholUse === item}
                      onChange={() => updateField("alcoholUse", item as any)}
                      className="accent-slate-950"
                    />
                    <span>{item}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-6 bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900">Pekerjaan (Occupation):</span>
                <input
                  type="text"
                  value={formData.occupation || "Wiraswasta"}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  className="font-medium text-xs bg-slate-50 px-2 py-1 rounded border border-slate-300 outline-none flex-1 min-w-[100px]"
                />
              </div>
              <div className="sm:col-span-6 bg-white p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-2">
                <span className="font-bold text-slate-900">Tempat Tinggal:</span>
                <select
                  value={formData.livingSituation}
                  onChange={(e) => updateField("livingSituation", e.target.value as any)}
                  className="font-medium text-xs bg-slate-50 px-2 py-1 rounded border border-slate-300 outline-none flex-1 min-w-[100px]"
                >
                  <option value="With family">Bersama Keluarga (With family)</option>
                  <option value="With S/O">Bersama Pasangan (With S/O)</option>
                  <option value="With roommates">Bersama Teman (With roommates)</option>
                  <option value="Other">Lainnya (Other)</option>
                </select>
              </div>
            </div>
          </div>
        </FormSection>

        {/* ================================================================
            SECTION 7: REVIEW OF SYSTEMS
            ================================================================ */}
        <FormSection>
          <SectionHeader
            title="7. Skrining Gejala Organ (Review of Systems - ROS)"
            rightContent={
              <span className="text-emerald-400 font-bold">{rosCheckedCount} Gejala Positif</span>
            }
          />
          <div className="p-4 bg-slate-50/50 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* General */}
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                <span className="font-bold uppercase text-[11px] font-mono text-slate-900 border-b border-slate-200 pb-1 block">
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
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                <span className="font-bold uppercase text-[11px] font-mono text-slate-900 border-b border-slate-200 pb-1 block">
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
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                <span className="font-bold uppercase text-[11px] font-mono text-slate-900 border-b border-slate-200 pb-1 block">
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
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                <span className="font-bold uppercase text-[11px] font-mono text-slate-900 border-b border-slate-200 pb-1 block">
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
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                <span className="font-bold uppercase text-[11px] font-mono text-slate-900 border-b border-slate-200 pb-1 block">
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
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-2">
                <span className="font-bold uppercase text-[11px] font-mono text-slate-900 border-b border-slate-200 pb-1 block">
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

        {/* ================================================================
            SECTION 8: CLINICAL ASSESSMENT
            ================================================================ */}
        <FormSection>
          <SectionHeader
            title="8. Diagnosa Medis & Tanda Vital (Primary Assessment)"
            rightContent={
              <select
                value={formData.severity}
                onChange={(e) => updateField("severity", e.target.value as any)}
                className="text-[10px] bg-emerald-400 text-slate-950 font-extrabold uppercase px-2.5 py-0.5 rounded outline-none cursor-pointer"
              >
                <option value="CRITICAL">CRITICAL</option>
                <option value="SEVERE">SEVERE</option>
                <option value="MODERATE">MODERATE</option>
                <option value="MILD">MILD</option>
                <option value="NORMAL">NORMAL</option>
              </select>
            }
          />
          <div className="p-4 bg-slate-50/50 space-y-4">
            {/* ICD-10 Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 no-print bg-white p-2.5 rounded-xl border border-slate-300">
              <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
                <span className="font-bold text-slate-500 uppercase mr-1">Preset ICD-10:</span>
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
                    className="px-2 py-0.5 rounded bg-slate-900 text-emerald-400 font-bold hover:bg-slate-800 transition whitespace-nowrap"
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
                className="px-3 py-1 bg-slate-900 text-white rounded-lg font-mono text-[11px] font-bold hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm whitespace-nowrap"
              >
                <Search size={13} className="text-emerald-400" />
                <span>Cari ICD-10</span>
              </button>
            </div>

            {/* Diagnosis */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              <div className="sm:col-span-9 bg-white p-3 rounded-xl border border-slate-300 space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 block">
                  Diagnosa Klinis Utama
                </label>
                <input
                  type="text"
                  value={formData.diagnosis}
                  onChange={(e) => updateField("diagnosis", e.target.value)}
                  placeholder="Ketikkan nama diagnosa medis..."
                  className="font-serif font-black text-slate-950 text-base w-full bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                />
              </div>
              <div className="sm:col-span-3 bg-white p-3 rounded-xl border border-slate-300 space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-500 block">
                  Kode ICD-10
                </label>
                <input
                  type="text"
                  value={formData.diagnosisIcd}
                  onChange={(e) => updateField("diagnosisIcd", e.target.value)}
                  placeholder="I20.9 / J06.9"
                  className="font-mono font-bold text-slate-950 text-sm w-full bg-transparent outline-none border-b border-transparent focus:border-slate-900"
                />
              </div>
            </div>

            {/* Vital Signs */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 font-mono">
              <div className="bg-white p-2.5 rounded-xl border border-slate-300 text-center space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Tensi (BP)</span>
                <input
                  type="text"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => updateVitalSign("bloodPressure", e.target.value)}
                  className="font-black text-sm text-slate-950 text-center w-full bg-transparent outline-none"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-300 text-center space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Nadi (HR)</span>
                <input
                  type="text"
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => updateVitalSign("heartRate", e.target.value)}
                  className="font-black text-sm text-slate-950 text-center w-full bg-transparent outline-none"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-300 text-center space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Nafas (RR)</span>
                <input
                  type="text"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={(e) => updateVitalSign("respiratoryRate", e.target.value)}
                  className="font-black text-sm text-slate-950 text-center w-full bg-transparent outline-none"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-300 text-center space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">SpO2</span>
                <input
                  type="text"
                  value={formData.vitalSigns.spo2}
                  onChange={(e) => updateVitalSign("spo2", e.target.value)}
                  className="font-black text-sm text-slate-950 text-center w-full bg-transparent outline-none"
                />
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-300 text-center space-y-0.5">
                <span className="text-[10px] text-slate-500 uppercase block font-bold">Suhu</span>
                <input
                  type="text"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => updateVitalSign("temperature", e.target.value)}
                  className="font-black text-sm text-slate-950 text-center w-full bg-transparent outline-none"
                />
              </div>
            </div>

            {/* Recommendations & Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-1">
                <label className="font-bold uppercase text-[11px] text-slate-700 block">
                  Tata Laksana Medis & Anjuran DPJP:
                </label>
                <textarea
                  rows={3}
                  value={formData.recommendations}
                  onChange={(e) => updateField("recommendations", e.target.value)}
                  placeholder="Instruksi pengobatan & rencana penanganan..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-serif text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                />
              </div>
              <div className="bg-white p-3 rounded-xl border border-slate-300 space-y-1">
                <label className="font-bold uppercase text-[11px] text-slate-700 block">
                  Ringkasan Untuk Pasien (Bahasa Awam):
                </label>
                <textarea
                  rows={3}
                  value={formData.patientSummary}
                  onChange={(e) => updateField("patientSummary", e.target.value)}
                  placeholder="Penjelasan ringkas kondisi pasien..."
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded font-serif text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                />
              </div>
            </div>
          </div>
        </FormSection>

        {/* ================================================================
            SECTION 9: SIGNATURE
            ================================================================ */}
        <section className="pt-4 border-t-2 border-slate-900 flex flex-col lg:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <div className="w-16 h-16 bg-slate-100 border-2 border-slate-900 rounded-xl flex items-center justify-center p-1 shrink-0">
              <QrCode size={48} className="text-slate-950" />
            </div>
            <div className="space-y-1 text-center sm:text-left">
              <div className="inline-flex items-center gap-1 text-[10px] font-mono font-bold bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded border border-emerald-300">
                <BadgeCheck size={12} /> VERIFIKASI DIGITAL SATUSEHAT
              </div>
              <p className="text-[11px] font-medium text-slate-600 max-w-xs leading-tight">
                Dokumen ini ditandatangani secara elektronik dan tersimpan secara sah dalam jaringan
                Rekam Medis Elektronik Nasional.
              </p>
            </div>
          </div>

          <div className="text-center lg:text-right space-y-2 w-full lg:w-auto">
            <div className="text-[11px] font-mono font-bold text-slate-700">
              Dokter Penanggung Jawab Pelayanan (DPJP)
            </div>

            <div className="relative inline-block bg-slate-50 border-2 border-slate-900 rounded-xl p-2 min-w-[240px] w-full sm:w-auto">
              <canvas
                ref={sigCanvasRef}
                width={240}
                height={80}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="cursor-crosshair bg-white border border-slate-200 rounded touch-none w-full h-auto"
              />
              <div className="flex flex-wrap items-center justify-between pt-1 font-mono text-[10px] no-print gap-1">
                <button
                  type="button"
                  onClick={handleUseRegisteredSignature}
                  className="text-emerald-700 hover:underline font-bold"
                >
                  + Gunakan TTE Terdaftar
                </button>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-slate-500 hover:text-red-600"
                >
                  Hapus
                </button>
              </div>
              {isDoctorSigned && signedAtTimestamp && (
                <div className="mt-1 text-[9px] font-mono font-bold text-emerald-800 bg-emerald-50 py-0.5 px-1.5 rounded border border-emerald-200 text-center">
                  ✓ TTD Sah: {signedAtTimestamp}
                </div>
              )}
            </div>

            <div className="space-y-0.5">
              <input
                type="text"
                value={formData.doctorName}
                onChange={(e) => updateField("doctorName", e.target.value)}
                className="font-serif font-black text-sm text-slate-950 text-center lg:text-right w-full bg-transparent outline-none"
              />
              <div className="text-[11px] text-slate-600 font-medium">{formData.doctorSpecialty}</div>
              <div className="text-[10px] font-mono font-bold text-slate-800">{formData.doctorSip}</div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 pt-3 border-t border-slate-300 flex flex-wrap items-center justify-between gap-2 text-[9px] font-mono text-slate-500 leading-tight">
          <span className="text-center sm:text-left">
            Dokumen Rekam Medis Elektronik ini diterbitkan oleh KLINIK UTAMA MED-AI ATELIER HEALTH
            (Faskes ID: 3171092-KARS) dan sah secara hukum sesuai Permenkes RI No. 24 Tahun 2022
            tentang Rekam Medis.
          </span>
          <span className="font-bold text-slate-700 shrink-0">SATUSEHAT FHIR READY</span>
        </footer>
      </article>

      {/* ICD-10 Modal */}
      {showIcdModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs no-print">
          <div className="bg-white border-2 border-slate-900 rounded-2xl p-4 sm:p-6 max-w-xl w-full shadow-2xl space-y-4 font-sans text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between border-b-2 border-slate-900 pb-3 font-mono gap-2">
              <div className="flex items-center gap-2">
                <Database size={18} className="text-emerald-600" />
                <h3 className="font-black text-sm uppercase text-slate-950">
                  Pencarian Kode ICD-10
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowIcdModal(false)}
                className="p-1 rounded text-slate-500 hover:text-slate-950 hover:bg-slate-100"
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
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border-2 border-slate-900 rounded-xl font-medium text-slate-950 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-400"
                autoFocus
              />
              <Search size={16} className="absolute left-3 top-3 text-slate-400" />
            </div>

            <div className="max-h-72 overflow-y-auto divide-y divide-slate-200 border border-slate-300 rounded-xl">
              {isSearchingIcd ? (
                <div className="p-6 text-center text-slate-500 font-mono animate-pulse">
                  Mencari data ICD-10 di Database PostgreSQL...
                </div>
              ) : icdSearchResults.length === 0 ? (
                <div className="p-6 text-center text-slate-500 italic font-serif">
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
                    className="w-full p-3 text-left hover:bg-emerald-50 transition flex flex-wrap items-center justify-between gap-2 group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-mono font-black text-slate-950 text-sm group-hover:text-emerald-700 flex flex-wrap items-center gap-2">
                        <span>{item.code}</span>
                        {item.groupName && (
                          <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-300 font-sans font-normal">
                            {item.groupName}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-700 font-medium truncate">
                        {item.display}
                      </div>
                    </div>
                    <span className="shrink-0 px-2 py-1 text-[10px] font-mono font-bold bg-slate-900 text-white rounded group-hover:bg-emerald-600">
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
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-950 font-mono font-bold rounded-lg uppercase text-xs"
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