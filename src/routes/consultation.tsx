import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import {
  Mic,
  MicOff,
  Sparkles,
  RotateCcw,
  ShieldCheck,
  ChevronRight,
  Lock,
  Zap,
  X,
  Plus,
  Trash2,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
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

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

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

  useEffect(() => {
    if (activeCase?.evidenceList && activeCase.evidenceList.length > 0) {
      setExtractedEvidences(activeCase.evidenceList);
    } else if (activeCase?.dialogue && activeCase.dialogue.length > 0) {
      const fallbackEvidences: EvidenceLinkedItem[] = activeCase.dialogue.map((d, i) => ({
        id: `ev-${i + 1}`,
        category: d.speaker === "patient" ? "subjective" : "objective",
        fieldLabel: d.speaker === "patient" ? "Keluhan Utama Pasien" : "Instruksi DPJP",
        extractedValue: d.text,
        sourceSpeaker: d.speaker,
        sourceTranscriptText: d.text,
        confidenceScore: 0.95,
      }));
      setExtractedEvidences(fallbackEvidences);
    }
  }, [activeCase?.id, activeCase?.evidenceList, activeCase?.dialogue]);

  // Modal State
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientDob, setNewPatientDob] = useState("14 Mei 1978");
  const [newPatientGender, setNewPatientGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
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

  // Real-time Web Speech API Setup
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

        if (activeText.trim()) {
          const autoSpeaker = classifySpeakerRole(activeText);
          setDetectedSpeaker(autoSpeaker);
        }

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
      title: newPatientChiefComplaint || `Konsultasi ${newPatientName}`,
      rawNotes: newPatientChiefComplaint ? `Pasien datang dengan keluhan utama: ${newPatientChiefComplaint}.` : "",
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

  // SSR Hydration Guard
  if (!isHydrated) {
    return (
      <main className="container-warm section-warm flex justify-center py-16">
        <div className="card-warm p-8 max-w-xl w-full text-center space-y-4">
          <div className="animate-pulse flex flex-col items-center gap-3">
            <div className="w-12 h-12 bg-[#E5E1CE] rounded-[2px]" />
            <div className="h-4 w-48 bg-[#E5E1CE] rounded-[2px]" />
            <div className="h-3 w-64 bg-[#E5E1CE] rounded-[2px]" />
          </div>
        </div>
      </main>
    );
  }

  // Access Control Guard
  if (!isDoctorRegistered) {
    return (
      <main className="container-warm section-warm flex justify-center">
        <div className="card-warm p-8 max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center mx-auto">
            <Lock size={28} />
          </div>
          <div className="space-y-2">
            <span className="badge-warm badge-warm-brand">
              AKSES DIPROTEKSI DOKTER DPJP
            </span>
            <h1 className="text-2xl font-medium text-[#191918]">
              Login / Registrasi Dokter Diperlukan
            </h1>
            <p className="text-sm text-[#474744] leading-relaxed">
              Untuk membuka modul dikte suara konsultasi dan ekstraksi rekam medis AI, Anda harus masuk atau mendaftarkan identitas Dokter DPJP terverifikasi SATUSEHAT.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="btn-warm btn-warm-primary btn-warm-base w-full sm:w-auto"
            >
              Registrasi / Verifikasi Dokter SATUSEHAT
            </Link>
            <Link
              to="/login"
              className="btn-warm btn-warm-outline btn-warm-base w-full sm:w-auto"
            >
              Masuk Akun Dokter
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container-warm section-warm space-y-10">
      {/* Header Banner */}
      <section className="card-warm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#ECEBDF] pb-5">
          <div className="space-y-2">
            <div className="badge-warm badge-warm-brand">
              <Mic size={13} className="text-[#9E1B2E]" />
              <span>NARASI — STASIUN KONSULTASI SUARA REALTIME DOKTER &amp; PASIEN</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-medium text-[#191918] tracking-tight">
              Konsultasi Suara Realtime &amp; Evidence-Linked AI
            </h1>
            <p className="text-sm text-[#474744]">
              Transkripsi percakapan otomatis masuk ke transkrip kanan secara langsung dengan deteksi suara cerdas.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="badge-warm badge-warm-success px-3 py-1.5 text-xs">
              <ShieldCheck size={13} />
              <span>STATUS SIMPAN: {dbSyncStatus === "saving" ? "MENYIMPAN..." : "TERSIMPAN AMAN"}</span>
            </div>

            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="btn-warm btn-warm-primary btn-warm-sm"
            >
              <Plus size={14} />
              <span>Pasien Baru</span>
            </button>
          </div>
        </div>

        {/* Case List Selector */}
        {cases.length > 0 && (
          <div className="space-y-2 text-xs">
            <span className="eyebrow-warm">Pilih Pasien Aktif ({cases.length}):</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {cases.map((c) => {
                const isSelected = c.id === activeCaseId;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => selectCase(c.id)}
                    className={`card-warm p-3.5 text-left transition-colors cursor-pointer ${
                      isSelected
                        ? "border-[#A71D31] bg-[#FCEEEF]"
                        : "hover:border-[#D1D0C6]"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="badge-warm">{c.patientMrn}</span>
                      <span className="badge-warm badge-warm-brand">{c.severity}</span>
                    </div>
                    <div className="font-medium text-sm text-[#191918] truncate">{c.patientName}</div>
                    <div className="text-xs text-[#6A6A64] truncate">{c.title}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Voice Recording Console (5 cols) */}
        <section className="lg:col-span-5 card-warm p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-3">
              <span className="eyebrow-warm mb-0">Dikte Suara Realtime</span>
              <span className="badge-warm badge-warm-brand">
                {isRecording ? "MEREKAM & TRANSMISI..." : "SIAP"} {formatTime(recordingSeconds)}
              </span>
            </div>

            {/* Auto Speaker Status Card */}
            <div className="p-4 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-wider text-[#6A6A64]">Deteksi Otomatis Pembicara:</span>
                <span className="badge-warm badge-warm-success text-[9px]">DIARISASI WICARA AKTIF</span>
              </div>
              <div className="p-2.5 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] flex items-center justify-between">
                <span className="text-[#191918] font-medium text-sm">
                  {detectedSpeaker === "doctor"
                    ? `👨‍⚕️ ${doctorProfile?.name || "Dokter DPJP"}`
                    : `👤 ${activeCase.patientName || "Pasien"}`}
                </span>
                <span className="text-[10px] text-[#6A6A64] uppercase tracking-wider">TERDETEKSI OTOMATIS</span>
              </div>
            </div>

            {/* Live Audio Visualizer */}
            <div className="h-28 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] p-3 flex items-center justify-center gap-1 overflow-hidden relative">
              {Array.from({ length: 32 }).map((_, i) => {
                const height = isRecording
                  ? Math.max(15, Math.sin((i + recordingSeconds * 5) * 0.4) * 80 + Math.random() * 40)
                  : 10;
                return (
                  <div
                    key={i}
                    className="w-1.5 bg-[#A71D31] transition-all duration-150 rounded-[1px]"
                    style={{ height: `${height}%` }}
                  />
                );
              })}
              <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-[10px] uppercase tracking-wider text-[#6A6A64]">
                <span>LANG: INDONESIAN (id-ID)</span>
                <span>REALTIME STREAM → SISI KANAN</span>
              </div>
            </div>

            {/* Live Transcription Box */}
            {isRecording && (
              <div className="p-3.5 bg-[#FCEEEF] border border-[#F6D8DC] rounded-[2px] space-y-1">
                <div className="text-xs font-medium text-[#9E1B2E] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#A71D31] animate-ping" />
                  Mendengarkan &amp; Memasukkan Teks...
                </div>
                <p className="text-xs italic text-[#191918]">
                  "{liveTranscript || "Katakan sesuatu... Teks langsung masuk ke transkrip kanan!"}"
                </p>
              </div>
            )}

            {/* Patient Meta Card */}
            <div className="p-4 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-2">
              <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-2 text-xs">
                <span className="font-medium text-[#191918]">PASIEN: {activeCase.patientName}</span>
                <span className="badge-warm">{activeCase.patientMrn}</span>
              </div>
              <div className="text-xs text-[#6A6A64]">
                {activeCase.patientAge} • {activeCase.patientGender} • DPJP: {activeCase.doctorName}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleStartStopRecording}
                className={`btn-warm btn-warm-primary btn-warm-base flex-1 ${
                  isRecording ? "bg-[#8E1727] animate-pulse" : ""
                }`}
              >
                {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                <span>{isRecording ? "Selesai Dikte Suara" : "Mulai Dikte Suara Realtime"}</span>
              </button>

              <button
                type="button"
                onClick={() => setRecordingSeconds(0)}
                className="btn-warm btn-warm-outline btn-warm-base px-3"
                title="Reset Timer"
              >
                <RotateCcw size={16} />
              </button>
            </div>

            <button
              type="button"
              onClick={handleOpenResumeMedis}
              disabled={isExtracting}
              className="btn-warm btn-warm-primary btn-warm-lg w-full"
            >
              <Sparkles size={16} className={isExtracting ? "animate-spin text-white" : "text-white"} />
              <span>
                {isExtracting ? "AI Menganalisis & Menyusun Rekam Medis..." : "BUKA RESUME MEDIS"}
              </span>
              <ChevronRight size={16} />
            </button>

            {activeCase.isAiGenerated && (
              <button
                type="button"
                onClick={handleRunAiExtraction}
                disabled={isExtracting}
                className="btn-warm btn-warm-outline btn-warm-sm w-full"
              >
                <Sparkles size={14} />
                <span>{isExtracting ? "Memproses..." : "Ekstraksi Ulang AI (SOAP & Checklists)"}</span>
              </button>
            )}
          </div>
        </section>

        {/* Right Column: Multi-turn Dialogue Transcript (7 cols) */}
        <section className="lg:col-span-7 card-warm p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-5">
            {/* Tabs */}
            <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("dialogue")}
                  className={`btn-warm btn-warm-sm ${
                    activeTab === "dialogue" ? "btn-warm-primary" : "btn-warm-outline"
                  }`}
                >
                  Transkrip Realtime ({activeCase.dialogue.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("evidence")}
                  className={`btn-warm btn-warm-sm ${
                    activeTab === "evidence" ? "btn-warm-primary" : "btn-warm-outline"
                  }`}
                >
                  Evidence-Link ({extractedEvidences.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`btn-warm btn-warm-sm ${
                    activeTab === "notes" ? "btn-warm-primary" : "btn-warm-outline"
                  }`}
                >
                  Anamnesis
                </button>
              </div>

              <span className="badge-warm badge-warm-success text-[10px]">
                <Zap size={11} className="animate-bounce text-[#0E7A41]" /> AUTO-INSERT ACTIVE
              </span>
            </div>

            {/* TAB: TRANSKRIP REALTIME DIALOGUE */}
            {activeTab === "dialogue" && (
              <div className="space-y-4">
                <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
                  {activeCase.dialogue.map((item, idx) => {
                    const isDoctor = item.speaker === "doctor";
                    const isHighlighted = highlightedTranscriptIndex === idx;

                    return (
                      <div
                        key={idx}
                        className={`p-4 border rounded-[2px] space-y-1.5 transition-colors ${
                          isHighlighted
                            ? "bg-[#FCEEEF] border-[#A71D31]"
                            : isDoctor
                            ? "bg-[#FFFEF2] border-[#ECEBDF] ml-4"
                            : "bg-[#F3F2E7] border-[#E3E2D8] mr-4"
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-medium text-[#191918] uppercase tracking-wider flex items-center gap-1.5">
                            {isDoctor ? "👨‍⚕️ " : "👤 "} {item.speakerName}
                          </span>
                          <div className="flex items-center gap-3 text-[#6A6A64]">
                            <span>{item.time}</span>
                            <button
                              type="button"
                              onClick={() => handleDeleteDialogueItem(idx)}
                              className="text-[#6A6A64] hover:text-[#C73737] p-0.5"
                              title="Hapus"
                            >
                              <Trash2 size={13} />
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
                          className="w-full bg-transparent border-b border-[#E3E2D8] focus:border-[#A71D31] outline-none text-xs text-[#191918] font-normal py-1"
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Add Manual Line Input */}
                <div className="p-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] flex flex-col sm:flex-row items-center gap-2">
                  <input
                    type="text"
                    value={newSpeakerText}
                    onChange={(e) => setNewSpeakerText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleAddDialogueItem()}
                    placeholder="Tambah baris percakapan..."
                    className="input-warm flex-1"
                  />
                  <div className="flex gap-2 w-full sm:w-auto shrink-0">
                    <button
                      type="button"
                      onClick={() => handleAddDialogueItem("doctor")}
                      className="btn-warm btn-warm-outline btn-warm-sm"
                    >
                      + Dokter
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddDialogueItem("patient")}
                      className="btn-warm btn-warm-primary btn-warm-sm"
                    >
                      + Pasien
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: EVIDENCE-LINKED VERIFICATION */}
            {activeTab === "evidence" && (
              <div className="space-y-4">
                <div className="p-4 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] space-y-1">
                  <span className="eyebrow-warm text-[#191918] mb-0">
                    📌 Evidence-Linked Verification Engine
                  </span>
                  <p className="text-xs text-[#6A6A64]">
                    Klik item di bawah untuk menelusuri ke potongan ucapan sumbernya secara tepat.
                  </p>
                </div>

                {extractedEvidences.length === 0 ? (
                  <div className="p-8 border border-dashed border-[#E3E2D8] rounded-[2px] text-center space-y-2">
                    <p className="text-sm font-medium text-[#191918]">Belum ada data Evidence-Link.</p>
                    <p className="text-xs text-[#6A6A64]">
                      Klik tombol "BUKA RESUME MEDIS" di sebelah kiri untuk menghasilkan pemetaan bukti ucapan.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
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
                        className="card-warm p-4 cursor-pointer space-y-2 hover:border-[#A71D31] transition-colors"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="badge-warm badge-warm-brand">
                            {ev.fieldLabel}
                          </span>
                          <span className="badge-warm badge-warm-success text-[10px]">
                            CONFIDENCE: {(ev.confidenceScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <div className="text-sm font-medium text-[#191918]">{ev.extractedValue}</div>
                        <div className="text-xs text-[#6A6A64] bg-[#F3F2E7] p-2.5 rounded-[2px] italic border border-[#E3E2D8]">
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
              <div className="space-y-3">
                <span className="eyebrow-warm">Anamnesis &amp; Catatan Dokter:</span>
                <textarea
                  rows={8}
                  value={activeCase.rawNotes}
                  onChange={(e) => updateActiveCase({ rawNotes: e.target.value })}
                  placeholder="Ketik atau edit catatan anamnesis medis, keluhan utama pasien, dan hasil pemeriksaan fisik di sini..."
                  className="input-warm"
                />
              </div>
            )}
          </div>

          {/* Footer Action */}
          <div className="border-t border-[#ECEBDF] pt-4 flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#6A6A64]">SIAP DITERBITKAN KE RESUME MEDIS</span>
            <button
              type="button"
              onClick={handleOpenResumeMedis}
              disabled={isExtracting}
              className="btn-warm btn-warm-primary btn-warm-base"
            >
              <Sparkles size={15} className={isExtracting ? "animate-spin text-white" : "text-white"} />
              <span>{isExtracting ? "AI Menyusun Rekam Medis..." : "Buka Resume Medis"}</span>
              <ChevronRight size={16} />
            </button>
          </div>
        </section>
      </div>

      {/* Modal: Pasien Baru */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-warm p-6 max-w-md w-full border-[#D1D0C6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-3">
              <span className="text-base font-medium text-[#191918]">Buat Pasien Baru</span>
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="text-[#6A6A64] hover:text-[#191918] p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateNewPatient} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Nama Lengkap Pasien *</label>
                <input
                  type="text"
                  required
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="Tn. Bambang Sutrisno"
                  className="input-warm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Tanggal Lahir</label>
                  <input
                    type="text"
                    value={newPatientDob}
                    onChange={(e) => setNewPatientDob(e.target.value)}
                    placeholder="DD MMMM YYYY"
                    className="input-warm"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Jenis Kelamin</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="input-warm bg-[#F3F2E7]"
                  >
                    <option value="Laki-laki">Laki-laki (M)</option>
                    <option value="Perempuan">Perempuan (F)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Keluhan Utama Pasien</label>
                <textarea
                  rows={3}
                  value={newPatientChiefComplaint}
                  onChange={(e) => setNewPatientChiefComplaint(e.target.value)}
                  placeholder="Keluhan pasien..."
                  className="input-warm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECEBDF]">
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="btn-warm btn-warm-outline btn-warm-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-warm btn-warm-primary btn-warm-sm"
                >
                  Simpan &amp; Mulai
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
