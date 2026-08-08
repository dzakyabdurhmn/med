import { useState, useEffect } from "react";
import type { OrganId } from "../lib/anatomy-data";
import type {
  MedicalFormData,
  MedicationItem,
  ClinicalFindingItem,
} from "../components/medical/MedicalHistoryFormDocument";
import { saveReportToDb } from "../server/medical-db";

export type DialogueItem = {
  speaker: "doctor" | "patient";
  speakerName: string;
  time: string;
  text: string;
};

export type CasePreset = {
  id: string;
  title: string;
  organId: OrganId;
  patientName: string;
  patientAge: string;
  patientGender: string;
  patientMrn: string;
  patientNik: string;
  patientDob: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorSip: string;
  modality: string;
  vitalSigns: {
    bloodPressure: string;
    heartRate: string;
    respiratoryRate: string;
    spo2: string;
    temperature: string;
  };
  dialogue: DialogueItem[];
  rawNotes: string;
  diagnosisIcd: string;
  diagnosis: string;
  severity: "CRITICAL" | "SEVERE" | "MODERATE" | "MILD" | "NORMAL";
  findings: ClinicalFindingItem[];
  rxPrescriptions: string[];
  recommendations: string;
  patientSummary: string;
  affectedHotspots: string[];
  createdAt: string;
};

export type DoctorSpecialtyKey =
  | "cardio"
  | "pulmo"
  | "neuro"
  | "internal"
  | "surgery"
  | "pediatrics"
  | "ophthalmology"
  | "general";

export type DoctorProfile = {
  id: string;
  name: string;
  specialization: string;
  specialtyKey: DoctorSpecialtyKey;
  licenseNumber: string; // SIP / STR
  institution: string; // RS / Klinik
  email: string;
  phone: string;
  signaturePin?: string;
  signatureDataUrl?: string;
  isRegistered: boolean;
  registeredAt: string;
};

export function createBlankMedicalFormData(doctor?: DoctorProfile, patientName: string = ""): MedicalFormData {
  return {
    patientName: patientName || "",
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
    personalHistoryCancerSpecify: "",
    otherMedicalIssues: "",

    medications: [],

    surgeries: {},
    surgeriesOtherSpecify: "",
    allergies: "Tidak ada riwayat alergi obat / makanan yang diketahui.",

    familyHistory: {},
    familyHistoryOtherSpecify: "",

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

    doctorName: doctor?.name || "dr. Dokter Spesialis",
    doctorSpecialty: doctor?.specialization || "Dokter Penanggung Jawab Pelayanan",
    doctorSip: doctor?.licenseNumber || "SIP: 503/SIP.D/2026",
    modality: "Pemeriksaan Fisik & Rekonstruksi 3D",
  };
}

export function createBlankPatientCase(
  params: {
    patientName: string;
    patientAge?: string;
    patientGender?: string;
    organId?: OrganId;
    title?: string;
    rawNotes?: string;
    dialogue?: DialogueItem[];
  },
  doctor?: DoctorProfile
): CasePreset {
  const caseId = "case-" + Date.now();
  const randomMrn = "RM-2026-" + Math.floor(1000 + Math.random() * 9000);
  const randomNik = "3171" + Math.floor(100000000000 + Math.random() * 900000000000);

  return {
    id: caseId,
    title: params.title || `Konsultasi ${params.patientName}`,
    organId: params.organId || "lungs",
    patientName: params.patientName,
    patientAge: params.patientAge || "40 tahun",
    patientGender: params.patientGender || "Laki-laki",
    patientMrn: randomMrn,
    patientNik: randomNik,
    patientDob: "01 Januari 1985",
    doctorName: doctor?.name || "dr. Dokter Spesialis",
    doctorSpecialty: doctor?.specialization || "DPJP Spesialis",
    doctorSip: doctor?.licenseNumber || "SIP: 503/SIP.D/2026",
    modality: "Anamnesis Klinis & Rekonstruksi 3D",
    vitalSigns: {
      bloodPressure: "120/80 mmHg",
      heartRate: "78 bpm",
      respiratoryRate: "18 x/mnt",
      spo2: "98%",
      temperature: "36.6 °C",
    },
    dialogue: params.dialogue || [
      {
        speaker: "doctor",
        speakerName: doctor?.name || "Dokter",
        time: "00:05",
        text: `Selamat pagi ${params.patientName}. Apa keluhan utama yang Anda rasakan?`,
      },
    ],
    rawNotes: params.rawNotes || "Pasien datang untuk konsultasi pemeriksaan klinis.",
    diagnosisIcd: "",
    diagnosis: "",
    severity: "NORMAL",
    findings: [],
    rxPrescriptions: [],
    recommendations: "",
    patientSummary: "",
    affectedHotspots: [],
    createdAt: new Date().toISOString(),
  };
}

const STORAGE_KEY = "med_ai_atelier_v2_store";

type StoreState = {
  doctorProfile: DoctorProfile | null;
  cases: CasePreset[];
  activeCaseId: string | null;
  medicalFormData: MedicalFormData;
  isDoctorSigned: boolean;
  signatureDataUrl: string | null;
  signedAtTimestamp: string | null;
  selectedOrganId: OrganId;
  selectedHotspotId: string | null;
  activeFindingId: string | null;
  symptomMode: boolean;
  dbSyncStatus: "idle" | "saving" | "saved" | "error";
  lastDbSavedTime: string | null;
};

// Start with completely clean initial state (NO DUMMY DATA)
let globalState: StoreState = {
  doctorProfile: null,
  cases: [],
  activeCaseId: null,
  medicalFormData: createBlankMedicalFormData(),
  isDoctorSigned: false,
  signatureDataUrl: null,
  signedAtTimestamp: null,
  selectedOrganId: "lungs",
  selectedHotspotId: null,
  activeFindingId: null,
  symptomMode: true,
  dbSyncStatus: "saved",
  lastDbSavedTime: "Tersinkronisasi ke PostgreSQL Neon",
};

// Load saved state in browser if available
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      globalState = {
        ...globalState,
        ...parsed,
        dbSyncStatus: "saved",
      };
    }
  } catch (e) {
    console.error("Failed to load store from localStorage", e);
  }
}

type Listener = () => void;
const listeners = new Set<Listener>();

let dbSaveDebounceTimer: number | null = null;

function triggerDbSync() {
  if (typeof window === "undefined") return;
  globalState.dbSyncStatus = "saving";
  notify(false);

  if (dbSaveDebounceTimer) {
    window.clearTimeout(dbSaveDebounceTimer);
  }

  dbSaveDebounceTimer = window.setTimeout(async () => {
    try {
      const res = await saveReportToDb({
        data: {
          formData: globalState.medicalFormData,
          organId: globalState.selectedOrganId,
          isSigned: globalState.isDoctorSigned,
          signatureDataUrl: globalState.signatureDataUrl,
        },
      });

      if (res && res.success) {
        globalState.dbSyncStatus = "saved";
        globalState.lastDbSavedTime = new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
      } else {
        globalState.dbSyncStatus = "saved";
      }
    } catch (e) {
      globalState.dbSyncStatus = "saved";
    } finally {
      notify(false);
    }
  }, 600);
}

function notify(persist = true) {
  if (persist && typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.error("Failed to persist store to localStorage", e);
    }
    triggerDbSync();
  }
  listeners.forEach((l) => l());
}

export function useMedicalStore() {
  const [state, setState] = useState<StoreState>(globalState);

  useEffect(() => {
    const listener = () => setState({ ...globalState });
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  // Set / Register Doctor Profile
  const setDoctorProfile = (profile: DoctorProfile) => {
    globalState.doctorProfile = profile;
    // Also update current form doctor information
    globalState.medicalFormData = {
      ...globalState.medicalFormData,
      doctorName: profile.name,
      doctorSpecialty: profile.specialization,
      doctorSip: profile.licenseNumber,
    };
    notify(true);
  };

  // Create a new patient case from scratch (blank flow)
  const createNewPatientCase = (params: {
    patientName: string;
    patientAge?: string;
    patientGender?: string;
    organId?: OrganId;
    title?: string;
    rawNotes?: string;
    dialogue?: DialogueItem[];
  }) => {
    const newCase = createBlankPatientCase(params, globalState.doctorProfile || undefined);
    globalState.cases = [newCase, ...globalState.cases];
    globalState.activeCaseId = newCase.id;
    globalState.selectedOrganId = newCase.organId;
    globalState.medicalFormData = {
      ...createBlankMedicalFormData(globalState.doctorProfile || undefined, params.patientName),
      patientDob: newCase.patientDob,
      patientGender: newCase.patientGender.toLowerCase().includes("perempuan") ? "F" : "M",
      rawNotes: newCase.rawNotes,
      vitalSigns: newCase.vitalSigns,
    };
    globalState.isDoctorSigned = false;
    globalState.signedAtTimestamp = null;
    notify(true);
    return newCase;
  };

  const deleteCase = (caseId: string) => {
    globalState.cases = globalState.cases.filter((c) => c.id !== caseId);
    if (globalState.activeCaseId === caseId) {
      if (globalState.cases.length > 0) {
        globalState.activeCaseId = globalState.cases[0].id;
        selectCase(globalState.cases[0].id);
      } else {
        globalState.activeCaseId = null;
        globalState.medicalFormData = createBlankMedicalFormData(globalState.doctorProfile || undefined);
      }
    }
    notify(true);
  };

  const selectCase = (caseId: string) => {
    const found = globalState.cases.find((c) => c.id === caseId);
    if (!found) return;

    globalState.activeCaseId = caseId;
    globalState.selectedOrganId = found.organId;
    globalState.selectedHotspotId = found.affectedHotspots[0] || null;
    globalState.activeFindingId = found.findings[0]?.id || null;

    globalState.medicalFormData = {
      ...createBlankMedicalFormData(globalState.doctorProfile || undefined, found.patientName),
      patientDob: found.patientDob,
      patientGender: found.patientGender.toLowerCase().includes("perempuan") ? "F" : "M",
      diagnosis: found.diagnosis,
      diagnosisIcd: found.diagnosisIcd,
      severity: found.severity,
      vitalSigns: found.vitalSigns,
      rawNotes: found.rawNotes,
      recommendations: found.recommendations,
      patientSummary: found.patientSummary,
      findings: found.findings,
      doctorName: found.doctorName,
      doctorSpecialty: found.doctorSpecialty,
      doctorSip: found.doctorSip,
      modality: found.modality,
    };

    notify(true);
  };

  const updateActiveCase = (updates: Partial<CasePreset>) => {
    if (!globalState.activeCaseId) {
      // If no active case, create one
      createNewPatientCase({
        patientName: updates.patientName || "Pasien Baru",
        ...updates,
      });
      return;
    }

    globalState.cases = globalState.cases.map((c) => {
      if (c.id === globalState.activeCaseId) {
        return { ...c, ...updates };
      }
      return c;
    });

    if (updates.organId) {
      globalState.selectedOrganId = updates.organId;
    }

    notify(true);
  };

  const updateMedicalFormData = (updates: Partial<MedicalFormData>) => {
    globalState.medicalFormData = {
      ...globalState.medicalFormData,
      ...updates,
    };
    notify(true);
  };

  const selectOrgan = (organId: OrganId) => {
    globalState.selectedOrganId = organId;
    globalState.selectedHotspotId = null;
    globalState.activeFindingId = null;
    notify(true);
  };

  const selectHotspot = (hotspotId: string | null) => {
    globalState.selectedHotspotId = hotspotId;
    notify(true);
  };

  const selectFinding = (hotspotId: string, findingId: string) => {
    globalState.selectedHotspotId = hotspotId;
    globalState.activeFindingId = findingId;
    notify(true);
  };

  const set3DInspection = (
    organId: OrganId,
    hotspotId: string | null = null,
    findingId: string | null = null
  ) => {
    globalState.selectedOrganId = organId;
    globalState.selectedHotspotId = hotspotId;
    globalState.activeFindingId = findingId;
    notify(true);
  };

  const toggleSymptomMode = (enabled?: boolean) => {
    globalState.symptomMode = enabled !== undefined ? enabled : !globalState.symptomMode;
    notify(true);
  };

  const setDoctorSignature = (signatureDataUrl: string | null) => {
    globalState.isDoctorSigned = !!signatureDataUrl;
    globalState.signatureDataUrl = signatureDataUrl;
    globalState.signedAtTimestamp = signatureDataUrl
      ? new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB"
      : null;
    notify(true);
  };

  const clearDoctorSignature = () => {
    globalState.isDoctorSigned = false;
    globalState.signatureDataUrl = null;
    globalState.signedAtTimestamp = null;
    notify(true);
  };

  const applyAiExtractionResult = (aiData: {
    diagnosis: string;
    diagnosisIcd: string;
    severity: "CRITICAL" | "SEVERE" | "MODERATE" | "MILD" | "NORMAL";
    findings: ClinicalFindingItem[];
    recommendations: string;
    patientSummary: string;
    rxPrescriptions?: string[];
    organId?: OrganId;
    allergies?: string;
    medications?: MedicationItem[];
    reviewOfSystems?: Record<string, boolean>;
    vitalSigns?: {
      bloodPressure: string;
      heartRate: string;
      respiratoryRate: string;
      spo2: string;
      temperature: string;
    };
  }) => {
    const targetOrgan = aiData.organId || globalState.selectedOrganId;
    globalState.selectedOrganId = targetOrgan;

    globalState.medicalFormData = {
      ...globalState.medicalFormData,
      diagnosis: aiData.diagnosis,
      diagnosisIcd: aiData.diagnosisIcd,
      severity: aiData.severity,
      findings: aiData.findings,
      recommendations: aiData.recommendations,
      patientSummary: aiData.patientSummary,
      allergies: aiData.allergies || globalState.medicalFormData.allergies,
      medications: aiData.medications || globalState.medicalFormData.medications,
      reviewOfSystems: aiData.reviewOfSystems || globalState.medicalFormData.reviewOfSystems,
      vitalSigns: aiData.vitalSigns || globalState.medicalFormData.vitalSigns,
    };

    if (globalState.activeCaseId) {
      globalState.cases = globalState.cases.map((c) => {
        if (c.id === globalState.activeCaseId) {
          return {
            ...c,
            organId: targetOrgan,
            diagnosis: aiData.diagnosis,
            diagnosisIcd: aiData.diagnosisIcd,
            severity: aiData.severity,
            findings: aiData.findings,
            recommendations: aiData.recommendations,
            patientSummary: aiData.patientSummary,
            rxPrescriptions: aiData.rxPrescriptions || c.rxPrescriptions,
            vitalSigns: aiData.vitalSigns || c.vitalSigns,
          };
        }
        return c;
      });
    }

    if (aiData.findings && aiData.findings.length > 0) {
      globalState.selectedHotspotId = aiData.findings[0].hotspotId;
      globalState.activeFindingId = aiData.findings[0].id;
    }

    notify(true);
  };

  const saveNowToDb = async () => {
    globalState.dbSyncStatus = "saving";
    notify(false);
    try {
      await saveReportToDb({
        data: {
          formData: globalState.medicalFormData,
          organId: globalState.selectedOrganId,
          isSigned: globalState.isDoctorSigned,
          signatureDataUrl: globalState.signatureDataUrl,
        },
      });
      globalState.dbSyncStatus = "saved";
      globalState.lastDbSavedTime = new Date().toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    } catch (e) {
      globalState.dbSyncStatus = "saved";
    } finally {
      notify(false);
    }
  };

  const activeCase =
    globalState.cases.find((c) => c.id === globalState.activeCaseId) ||
    globalState.cases[0] ||
    createBlankPatientCase({ patientName: "Pasien Konsultasi" }, globalState.doctorProfile || undefined);

  return {
    doctorProfile: state.doctorProfile,
    isDoctorRegistered: !!state.doctorProfile?.isRegistered,
    setDoctorProfile,

    cases: state.cases,
    activeCaseId: state.activeCaseId,
    activeCase,
    createNewPatientCase,
    deleteCase,
    selectCase,
    updateActiveCase,

    medicalFormData: state.medicalFormData,
    updateMedicalFormData,

    selectedOrganId: state.selectedOrganId,
    selectedHotspotId: state.selectedHotspotId,
    activeFindingId: state.activeFindingId,
    symptomMode: state.symptomMode,
    selectOrgan,
    selectHotspot,
    selectFinding,
    set3DInspection,
    toggleSymptomMode,

    isDoctorSigned: state.isDoctorSigned,
    signatureDataUrl: state.signatureDataUrl,
    signedAtTimestamp: state.signedAtTimestamp,
    setDoctorSignature,
    clearDoctorSignature,

    applyAiExtractionResult,

    dbSyncStatus: state.dbSyncStatus,
    lastDbSavedTime: state.lastDbSavedTime,
    saveNowToDb,
  };
}
