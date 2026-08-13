import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Printer,
  Database,
  Save,
  ArrowLeft,
  PenTool,
  Lock,
  Mic,
  ShieldCheck,
  FilePlus2,
  Check,
  Sparkles,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import { MedicalHistoryFormDocument } from "../components/medical/MedicalHistoryFormDocument";
import { runNarasiAiExtraction } from "../server/ai-extract";

export const Route = createFileRoute("/report")({
  component: ReportPage,
});

function ReportPage() {
  const {
    cases,
    activeCase,
    medicalFormData,
    updateMedicalFormData,
    applyAiExtractionResult,
    isDoctorSigned,
    signedAtTimestamp,
    setDoctorSignature,
    clearDoctorSignature,
    dbSyncStatus,
    saveNowToDb,
    isDoctorRegistered,
    doctorProfile,
  } = useMedicalStore();

  const hasPatientCases = cases.length > 0;

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [signatureName, setSignatureName] = useState(
    medicalFormData.doctorName || doctorProfile?.name || "dr. DPJP Spesialis"
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const handleAutoGenerate = async () => {
    if (!activeCase) return;
    setIsGeneratingAi(true);
    try {
      const res = await runNarasiAiExtraction({
        data: {
          dialogueLines: activeCase.dialogue,
          rawNotes: activeCase.rawNotes,
          patientName: activeCase.patientName,
        },
      });
      if (res && res.success) {
        applyAiExtractionResult({
          diagnosis: res.diagnosis,
          diagnosisIcd: res.diagnosisIcd,
          severity: res.severity,
          findings: res.findings,
          recommendations: res.recommendations,
          patientSummary: res.patientSummary,
          vitalSigns: res.vitalSigns,
          allergies: res.allergies,
          medications: res.medications,
          personalHistory: res.personalHistory,
          familyHistory: res.familyHistory,
          surgeries: res.surgeries,
          reviewOfSystems: res.reviewOfSystems,
          otherMedicalIssues: res.otherMedicalIssues,
          tobaccoUse: res.tobaccoUse,
          alcoholUse: res.alcoholUse,
          occupation: res.occupation,
          livingSituation: res.livingSituation,
          aiCheckedKeys: res.aiCheckedKeys,
          organId: res.primaryOrgan,
        });
      }
    } catch (e) {
      console.warn("AI generation error:", e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Drawing canvas logic
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = "touches" in e ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = "touches" in e ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setDoctorSignature(dataUrl);
    setShowSignatureModal(false);
  };

  const handlePrint = () => {
    window.print();
  };

  // 🔒 ACCESS CONTROL GATE 1: Require Registered DPJP Doctor
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
              Lembar Resume Medis EHR resmi Kemenkes/SATUSEHAT hanya dapat diakses dan ditandatangani oleh Dokter Penanggung Jawab Pelayanan (DPJP).
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 font-mono font-bold text-xs">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 bg-black hover:bg-neutral-800 text-white uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition"
            >
              Registrasi Dokter SATUSEHAT
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

  // 🔒 ACCESS CONTROL GATE 2: Require Patient Case
  if (!hasPatientCases) {
    return (
      <main className="max-w-xl mx-auto px-4 py-16 text-center font-sans">
        <div className="bg-white border-2 border-black p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto font-mono font-bold text-2xl">
            <FilePlus2 size={32} />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold bg-black text-white px-3 py-1 uppercase">
              BELUM ADA PASIEN AKTIF
            </span>
            <h1 className="text-2xl font-black text-black uppercase">
              Mulai Sesi Konsultasi Terlebih Dahulu
            </h1>
            <p className="text-xs text-neutral-700 font-medium leading-relaxed">
              Dokumen Resume Medis dihasilkan secara otomatis dari sesi dikte percakapan dokter-pasien.
            </p>
          </div>
          <div className="pt-2 flex justify-center font-mono font-bold text-xs">
            <Link
              to="/consultation"
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition flex items-center gap-2"
            >
              <Mic size={16} />
              <span>Mulai Sesi Konsultasi Pasien</span>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 font-sans">
      {/* AI Not Generated Warning Banner */}
      {activeCase && !activeCase.isAiGenerated && (
        <div className="no-print bg-amber-50 border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 font-mono text-xs">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-amber-600 animate-pulse shrink-0" />
            <div>
              <span className="font-extrabold uppercase text-amber-950 block">Resume Medis Belum Di-generate AI</span>
              <span className="text-amber-900 font-sans">Dokumen rekam medis belum diekstraksi dari hasil konsultasi suara & catatan klinis pasien.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={isGeneratingAi}
            className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-bold uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] shrink-0 cursor-pointer"
          >
            <Sparkles size={14} className={isGeneratingAi ? "animate-spin text-emerald-400" : "text-emerald-400"} />
            <span>{isGeneratingAi ? "Memproses AI..." : "Generate AI Sekarang"}</span>
          </button>
        </div>
      )}

      {/* Top Action Toolbar (No-Print) */}
      <section className="no-print bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/consultation"
            className="shrink-0 p-2.5 border-2 border-black text-black hover:bg-neutral-100 transition flex items-center gap-1.5 text-xs font-mono font-bold uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft size={15} />
            <span>Konsultasi</span>
          </Link>

          <div>
            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-black">
              RESUME MEDIS RESMI (EHR KEMENKES SATUSEHAT)
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-black uppercase">
              Lembar Formulir Rekam Medis
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs font-bold">
          <div className="px-3 py-2 bg-neutral-100 border-2 border-black flex items-center gap-2">
            <Database size={14} />
            <span>STATUS: {dbSyncStatus === "saving" ? "MENYIMPAN..." : "TERSIMPAN AMAN"}</span>
          </div>

          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={isGeneratingAi}
            className="px-4 py-2 border-2 border-black bg-black text-white hover:bg-neutral-800 uppercase tracking-wider transition shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} className={isGeneratingAi ? "animate-spin text-emerald-400" : "text-emerald-400"} />
            <span>{isGeneratingAi ? "Menyusun AI..." : "Ekstraksi Ulang AI"}</span>
          </button>

          <button
            type="button"
            onClick={() => saveNowToDb()}
            className="px-3.5 py-2 border-2 border-black bg-white hover:bg-neutral-100 text-black uppercase tracking-wider transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Simpan DB</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignatureModal(true)}
            className={`px-4 py-2 border-2 border-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] ${
              isDoctorSigned ? "bg-neutral-100 text-black" : "bg-black text-white hover:bg-neutral-800"
            }`}
          >
            <PenTool size={14} />
            <span>{isDoctorSigned ? "Dokumen Ditandatangani" : "Tanda Tangan Dokter"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 bg-black hover:bg-neutral-800 text-white uppercase tracking-wider transition flex items-center gap-1.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
          >
            <Printer size={15} />
            <span>Cetak / PDF</span>
          </button>
        </div>
      </section>

      {/* Editable Document Component */}
      <section className="print:m-0 print:p-0">
        <MedicalHistoryFormDocument
          data={medicalFormData}
          onChange={updateMedicalFormData}
          isDoctorSigned={isDoctorSigned}
          signedAtTimestamp={signedAtTimestamp}
          onSignComplete={(dataUrl) => setDoctorSignature(dataUrl)}
          onClearSignature={() => clearDoctorSignature()}
        />
      </section>

      {/* Digital Doctor Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 no-print">
          <div className="bg-white border-2 border-black p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 font-sans text-xs font-bold">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                <h3 className="font-black text-base uppercase text-black">TANDA TANGAN DOKTER DPJP</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="text-black font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1 font-mono">
              <label className="uppercase text-black block">Nama Dokter DPJP:</label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => {
                  setSignatureName(e.target.value);
                  updateMedicalFormData({ doctorName: e.target.value });
                }}
                className="w-full px-3 py-2 border-2 border-black text-black font-sans font-bold"
              />
            </div>

            <div className="space-y-1 font-mono">
              <div className="flex items-center justify-between">
                <label className="uppercase text-black">Goreskan Tanda Tangan:</label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-neutral-700 hover:text-black underline text-[10px]"
                >
                  Reset
                </button>
              </div>

              <div className="border-2 border-black bg-white">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={140}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full h-[140px] cursor-crosshair touch-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t-2 border-black font-mono">
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 border-2 border-black text-black hover:bg-neutral-100 uppercase tracking-wider"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveSignature}
                className="px-5 py-2 bg-black text-white hover:bg-neutral-800 uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-1.5"
              >
                <Check size={14} />
                <span>Simpan Signature</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}