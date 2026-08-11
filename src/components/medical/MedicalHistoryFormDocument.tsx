"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Printer,
  CheckCircle2,
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
} from "lucide-react";
import type { OrganId } from "../../lib/anatomy-data";

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
  // Patient Info
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

  // Personal History Checklist
  personalHistory: Record<string, boolean>;
  personalHistoryCancerSpecify?: string;
  otherMedicalIssues: string;

  // Medications Table
  medications: MedicationItem[];

  // Surgeries & Procedures
  surgeries: Record<string, boolean>;
  surgeriesOtherSpecify?: string;
  allergies: string;

  // Family History Checklist
  familyHistory: Record<string, boolean>;
  familyHistoryOtherSpecify?: string;

  // Social History
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

  // Review of Systems (ROS)
  reviewOfSystems: Record<string, boolean>;

  // Assessment & 3D Spatial
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

  // Doctor Info
  doctorName: string;
  doctorSpecialty: string;
  doctorSip: string;
  modality: string;
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
  onOpen3DHotspot: _onOpen3DHotspot,
  onSelectFinding: _onSelectFinding,
  onNewRecording = () => {},
  isDoctorSigned: externalIsDoctorSigned,
  signedAtTimestamp: externalSignedAtTimestamp,
  onSignComplete: externalOnSignComplete,
  onClearSignature: externalOnClearSignature,
}: MedicalHistoryFormDocumentProps) {
  const activeIncomingData = data || initialData || DEFAULT_FORM_DATA;
  const [formData, setFormData] = useState<MedicalFormData>(activeIncomingData);
  const [isEditing, setIsEditing] = useState(false);
  const [patientSignatureConfirmed, setPatientSignatureConfirmed] = useState(true);

  // Internal signature state fallback if not managed externally
  const [internalSigned, setInternalSigned] = useState(false);
  const [internalTimestamp, setInternalTimestamp] = useState<string | null>(null);

  const isDoctorSigned = externalIsDoctorSigned ?? internalSigned;
  const signedAtTimestamp = externalSignedAtTimestamp ?? internalTimestamp;

  // Sync with preset / prop changes safely
  useEffect(() => {
    if (data || initialData) {
      setFormData(data || initialData || DEFAULT_FORM_DATA);
    }
  }, [data, initialData]);

  // Canvas drawing for Doctor Signature
  const sigCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
        vitalSigns: {
          ...prev.vitalSigns,
          [key]: value,
        },
      };
      onChange?.(next);
      return next;
    });
  };

  const toggleCheckbox = (category: "personalHistory" | "surgeries" | "familyHistory" | "reviewOfSystems", key: string) => {
    setFormData((prev) => {
      const current = prev || DEFAULT_FORM_DATA;
      const catObj = current[category] || {};
      const next = {
        ...current,
        [category]: {
          ...catObj,
          [key]: !catObj[key],
        },
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

  // Drawing handlers
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
    ctx.strokeStyle = "#1e3a8a";
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
    ctx.strokeStyle = "#1e3a8a";
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

  return (
    <main className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Top Action Bar (No-Print) */}
      <div className="flow-stepper-bar no-print flex flex-wrap items-center justify-between gap-3 bg-[var(--paper)] p-4 rounded-2xl border border-[var(--line)] shadow-xs">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewRecording}
            className="px-3.5 py-1.5 rounded-full border border-[var(--line)] bg-white text-xs font-serif font-semibold text-[var(--ink-soft)] hover:text-[var(--terracotta)] flex items-center gap-1.5 transition shadow-xs"
          >
            <RotateCcw size={13} />
            <span>Mulai Kasus Baru</span>
          </button>

          <span className="step-chip completed text-xs flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            <Check size={12} /> Percakapan Klinis
          </span>
          <ChevronRight size={14} className="text-[var(--ink-muted)]" />
          <span className="step-chip active text-xs font-bold text-[var(--terracotta)] bg-[rgba(235,124,107,0.12)] px-3 py-1 rounded-full border border-[rgba(235,124,107,0.3)]">
            ★ Medical Report (EHR Form)
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* 3D Station Callout Button */}
          <button
            type="button"
            onClick={onOpen3DStation}
            className="px-4 py-1.5 rounded-full bg-[rgba(235,124,107,0.15)] text-[var(--terracotta-deep)] hover:bg-[var(--terracotta)] hover:text-white border border-[rgba(235,124,107,0.35)] text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Sparkles size={14} className="text-[var(--terracotta)]" />
            <span>🧬 Inspeksi 3D Anatomy</span>
          </button>

          {/* Toggle Interactive Edit Mode */}
          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-serif font-bold border flex items-center gap-1.5 transition shadow-xs ${
              isEditing
                ? "bg-emerald-600 text-white border-emerald-700 ring-2 ring-emerald-300"
                : "bg-white text-[var(--ink)] border-[var(--line)] hover:border-[var(--terracotta)]"
            }`}
          >
            {isEditing ? <Save size={13} /> : <Edit3 size={13} />}
            <span>{isEditing ? "Mode Edit Aktif (Simpan)" : "Mode Edit Semua Kolom"}</span>
          </button>

          {/* Print / Download PDF */}
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-1.5 rounded-full bg-[var(--ink)] text-white hover:bg-black text-xs font-serif font-bold flex items-center gap-1.5 shadow-xs transition"
          >
            <Printer size={14} />
            <span>Cetak / Cetak PDF</span>
          </button>
        </div>
      </div>

      {isEditing && (
        <div className="no-print bg-emerald-50 border border-emerald-300 rounded-2xl p-3.5 flex items-center gap-3 text-xs text-emerald-900 font-serif">
          <Sparkles size={18} className="text-emerald-700 shrink-0" />
          <div>
            <b>Mode Edit Dokumen Terbuka:</b> Anda dapat mengedit Nama Pasien, Tanggal Lahir, Riwayat Alergi, Obat-obatan, ICD-10, Catatan Anamnesis, dan Tanda-Tanda Vital secara langsung. Setiap perubahan pada rekam medis otomatis tersimpan secara aman.
          </div>
        </div>
      )}

      {/* =========================================================================
          THE OFFICIAL MEDICAL HISTORY & CLINICAL ASSESSMENT FORM (FILLABLE EHR PDF)
          ========================================================================= */}
      <article className="clinical-report-doc pdf-form-document bg-white text-black p-8 sm:p-10 border border-black shadow-2xl font-sans text-[13px] leading-normal relative">
        
        {/* Document Header with Medical Emblem */}
        <header className="flex items-start justify-between border-b-2 border-black pb-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-black text-white flex items-center justify-center font-bold text-xl tracking-tighter">
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight uppercase text-black font-serif">
                MEDICAL HISTORY FORM
              </h1>
              <p className="text-[11px] font-medium text-neutral-700 tracking-wide">
                LEMBAR REKAM MEDIS & FORMULIR EVALUASI KLINIS TERPADU (EHR)
              </p>
            </div>
          </div>

          <div className="text-right text-[10px] font-mono text-neutral-600">
            <span className="inline-block px-2 py-0.5 border border-black font-bold uppercase bg-neutral-100 mb-1">
              STANDARD FORM EHR-01
            </span>
            <div>Faskes ID: 3171092-KARS</div>
            <div>Tgl: {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}</div>
          </div>
        </header>

        {/* =====================================================================
            SECTION 1: PATIENT INFORMATION (BORDERED GRID)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider flex items-center justify-between">
            <span>Patient Information</span>
            <span className="text-[10px] font-mono text-neutral-800">
              No. RM: {formData.insurancePolicyNumber ? formData.insurancePolicyNumber.slice(0, 10) : "RM-2026-0891"}
            </span>
          </div>

          {/* Row 1: Name, DOB, Gender */}
          <div className="grid grid-cols-12 border-b border-black text-xs">
            <div className="col-span-12 sm:col-span-5 p-2 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-14">Name:</span>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
                placeholder="Nama Lengkap Pasien"
                className="font-semibold text-black font-serif text-sm w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
            <div className="col-span-6 sm:col-span-3 p-2 border-r border-black flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-10">DOB:</span>
              <input
                type="text"
                value={formData.patientDob}
                onChange={(e) => updateField("patientDob", e.target.value)}
                placeholder="Contoh: 14 Mei 1978"
                className="font-mono text-xs w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
            <div className="col-span-6 sm:col-span-4 p-2 flex items-center gap-3">
              <span className="font-bold text-neutral-800">Gender:</span>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="genderRadio"
                  checked={formData.patientGender === "M"}
                  onChange={() => updateField("patientGender", "M")}
                  className="w-3.5 h-3.5 accent-black"
                />
                <span>M (Laki-laki)</span>
              </label>
              <label className="flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name="genderRadio"
                  checked={formData.patientGender === "F"}
                  onChange={() => updateField("patientGender", "F")}
                  className="w-3.5 h-3.5 accent-black"
                />
                <span>F (Perempuan)</span>
              </label>
            </div>
          </div>

          {/* Row 2: Address & Phone */}
          <div className="grid grid-cols-12 border-b border-black text-xs">
            <div className="col-span-12 sm:col-span-8 p-2 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-16">Address:</span>
              <input
                type="text"
                value={formData.patientAddress}
                onChange={(e) => updateField("patientAddress", e.target.value)}
                className="w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
            <div className="col-span-12 sm:col-span-4 p-2 flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-14">Phone:</span>
              <input
                type="text"
                value={formData.patientPhone}
                onChange={(e) => updateField("patientPhone", e.target.value)}
                className="font-mono text-xs w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Row 3: Emergency Contact Header & Data */}
          <div className="bg-neutral-100 px-3 py-0.5 font-bold text-[11px] uppercase border-b border-black text-neutral-800">
            Emergency Contact
          </div>
          <div className="grid grid-cols-12 border-b border-black text-xs">
            <div className="col-span-12 sm:col-span-5 p-2 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-14">Name:</span>
              <input
                type="text"
                value={formData.emergencyContactName}
                onChange={(e) => updateField("emergencyContactName", e.target.value)}
                className="w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
            <div className="col-span-6 sm:col-span-3 p-2 border-r border-black flex items-center gap-1.5">
              <span className="font-bold text-neutral-800">Rel:</span>
              <input
                type="text"
                value={formData.emergencyContactRelationship}
                onChange={(e) => updateField("emergencyContactRelationship", e.target.value)}
                className="w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
            <div className="col-span-6 sm:col-span-4 p-2 flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-14">Phone:</span>
              <input
                type="text"
                value={formData.emergencyContactPhone}
                onChange={(e) => updateField("emergencyContactPhone", e.target.value)}
                className="font-mono text-xs w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
          </div>

          {/* Row 4: Insurance Information */}
          <div className="bg-neutral-100 px-3 py-0.5 font-bold text-[11px] uppercase border-b border-black text-neutral-800">
            Insurance Information
          </div>
          <div className="grid grid-cols-12 text-xs">
            <div className="col-span-12 sm:col-span-7 p-2 border-b sm:border-b-0 sm:border-r border-black flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-32">Insurance Provider:</span>
              <input
                type="text"
                value={formData.insuranceProvider}
                onChange={(e) => updateField("insuranceProvider", e.target.value)}
                className="w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
            <div className="col-span-12 sm:col-span-5 p-2 flex items-center gap-1.5">
              <span className="font-bold text-neutral-800 w-28">Policy Number:</span>
              <input
                type="text"
                value={formData.insurancePolicyNumber}
                onChange={(e) => updateField("insurancePolicyNumber", e.target.value)}
                className="font-mono font-semibold text-xs w-full bg-transparent focus:bg-yellow-50 px-1 border-b border-dashed border-transparent focus:border-black outline-none"
              />
            </div>
          </div>
        </div>

        {/* =====================================================================
            SECTION 2: PERSONAL HISTORY (CHECK ALL THAT APPLY - 2 COLUMN GRID)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider flex items-center justify-between">
            <span>Personal history (check all that apply)</span>
            <span className="text-[10px] italic font-normal text-neutral-800">Diekstraksi AI & dapat diedit langsung</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 text-xs border-b border-black">
            {/* Left Column */}
            <div className="p-3 border-b sm:border-b-0 sm:border-r border-black space-y-1.5">
              {[
                { key: "no_known_history", label: "No known medical history" },
                { key: "acid_reflux", label: "Acid Reflux / GERD" },
                { key: "anemia", label: "Anemia" },
                { key: "anxiety", label: "Anxiety" },
                { key: "asthma", label: "Asthma" },
                { key: "cancer", label: "Cancer (specify below)" },
                { key: "congestive_heart_failure", label: "Congestive Heart Failure" },
                { key: "copd", label: "COPD" },
                { key: "depression", label: "Depression" },
                { key: "diabetes_type1", label: "Diabetes Type 1" },
                { key: "diabetes_type2", label: "Diabetes Type 2" },
                { key: "eating_disorder", label: "Eating Disorder" },
              ].map((item) => {
                const isChecked = !!formData.personalHistory[item.key];
                return (
                  <label
                    key={item.key}
                    onClick={() => toggleCheckbox("personalHistory", item.key)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 py-0.5 px-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 accent-black rounded-none"
                    />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Right Column */}
            <div className="p-3 space-y-1.5">
              {[
                { key: "heart_disease", label: "Heart Disease" },
                { key: "hepatitis", label: "Hepatitis" },
                { key: "high_blood_pressure", label: "High Blood Pressure (Hipertensi)" },
                { key: "high_cholesterol", label: "High Cholesterol (Dislipidemia)" },
                { key: "hiv_aids", label: "HIV / AIDS" },
                { key: "kidney_disease", label: "Kidney Disease (Gagal Ginjal)" },
                { key: "liver_disease", label: "Liver Disease / Steatohepatitis" },
                { key: "osteoporosis", label: "Osteoporosis" },
                { key: "seizures", label: "Seizures / Epilepsy" },
                { key: "stroke", label: "Stroke / TIA" },
                { key: "thyroid_disease", label: "Thyroid Disease" },
                { key: "other_personal", label: "Other" },
              ].map((item) => {
                const isChecked = !!formData.personalHistory[item.key];
                return (
                  <label
                    key={item.key}
                    onClick={() => toggleCheckbox("personalHistory", item.key)}
                    className="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 py-0.5 px-1 rounded"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 accent-black rounded-none"
                    />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>
                      {item.label}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Other Medical Issues Free-text input */}
          <div className="p-3 text-xs bg-neutral-50">
            <span className="font-bold block uppercase tracking-wider text-neutral-800 mb-1">
              Catatan Anamnesis / Other Medical Issues:
            </span>
            <textarea
              rows={2}
              value={formData.otherMedicalIssues}
              onChange={(e) => updateField("otherMedicalIssues", e.target.value)}
              placeholder="Tambahkan catatan riwayat penyakit atau keluhan lain..."
              className="w-full p-2 bg-white border border-neutral-300 rounded font-serif text-black focus:outline-none focus:border-black text-xs"
            />
          </div>
        </div>

        {/* =====================================================================
            SECTION 3: MEDICATIONS / TREATMENTS (INTERACTIVE TABLE)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider flex items-center justify-between">
            <span>Current Medications & Treatments (Resep & Terapi Aktif)</span>
            <button
              type="button"
              onClick={handleAddMedication}
              className="no-print text-[11px] font-bold text-black bg-white border border-black px-2 py-0.5 rounded hover:bg-black hover:text-white transition flex items-center gap-1"
            >
              <Plus size={11} /> Tambah Obat
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-black text-black">
                  <th className="p-2 border-r border-black font-bold w-[25%]">Nama Obat / Terapi</th>
                  <th className="p-2 border-r border-black font-bold w-[15%]">Dosis</th>
                  <th className="p-2 border-r border-black font-bold w-[20%]">Frekuensi</th>
                  <th className="p-2 border-r border-black font-bold w-[25%]">Tujuan / Indikasi</th>
                  <th className="p-2 font-bold w-[15%] no-print">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {formData.medications.map((med) => (
                  <tr key={med.id} className="hover:bg-neutral-50">
                    <td className="p-1.5 border-r border-black">
                      <input
                        type="text"
                        value={med.name}
                        onChange={(e) => handleMedicationChange(med.id, "name", e.target.value)}
                        placeholder="Nama Obat"
                        className="w-full font-bold text-black bg-transparent outline-none border-b border-transparent focus:border-black"
                      />
                    </td>
                    <td className="p-1.5 border-r border-black">
                      <input
                        type="text"
                        value={med.dosage}
                        onChange={(e) => handleMedicationChange(med.id, "dosage", e.target.value)}
                        placeholder="Contoh: 5 mg"
                        className="w-full text-black bg-transparent outline-none border-b border-transparent focus:border-black font-mono text-xs"
                      />
                    </td>
                    <td className="p-1.5 border-r border-black">
                      <input
                        type="text"
                        value={med.frequency}
                        onChange={(e) => handleMedicationChange(med.id, "frequency", e.target.value)}
                        placeholder="Contoh: 1x1 tablet / hari"
                        className="w-full text-black bg-transparent outline-none border-b border-transparent focus:border-black"
                      />
                    </td>
                    <td className="p-1.5 border-r border-black">
                      <input
                        type="text"
                        value={med.purpose}
                        onChange={(e) => handleMedicationChange(med.id, "purpose", e.target.value)}
                        placeholder="Indikasi Terapi"
                        className="w-full text-black bg-transparent outline-none border-b border-transparent focus:border-black"
                      />
                    </td>
                    <td className="p-1.5 text-center no-print">
                      <button
                        type="button"
                        onClick={() => handleRemoveMedication(med.id)}
                        className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50 transition"
                        title="Hapus Obat"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* =====================================================================
            SECTION 4: SURGERIES / PROCEDURES & RIWAYAT ALERGI (EDITABLE!)
            ===================================================================== */}
        <div className="grid grid-cols-1 sm:grid-cols-12 border border-black mb-5 text-xs">
          {/* Surgeries / Procedures */}
          <div className="col-span-12 sm:col-span-7 p-3 border-b sm:border-b-0 sm:border-r border-black">
            <span className="font-bold block uppercase tracking-wider text-neutral-800 mb-2">
              Surgeries / Procedures:
            </span>
            <div className="grid grid-cols-2 gap-y-1.5">
              {[
                { key: "heart_surgery", label: "Heart surgery" },
                { key: "cholecystectomy", label: "Cholecystectomy" },
                { key: "appendectomy", label: "Appendectomy" },
                { key: "c_section", label: "C-section" },
                { key: "hysterectomy", label: "Hysterectomy" },
                { key: "bladder", label: "Bladder" },
                { key: "colonoscopy", label: "Colonoscopy" },
                { key: "egd", label: "EGD" },
                { key: "joint", label: "Joint" },
                { key: "other_surg", label: "Other" },
              ].map((surg) => {
                const isChecked = !!formData.surgeries[surg.key];
                return (
                  <label
                    key={surg.key}
                    onClick={() => toggleCheckbox("surgeries", surg.key)}
                    className="flex items-center gap-1.5 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => {}}
                      className="w-3.5 h-3.5 accent-black rounded-none"
                    />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-700"}>{surg.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Allergies Box - 100% EDITABLE! */}
          <div className="col-span-12 sm:col-span-5 p-3 bg-red-50/40">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-bold block uppercase tracking-wider text-red-900 flex items-center gap-1">
                <AlertTriangle size={13} className="text-red-600" />
                Riwayat Alergi (Allergies) <span className="text-red-500">*</span>
              </span>
              <span className="text-[10px] text-red-700 font-mono">Editable</span>
            </div>

            {/* Quick Allergies Preset Badges */}
            <div className="flex flex-wrap gap-1 mb-2 no-print">
              {[
                "Penisilin",
                "Sefalosporin",
                "Sulfa",
                "NSAID / Aspirin",
                "Seafood / Makanan Laut",
                "Tanpa Alergi Dikenal",
              ].map((al) => (
                <button
                  key={al}
                  type="button"
                  onClick={() => {
                    const current = formData.allergies || "";
                    if (al === "Tanpa Alergi Dikenal") {
                      updateField("allergies", "Tidak ada riwayat alergi obat / makanan yang diketahui.");
                    } else if (!current.includes(al)) {
                      updateField("allergies", current ? `${current}, Alergi: ${al}` : `Alergi: ${al}`);
                    }
                  }}
                  className="px-1.5 py-0.5 rounded bg-white border border-red-200 hover:bg-red-100 text-[10px] text-red-900 font-medium transition"
                >
                  + {al}
                </button>
              ))}
            </div>

            <textarea
              rows={3}
              value={formData.allergies}
              onChange={(e) => updateField("allergies", e.target.value)}
              placeholder="Ketikkan riwayat alergi obat, makanan, debu, atau zat kontras di sini..."
              className="w-full p-2 bg-white border border-red-300 rounded font-serif leading-relaxed text-black text-xs focus:outline-none focus:border-red-600 shadow-inner"
            />
          </div>
        </div>

        {/* =====================================================================
            SECTION 5: FAMILY HISTORY (CHECK ALL THAT APPLY)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider">
            Family history (check all that apply)
          </div>

          <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            {[
              { key: "no_known_family", label: "No known family history of medical conditions" },
              { key: "cancer", label: "Cancer" },
              { key: "diabetes", label: "Diabetes" },
              { key: "heart_disease", label: "Heart Disease" },
              { key: "high_blood_pressure", label: "High Blood Pressure" },
              { key: "high_cholesterol", label: "High Cholesterol" },
              { key: "stroke", label: "Stroke" },
              { key: "thyroid_disease", label: "Thyroid Disease" },
              { key: "kidney_disease", label: "Kidney Disease" },
              { key: "mental_health", label: "Mental Health Conditions (Depression, Anxiety, etc.)" },
              { key: "autoimmune", label: "Autoimmune Diseases" },
              { key: "other_fam", label: "Other: ________________" },
            ].map((fam) => {
              const isChecked = !!formData.familyHistory[fam.key];
              return (
                <label
                  key={fam.key}
                  onClick={() => toggleCheckbox("familyHistory", fam.key)}
                  className="flex items-center gap-2 cursor-pointer hover:bg-neutral-100 py-0.5 px-1 rounded"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => {}}
                    className="w-3.5 h-3.5 accent-black rounded-none"
                  />
                  <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{fam.label}</span>
                </label>
              );
            })}
          </div>
        </div>

        {/* =====================================================================
            SECTION 6: SOCIAL HISTORY (TABLE FORMAT FROM PDF)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider">
            Social history
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-neutral-100 border-b border-black text-black">
                  <th className="p-2 border-r border-black font-bold w-[25%]">Factor</th>
                  <th className="p-2 border-r border-black font-bold w-[45%]">Check one</th>
                  <th className="p-2 font-bold w-[30%]">Most recent date / Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-300">
                {/* Tobacco */}
                <tr>
                  <td className="p-2 border-r border-black font-medium">Tobacco Use</td>
                  <td className="p-2 border-r border-black flex items-center gap-3">
                    {["Cigarettes", "Vaping", "Tobacco", "Non-smoker"].map((item) => (
                      <label key={item} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="tobacco"
                          checked={formData.tobaccoUse === item}
                          onChange={() => updateField("tobaccoUse", item as any)}
                          className="accent-black"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </td>
                  <td className="p-1.5">
                    <input
                      type="text"
                      value={formData.tobaccoRecentDate || ""}
                      onChange={(e) => updateField("tobaccoRecentDate", e.target.value)}
                      placeholder="Catatan rokok..."
                      className="w-full font-mono text-xs bg-transparent outline-none"
                    />
                  </td>
                </tr>

                {/* Alcohol */}
                <tr>
                  <td className="p-2 border-r border-black font-medium">Alcohol Use</td>
                  <td className="p-2 border-r border-black flex items-center gap-3">
                    {["None", "Occasional", "Moderate", "Heavy"].map((item) => (
                      <label key={item} className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="alcohol"
                          checked={formData.alcoholUse === item}
                          onChange={() => updateField("alcoholUse", item as any)}
                          className="accent-black"
                        />
                        <span>{item}</span>
                      </label>
                    ))}
                  </td>
                  <td className="p-2 text-neutral-600 font-mono">-</td>
                </tr>

                {/* Recreational Drugs */}
                <tr>
                  <td className="p-2 border-r border-black font-medium">Recreational Drugs</td>
                  <td className="p-2 border-r border-black flex items-center gap-3">
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="recDrugs"
                        checked={formData.recreationalDrugs === "No"}
                        onChange={() => updateField("recreationalDrugs", "No")}
                        className="accent-black"
                      />
                      <span>No</span>
                    </label>
                    <label className="flex items-center gap-1 cursor-pointer">
                      <input
                        type="radio"
                        name="recDrugs"
                        checked={formData.recreationalDrugs === "Yes"}
                        onChange={() => updateField("recreationalDrugs", "Yes")}
                        className="accent-black"
                      />
                      <span>Yes</span>
                    </label>
                  </td>
                  <td className="p-2 text-neutral-600 font-mono">-</td>
                </tr>

                {/* Caffeine */}
                <tr>
                  <td className="p-2 border-r border-black font-medium">Caffeine</td>
                  <td className="p-2 border-r border-black" colSpan={2}>
                    <input
                      type="text"
                      value={formData.caffeineWeekly || "2"}
                      onChange={(e) => updateField("caffeineWeekly", e.target.value)}
                      className="w-10 font-bold px-1 border border-neutral-300 rounded text-center"
                    />{" "}
                    Times per week
                  </td>
                </tr>

                {/* Exercise Routine */}
                <tr>
                  <td className="p-2 border-r border-black font-medium">Exercise Routine</td>
                  <td className="p-2 border-r border-black" colSpan={2}>
                    <input
                      type="text"
                      value={formData.exerciseWeekly || "2"}
                      onChange={(e) => updateField("exerciseWeekly", e.target.value)}
                      className="w-10 font-bold px-1 border border-neutral-300 rounded text-center"
                    />{" "}
                    Times per week
                  </td>
                </tr>

                {/* Sleep */}
                <tr>
                  <td className="p-2 border-r border-black font-medium">Sleep</td>
                  <td className="p-2 border-r border-black" colSpan={2}>
                    <input
                      type="text"
                      value={formData.sleepHours || "6-7"}
                      onChange={(e) => updateField("sleepHours", e.target.value)}
                      className="w-14 font-bold px-1 border border-neutral-300 rounded text-center"
                    />{" "}
                    Hours a night
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Social Detriments & Living Situation */}
          <div className="p-2.5 border-t border-black text-xs space-y-2">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 pt-1">
              <div className="col-span-12 sm:col-span-5 flex items-center gap-2">
                <span className="font-bold">Occupation:</span>
                <input
                  type="text"
                  value={formData.occupation || "Wiraswasta"}
                  onChange={(e) => updateField("occupation", e.target.value)}
                  className="w-full bg-transparent border-b border-neutral-300 outline-none"
                />
              </div>
              <div className="col-span-12 sm:col-span-7 flex items-center gap-2 flex-wrap">
                <span className="font-bold">Living Situation:</span>
                {["With roommates", "With S/O", "With family", "Other"].map((sit) => (
                  <label key={sit} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="livingSit"
                      checked={formData.livingSituation === sit}
                      onChange={() => updateField("livingSituation", sit as any)}
                      className="accent-black"
                    />
                    <span>{sit}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            SECTION 7: REVIEW OF SYSTEMS (ROS - 3x3 MATRIX GRID)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider">
            Review of Systems (Check any symptoms that you are experiencing)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 text-xs divide-y sm:divide-y-0 sm:divide-x divide-black">
            {/* General */}
            <div className="p-2.5 space-y-1">
              <span className="font-bold italic block text-neutral-800 border-b border-neutral-300 pb-1 mb-1">General</span>
              {[
                { key: "ros_fatigue", label: "Fatigue" },
                { key: "ros_fever", label: "Fever or chills" },
                { key: "ros_weight", label: "Unexplained weight loss/gain" },
              ].map((item) => {
                const isChecked = !!formData.reviewOfSystems[item.key];
                return (
                  <label key={item.key} onClick={() => toggleCheckbox("reviewOfSystems", item.key)} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-3.5 h-3.5 accent-black rounded-none" />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* EENT */}
            <div className="p-2.5 space-y-1">
              <span className="font-bold italic block text-neutral-800 border-b border-neutral-300 pb-1 mb-1">EENT</span>
              {[
                { key: "ros_vision", label: "Vision changes" },
                { key: "ros_hearing", label: "Hearing loss or ringing" },
                { key: "ros_throat", label: "Sore throat / Hoarseness" },
              ].map((item) => {
                const isChecked = !!formData.reviewOfSystems[item.key];
                return (
                  <label key={item.key} onClick={() => toggleCheckbox("reviewOfSystems", item.key)} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-3.5 h-3.5 accent-black rounded-none" />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Cardiovascular */}
            <div className="p-2.5 space-y-1">
              <span className="font-bold italic block text-neutral-800 border-b border-neutral-300 pb-1 mb-1">Cardiovascular</span>
              {[
                { key: "ros_chest_pain", label: "Chest pain or tightness" },
                { key: "ros_palpitations", label: "Palpitations (fast/irregular)" },
                { key: "ros_swelling", label: "Swelling in legs or feet" },
              ].map((item) => {
                const isChecked = !!formData.reviewOfSystems[item.key];
                return (
                  <label key={item.key} onClick={() => toggleCheckbox("reviewOfSystems", item.key)} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-3.5 h-3.5 accent-black rounded-none" />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Row 2: Respiratory, Gastrointestinal, Genitourinary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 text-xs border-t divide-y sm:divide-y-0 sm:divide-x divide-black border-black">
            {/* Respiratory */}
            <div className="p-2.5 space-y-1">
              <span className="font-bold italic block text-neutral-800 border-b border-neutral-300 pb-1 mb-1">Respiratory</span>
              {[
                { key: "ros_sob", label: "Shortness of breath" },
                { key: "ros_cough", label: "Chronic cough" },
                { key: "ros_wheezing", label: "Wheezing" },
              ].map((item) => {
                const isChecked = !!formData.reviewOfSystems[item.key];
                return (
                  <label key={item.key} onClick={() => toggleCheckbox("reviewOfSystems", item.key)} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-3.5 h-3.5 accent-black rounded-none" />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Gastrointestinal */}
            <div className="p-2.5 space-y-1">
              <span className="font-bold italic block text-neutral-800 border-b border-neutral-300 pb-1 mb-1">Gastrointestinal</span>
              {[
                { key: "ros_abdo_pain", label: "Abdominal pain" },
                { key: "ros_nausea", label: "Nausea or vomiting" },
                { key: "ros_diarrhea", label: "Diarrhea or constipation" },
              ].map((item) => {
                const isChecked = !!formData.reviewOfSystems[item.key];
                return (
                  <label key={item.key} onClick={() => toggleCheckbox("reviewOfSystems", item.key)} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-3.5 h-3.5 accent-black rounded-none" />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{item.label}</span>
                  </label>
                );
              })}
            </div>

            {/* Genitourinary */}
            <div className="p-2.5 space-y-1">
              <span className="font-bold italic block text-neutral-800 border-b border-neutral-300 pb-1 mb-1">Genitourinary</span>
              {[
                { key: "ros_incontinence", label: "Incontinence" },
                { key: "ros_burning", label: "Burning / Urgency" },
                { key: "ros_hematuria", label: "Blood in urine" },
              ].map((item) => {
                const isChecked = !!formData.reviewOfSystems[item.key];
                return (
                  <label key={item.key} onClick={() => toggleCheckbox("reviewOfSystems", item.key)} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={isChecked} onChange={() => {}} className="w-3.5 h-3.5 accent-black rounded-none" />
                    <span className={isChecked ? "font-bold text-black" : "text-neutral-800"}>{item.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* =====================================================================
            SECTION 8: CLINICAL ASSESSMENT & VITAL SIGNS (EDITABLE!)
            ===================================================================== */}
        <div className="mb-5 border border-black">
          <div className="bg-neutral-200 px-3 py-1 font-bold text-xs uppercase border-b border-black tracking-wider flex items-center justify-between">
            <span>Primary Clinical Assessment & Vital Signs</span>
            <select
              value={formData.severity}
              onChange={(e) => updateField("severity", e.target.value as any)}
              className="text-[10px] bg-black text-white px-2 py-0.5 font-bold uppercase rounded outline-none"
            >
              <option value="CRITICAL">CRITICAL</option>
              <option value="SEVERE">SEVERE</option>
              <option value="MODERATE">MODERATE</option>
              <option value="MILD">MILD</option>
              <option value="NORMAL">NORMAL</option>
            </select>
          </div>

          <div className="p-3 text-xs space-y-4">
            {/* Vital Signs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-2.5 bg-neutral-50 border border-neutral-300 rounded text-center">
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase font-bold">Tekanan Darah</span>
                <input
                  type="text"
                  value={formData.vitalSigns.bloodPressure}
                  onChange={(e) => updateVitalSign("bloodPressure", e.target.value)}
                  className="font-mono font-bold text-xs text-center w-full bg-white border border-neutral-300 rounded p-1"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase font-bold">Nadi / HR</span>
                <input
                  type="text"
                  value={formData.vitalSigns.heartRate}
                  onChange={(e) => updateVitalSign("heartRate", e.target.value)}
                  className="font-mono font-bold text-xs text-center w-full bg-white border border-neutral-300 rounded p-1"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase font-bold">Laju Napas (RR)</span>
                <input
                  type="text"
                  value={formData.vitalSigns.respiratoryRate}
                  onChange={(e) => updateVitalSign("respiratoryRate", e.target.value)}
                  className="font-mono font-bold text-xs text-center w-full bg-white border border-neutral-300 rounded p-1"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase font-bold">Saturasi (SpO2)</span>
                <input
                  type="text"
                  value={formData.vitalSigns.spo2}
                  onChange={(e) => updateVitalSign("spo2", e.target.value)}
                  className="font-mono font-bold text-xs text-center w-full bg-white border border-neutral-300 rounded p-1"
                />
              </div>
              <div>
                <span className="text-[10px] text-neutral-600 block uppercase font-bold">Suhu Tubuh</span>
                <input
                  type="text"
                  value={formData.vitalSigns.temperature}
                  onChange={(e) => updateVitalSign("temperature", e.target.value)}
                  className="font-mono font-bold text-xs text-center w-full bg-white border border-neutral-300 rounded p-1"
                />
              </div>
            </div>

            {/* Diagnosis & ICD-10 */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-700 block uppercase">Diagnosis Klinis Utama:</span>
              <input
                type="text"
                value={formData.diagnosis}
                onChange={(e) => updateField("diagnosis", e.target.value)}
                placeholder="Diagnosis Kerja"
                className="font-serif font-bold text-base text-black w-full p-2 border border-neutral-300 rounded bg-white"
              />
              <div className="flex items-center gap-2 pt-1">
                <span className="font-bold text-xs text-neutral-700">Kode ICD-10:</span>
                <input
                  type="text"
                  value={formData.diagnosisIcd}
                  onChange={(e) => updateField("diagnosisIcd", e.target.value)}
                  placeholder="Kode ICD-10"
                  className="font-mono text-xs p-1 border border-neutral-300 rounded bg-white w-64"
                />
              </div>
            </div>

            {/* Rekomendasi & Edukasi */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <span className="text-[10px] font-bold text-neutral-700 block uppercase mb-1">
                  Rekomendasi / Rencana Tata Laksana:
                </span>
                <textarea
                  rows={3}
                  value={formData.recommendations}
                  onChange={(e) => updateField("recommendations", e.target.value)}
                  className="w-full p-2 bg-white border border-neutral-300 rounded text-xs font-serif text-black"
                />
              </div>
              <div>
                <span className="text-[10px] font-bold text-neutral-700 block uppercase mb-1">
                  Ringkasan Edukasi Pasien (Bahasa Awam):
                </span>
                <textarea
                  rows={3}
                  value={formData.patientSummary}
                  onChange={(e) => updateField("patientSummary", e.target.value)}
                  className="w-full p-2 bg-white border border-neutral-300 rounded text-xs font-serif text-black"
                />
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            SECTION 9: PATIENT & DOCTOR SIGNATURES (OFFICIAL BORDERED FOOTER)
            ===================================================================== */}
        <div className="border border-black text-xs">
          {/* Patient Signature Line */}
          <div className="grid grid-cols-12 border-b border-black">
            <div className="col-span-12 sm:col-span-8 p-3 border-b sm:border-b-0 sm:border-r border-black flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-neutral-800">Patient Name:</span>
                <span className="font-serif font-semibold">{formData.patientName}</span>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-neutral-700">
                <input
                  type="checkbox"
                  checked={patientSignatureConfirmed}
                  onChange={(e) => setPatientSignatureConfirmed(e.target.checked)}
                  className="w-3.5 h-3.5 accent-black rounded-none"
                />
                <span>Persetujuan Pasien Terverifikasi</span>
              </div>
            </div>
            <div className="col-span-12 sm:col-span-4 p-3 flex items-center gap-2">
              <span className="font-bold text-neutral-800">Date:</span>
              <span className="font-mono">{new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</span>
            </div>
          </div>

          {/* Doctor DPJP Signature & SatuSehat Verification */}
          <div className="p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center bg-neutral-50">
            <div className="col-span-12 sm:col-span-7 space-y-2">
              <div>
                <span className="text-[10px] font-bold text-neutral-600 block uppercase">
                  Dokter Penanggung Jawab Pelayanan (DPJP Utama):
                </span>
                <b className="text-sm font-serif text-black block">{formData.doctorName}</b>
                <span className="text-xs font-mono text-neutral-700 block">
                  SIP: {formData.doctorSip} • {formData.doctorSpecialty}
                </span>
              </div>

              {/* Signature Canvas Pad */}
              <div className="no-print pt-1">
                <div className="border border-neutral-400 bg-white p-2 rounded">
                  <canvas
                    ref={sigCanvasRef}
                    width={300}
                    height={65}
                    className="w-full h-[65px] border border-dashed border-neutral-300 bg-white cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                  />
                  <div className="flex items-center justify-between text-[10px] mt-1 text-neutral-600 font-sans">
                    <span>Goreskan TTD resmi di kotak</span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={handleClear} className="text-neutral-500 hover:text-red-600">
                        Hapus
                      </button>
                      <button type="button" onClick={handleUseRegisteredSignature} className="font-bold text-black underline">
                        Gunakan TTD Terdaftar
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {isDoctorSigned && (
                <div className="text-[11px] font-mono text-green-700 flex items-center gap-1 font-semibold">
                  <CheckCircle2 size={13} />
                  <span>Dokumen Terverifikasi & Ditandatangani: {signedAtTimestamp}</span>
                </div>
              )}
            </div>

            {/* Official Kemenkes SatuSehat QR & Seal Stamp */}
            <div className="col-span-12 sm:col-span-5 flex items-center justify-end gap-3">
              <div className="doctor-seal-stamp border-2 border-black text-black">
                <span>★ VERIFIED CLINICAL ★</span>
                <b>DPJP SPESIALIS</b>
                <span>MED-AI REKAM MEDIS</span>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 p-1 border border-black bg-white flex items-center justify-center shadow-xs">
                  <QrCode size={52} className="text-black" />
                </div>
                <span className="text-[8px] font-mono text-neutral-600 block mt-1">
                  KEMENKES SATUSEHAT
                </span>
              </div>
            </div>
          </div>
        </div>

      </article>
    </main>
  );
}
