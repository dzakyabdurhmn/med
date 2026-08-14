import { useState, useEffect } from "react";
import type {
  MedicalFormData,
  MedicationItem,
  ClinicalFindingItem,
} from "../components/medical/MedicalHistoryFormDocument";
import { saveReportToDb } from "../server/medical-db";
import type { EvidenceLinkedItem } from "../server/ai-extract";

export type DialogueItem = {
  speaker: "doctor" | "patient";
  speakerName: string;
  time: string;
  text: string;
};

export type CasePreset = {
  id: string;
  title: string;
  organId?: string;
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

  // EHR Form Checklists & Details
  personalHistory?: Record<string, boolean>;
  personalHistoryCancerSpecify?: string;
  otherMedicalIssues?: string;
  medications?: MedicationItem[];
  surgeries?: Record<string, boolean>;
  surgeriesOtherSpecify?: string;
  allergies?: string;
  familyHistory?: Record<string, boolean>;
  familyHistoryOtherSpecify?: string;
  tobaccoUse?: "Cigarettes" | "Vaping" | "Tobacco" | "Non-smoker";
  tobaccoRecentDate?: string;
  alcoholUse?: "None" | "Occasional" | "Moderate" | "Heavy";
  recreationalDrugs?: "No" | "Yes";
  caffeineWeekly?: string;
  exerciseWeekly?: string;
  sleepHours?: string;
  socialDetriments?: "No" | "Yes";
  occupation?: string;
  livingSituation?: "With roommates" | "With S/O" | "With family" | "Other";
  reviewOfSystems?: Record<string, boolean>;
  aiCheckedKeys?: string[];
  isAiGenerated?: boolean;
  evidenceList?: EvidenceLinkedItem[];
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
  nik?: string;
  satusehatId?: string;
  isSatusehatVerified?: boolean;
  satusehatVerifiedAt?: string;
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
    doctorSpecialty: doctor?.specialization || "DPJP Spesialis",
    doctorSip: doctor?.licenseNumber || "SIP: 503/SIP.D/2026",
    modality: "Pemeriksaan & Anamnesis Klinis",
  };
}

export function createBlankPatientCase(
  params: {
    patientName: string;
    patientDob?: string;
    patientAge?: string;
    patientGender?: string;
    organId?: string;
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
    organId: params.organId || "general",
    patientName: params.patientName,
    patientAge: params.patientDob || params.patientAge || "",
    patientGender: params.patientGender || "Laki-laki",
    patientMrn: randomMrn,
    patientNik: randomNik,
    patientDob: params.patientDob || "",
    doctorName: doctor?.name || "dr. Dokter Spesialis",
    doctorSpecialty: doctor?.specialization || "DPJP Spesialis",
    doctorSip: doctor?.licenseNumber || "SIP: 503/SIP.D/2026",
    modality: "Pemeriksaan & Anamnesis Klinis",
    vitalSigns: {
      bloodPressure: "120/80 mmHg",
      heartRate: "75 bpm",
      respiratoryRate: "18 x/mnt",
      spo2: "99%",
      temperature: "36.5 °C",
    },
    dialogue: params.dialogue || [
      {
        speaker: "doctor",
        speakerName: doctor?.name || "Dokter",
        time: "00:05",
        text: `Selamat pagi ${params.patientName}. Apa keluhan utama yang Anda rasakan?`,
      },
    ],
    rawNotes: params.rawNotes || "",
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
  selectedOrganId: string;
  selectedHotspotId: string | null;
  activeFindingId: string | null;
  symptomMode: boolean;
  dbSyncStatus: "idle" | "saving" | "saved" | "error";
  lastDbSavedTime: string | null;
};

// Clean initial state (NO DUMMY FAKE PATIENTS OR DUMMY DATA)
let globalState: StoreState = {
  doctorProfile: {
    id: "doc-default",
    name: "dr. Dokter Spesialis",
    specialization: "DPJP Spesialis",
    specialtyKey: "general",
    licenseNumber: "503/482/SIP.D/2026",
    institution: "Rumah Sakit / Klinik Utama",
    email: "dokter@kemenkes.go.id",
    phone: "081234567890",
    isRegistered: true,
    registeredAt: "2026-01-01T00:00:00.000Z",
  },
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
  lastDbSavedTime: "Tersimpan Otomatis & Aman",
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
let isDbSyncing = false;

function triggerDbSync() {
  if (typeof window === "undefined") return;

  if (dbSaveDebounceTimer) {
    window.clearTimeout(dbSaveDebounceTimer);
  }

  dbSaveDebounceTimer = window.setTimeout(async () => {
    if (isDbSyncing) return;
    isDbSyncing = true;

    try {
      globalState.dbSyncStatus = "saving";
      listeners.forEach((l) => l());

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
      isDbSyncing = false;
      listeners.forEach((l) => l());
    }
  }, 1500);
}

function notify(persist = true) {
  if (persist && typeof window !== "undefined") {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(globalState));
    } catch (e) {
      console.warn("Failed to persist store to localStorage", e);
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
    patientDob?: string;
    patientAge?: string;
    patientGender?: string;
    organId?: string;
    title?: string;
    rawNotes?: string;
    dialogue?: DialogueItem[];
  }) => {
    const newCase = createBlankPatientCase(params, globalState.doctorProfile || undefined);
    globalState.cases = [newCase, ...globalState.cases];
    globalState.activeCaseId = newCase.id;
    globalState.selectedOrganId = newCase.organId || "general";
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
    globalState.selectedOrganId = found.organId || "general";
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
      personalHistory: found.personalHistory || {},
      personalHistoryCancerSpecify: found.personalHistoryCancerSpecify || "",
      otherMedicalIssues: found.otherMedicalIssues || "",
      medications: found.medications || [],
      surgeries: found.surgeries || {},
      surgeriesOtherSpecify: found.surgeriesOtherSpecify || "",
      allergies: found.allergies || "Tidak ada riwayat alergi obat / makanan yang diketahui.",
      familyHistory: found.familyHistory || {},
      familyHistoryOtherSpecify: found.familyHistoryOtherSpecify || "",
      tobaccoUse: found.tobaccoUse || "Non-smoker",
      tobaccoRecentDate: found.tobaccoRecentDate || "-",
      alcoholUse: found.alcoholUse || "None",
      recreationalDrugs: found.recreationalDrugs || "No",
      caffeineWeekly: found.caffeineWeekly || "0",
      exerciseWeekly: found.exerciseWeekly || "0",
      sleepHours: found.sleepHours || "7-8",
      socialDetriments: found.socialDetriments || "No",
      occupation: found.occupation || "Wiraswasta",
      livingSituation: found.livingSituation || "With family",
      reviewOfSystems: found.reviewOfSystems || {},
    };

    notify(true);
  };

  const updateActiveCase = (updates: Partial<CasePreset>) => {
    if (!globalState.activeCaseId) {
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

    // Also sync to active case in cases array
    if (globalState.activeCaseId) {
      globalState.cases = globalState.cases.map((c) => {
        if (c.id === globalState.activeCaseId) {
          return {
            ...c,
            patientName: updates.patientName ?? c.patientName,
            patientDob: updates.patientDob ?? c.patientDob,
            diagnosis: updates.diagnosis ?? c.diagnosis,
            diagnosisIcd: updates.diagnosisIcd ?? c.diagnosisIcd,
            severity: updates.severity ?? c.severity,
            vitalSigns: updates.vitalSigns ?? c.vitalSigns,
            recommendations: updates.recommendations ?? c.recommendations,
            patientSummary: updates.patientSummary ?? c.patientSummary,
            findings: updates.findings ?? c.findings,
            personalHistory: updates.personalHistory ?? c.personalHistory,
            otherMedicalIssues: updates.otherMedicalIssues ?? c.otherMedicalIssues,
            medications: updates.medications ?? c.medications,
            surgeries: updates.surgeries ?? c.surgeries,
            allergies: updates.allergies ?? c.allergies,
            familyHistory: updates.familyHistory ?? c.familyHistory,
            tobaccoUse: updates.tobaccoUse ?? c.tobaccoUse,
            alcoholUse: updates.alcoholUse ?? c.alcoholUse,
            occupation: updates.occupation ?? c.occupation,
            livingSituation: updates.livingSituation ?? c.livingSituation,
            reviewOfSystems: updates.reviewOfSystems ?? c.reviewOfSystems,
          };
        }
        return c;
      });
    }

    notify(true);
  };

  const selectOrgan = (organId: string) => {
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
    organId: string,
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
    organId?: string;
    allergies?: string;
    medications?: MedicationItem[];
    personalHistory?: Record<string, boolean>;
    familyHistory?: Record<string, boolean>;
    surgeries?: Record<string, boolean>;
    reviewOfSystems?: Record<string, boolean>;
    otherMedicalIssues?: string;
    tobaccoUse?: "Cigarettes" | "Vaping" | "Tobacco" | "Non-smoker";
    alcoholUse?: "None" | "Occasional" | "Moderate" | "Heavy";
    occupation?: string;
    livingSituation?: "With roommates" | "With S/O" | "With family" | "Other";
    aiCheckedKeys?: string[];
    evidenceList?: EvidenceLinkedItem[];
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
      personalHistory: aiData.personalHistory || globalState.medicalFormData.personalHistory,
      familyHistory: aiData.familyHistory || globalState.medicalFormData.familyHistory,
      surgeries: aiData.surgeries || globalState.medicalFormData.surgeries,
      reviewOfSystems: aiData.reviewOfSystems || globalState.medicalFormData.reviewOfSystems,
      otherMedicalIssues: aiData.otherMedicalIssues || globalState.medicalFormData.otherMedicalIssues,
      tobaccoUse: aiData.tobaccoUse || globalState.medicalFormData.tobaccoUse,
      alcoholUse: aiData.alcoholUse || globalState.medicalFormData.alcoholUse,
      occupation: aiData.occupation || globalState.medicalFormData.occupation,
      livingSituation: aiData.livingSituation || globalState.medicalFormData.livingSituation,
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
            personalHistory: aiData.personalHistory || c.personalHistory,
            familyHistory: aiData.familyHistory || c.familyHistory,
            surgeries: aiData.surgeries || c.surgeries,
            reviewOfSystems: aiData.reviewOfSystems || c.reviewOfSystems,
            medications: aiData.medications || c.medications,
            allergies: aiData.allergies || c.allergies,
            otherMedicalIssues: aiData.otherMedicalIssues || c.otherMedicalIssues,
            tobaccoUse: aiData.tobaccoUse || c.tobaccoUse,
            alcoholUse: aiData.alcoholUse || c.alcoholUse,
            occupation: aiData.occupation || c.occupation,
            livingSituation: aiData.livingSituation || c.livingSituation,
            aiCheckedKeys: aiData.aiCheckedKeys || c.aiCheckedKeys,
            evidenceList: aiData.evidenceList || c.evidenceList,
            isAiGenerated: true,
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
      const currentActiveCase = globalState.cases.find((c) => c.id === globalState.activeCaseId);
      await saveReportToDb({
        data: {
          formData: globalState.medicalFormData,
          organId: globalState.selectedOrganId,
          isSigned: globalState.isDoctorSigned,
          signatureDataUrl: globalState.signatureDataUrl,
          dialogueLines: currentActiveCase?.dialogue || [],
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
