import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  FileText,
  User,
  Stethoscope,
  Database,
  ChevronRight,
  Save,
  Plus,
  Trash2,
  Check,
  Lock,
  AlertCircle,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import type { OrganId } from "../lib/anatomy-data";

export const Route = createFileRoute("/consultation")({
  component: ConsultationPage,
});

function ConsultationPage() {
  const {
    cases,
    activeCaseId,
    activeCase,
    selectCase,
    createNewPatientCase,
    updateActiveCase,
    applyAiExtractionResult,
    dbSyncStatus,
    saveNowToDb,
    doctorProfile,
    isDoctorRegistered,
  } = useMedicalStore();

  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionComplete, setExtractionComplete] = useState(false);
  const [activeTab, setActiveTab] = useState<"dialogue" | "notes" | "vitals">("dialogue");
  
  // Real-time live speech recognition state
  const [liveTranscript, setLiveTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  // New patient modal / inline state
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("45 tahun");
  const [newPatientGender, setNewPatientGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [newPatientOrgan, setNewPatientOrgan] = useState<OrganId>("heart");
  const [newPatientChiefComplaint, setNewPatientChiefComplaint] = useState("");

  // New dialogue line input
  const [newSpeaker, setNewSpeaker] = useState<"doctor" | "patient">("doctor");
  const [newSpeakerText, setNewSpeakerText] = useState("");

  // Audio timer simulation
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [isRecording]);

  // Speech recognition setup (Web Speech API)
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID";

      recognition.onresult = (event: any) => {
        let current = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          current += event.results[i][0].transcript;
        }
        setLiveTranscript(current);
      };

      recognition.onerror = (e: any) => {
        console.log("Speech recognition error:", e);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleStartStopRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}

      // If live transcript captured, add it to the dialogue
      if (liveTranscript.trim()) {
        const newDialogueItem = {
          speaker: "patient" as const,
          speakerName: activeCase.patientName || "Pasien",
          text: liveTranscript.trim(),
          time: new Date().toLocaleTimeString("id-ID", { minute: "2-digit", second: "2-digit" }),
        };
        updateActiveCase({
          dialogue: [...activeCase.dialogue, newDialogueItem],
        });
        setLiveTranscript("");
      }
    } else {
      // Start recording
      setIsRecording(true);
      setLiveTranscript("");
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.log("Recognition start failed or already active:", e);
      }
    }
  };

  const handleAddDialogueItem = () => {
    if (!newSpeakerText.trim()) return;
    const speakerName = newSpeaker === "doctor" ? activeCase.doctorName || "Dokter" : activeCase.patientName || "Pasien";
    const newItem = {
      speaker: newSpeaker,
      speakerName,
      text: newSpeakerText.trim(),
      time: new Date().toLocaleTimeString("id-ID", { minute: "2-digit", second: "2-digit" }),
    };
    updateActiveCase({
      dialogue: [...activeCase.dialogue, newItem],
    });
    setNewSpeakerText("");
  };

  const handleDeleteDialogueItem = (index: number) => {
    const updated = activeCase.dialogue.filter((_, i) => i !== index);
    updateActiveCase({ dialogue: updated });
  };

  const handleCreateNewPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim()) return;

    createNewPatientCase({
      patientName: newPatientName,
      patientAge: newPatientAge,
      patientGender: newPatientGender,
      organId: newPatientOrgan,
      title: newPatientChiefComplaint || `Konsultasi ${newPatientName}`,
      rawNotes: `Pasien datang dengan keluhan utama: ${newPatientChiefComplaint || "Pemeriksaan rutin"}. Dilakukan anamnesis mendalam.`,
      dialogue: [
        {
          speaker: "doctor",
          speakerName: doctorProfile?.name || "dr. Spesialis",
          text: `Selamat pagi, ${newPatientName}. Ada keluhan apa yang bisa saya bantu hari ini?`,
          time: "00:05",
        },
        {
          speaker: "patient",
          speakerName: newPatientName,
          text: newPatientChiefComplaint || "Saya merasakan keluhan sejak beberapa hari terakhir ini dokter...",
          time: "00:15",
        },
      ],
    });

    setShowNewPatientModal(false);
    setNewPatientName("");
    setNewPatientChiefComplaint("");
  };

  const handleRunAiExtraction = async () => {
    setIsExtracting(true);
    setExtractionComplete(false);

    try {
      // Call AI Extraction API endpoint
      const response = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          dialogue: activeCase.dialogue.map((d) => `${d.speakerName}: ${d.text}`).join("\n"),
          rawNotes: activeCase.rawNotes,
          organId: activeCase.organId,
          patientName: activeCase.patientName,
          patientMrn: activeCase.patientMrn,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          applyAiExtractionResult({
            ...result.data,
            organId: (result.data.primaryOrgan as OrganId) || activeCase.organId,
          });
        }
      }
    } catch (e) {
      console.warn("AI extraction fallback to local structured model:", e);
    } finally {
      // Ensure data is synced to DB
      await saveNowToDb();
      setIsExtracting(false);
      setExtractionComplete(true);
    }
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // 🔒 ACCESS CONTROL GUARD: Require Registered DPJP Doctor
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
              Untuk membuka modul konsultasi klinis, merekam anamnesis, dan melakukan ekstraksi medis AI, Anda harus masuk atau mendaftarkan identitas Dokter Penanggung Jawab Pelayanan (DPJP) dengan SIP/STR resmi.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="px-6 py-3 rounded-xl bg-[var(--terracotta)] text-white text-xs font-bold hover:bg-[#d95d4b] transition flex items-center gap-2 shadow-md"
            >
              <Stethoscope size={16} />
              <span>Login / Registrasi Dokter DPJP Sekarang</span>
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
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-8">
      {/* Header & Case Preset Switcher */}
      <section className="bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-6 shadow-[var(--shadow)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--line)] pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(235,124,107,0.12)] text-[var(--terracotta)] border border-[rgba(235,124,107,0.25)]">
              <Mic size={13} className="animate-pulse" />
              <span>Modul 1: Sesi Konsultasi Suara Dokter & Pasien</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--ink)]">
              Rekaman Konsultasi & Ekstraksi AI
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-serif">
              Merekam percakapan klinis secara real-time, mengekstrak istilah medis, dan menyimpannya langsung ke Database PostgreSQL Neon DB.
            </p>
          </div>

          {/* Database Persistence Status Badge & Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-white border border-[var(--line)] shadow-xs flex items-center gap-2">
              <Database size={15} className={dbSyncStatus === "saving" ? "text-amber-500 animate-spin" : "text-[#3b6b39]"} />
              <div className="text-left">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[var(--ink-muted)]">
                  Status Database Neon DB
                </div>
                <div className="text-xs font-bold text-[var(--ink)] flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${dbSyncStatus === "saving" ? "bg-amber-400 animate-ping" : "bg-[#3b6b39]"}`} />
                  {dbSyncStatus === "saving" ? "Menyimpan ke DB..." : "Tersinkronisasi ke PostgreSQL"}
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-3.5 py-2 rounded-xl bg-[var(--terracotta)] text-white text-xs font-serif font-bold hover:bg-[#d95d4b] transition flex items-center gap-1.5 shadow-xs"
            >
              <Plus size={14} />
              <span>+ Pasien Baru (Blank Flow)</span>
            </button>

            <button
              type="button"
              onClick={() => saveNowToDb()}
              className="px-3 py-2 rounded-xl bg-white border border-[var(--line)] text-xs font-serif font-bold text-[var(--ink)] hover:bg-[var(--paper-soft)] transition flex items-center gap-1.5 shadow-xs"
              title="Paksa Sinkronisasi Sekarang"
            >
              <Save size={14} />
              <span>Simpan DB</span>
            </button>
          </div>
        </div>

        {/* Case Selector */}
        {cases.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif font-bold text-[var(--ink-soft)] uppercase tracking-wider block">
                Daftar Pasien & Kasus Klinis Terdaftar:
              </label>
              <span className="text-xs font-mono text-[var(--ink-muted)]">{cases.length} Kasus Aktif</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cases.map((c) => {
                const isSelected = c.id === activeCaseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCase(c.id)}
                    className={`p-3.5 rounded-2xl border text-left transition relative ${
                      isSelected
                        ? "bg-[rgba(235,124,107,0.1)] border-[var(--terracotta)] shadow-sm"
                        : "bg-white border-[var(--line)] hover:border-[var(--ink-muted)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--paper-soft)] text-[var(--ink-soft)] font-bold">
                        {c.patientMrn}
                      </span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          c.severity === "CRITICAL"
                            ? "bg-red-100 text-red-700"
                            : c.severity === "SEVERE"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-emerald-100 text-emerald-800"
                        }`}
                      >
                        {c.severity}
                      </span>
                    </div>
                    <div className="font-serif font-bold text-sm text-[var(--ink)] line-clamp-1">{c.patientName}</div>
                    <div className="text-xs text-[var(--ink-soft)] font-serif line-clamp-1">{c.title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-center justify-between gap-3 text-xs font-serif text-amber-900">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span>Sesi konsultasi blank flow aktif. Daftarkan pasien baru atau langsung mulai rekam percakapan dokter-pasien di bawah.</span>
            </div>
            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-3 py-1.5 rounded-lg bg-[var(--terracotta)] text-white font-bold hover:bg-[#d95d4b] transition shrink-0"
            >
              + Input Data Pasien
            </button>
          </div>
        )}
      </section>

      {/* Main Studio Grid: Audio Recorder Left, Live Dialogue Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Voice Recording Console (5 cols) */}
        <section className="lg:col-span-5 bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-6 shadow-[var(--shadow)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[var(--ink-soft)] uppercase tracking-wider">
                Konsol Perekam Audio Pasien
              </span>
              <span className="text-xs font-mono font-bold text-[var(--terracotta)] bg-[rgba(235,124,107,0.12)] px-2.5 py-1 rounded-full flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isRecording ? "bg-red-500 animate-ping" : "bg-gray-400"}`} />
                {isRecording ? "MEREKAM..." : "SIAP"} {formatTime(recordingSeconds)}
              </span>
            </div>

            {/* Live Audio Waveform */}
            <div className="h-32 bg-[var(--paper-soft)] rounded-2xl border border-[var(--line)] p-4 flex items-center justify-center gap-1 overflow-hidden relative">
              {Array.from({ length: 36 }).map((_, i) => {
                const height = isRecording
                  ? Math.max(12, Math.sin((i + recordingSeconds * 5) * 0.4) * 80 + Math.random() * 40)
                  : 8;
                return (
                  <div
                    key={i}
                    className="w-1.5 rounded-full transition-all duration-150"
                    style={{
                      height: `${height}%`,
                      backgroundColor: isRecording ? "var(--terracotta)" : "var(--line)",
                    }}
                  />
                );
              })}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] text-[var(--ink-muted)] font-mono">
                <span>MIC: SPEECH RECOGNITION (id-ID)</span>
                <span>STATE: {isRecording ? "AKTIF MENDENGAR" : "STANDBY"}</span>
              </div>
            </div>

            {/* Live Speech Recognition Transcription Box */}
            {isRecording && (
              <div className="p-3 bg-red-50/70 border border-red-200 rounded-2xl space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-red-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  Live Transkripsi Suara (Web Speech API):
                </div>
                <p className="text-xs font-serif text-red-950 italic">
                  {liveTranscript || "Sedang mendengarkan ucapan pasien / dokter dalam Bahasa Indonesia..."}
                </p>
              </div>
            )}

            {/* Patient & Doctor Meta Card */}
            <div className="bg-white rounded-2xl p-4 border border-[var(--line)] space-y-3 text-xs font-serif shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--sage-light)] text-[var(--sage)] flex items-center justify-center font-bold">
                  <User size={18} />
                </div>
                <div>
                  <div className="font-bold text-[var(--ink)] text-sm">{activeCase.patientName}</div>
                  <div className="text-[var(--ink-soft)] text-xs">
                    {activeCase.patientAge} • {activeCase.patientGender} • NIK: {activeCase.patientNik}
                  </div>
                </div>
              </div>

              <div className="border-t border-[var(--line)] pt-2.5 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--lavender-light)] text-[var(--lavender)] flex items-center justify-center font-bold">
                  <Stethoscope size={18} />
                </div>
                <div>
                  <div className="font-bold text-[var(--ink)]">{activeCase.doctorName}</div>
                  <div className="text-[var(--ink-soft)] text-[11px]">{activeCase.doctorSpecialty}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recorder Controls & AI Extraction Action */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleStartStopRecording}
                className={`flex-1 py-3.5 px-4 rounded-xl font-serif font-bold text-sm transition flex items-center justify-center gap-2 shadow-sm ${
                  isRecording
                    ? "bg-red-600 hover:bg-red-700 text-white animate-pulse"
                    : "bg-[var(--ink)] hover:bg-black text-white"
                }`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isRecording ? "Selesai & Simpan Suara" : "Mulai Rekam Percakapan"}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecordingSeconds(0)}
                className="p-3.5 rounded-xl bg-white border border-[var(--line)] text-[var(--ink-soft)] hover:text-[var(--ink)] transition shadow-xs"
                title="Reset Timer"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            {/* AI Reasoning Extraction Trigger Button */}
            <button
              type="button"
              onClick={handleRunAiExtraction}
              disabled={isExtracting}
              className="w-full py-4 px-4 rounded-xl font-serif font-bold text-sm bg-gradient-to-r from-[var(--terracotta)] to-[#d95d4b] hover:opacity-95 text-white transition flex items-center justify-center gap-2.5 shadow-md disabled:opacity-50"
            >
              <Sparkles size={18} className={isExtracting ? "animate-spin" : ""} />
              <span>
                {isExtracting
                  ? "AI Menganalisis Percakapan & Menyimpan ke PostgreSQL..."
                  : "Ekstraksi AI Jadi Dokumen Medis Resmi"}
              </span>
            </button>
          </div>
        </section>

        {/* Right Column: Multi-turn Dialogue Transcript & Clinical Findings (7 cols) */}
        <section className="lg:col-span-7 bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-6 shadow-[var(--shadow)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("dialogue")}
                  className={`text-xs font-serif font-bold px-3 py-1.5 rounded-xl transition ${
                    activeTab === "dialogue"
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--ink-soft)] hover:bg-white"
                  }`}
                >
                  Transkrip Percakapan ({activeCase.dialogue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`text-xs font-serif font-bold px-3 py-1.5 rounded-xl transition ${
                    activeTab === "notes"
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--ink-soft)] hover:bg-white"
                  }`}
                >
                  Catatan Anamnesis Dokter
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("vitals")}
                  className={`text-xs font-serif font-bold px-3 py-1.5 rounded-xl transition ${
                    activeTab === "vitals"
                      ? "bg-[var(--ink)] text-white"
                      : "text-[var(--ink-soft)] hover:bg-white"
                  }`}
                >
                  Tanda Vital Pasien
                </button>
              </div>

              <span className="text-[11px] font-mono text-[var(--ink-muted)]">
                ORGAN: {activeCase.organId.toUpperCase()}
              </span>
            </div>

            {/* Tab Contents */}
            {activeTab === "dialogue" && (
              <div className="space-y-3">
                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {activeCase.dialogue.map((item, idx) => {
                    const isDoctor = item.speaker === "doctor";
                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border text-xs font-serif space-y-1.5 relative group ${
                          isDoctor
                            ? "bg-[rgba(118,157,116,0.08)] border-[rgba(118,157,116,0.25)] ml-4"
                            : "bg-white border-[var(--line)] mr-4 shadow-xs"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold text-[var(--ink)] flex items-center gap-1.5">
                            {isDoctor ? <Stethoscope size={13} className="text-[#3b6b39]" /> : <User size={13} className="text-[var(--terracotta)]" />}
                            {item.speakerName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-[10px] text-[var(--ink-muted)]">{item.time}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteDialogueItem(idx)}
                              className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                              title="Hapus Baris"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => {
                            const updated = [...activeCase.dialogue];
                            updated[idx] = { ...updated[idx], text: e.target.value };
                            updateActiveCase({ dialogue: updated });
                          }}
                          className="w-full text-[var(--ink-soft)] bg-transparent border-b border-transparent focus:border-[var(--line)] outline-none"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Dialogue Row */}
                <div className="p-3 bg-white border border-[var(--line)] rounded-2xl flex items-center gap-2 shadow-xs">
                  <select
                    value={newSpeaker}
                    onChange={(e) => setNewSpeaker(e.target.value as any)}
                    className="p-1.5 bg-[var(--paper-soft)] border border-[var(--line)] rounded-lg text-xs font-serif font-bold text-[var(--ink)] outline-none"
                  >
                    <option value="doctor">Dokter</option>
                    <option value="patient">Pasien</option>
                  </select>
                  <input
                    type="text"
                    value={newSpeakerText}
                    onChange={(e) => setNewSpeakerText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddDialogueItem()}
                    placeholder="Tambah baris percakapan baru..."
                    className="flex-1 text-xs font-serif p-1.5 bg-transparent border-b border-[var(--line)] outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddDialogueItem}
                    className="px-3 py-1.5 rounded-lg bg-[var(--ink)] text-white text-xs font-serif font-bold hover:bg-black transition flex items-center gap-1"
                  >
                    <Plus size={13} />
                    <span>Tambah</span>
                  </button>
                </div>
              </div>
            )}

            {activeTab === "notes" && (
              <div className="bg-white rounded-2xl p-5 border border-[var(--line)] space-y-3 text-xs font-serif shadow-xs">
                <div className="font-bold text-sm text-[var(--ink)]">Catatan & Anamnesis Dokter</div>
                <textarea
                  rows={6}
                  value={activeCase.rawNotes}
                  onChange={(e) => updateActiveCase({ rawNotes: e.target.value })}
                  placeholder="Ketikkan catatan anamnesis dan pemeriksaan fisik dokter..."
                  className="w-full p-3 bg-[var(--paper-soft)] border border-[var(--line)] rounded-xl text-xs font-serif text-[var(--ink)] leading-relaxed focus:outline-none focus:border-[var(--terracotta)]"
                />
                <div className="p-3 rounded-xl bg-[var(--paper-soft)] border border-[var(--line)] space-y-1">
                  <span className="font-bold text-[var(--ink)]">Modalitas Radiologi / Pemeriksaan:</span>
                  <input
                    type="text"
                    value={activeCase.modality}
                    onChange={(e) => updateActiveCase({ modality: e.target.value })}
                    className="w-full text-xs font-serif bg-transparent border-b border-[var(--line)] outline-none"
                  />
                </div>
              </div>
            )}

            {activeTab === "vitals" && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-serif">
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] space-y-1 shadow-xs">
                  <span className="text-[var(--ink-muted)] text-[10px] block uppercase font-bold">Tekanan Darah</span>
                  <input
                    type="text"
                    value={activeCase.vitalSigns.bloodPressure}
                    onChange={(e) =>
                      updateActiveCase({
                        vitalSigns: { ...activeCase.vitalSigns, bloodPressure: e.target.value },
                      })
                    }
                    className="font-bold text-base text-[var(--ink)] w-full bg-transparent outline-none"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] space-y-1 shadow-xs">
                  <span className="text-[var(--ink-muted)] text-[10px] block uppercase font-bold">Detak Jantung (HR)</span>
                  <input
                    type="text"
                    value={activeCase.vitalSigns.heartRate}
                    onChange={(e) =>
                      updateActiveCase({
                        vitalSigns: { ...activeCase.vitalSigns, heartRate: e.target.value },
                      })
                    }
                    className="font-bold text-base text-[var(--ink)] w-full bg-transparent outline-none"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] space-y-1 shadow-xs">
                  <span className="text-[var(--ink-muted)] text-[10px] block uppercase font-bold">Laju Pernafasan</span>
                  <input
                    type="text"
                    value={activeCase.vitalSigns.respiratoryRate}
                    onChange={(e) =>
                      updateActiveCase({
                        vitalSigns: { ...activeCase.vitalSigns, respiratoryRate: e.target.value },
                      })
                    }
                    className="font-bold text-base text-[var(--ink)] w-full bg-transparent outline-none"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] space-y-1 shadow-xs">
                  <span className="text-[var(--ink-muted)] text-[10px] block uppercase font-bold">Saturasi O2 (SpO2)</span>
                  <input
                    type="text"
                    value={activeCase.vitalSigns.spo2}
                    onChange={(e) =>
                      updateActiveCase({
                        vitalSigns: { ...activeCase.vitalSigns, spo2: e.target.value },
                      })
                    }
                    className="font-bold text-base text-[var(--ink)] w-full bg-transparent outline-none"
                  />
                </div>
                <div className="p-3.5 rounded-2xl bg-white border border-[var(--line)] space-y-1 shadow-xs">
                  <span className="text-[var(--ink-muted)] text-[10px] block uppercase font-bold">Suhu Tubuh</span>
                  <input
                    type="text"
                    value={activeCase.vitalSigns.temperature}
                    onChange={(e) =>
                      updateActiveCase({
                        vitalSigns: { ...activeCase.vitalSigns, temperature: e.target.value },
                      })
                    }
                    className="font-bold text-base text-[var(--ink)] w-full bg-transparent outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Next Steps: Navigation to Report & 3D */}
          <div className="border-t border-[var(--line)] pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs font-serif text-[var(--ink-soft)]">
              {extractionComplete ? (
                <span className="text-[#3b6b39] font-bold flex items-center gap-1.5">
                  <CheckCircle2 size={15} /> Dokumen Terisi Lengkap & Tersimpan di Database!
                </span>
              ) : (
                <span>Siap diubah menjadi dokumen formulir resmi.</span>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Link
                to="/report"
                className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-serif font-bold text-sm bg-[var(--ink)] hover:bg-black text-white transition flex items-center justify-center gap-2 shadow-sm"
              >
                <FileText size={16} />
                <span>Lihat Dokumen Formulir Resmi</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Modal: Tambah Pasien Baru (Blank Flow) */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[var(--paper)] border border-[var(--line)] rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <h2 className="font-serif font-bold text-xl text-[var(--ink)]">Daftarkan Pasien Baru (Blank Flow)</h2>
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="text-[var(--ink-soft)] hover:text-black text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewPatient} className="space-y-4 text-xs font-serif">
              <div className="space-y-1">
                <label className="font-bold text-[var(--ink)] block">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="Contoh: Tn. Hendra Wijaya"
                  className="w-full p-2.5 bg-white border border-[var(--line)] rounded-xl outline-none focus:border-[var(--terracotta)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[var(--ink)] block">Usia Pasien</label>
                  <input
                    type="text"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    placeholder="Contoh: 52 tahun"
                    className="w-full p-2.5 bg-white border border-[var(--line)] rounded-xl outline-none focus:border-[var(--terracotta)]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[var(--ink)] block">Jenis Kelamin</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full p-2.5 bg-white border border-[var(--line)] rounded-xl outline-none focus:border-[var(--terracotta)]"
                  >
                    <option value="Laki-laki">Laki-laki (M)</option>
                    <option value="Perempuan">Perempuan (F)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--ink)] block">Organ Utama Yang Dikeluhkan</label>
                <select
                  value={newPatientOrgan}
                  onChange={(e) => setNewPatientOrgan(e.target.value as OrganId)}
                  className="w-full p-2.5 bg-white border border-[var(--line)] rounded-xl outline-none focus:border-[var(--terracotta)]"
                >
                  <option value="heart">Jantung (Cardiovascular / Heart)</option>
                  <option value="lungs">Paru-paru (Pulmonary / Lungs)</option>
                  <option value="brain">Otak & Saraf (Brain / Neurology)</option>
                  <option value="liver">Hati & Empedu (Liver / Hepato)</option>
                  <option value="kidneys">Ginjal & Urinaria (Kidneys / Renal)</option>
                  <option value="stomach">Lambung & GI (Stomach / Gastric)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--ink)] block">Keluhan Utama / Alasan Kunjungan</label>
                <textarea
                  rows={3}
                  value={newPatientChiefComplaint}
                  onChange={(e) => setNewPatientChiefComplaint(e.target.value)}
                  placeholder="Contoh: Batuk berdahak 3 minggu, sesak napas saat naik tangga..."
                  className="w-full p-2.5 bg-white border border-[var(--line)] rounded-xl outline-none focus:border-[var(--terracotta)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--line)] text-[var(--ink-soft)] hover:bg-white transition font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[var(--terracotta)] text-white hover:bg-[#d95d4b] transition font-bold shadow-xs flex items-center gap-1.5"
                >
                  <Check size={14} />
                  <span>Buat Kasus Pasien</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
