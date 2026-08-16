import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import {
  Printer,
  Save,
  ArrowLeft,
  PenTool,
  Lock,
  Mic,
  ShieldCheck,
  FilePlus2,
  Check,
  Sparkles,
  Loader2,
  X,
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
    signatureDataUrl,
  } = useMedicalStore();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const hasPatientCases = cases.length > 0;

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
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
    ctx.strokeStyle = "#191918";
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

  const handlePrint = async () => {
    if (isGeneratingPdf) return;
    setIsGeneratingPdf(true);
    try {
      const res = await fetch("/api/report-pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData: medicalFormData,
          isDoctorSigned,
          signedAtTimestamp,
          signatureDataUrl,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const fileName =
        res.headers.get("Content-Disposition")?.match(/filename="?([^";]+)"?/)?.[1] ?? "RekamMedis-EHR.pdf";
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.warn("PDF generation error:", e);
    } finally {
      setIsGeneratingPdf(false);
    }
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

  // ACCESS CONTROL GATE 1: Require Registered DPJP Doctor
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
              Lembar Resume Medis EHR resmi Kemenkes/SATUSEHAT hanya dapat diakses dan ditandatangani oleh Dokter Penanggung Jawab Pelayanan (DPJP).
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="btn-warm btn-warm-primary btn-warm-base w-full sm:w-auto"
            >
              Registrasi Dokter SATUSEHAT
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

  // ACCESS CONTROL GATE 2: Require Patient Case
  if (!hasPatientCases) {
    return (
      <main className="container-warm section-warm flex justify-center">
        <div className="card-warm p-8 max-w-xl w-full text-center space-y-6">
          <div className="w-16 h-16 bg-[#F3F2E7] text-[#191918] border border-[#E3E2D8] rounded-[2px] flex items-center justify-center mx-auto">
            <FilePlus2 size={28} />
          </div>
          <div className="space-y-2">
            <span className="badge-warm">
              BELUM ADA PASIEN AKTIF
            </span>
            <h1 className="text-2xl font-medium text-[#191918]">
              Mulai Sesi Konsultasi Terlebih Dahulu
            </h1>
            <p className="text-sm text-[#474744] leading-relaxed">
              Dokumen Resume Medis dihasilkan secara otomatis dari sesi dikte percakapan dokter-pasien.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <Link
              to="/consultation"
              className="btn-warm btn-warm-primary btn-warm-base"
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
    <main className="container-warm section-warm space-y-8">
      {/* AI Not Generated Warning Banner */}
      {activeCase && !activeCase.isAiGenerated && (
        <div className="no-print card-warm p-5 bg-[#FEF0E0] border-[#FCE0C0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sparkles size={20} className="text-[#A64E0B] shrink-0" />
            <div>
              <span className="text-sm font-medium text-[#A64E0B] block">Resume Medis Belum Di-generate AI</span>
              <span className="text-xs text-[#6A6A64]">Dokumen rekam medis belum diekstraksi dari hasil konsultasi suara &amp; catatan klinis pasien.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={isGeneratingAi}
            className="btn-warm btn-warm-primary btn-warm-sm shrink-0"
          >
            {isGeneratingAi ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : (
              <Sparkles size={14} className="text-white" />
            )}
            <span>{isGeneratingAi ? "Memproses AI..." : "Generate AI Sekarang"}</span>
          </button>
        </div>
      )}

      {/* Top Action Toolbar (No-Print) */}
      <section className="no-print card-warm p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          <Link
            to="/consultation"
            className="btn-warm btn-warm-outline btn-warm-sm shrink-0"
          >
            <ArrowLeft size={14} />
            <span>Konsultasi</span>
          </Link>

          <div>
            <span className="eyebrow-warm mb-0">RESUME MEDIS RESMI (EHR KEMENKES SATUSEHAT)</span>
            <h1 className="text-xl sm:text-2xl font-medium text-[#191918]">
              Lembar Formulir Rekam Medis
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
          <div className="col-span-2 sm:col-span-1 badge-warm badge-warm-success px-3 py-1.5 text-xs justify-center">
            <ShieldCheck size={13} />
            <span>STATUS ARSIP: {dbSyncStatus === "saving" ? "MENYIMPAN..." : "TERSIMPAN AMAN"}</span>
          </div>

          <button
            type="button"
            onClick={handleAutoGenerate}
            disabled={isGeneratingAi}
            className="btn-warm btn-warm-primary btn-warm-sm justify-center"
          >
            {isGeneratingAi ? (
              <Loader2 size={14} className="animate-spin text-white" />
            ) : (
              <Sparkles size={14} className="text-white" />
            )}
            <span>{isGeneratingAi ? "Menyusun AI..." : "Ekstraksi AI"}</span>
          </button>

          <button
            type="button"
            onClick={() => saveNowToDb()}
            className="btn-warm btn-warm-outline btn-warm-sm justify-center"
          >
            <Save size={14} />
            <span>Arsip Medis</span>
          </button>

          <button
            type="button"
            onClick={() => setShowSignatureModal(true)}
            className={`btn-warm btn-warm-sm justify-center ${
              isDoctorSigned ? "btn-warm-outline bg-[#F3F2E7]" : "btn-warm-primary"
            }`}
          >
            <PenTool size={14} />
            <span>{isDoctorSigned ? "Ditandatangani" : "Tanda Tangan DPJP"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            disabled={isGeneratingPdf}
            className="btn-warm btn-warm-primary btn-warm-sm justify-center col-span-2 sm:col-span-1"
          >
            <Printer size={14} className={isGeneratingPdf ? "animate-pulse" : ""} />
            <span>{isGeneratingPdf ? "Membuat PDF..." : "Cetak PDF Resmi"}</span>
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
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4 no-print">
          <div className="card-warm p-6 max-w-md w-full border-[#D1D0C6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck size={18} className="text-[#9E1B2E]" />
                <span className="text-base font-medium text-[#191918]">Tanda Tangan Dokter DPJP</span>
              </div>
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="text-[#6A6A64] hover:text-[#191918] p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Nama Dokter DPJP:</label>
                <input
                  type="text"
                  value={signatureName}
                  onChange={(e) => {
                    setSignatureName(e.target.value);
                    updateMedicalFormData({ doctorName: e.target.value });
                  }}
                  className="input-warm"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Goreskan Tanda Tangan:</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[#9E1B2E] hover:underline text-[11px] uppercase tracking-wider"
                  >
                    Reset
                  </button>
                </div>

                <div className="border border-[#E3E2D8] bg-[#FFFFFF] rounded-[2px]">
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

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#ECEBDF]">
                <button
                  type="button"
                  onClick={() => setShowSignatureModal(false)}
                  className="btn-warm btn-warm-outline btn-warm-sm"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={saveSignature}
                  className="btn-warm btn-warm-primary btn-warm-sm"
                >
                  <Check size={14} />
                  <span>Simpan Signature</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}