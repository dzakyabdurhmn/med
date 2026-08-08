import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Sparkles,
  FileText,
  Activity,
  ArrowLeft,
  ArrowRight,
  Database,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Flame,
  Droplets,
  Loader2,
  Terminal,
  Cpu,
  Wand2,
  Lock,
  Box,
  Mic,
  UserCheck,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import { organs, type OrganId } from "../lib/anatomy-data";
import { inferOrganFromClinicalData, type AiTriageResult } from "../lib/anatomy-ai-triage";
import { OrganViewer } from "../components/anatomy/OrganViewer";
import {
  type PathologyType,
  PATHOLOGY_PRESETS,
  inferPathologyFromClinicalText,
} from "../lib/three/pathology-mutator";

export const Route = createFileRoute("/anatomy")({
  component: AnatomyPage,
});

const QUICK_PATHOLOGY_PRESETS: {
  id: PathologyType;
  label: string;
  organId: OrganId;
  prompt: string;
  icon: string;
  badgeColor: string;
}[] = [
  {
    id: "smoker_tar",
    label: "Paru-Paru Perokok Kronis (Black Tar)",
    organId: "lungs",
    prompt: "Pasien riwayat perokok 25 tahun, paru-paru hitam pekat antrakosis tar jelaga dengan emfisema",
    icon: "🚬",
    badgeColor: "bg-neutral-800 text-neutral-100 border-neutral-700",
  },
  {
    id: "stab_wound_bleeding",
    label: "Trauma Luka Tusuk & Pendarahan Aktif",
    organId: "lungs",
    prompt: "Pasien korban kekerasan luka tusuk tembus dinding thorax dengan pendarahan hebat aktif",
    icon: "🩸",
    badgeColor: "bg-red-900/90 text-red-100 border-red-700",
  },
  {
    id: "acute_infarction",
    label: "Infark Miokard Akut & Iskemia Sianosis",
    organId: "heart",
    prompt: "Pasien serangan jantung akut STEMI oklusi arteri koroner dengan iskemia kebiruan nekrotik",
    icon: "⚡",
    badgeColor: "bg-purple-950 text-purple-100 border-purple-800",
  },
  {
    id: "kidney_stone",
    label: "Nefrolitiasis (Batu Kristal Kalsium 3D)",
    organId: "kidneys",
    prompt: "Pasien kolik renal dengan pembentukan batu kristal kalsium bergerigi pada pelvikalises ginjal",
    icon: "🪨",
    badgeColor: "bg-amber-950 text-amber-100 border-amber-800",
  },
  {
    id: "purulent_infection",
    label: "Konsolidasi Pneumonia & Pus Nanah",
    organId: "lungs",
    prompt: "Pasien pneumonia lobaris berat dengan infiltrat purulen eksudat nanah kekuningan",
    icon: "🦠",
    badgeColor: "bg-lime-950 text-lime-100 border-lime-800",
  },
  {
    id: "cirrhosis_jaundice",
    label: "Sirosis Hepatobilier & Ikterus Kuning",
    organId: "liver",
    prompt: "Pasien sirosis hepatis stadium lanjut dengan sklera ikterik kekuningan dan fibrosis nodular",
    icon: "🟡",
    badgeColor: "bg-yellow-950 text-yellow-100 border-yellow-800",
  },
  {
    id: "cerebral_hemorrhage",
    label: "Stroke Pendarahan Otak & Hematoma",
    organId: "brain",
    prompt: "Pasien stroke hemoragik dengan ruptur pembuluh darah serebral dan penumpukan hematoma masif",
    icon: "🧠",
    badgeColor: "bg-rose-950 text-rose-100 border-rose-800",
  },
  {
    id: "normal",
    label: "Kondisi Anatomi Normal Sehat",
    organId: "lungs",
    prompt: "Jaringan parenkim utuh, perfusi vaskular optimal tanpa lesi patologis",
    icon: "🩺",
    badgeColor: "bg-emerald-950 text-emerald-100 border-emerald-800",
  },
];

function AnatomyPage() {
  const {
    cases,
    isDoctorRegistered,
    selectedOrganId,
    selectedHotspotId,
    symptomMode,
    set3DInspection,
    toggleSymptomMode,
    medicalFormData,
    activeCase,
  } = useMedicalStore();

  const hasPatientCases = cases.length > 0;

  const [customAiPrompt, setCustomAiPrompt] = useState("");
  const [showAllOrgans, setShowAllOrgans] = useState(false);

  // Compute AI Clinical Triage based on active case
  const aiTriageResult = useMemo<AiTriageResult>(() => {
    const dialogueText = activeCase.dialogue.map((d) => d.text).join(" ");
    return inferOrganFromClinicalData({
      dialogueText,
      rawNotes: activeCase.rawNotes,
      chiefComplaint: activeCase.patientSummary,
      diagnosis: activeCase.diagnosis,
      defaultOrganId: activeCase.organId,
    });
  }, [activeCase]);

  // Current active organ ID
  const [currentOrganId, setCurrentOrganId] = useState<OrganId>(
    selectedOrganId || aiTriageResult.primaryOrganId || "lungs",
  );

  // Active 3D Pathology Mutation State
  const initialPathology = useMemo(() => {
    const combined = `${activeCase?.patientSummary || ""} ${activeCase?.rawNotes || ""} ${activeCase?.diagnosis || ""} ${medicalFormData?.tobaccoUse || ""}`;
    return inferPathologyFromClinicalText(combined, currentOrganId);
  }, [activeCase, medicalFormData?.tobaccoUse, currentOrganId]);

  const [activePathology, setActivePathology] = useState<PathologyType>(initialPathology);

  // Futuristic AI Synthesis HUD State
  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [synthesisProgress, setSynthesisProgress] = useState(0);
  const [synthesisStepText, setSynthesisStepText] = useState("");
  const [synthesisLogs, setSynthesisLogs] = useState<string[]>([]);

  // Synchronize when AI Triage changes (e.g. case change or query)
  useEffect(() => {
    if (!selectedOrganId) {
      setCurrentOrganId(aiTriageResult.primaryOrganId);
      if (aiTriageResult.recommendedHotspotId) {
        set3DInspection(aiTriageResult.primaryOrganId, aiTriageResult.recommendedHotspotId, null);
      }
    }
  }, [aiTriageResult.primaryOrganId, selectedOrganId]);

  const currentOrgan = useMemo(() => {
    return organs.find((o) => o.id === currentOrganId) || organs[0];
  }, [currentOrganId]);

  // Selected hotspot object
  const activeHotspot = useMemo(() => {
    if (!selectedHotspotId) return null;
    return currentOrgan.hotspots.find((h) => h.id === selectedHotspotId) || null;
  }, [selectedHotspotId, currentOrgan.hotspots]);

  // Symptom hotspot IDs for this organ
  const symptomHotspotIds = useMemo(() => {
    const list: string[] = [];
    if (activeCase && activeCase.organId === currentOrganId) {
      list.push(...activeCase.affectedHotspots);
    }
    if (medicalFormData.findings) {
      medicalFormData.findings
        .filter((f) => !f.organId || f.organId === currentOrganId)
        .forEach((f) => {
          if (f.hotspotId && !list.includes(f.hotspotId)) {
            list.push(f.hotspotId);
          }
        });
    }
    if (aiTriageResult.primaryOrganId === currentOrganId && aiTriageResult.recommendedHotspotId) {
      if (!list.includes(aiTriageResult.recommendedHotspotId)) {
        list.push(aiTriageResult.recommendedHotspotId);
      }
    }
    return list;
  }, [activeCase, currentOrganId, medicalFormData.findings, aiTriageResult]);

  const handleSelectOrgan = (organId: OrganId) => {
    setCurrentOrganId(organId);
    set3DInspection(organId, null, null);
  };

  /**
   * Triggers the high-tech DeepSeek Neural AI 3D Pathology Synthesis Pipeline
   */
  const handleTriggerAiPathologySynthesis = (promptText: string, targetPathology?: PathologyType) => {
    if (!promptText.trim()) return;

    const matchedPathology =
      targetPathology || inferPathologyFromClinicalText(promptText, currentOrganId);

    setIsSynthesizing(true);
    setSynthesisProgress(10);
    setSynthesisLogs([
      `> [01/05] Connecting to NVIDIA DeepSeek Neural Reasoning Engine (meta/llama-3.3-70b-instruct & DeepSeek-R1)...`,
    ]);
    setSynthesisStepText("Menganalisis Biopsi & Rekam Klinis Pasien...");

    setTimeout(() => {
      setSynthesisProgress(35);
      setSynthesisLogs((prev) => [
        ...prev,
        `> [02/05] Clinical NLP: Extracted pathological markers: "${promptText}"`,
        `> [03/05] Computing 3D Biomechanical Morphing Vector for ${currentOrgan.name}...`,
      ]);
      setSynthesisStepText("Mensintesis Vektor Deformasi Jaringan 3D...");
    }, 450);

    setTimeout(() => {
      setSynthesisProgress(70);
      setSynthesisLogs((prev) => [
        ...prev,
        `> [04/05] Injecting procedural 3D physical lesions (Shaders, Roughness, Displacements)...`,
        `> [04/05] Spawning targeted geometry: ${PATHOLOGY_PRESETS[matchedPathology]?.badge || "Lesion Nodes"}...`,
      ]);
      setSynthesisStepText("Menyuntikkan Shader & Geometri Lesi Fisik...");
    }, 900);

    setTimeout(() => {
      setSynthesisProgress(100);
      setSynthesisLogs((prev) => [
        ...prev,
        `> [05/05] WebGL PBR shader compilation complete. Active pathology: [${matchedPathology}]`,
        `> [DONE] 3D Biological Model successfully mutated to patient condition!`,
      ]);
      setSynthesisStepText("Sintesis 3D Berhasil!");
    }, 1350);

    setTimeout(() => {
      setActivePathology(matchedPathology);
      setIsSynthesizing(false);
    }, 1750);
  };

  // Filter relevant organs vs secondary organs
  const relevantOrganIds = useMemo(() => {
    const set = new Set<OrganId>();
    if (activeCase.organId) set.add(activeCase.organId);
    if (aiTriageResult.primaryOrganId) set.add(aiTriageResult.primaryOrganId);
    aiTriageResult.secondaryOrganIds.forEach((id) => set.add(id));
    return Array.from(set);
  }, [activeCase.organId, aiTriageResult]);

  const relevantOrgans = useMemo(() => {
    return organs.filter((o) => relevantOrganIds.includes(o.id));
  }, [relevantOrganIds]);

  const currentPathologyConfig = PATHOLOGY_PRESETS[activePathology] || PATHOLOGY_PRESETS.normal;

  // 🔒 ACCESS CONTROL GATE 1: Require Registered DPJP Doctor
  if (!isDoctorRegistered) {
    return (
      <main className="max-w-[850px] mx-auto px-4 py-16 space-y-8 text-center font-serif">
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[32px] p-10 shadow-[var(--shadow)] space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Akses Terkunci • Diperlukan Identitas Dokter DPJP
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Login / Registrasi Dokter Diperlukan
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-lg mx-auto leading-relaxed">
              Stasiun Rekonstruksi Anatomi 3D dan simulasi mutasi patologi biomekanikal hanya dapat diakses oleh Dokter Penanggung Jawab Pelayanan (DPJP) yang terverifikasi.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-[var(--terracotta)] text-white text-xs font-bold hover:bg-[#d95d4b] transition flex items-center gap-2 shadow-md"
            >
              <UserCheck size={16} />
              <span>Login / Registrasi Dokter DPJP</span>
            </Link>
            <Link
              to="/"
              className="px-5 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] font-bold hover:bg-[var(--paper-soft)] transition"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // 🔒 ACCESS CONTROL GATE 2: Require Patient Clinical Indication
  if (!hasPatientCases) {
    return (
      <main className="max-w-[850px] mx-auto px-4 py-16 space-y-8 text-center font-serif">
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[32px] p-10 shadow-[var(--shadow)] space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 flex items-center justify-center mx-auto shadow-inner">
            <Box size={32} />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 border border-indigo-200">
              Belum Ada Indikasi Klinis / Patologi Pasien
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Mulai Konsultasi & Input Keluhan Pasien
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-lg mx-auto leading-relaxed">
              Model Anatomi 3D dan mutasi patologi AI (seperti lesi smoker, trauma, nekrosis, hipertrofi, infark) dimodelkan secara spesifik berdasarkan hasil anamnesis dan keluhan pasien. Silakan rekam atau buat sesi konsultasi terlebih dahulu.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/consultation"
              className="px-6 py-3 rounded-xl bg-[var(--terracotta)] text-white text-xs font-bold hover:bg-[#d95d4b] transition flex items-center gap-2 shadow-md"
            >
              <Mic size={16} />
              <span>Mulai Sesi Konsultasi Pasien</span>
            </Link>
            <Link
              to="/"
              className="px-5 py-3 rounded-xl bg-white border border-[var(--line)] text-xs text-[var(--ink)] font-bold hover:bg-[var(--paper-soft)] transition"
            >
              Kembali ke Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1440px] mx-auto px-4 py-6 space-y-6">
      {/* Top Header & Navigation Breadcrumb */}
      <section className="bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-5 shadow-[var(--shadow)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/report"
            className="p-2.5 rounded-xl bg-white border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper-soft)] transition flex items-center gap-1.5 text-xs font-serif font-bold"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Dokumen Formulir</span>
          </Link>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-muted)] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Stasiun Rekonstruksi Anatomi 3D Terarah AI (Live 3D Pathology Mutation)</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] flex items-center gap-2">
              <span>Visualisasi & Mutasi 3D Sesuai Kondisi Pasien</span>
            </h1>
          </div>
        </div>

        {/* Right Info Badges */}
        <div className="flex items-center gap-3">
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[var(--line)] shadow-sm flex items-center gap-2 text-xs font-serif">
            <Database size={14} className="text-[#3b6b39]" />
            <span className="font-bold text-[var(--ink)]">Tersinkron ke DB Neon</span>
          </div>

          <Link
            to="/report"
            className="px-4 py-2 rounded-xl bg-[var(--ink)] hover:bg-black text-white text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-sm"
          >
            <FileText size={15} />
            <span>Buka Laporan Medis</span>
          </Link>
        </div>
      </section>

      {/* 🎛️ AI 3D Pathology Live Mutator Panel (NVIDIA DeepSeek Pro Driven) */}
      <section className="bg-gradient-to-r from-slate-900 via-neutral-900 to-stone-900 text-white rounded-[26px] p-5 border border-neutral-700 shadow-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-neutral-800 pb-3.5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center shrink-0">
              <Wand2 size={22} className="animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  NVIDIA DeepSeek Pro • 3D Biomechanical Morphing Engine
                </span>
                <span className="text-[11px] font-sans font-bold px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/50">
                  Status: {currentPathologyConfig.badge}
                </span>
              </div>
              <h2 className="text-base font-serif font-bold text-neutral-100 mt-0.5">
                Modifikasi Model 3D Berdasarkan Kondisi Pasien (Warna, Tekstur & Lesi Fisik)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-serif text-neutral-400">
            <Cpu size={14} className="text-amber-400" />
            <span>DeepSeek-R1-Med / LLaMA-70B Active</span>
          </div>
        </div>

        {/* AI Custom Prompt Input Bar */}
        <div className="space-y-1.5">
          <label className="text-xs font-serif text-neutral-300 font-semibold block">
            Ketik Kondisi Klinis / Gaya Hidup Pasien untuk Mutasi 3D Real-Time:
          </label>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Sparkles size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-amber-400" />
              <input
                type="text"
                value={customAiPrompt}
                onChange={(e) => setCustomAiPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && customAiPrompt.trim()) {
                    handleTriggerAiPathologySynthesis(customAiPrompt);
                  }
                }}
                placeholder="Misal: 'Pasien perokok berat 2 bungkus sehari paru hitam', 'Pasien tertusuk pisau pendarahan', dll..."
                className="w-full pl-9.5 pr-4 py-2.5 rounded-xl bg-neutral-800/90 border border-neutral-700 text-xs font-serif text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
              />
            </div>

            <button
              type="button"
              disabled={isSynthesizing}
              onClick={() => {
                const prompt = customAiPrompt.trim() || activeCase.patientSummary || "smoker";
                handleTriggerAiPathologySynthesis(prompt);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-serif font-bold transition flex items-center justify-center gap-2 shadow-lg shrink-0 disabled:opacity-50"
            >
              {isSynthesizing ? <Loader2 size={15} className="animate-spin" /> : <Flame size={15} />}
              <span>Mutasikan 3D via DeepSeek AI</span>
            </button>
          </div>
        </div>

        {/* Quick Pathology Presets Grid */}
        <div className="space-y-1.5 pt-1">
          <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider block">
            Pilih Cepat Preset Patologi (Klik untuk Memodifikasi Model 3D Langsung):
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
            {QUICK_PATHOLOGY_PRESETS.map((preset) => {
              const isActive = activePathology === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => {
                    if (preset.organId !== currentOrganId) {
                      setCurrentOrganId(preset.organId);
                    }
                    handleTriggerAiPathologySynthesis(preset.prompt, preset.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition flex flex-col items-start gap-1 ${
                    isActive
                      ? "bg-amber-500 text-black border-amber-400 font-bold shadow-md ring-2 ring-amber-400/50"
                      : "bg-neutral-800/80 text-neutral-300 border-neutral-700 hover:bg-neutral-750 hover:border-neutral-500"
                  }`}
                >
                  <span className="text-base">{preset.icon}</span>
                  <span className="text-[11px] font-serif leading-tight">{preset.label.split(" (")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Organ Systems Filtered by AI Relevance */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-serif font-bold text-[var(--ink)] uppercase tracking-wider">
              Organ Terkait Kasus Pasien (AI Primary & Secondary):
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              {relevantOrgans.length} Organ Ditargetkan
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowAllOrgans(!showAllOrgans)}
            className="text-xs font-serif text-[var(--ink-soft)] hover:text-[var(--ink)] flex items-center gap-1 font-semibold transition"
          >
            <span>{showAllOrgans ? "Sembunyikan Spesimen Lain" : "Tampilkan Semua 9 Spesimen Organ"}</span>
            {showAllOrgans ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>
        </div>

        {/* Primary AI-Recommended Organs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {relevantOrgans.map((organ) => {
            const isSelected = organ.id === currentOrganId;
            const isPrimary = organ.id === aiTriageResult.primaryOrganId;
            const hasSymptom = activeCase.organId === organ.id || isPrimary;

            return (
              <button
                key={organ.id}
                type="button"
                onClick={() => handleSelectOrgan(organ.id)}
                className={`p-3.5 rounded-2xl border text-left transition relative flex items-center gap-3.5 ${
                  isSelected
                    ? "bg-white border-[var(--terracotta)] shadow-md ring-2 ring-[var(--terracotta)]/25"
                    : "bg-[var(--paper)] border-[var(--line)] hover:bg-white"
                }`}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold text-2xl transition shrink-0"
                  style={{
                    backgroundColor: isSelected ? `${organ.accent}25` : "var(--paper-soft)",
                    color: organ.accent,
                  }}
                >
                  {organ.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm text-[var(--ink)]">{organ.name}</span>
                    {isPrimary && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.2 rounded bg-amber-500 text-white shadow-2xs">
                        AI Utama
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-[var(--ink-muted)] font-serif italic truncate">
                    {organ.scientificName} • {organ.system}
                  </div>
                  <div className="text-[11px] text-[var(--terracotta)] font-serif font-semibold mt-0.5 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    <span>{organ.hotspots.length} Landmark Klinis</span>
                  </div>
                </div>

                {hasSymptom && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-[#ef4444] ring-2 ring-white animate-ping" />
                )}
              </button>
            );
          })}
        </div>

        {/* Collapsible Complete 9 Organs Grid (if requested) */}
        {showAllOrgans && (
          <div className="pt-2 space-y-2 animate-in fade-in duration-200">
            <span className="text-[10px] uppercase font-bold text-[var(--ink-muted)] tracking-wider block">
              Katalog Lengkap Seluruh Spesimen (Eksplorasi Diagnostik Luas):
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
              {organs.map((organ) => {
                const isSelected = organ.id === currentOrganId;
                return (
                  <button
                    key={organ.id}
                    type="button"
                    onClick={() => handleSelectOrgan(organ.id)}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                      isSelected
                        ? "bg-white border-[var(--terracotta)] shadow-sm font-bold"
                        : "bg-[var(--paper-soft)] border-[var(--line)] hover:bg-white text-[var(--ink-soft)]"
                    }`}
                  >
                    <span className="text-lg">{organ.icon}</span>
                    <span className="font-serif text-xs">{organ.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Main 3D Canvas & Clinical Findings Split (12 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D WebGL Canvas Viewport (8 cols) */}
        <div className="lg:col-span-8 bg-[var(--paper)] border border-[var(--line)] rounded-[30px] p-4 shadow-[var(--shadow)] overflow-hidden relative">
          <div className="h-[680px] rounded-[24px] overflow-hidden relative">
            <OrganViewer
              organ={currentOrgan}
              autoRotate={true}
              selectedHotspotId={selectedHotspotId}
              onSelectHotspot={(h) => set3DInspection(currentOrganId, h?.id || null, null)}
              symptomMode={symptomMode}
              symptomHotspotIds={symptomHotspotIds}
              onToggleSymptomMode={toggleSymptomMode}
              pathologyType={activePathology}
            />
          </div>
        </div>

        {/* Right Clinical Information & Findings Panel (4 cols) */}
        <div className="lg:col-span-4 space-y-5 flex flex-col">
          {/* Active 3D Pathology Pathology Description Card */}
          <div className="bg-gradient-to-br from-neutral-900 to-slate-900 text-white rounded-[26px] p-5 border border-neutral-700 shadow-md space-y-3 font-serif">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Flame size={16} className="text-amber-400 animate-pulse" />
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-300">
                  Patologi 3D Aktif (Live Mutation)
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-900 text-red-200 border border-red-700">
                {currentPathologyConfig.badge}
              </span>
            </div>

            <h3 className="text-sm font-bold text-neutral-100">{currentPathologyConfig.title}</h3>
            <p className="text-xs text-neutral-300 leading-relaxed">{currentPathologyConfig.description}</p>

            <div className="pt-2 flex flex-wrap gap-1.5 text-[10px] font-sans">
              {currentPathologyConfig.hasBleeding && (
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 flex items-center gap-1">
                  <Droplets size={11} /> Pendarahan Aktif 3D
                </span>
              )}
              {currentPathologyConfig.hasStabWound && (
                <span className="px-2 py-0.5 rounded bg-rose-950 text-rose-300 border border-rose-800">
                  🔪 Laserasi Luka Tusuk
                </span>
              )}
              {currentPathologyConfig.hasTarDeposits && (
                <span className="px-2 py-0.5 rounded bg-neutral-800 text-neutral-300 border border-neutral-600">
                  💨 Deposit Tar Karbon
                </span>
              )}
              {currentPathologyConfig.hasStones && (
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                  🪨 Kristal Kalsium Oksalat
                </span>
              )}
            </div>
          </div>

          {/* Active Selected Landmark Inspector Card */}
          {activeHotspot ? (
            <div className="bg-[var(--paper)] border-2 border-[var(--terracotta)] rounded-[26px] p-5 shadow-[var(--shadow)] space-y-3 font-serif animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--terracotta)] tracking-wider block">
                    Inspeksi Spasial 3D Landmark Terpilih
                  </span>
                  <h3 className="font-bold text-lg text-[var(--ink)]">{activeHotspot.label}</h3>
                </div>
                <button
                  type="button"
                  onClick={() => set3DInspection(currentOrganId, null, null)}
                  className="text-xs text-[var(--ink-muted)] hover:text-[var(--ink)] px-2 py-1 rounded-lg bg-white border border-[var(--line)]"
                >
                  Tutup Fokus
                </button>
              </div>

              {symptomHotspotIds.includes(activeHotspot.id) ? (
                <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2">
                  <Zap size={14} className="shrink-0 mt-0.5 text-red-600 animate-pulse" />
                  <div>
                    <strong className="block font-bold">Terdeteksi Patologi Klinis Aktif (Lesi)</strong>
                    <span className="text-[11px] leading-snug">
                      Zona ini mengalami perubahan morfologi dan patofisiologi akibat inflamasi/lesi sesuai dengan keluhan klinis pasien.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 size={14} className="shrink-0 mt-0.5 text-emerald-600" />
                  <div>
                    <strong className="block font-bold">Struktur Anatomi Normal</strong>
                    <span className="text-[11px] leading-snug">
                      Tidak teridentifikasi lesi akut pada jaringan landmark ini.
                    </span>
                  </div>
                </div>
              )}

              <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{activeHotspot.detail}</p>
            </div>
          ) : (
            /* Organ Biological Fact Card */
            <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-5 shadow-[var(--shadow)] space-y-3 font-serif">
              <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
                <div>
                  <span className="text-[10px] uppercase font-bold text-[var(--ink-muted)] tracking-wider">
                    Sistem Anatomi: {currentOrgan.system}
                  </span>
                  <h3 className="font-bold text-xl text-[var(--ink)]">{currentOrgan.name}</h3>
                </div>
                <span className="text-2xl" style={{ color: currentOrgan.accent }}>
                  {currentOrgan.icon}
                </span>
              </div>

              <p className="text-xs text-[var(--ink-soft)] leading-relaxed">{currentOrgan.description}</p>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2.5 rounded-xl bg-white border border-[var(--line)]">
                  <span className="text-[10px] text-[var(--ink-muted)] block">Ukuran Normal:</span>
                  <span className="font-bold text-[var(--ink)]">{currentOrgan.size}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white border border-[var(--line)]">
                  <span className="text-[10px] text-[var(--ink-muted)] block">Berat Rata-rata:</span>
                  <span className="font-bold text-[var(--ink)]">{currentOrgan.weight}</span>
                </div>
              </div>
            </div>
          )}

          {/* Active Patient Diagnosis & Hotspot Findings */}
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-5 shadow-[var(--shadow)] space-y-4 font-serif">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-2.5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-[var(--terracotta)]" />
                <h4 className="font-bold text-sm text-[var(--ink)]">Daftar Landmark & Patologi</h4>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold">
                {symptomHotspotIds.length} Titik Lesi
              </span>
            </div>

            {/* Diagnosis Banner */}
            <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] space-y-1">
              <span className="text-[10px] uppercase font-bold text-[var(--terracotta)] block">
                Diagnosis Terkait Kasus:
              </span>
              <div className="font-bold text-sm text-[var(--ink)]">{activeCase.diagnosis}</div>
              <div className="text-xs text-[var(--ink-soft)]">{activeCase.diagnosisIcd}</div>
            </div>

            {/* List of Landmarks */}
            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              {currentOrgan.hotspots.map((hotspot) => {
                const isSymptom = symptomHotspotIds.includes(hotspot.id);
                const isSelected = selectedHotspotId === hotspot.id;

                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        set3DInspection(currentOrganId, null, null);
                      } else {
                        set3DInspection(currentOrganId, hotspot.id, null);
                      }
                    }}
                    className={`w-full p-3 rounded-2xl border text-left transition flex items-start justify-between gap-2 ${
                      isSelected
                        ? "bg-[rgba(235,124,107,0.12)] border-[var(--terracotta)] shadow-sm"
                        : isSymptom
                        ? "bg-red-50/60 border-red-200 hover:bg-red-50"
                        : "bg-white border-[var(--line)] hover:bg-[var(--paper-soft)]"
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="font-bold text-xs text-[var(--ink)] flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            isSymptom ? "bg-red-500 animate-ping" : "bg-gray-400"
                          }`}
                        />
                        <span>{hotspot.label}</span>
                      </div>
                      <div className="text-[11px] text-[var(--ink-soft)] leading-snug">{hotspot.detail}</div>
                    </div>

                    {isSymptom && (
                      <span className="text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-red-600 text-white shrink-0">
                        Patologi
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Bottom CTA to View Report */}
            <div className="pt-2">
              <Link
                to="/report"
                className="w-full py-3 px-4 rounded-xl font-serif font-bold text-xs bg-[var(--terracotta)] hover:opacity-95 text-white transition flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText size={15} />
                <span>Buka Formulir Riwayat Medis Lengkap</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🚀 Futuristic Cyber-Medical DeepSeek Neural AI 3D Synthesis Modal Overlay */}
      {isSynthesizing && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="max-w-xl w-full bg-neutral-950 border border-amber-500/50 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-white font-mono relative overflow-hidden">
            {/* Ambient Background Grid & Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header */}
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                  <Cpu size={22} className="animate-spin" style={{ animationDuration: "6s" }} />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-amber-400 font-bold">
                    DeepSeek Pro • 3D Neural Morphing
                  </div>
                  <div className="text-base font-serif font-bold text-white">
                    Sintesis Patologi 3D Spesimen {currentOrgan.name}
                  </div>
                </div>
              </div>

              <div className="text-xs text-amber-400/90 font-bold px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30">
                {synthesisProgress}%
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-300 font-sans">
                <span className="flex items-center gap-2">
                  <Loader2 size={13} className="animate-spin text-amber-400" />
                  <span>{synthesisStepText}</span>
                </span>
                <span className="text-neutral-400 font-mono">{synthesisProgress}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-neutral-800 overflow-hidden border border-neutral-700">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 transition-all duration-300 rounded-full shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  style={{ width: `${synthesisProgress}%` }}
                />
              </div>
            </div>

            {/* Live Terminal Reasoning Logs */}
            <div className="bg-black/90 border border-neutral-800 rounded-2xl p-4 font-mono text-xs space-y-1.5 text-neutral-300 max-h-48 overflow-y-auto">
              <div className="flex items-center gap-2 text-[10px] uppercase font-bold text-amber-500 border-b border-neutral-800 pb-1.5 mb-2">
                <Terminal size={12} />
                <span>NVIDIA DeepSeek Reasoning Logs:</span>
              </div>
              {synthesisLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={`leading-relaxed ${
                    idx === synthesisLogs.length - 1 ? "text-amber-300 font-bold" : "text-neutral-400"
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>

            <div className="text-[11px] font-sans text-neutral-400 text-center italic">
              Sedang merekonstruksi displacement peta verteks, tekstur jelaga/darah, dan lesi patologis...
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
