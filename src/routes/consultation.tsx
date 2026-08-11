import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  Database,
  ChevronRight,
  Lock,
  Zap,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import type { OrganId } from "../lib/anatomy-data";
import { runNarasiAiExtraction, type EvidenceLinkedItem } from "../server/ai-extract";
import { classifySpeakerRole } from "../server/elevenlabs-stt";

export const Route = createFileRoute("/consultation")({
  component: ConsultationPage,
});

function ConsultationPage() {
  const navigate = useNavigate();
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
  const [activeTab, setActiveTab] = useState<"dialogue" | "notes" | "vitals" | "evidence">("dialogue");

  // Real-time live transcript state
  const [liveTranscript, setLiveTranscript] = useState("");
  const [detectedSpeaker, setDetectedSpeaker] = useState<"doctor" | "patient">("patient");
  const recognitionRef = useRef<any>(null);

  // Evidence-Linking State
  const [highlightedTranscriptIndex, setHighlightedTranscriptIndex] = useState<number | null>(null);
  const [extractedEvidences, setExtractedEvidences] = useState<EvidenceLinkedItem[]>([]);

  // Modal State
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientDob, setNewPatientDob] = useState("14 Mei 1978");
  const [newPatientGender, setNewPatientGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [newPatientOrgan] = useState<OrganId>("lungs");
  const [newPatientChiefComplaint, setNewPatientChiefComplaint] = useState("");

  // Manual Line Input fallback
  const [newSpeakerText, setNewSpeakerText] = useState("");

  // Timer
  useEffect(() => {
    let interval: number;
    if (isRecording) {
      interval = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    }
    return () => window.clearInterval(interval);
  }, [isRecording]);

  // Real-time Web Speech API Setup with Automatic Speaker Detection & Direct Insertion to Right Pane
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "id-ID";

      recognition.onresult = (event: any) => {
        let interimText = "";
        let finalSegment = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalSegment += transcript;
          } else {
            interimText += transcript;
          }
        }

        const activeText = finalSegment || interimText;
        setLiveTranscript(activeText);

        // Automatic Speaker Classification
        if (activeText.trim()) {
          const autoSpeaker = classifySpeakerRole(activeText);
          setDetectedSpeaker(autoSpeaker);
        }

        // Direct Real-time Insertion on Final Result
        if (finalSegment.trim()) {
          const autoSpeaker = classifySpeakerRole(finalSegment);
          const speakerName =
            autoSpeaker === "doctor"
              ? doctorProfile?.name || "dr. Spesialis DPJP"
              : activeCase.patientName || "Pasien";

          const newItem = {
            speaker: autoSpeaker,
            speakerName,
            text: finalSegment.trim(),
            time: new Date().toLocaleTimeString("id-ID", { minute: "2-digit", second: "2-digit" }),
          };

          updateActiveCase({
            dialogue: [...activeCase.dialogue, newItem],
          });

          setLiveTranscript("");
        }
      };

      recognition.onerror = (e: any) => {
        console.log("Speech recognition error:", e);
      };

      recognitionRef.current = recognition;
    }
  }, [activeCase, doctorProfile]);

  const handleStartStopRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      try {
        recognitionRef.current?.stop();
      } catch (e) {}

      // Commit any lingering interim transcript to the right pane
      if (liveTranscript.trim()) {
        const autoSpeaker = classifySpeakerRole(liveTranscript);
        const speakerName =
          autoSpeaker === "doctor"
            ? doctorProfile?.name || "dr. Spesialis DPJP"
            : activeCase.patientName || "Pasien";

        const newItem = {
          speaker: autoSpeaker,
          speakerName,
          text: liveTranscript.trim(),
          time: new Date().toLocaleTimeString("id-ID", { minute: "2-digit", second: "2-digit" }),
        };

        updateActiveCase({
          dialogue: [...activeCase.dialogue, newItem],
        });

        setLiveTranscript("");
      }
    } else {
      setIsRecording(true);
      setLiveTranscript("");
      try {
        recognitionRef.current?.start();
      } catch (e) {
        console.log("Recognition start failed:", e);
      }
    }
  };

  const handleAddDialogueItem = (forcedSpeaker?: "doctor" | "patient") => {
    if (!newSpeakerText.trim()) return;
    
    let finalSpeaker = forcedSpeaker;
    if (!finalSpeaker) {
      if (activeCase.dialogue.length > 0) {
        const lastSpeaker = activeCase.dialogue[activeCase.dialogue.length - 1].speaker;
        finalSpeaker = lastSpeaker === "doctor" ? "patient" : "doctor";
      } else {
        finalSpeaker = "patient";
      }
    }

    const speakerName =
      finalSpeaker === "doctor"
        ? doctorProfile?.name || "dr. Spesialis DPJP"
        : activeCase.patientName || "Pasien";

    const newItem = {
      speaker: finalSpeaker,
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
      patientDob: newPatientDob,
      patientGender: newPatientGender,
      organId: newPatientOrgan,
      title: newPatientChiefComplaint || `Konsultasi ${newPatientName}`,
      rawNotes: `Pasien datang dengan keluhan utama: ${newPatientChiefComplaint || "Pemeriksaan klinis"}.`,
      dialogue: [
        {
          speaker: "doctor",
          speakerName: doctorProfile?.name || "dr. Spesialis DPJP",
          text: `Selamat pagi, ${newPatientName}. Silakan ceritakan keluhan yang Anda rasakan saat ini.`,
          time: "00:05",
        },
        {
          speaker: "patient",
          speakerName: newPatientName,
          text: newPatientChiefComplaint || "Saya merasakan keluhan sejak 3 hari yang lalu dokter...",
          time: "00:15",
        },
      ],
    });

    setShowNewPatientModal(false);
    setNewPatientName("");
    setNewPatientChiefComplaint("");
  };

  // Run NARASI AI Extraction with Evidence-Linking
  const handleRunAiExtraction = async () => {
    setIsExtracting(true);

    try {
      const result = await runNarasiAiExtraction({
        data: {
          dialogueLines: activeCase.dialogue,
          rawNotes: activeCase.rawNotes,
          patientName: activeCase.patientName,
        },
      });

      if (result && result.success) {
        applyAiExtractionResult({
          diagnosis: result.diagnosis,
          diagnosisIcd: result.diagnosisIcd,
          severity: result.severity,
          findings: result.findings,
          recommendations: result.recommendations,
          patientSummary: result.patientSummary,
          vitalSigns: result.vitalSigns,
          allergies: result.allergies,
          medications: result.medications,
          personalHistory: result.personalHistory,
          familyHistory: result.familyHistory,
          surgeries: result.surgeries,
          reviewOfSystems: result.reviewOfSystems,
          otherMedicalIssues: result.otherMedicalIssues,
          tobaccoUse: result.tobaccoUse,
          alcoholUse: result.alcoholUse,
          occupation: result.occupation,
          livingSituation: result.livingSituation,
          aiCheckedKeys: result.aiCheckedKeys,
          organId: result.primaryOrgan,
        });

        if (result.evidenceList && result.evidenceList.length > 0) {
          setExtractedEvidences(result.evidenceList);
        }
      }
    } catch (e) {
      console.warn("AI extraction fallback:", e);
    } finally {
      await saveNowToDb();
      setIsExtracting(false);
    }
  };

  const handleOpenResumeMedis = async () => {
    if (isExtracting) return;

    if (!activeCase.isAiGenerated) {
      await handleRunAiExtraction();
    }
    navigate({ to: "/report" });
  };

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Access Control Guard
  if (!isDoctorRegistered) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto font-mono font-bold text-2xl">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold bg-black text-white px-3 py-1 uppercase">
              AKSES DIPROTEKSI DOKTER DPJP
            </span>
            <h1 className="text-2xl font-black text-black uppercase">
              Login / Registrasi Dokter Diperlukan
            </h1>
            <p className="text-xs text-neutral-700 font-medium leading-relaxed">
              Untuk membuka modul dikte suara konsultasi dan ekstraksi rekam medis AI, Anda harus masuk atau mendaftarkan identitas Dokter DPJP terverifikasi SATUSEHAT.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-bold text-xs">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-neutral-800 text-white uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition"
            >
              Registrasi / Verifikasi Dokter SATUSEHAT
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 border-2 border-black text-black uppercase tracking-wider hover:bg-neutral-100 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Masuk Akun Dokter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Header Banner */}
      <section className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-black pb-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold bg-black text-white uppercase tracking-widest">
              <Mic size={14} className="animate-pulse" />
              <span>NARASI — STASIUN DIKTE SUARA REALTIME & ELEVENLABS STT</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black uppercase">
              Konsultasi Suara Realtime & Evidence-Linked AI
            </h1>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium">
              Transkripsi percakapan otomatis masuk ke transkrip kanan secara langsung dengan deteksi suara cerdas (tanpa tombol manual).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 font-bold text-xs">
            <div className="px-3.5 py-2 bg-neutral-100 border-2 border-black flex items-center gap-2 font-mono">
              <Database size={15} />
              <span>STATUS: {dbSyncStatus === "saving" ? "MENYIMPAN..." : "TERSIMPAN AMAN"}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-mono uppercase tracking-wider transition shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
            >
              + Pasien Baru
            </button>
          </div>
        </div>

        {/* Case List Selector */}
        {cases.length > 0 && (
          <div className="space-y-2 text-xs font-bold">
            <label className="uppercase tracking-wider text-black block font-mono">
              Pilih Pasien Aktif ({cases.length}):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {cases.map((c) => {
                const isSelected = c.id === activeCaseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCase(c.id)}
                    className={`p-3 border-2 border-black text-left transition ${
                      isSelected
                        ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                        : "bg-white text-black hover:bg-neutral-100"
                    }`}
                  >
                    <div className="flex items-center justify-between font-mono text-[10px] mb-1">
                      <span className="bg-current text-current px-1">{c.patientMrn}</span>
                      <span className={`px-1 font-bold ${isSelected ? "bg-white text-black" : "bg-black text-white"}`}>
                        {c.severity}
                      </span>
                    </div>
                    <div className="font-black text-sm uppercase truncate">{c.patientName}</div>
                    <div className="text-[11px] font-mono truncate opacity-90">{c.title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Voice Recording Console & Live Stream Indicator (5 cols) */}
        <section className="lg:col-span-5 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between font-mono text-xs font-bold border-b-2 border-black pb-3">
              <span className="uppercase tracking-wider text-black">DIKTE SUARA REALTIME</span>
              <span className="bg-black text-white px-2 py-0.5">
                {isRecording ? "MEREKAM & TRANSMISI..." : "SIAP"} {formatTime(recordingSeconds)}
              </span>
            </div>

            {/* Auto Speaker Status Card (No Manual Button Required!) */}
            <div className="p-3 border-2 border-black bg-neutral-100 space-y-1.5 text-xs font-mono font-bold">
              <div className="flex items-center justify-between">
                <span className="uppercase text-black text-[10px]">DETEKSI OTOMATIS PEMBICARA:</span>
                <span className="bg-black text-white px-2 py-0.5 text-[10px]">
                  ELEVENLABS / AI SPEECH ACTIVE
                </span>
              </div>
              <div className="p-2 bg-white border border-black flex items-center justify-between">
                <span className="text-black font-black uppercase text-sm">
                  {detectedSpeaker === "doctor"
                    ? `👨‍⚕️ ${doctorProfile?.name || "Dokter DPJP"}`
                    : `👤 ${activeCase.patientName || "Pasien"}`}
                </span>
                <span className="text-[10px] text-neutral-600">AUTO CLASSIFIED</span>
              </div>
            </div>

            {/* Live Audio Visualizer */}
            <div className="h-28 bg-neutral-50 border-2 border-black p-3 flex items-center justify-center gap-1 overflow-hidden relative">
              {Array.from({ length: 32 }).map((_, i) => {
                const height = isRecording
                  ? Math.max(15, Math.sin((i + recordingSeconds * 5) * 0.4) * 80 + Math.random() * 40)
                  : 10;
                return (
                  <div
                    key={i}
                    className="w-1.5 bg-black transition-all duration-150"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
              <div className="absolute bottom-1.5 left-3 right-3 flex items-center justify-between text-[10px] font-mono font-bold text-black">
                <span>LANG: INDONESIAN (id-ID)</span>
                <span>REALTIME STREAM → SISI KANAN</span>
              </div>
            </div>

            {/* Live Transcription Box */}
            {isRecording && (
              <div className="p-3 bg-neutral-100 border-2 border-black space-y-1 font-mono text-xs">
                <div className="font-bold uppercase text-black flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                  MENDENGARKAN & MEMASUKKAN TEKS...
                </div>
                <p className="italic font-medium text-black">
                  "{liveTranscript || "Katakan sesuatu... Teks langsung masuk ke transkrip kanan!"}"
                </p>
              </div>
            )}

            {/* Patient Meta Card */}
            <div className="border-2 border-black p-4 bg-white text-xs font-mono font-bold space-y-2">
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="text-black uppercase">PASIEN: {activeCase.patientName}</span>
                <span>RM: {activeCase.patientMrn}</span>
              </div>
              <div className="text-neutral-700 font-sans">
                {activeCase.patientAge} • {activeCase.patientGender} • DPJP: {activeCase.doctorName}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2 font-bold text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartStopRecording}
                className={`flex-1 py-3.5 px-4 border-2 border-black font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 ${
                  isRecording
                    ? "bg-black text-white animate-pulse"
                    : "bg-black hover:bg-neutral-800 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                }`}
              >
                {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                <span>{isRecording ? "Selesai Dikte Suara" : "Mulai Dikte Suara Realtime"}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecordingSeconds(0)}
                className="p-3.5 border-2 border-black bg-white hover:bg-neutral-100 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                title="Reset Timer"
              >
                <RotateCcw size={18} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenResumeMedis}
              disabled={isExtracting}
              className="w-full py-4 px-4 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-mono uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] cursor-pointer"
            >
              <Sparkles size={18} className={isExtracting ? "animate-spin text-emerald-400" : "text-emerald-400"} />
              <span>
                {isExtracting ? "AI Menganalisis & Menyusun Rekam Medis..." : "BUKA RESUME MEDIS"}
              </span>
              <ChevronRight size={18} />
            </button>

            {activeCase.isAiGenerated && (
              <button
                type="button"
                onClick={handleRunAiExtraction}
                disabled={isExtracting}
                className="w-full py-2 px-3 bg-neutral-100 hover:bg-neutral-200 border-2 border-black text-black font-mono text-[11px] uppercase font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles size={14} className={isExtracting ? "animate-spin text-black" : "text-black"} />
                <span>{isExtracting ? "Memproses..." : "Ekstraksi Ulang AI (SOAP & Checklists)"}</span>
              </button>
            )}
          </div>
        </section>

        {/* Right Column: Multi-turn Dialogue Transcript & Realtime Direct Input (7 cols) */}
        <section className="lg:col-span-7 bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between space-y-6">
          <div className="space-y-4 text-xs font-bold">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b-2 border-black pb-3">
              <div className="flex items-center gap-2 font-mono">
                <button
                  type="button"
                  onClick={() => setActiveTab("dialogue")}
                  className={`px-3 py-1.5 border-2 border-black uppercase transition ${
                    activeTab === "dialogue" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  Transkrip Realtime ({activeCase.dialogue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("evidence")}
                  className={`px-3 py-1.5 border-2 border-black uppercase transition ${
                    activeTab === "evidence" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  Evidence-Link ({extractedEvidences.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`px-3 py-1.5 border-2 border-black uppercase transition ${
                    activeTab === "notes" ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  Anamnesis
                </button>
              </div>

              <span className="font-mono text-[10px] bg-black text-white px-2 py-0.5 flex items-center gap-1">
                <Zap size={12} className="animate-bounce" /> AUTO-INSERT ACTIVE
              </span>
            </div>

            {/* TAB: TRANSKRIP REALTIME DIALOGUE */}
            {activeTab === "dialogue" && (
              <div className="space-y-3">
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                  {activeCase.dialogue.map((item, idx) => {
                    const isDoctor = item.speaker === "doctor";
                    const isHighlighted = highlightedTranscriptIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`p-3.5 border-2 border-black space-y-1 transition ${
                          isHighlighted
                            ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
                            : isDoctor
                            ? "bg-neutral-100 text-black ml-4"
                            : "bg-white text-black mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="font-bold uppercase flex items-center gap-1.5">
                            {isDoctor ? "👨‍⚕️ " : "👤 "} {item.speakerName}
                          </span>
                          <div className="flex items-center gap-2">
                            <span>{item.time}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteDialogueItem(idx)}
                              className="text-neutral-500 hover:text-black font-bold p-1"
                              title="Hapus"
                            >
                              ✕
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
                          className="w-full bg-transparent border-b border-current outline-none text-xs font-sans font-medium"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Add Manual Line Input */}
                <div className="p-3 border-2 border-black bg-white flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newSpeakerText}
                    onChange={(e) => setNewSpeakerText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddDialogueItem()}
                    placeholder="Tambah baris percakapan..."
                    className="flex-1 w-full text-xs font-sans p-1.5 border-b-2 border-black outline-none font-medium"
                  />
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddDialogueItem("doctor")}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-black border-2 border-black text-xs font-mono font-bold uppercase transition"
                    >
                      + Dokter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDialogueItem("patient")}
                      className="flex-1 sm:flex-none px-3 py-1.5 bg-black hover:bg-neutral-800 text-white border-2 border-black text-xs font-mono font-bold uppercase transition"
                    >
                      + Pasien
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EVIDENCE-LINKED VERIFICATION */}
            {activeTab === "evidence" && (
              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-neutral-100 border-2 border-black space-y-1">
                  <span className="font-bold uppercase text-black block">
                    📌 Evidence-Linked Verification Engine
                  </span>
                  <p className="text-[11px] font-sans font-medium text-neutral-800">
                    Klik item di bawah untuk menelusuri ke potongan ucapan sumbernya secara tepat.
                  </p>
                </div>

                {extractedEvidences.length === 0 ? (
                  <div className="p-8 border-2 border-dashed border-black text-center space-y-2">
                    <p className="font-bold uppercase">Belum ada data Evidence-Link.</p>
                    <p className="text-neutral-600 font-sans">
                      Klik tombol "EKSTRAKSI AI NARASI" di sebelah kiri untuk menghasilkan pemetaan bukti ucapan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
                    {extractedEvidences.map((ev, i) => (
                      <div
                        key={ev.id || i}
                        onClick={() => {
                          setActiveTab("dialogue");
                          const foundIdx = activeCase.dialogue.findIndex((d) =>
                            d.text.toLowerCase().includes(ev.sourceTranscriptText.toLowerCase())
                          );
                          if (foundIdx !== -1) setHighlightedTranscriptIndex(foundIdx);
                        }}
                        className="p-3.5 border-2 border-black bg-white hover:bg-neutral-100 cursor-pointer space-y-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition"
                      >
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="font-bold uppercase bg-black text-white px-2 py-0.5">
                            {ev.fieldLabel}
                          </span>
                          <span className="text-[10px] text-neutral-600">
                            CONFIDENCE: {(ev.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="font-black text-sm font-sans text-black">{ev.extractedValue}</div>
                        <div className="text-[11px] font-sans text-neutral-700 bg-neutral-100 p-2 border border-black italic">
                          "Bukti Spoken Text: {ev.sourceTranscriptText}" ({ev.sourceSpeaker.toUpperCase()})
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: NOTES */}
            {activeTab === "notes" && (
              <div className="border-2 border-black p-4 space-y-3 bg-white text-xs">
                <span className="font-mono font-bold uppercase text-black block">Anamnesis & Catatan Dokter:</span>
                <textarea
                  rows={6}
                  value={activeCase.rawNotes}
                  onChange={(e) => updateActiveCase({ rawNotes: e.target.value })}
                  placeholder="Ketik catatan medis tambahan..."
                  className="w-full p-3 border-2 border-black font-sans font-medium text-black outline-none focus:bg-neutral-50"
                />
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t-2 border-black pt-4 flex items-center justify-between font-mono font-bold text-xs">
            <span className="text-neutral-700">SIAP DITERBITKAN KE RESUME MEDIS</span>
            <button
              type="button"
              onClick={handleOpenResumeMedis}
              disabled={isExtracting}
              className="px-6 py-3 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white uppercase tracking-wider flex items-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition cursor-pointer"
            >
              <Sparkles size={15} className={isExtracting ? "animate-spin text-emerald-400" : "text-emerald-400"} />
              <span>{isExtracting ? "AI Menyusun Rekam Medis..." : "Buka Resume Medis"}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* Modal: Pasien Baru */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 text-xs font-bold font-sans">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 font-mono">
              <span className="font-black text-sm uppercase">BUAT PASIEN BARU</span>
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="font-bold text-black hover:opacity-70"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewPatient} className="space-y-3">
              <div className="space-y-1">
                <label className="uppercase text-black block">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="Tn. Bambang Sutrisno"
                  className="w-full p-2.5 border-2 border-black text-black font-medium focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="uppercase text-black block">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={newPatientDob}
                    onChange={(e) => setNewPatientDob(e.target.value)}
                    placeholder="DD MMMM YYYY"
                    className="w-full p-2.5 border-2 border-black text-black font-medium focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="uppercase text-black block">Jenis Kelamin</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full p-2.5 border-2 border-black text-black font-medium bg-white focus:outline-none"
                  >
                    <option value="Laki-laki">Laki-laki (M)</option>
                    <option value="Perempuan">Perempuan (F)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="uppercase text-black block">Keluhan Utama</label>
                <textarea
                  rows={2}
                  value={newPatientChiefComplaint}
                  onChange={(e) => setNewPatientChiefComplaint(e.target.value)}
                  placeholder="Keluhan pasien..."
                  className="w-full p-2.5 border-2 border-black text-black font-medium focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black font-mono">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2 border-2 border-black text-black hover:bg-neutral-100 uppercase"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-black text-white hover:bg-neutral-800 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
                >
                  Simpan & Mulai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
