import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  Printer,
  Database,
  Save,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  PenTool,
  RotateCcw,
  Lock,
  Mic,
  UserCheck,
  AlertCircle,
  FilePlus2,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import { inferOrganFromClinicalData } from "../lib/anatomy-ai-triage";
import { MedicalHistoryFormDocument } from "../components/medical/MedicalHistoryFormDocument";

export const Route = createFileRoute("/report")({
  component: ReportPage,
});

function ReportPage() {
  const {
    cases,
    activeCase,
    medicalFormData,
    updateMedicalFormData,
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

  const aiTriage = inferOrganFromClinicalData({
    chiefComplaint: medicalFormData.otherMedicalIssues || activeCase.patientSummary,
    diagnosis: medicalFormData.diagnosis || activeCase.diagnosis,
    rawNotes: medicalFormData.rawNotes || activeCase.rawNotes,
    defaultOrganId: activeCase.organId,
  });

  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureName, setSignatureName] = useState(
    medicalFormData.doctorName || doctorProfile?.name || "dr. DPJP Spesialis"
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

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
    ctx.strokeStyle = "#1e293b";
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
      <main className="max-w-[850px] mx-auto px-4 py-16 space-y-8 text-center font-serif">
        <div className="bg-[var(--paper)] border border-[var(--line)] rounded-[32px] p-10 shadow-[var(--shadow)] space-y-6">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/15 border border-amber-500/30 text-amber-700 flex items-center justify-center mx-auto shadow-inner">
            <Lock size={32} />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
              Akses Terkunci • Diperlukan Kredensial Dokter
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Login / Registrasi Dokter Diperlukan
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-lg mx-auto leading-relaxed">
              Lembar Rekam Medis Elektronik (EHR) dan formulir riwayat kesehatan pasien hanya dapat diakses serta ditandatangani oleh Dokter Penanggung Jawab Pelayanan (DPJP) yang terverifikasi.
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
          <div className="w-16 h-16 rounded-3xl bg-blue-500/15 border border-blue-500/30 text-blue-700 flex items-center justify-center mx-auto shadow-inner">
            <FilePlus2 size={32} />
          </div>
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
              Belum Ada Pasien / Indikasi Klinis
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--ink)]">
              Mulai Sesi Konsultasi Terlebih Dahulu
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] max-w-lg mx-auto leading-relaxed">
              Formulir Rekam Medis (Medical History Form) dan riwayat klinis dihasilkan secara terintegrasi dari sesi anamnesis & konsultasi suara pasien. Daftarkan pasien baru dan mulai rekaman konsultasi untuk mengisi formulir ini.
            </p>
          </div>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/consultation"
              className="px-6 py-3 rounded-xl bg-[var(--terracotta)] text-white text-xs font-bold hover:bg-[#d95d4b] transition flex items-center gap-2 shadow-md"
            >
              <Mic size={16} />
              <span>Mulai Konsultasi Pasien Baru</span>
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
    <main className="max-w-[1280px] mx-auto px-4 py-8 space-y-6">
      {/* Top Action Toolbar (Hidden during Print) */}
      <section className="no-print bg-[var(--paper)] border border-[var(--line)] rounded-[26px] p-5 shadow-[var(--shadow)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/consultation"
            className="p-2.5 rounded-xl bg-white border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--paper-soft)] transition flex items-center gap-1.5 text-xs font-serif font-bold"
          >
            <ArrowLeft size={15} />
            <span>Kembali ke Konsultasi</span>
          </Link>

          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--ink-muted)]">
              Dokumen Rekam Medis Elektronik (EHR)
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)]">
              Formulir Riwayat Medis Pasien (Medical History Form)
            </h1>
          </div>
        </div>

        {/* Action Buttons: DB Save, 3D Anatomy Nav, Doctor Sign, Print */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Live DB Status Badge */}
          <div className="px-3 py-1.5 rounded-xl bg-white border border-[var(--line)] shadow-sm flex items-center gap-2 text-xs font-serif">
            <Database size={14} className={dbSyncStatus === "saving" ? "text-amber-500 animate-spin" : "text-[#3b6b39]"} />
            <span className="font-bold text-[var(--ink)]">
              {dbSyncStatus === "saving" ? "Menyimpan ke DB..." : "Tersimpan di DB Neon"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => saveNowToDb()}
            className="px-3 py-2 rounded-xl bg-white border border-[var(--line)] hover:bg-[var(--paper-soft)] text-xs font-serif font-bold text-[var(--ink)] transition flex items-center gap-1.5"
          >
            <Save size={14} />
            <span>Simpan DB</span>
          </button>

          {/* AI Recommended 3D Spatial Anatomy Viewer Button */}
          <Link
            to="/anatomy"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500/15 to-rose-500/15 text-[var(--ink)] border border-amber-300 hover:bg-amber-100/40 text-xs font-serif font-bold transition flex items-center gap-2 shadow-sm"
          >
            <Sparkles size={14} className="text-amber-600 animate-spin" style={{ animationDuration: "12s" }} />
            <span>Inspeksi 3D: {aiTriage.organDetails.name} ({aiTriage.organDetails.scientificName})</span>
            <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">AI</span>
            <ArrowRight size={13} className="text-[var(--terracotta)]" />
          </Link>

          {/* Doctor Signature Button */}
          <button
            type="button"
            onClick={() => setShowSignatureModal(true)}
            className={`px-4 py-2 rounded-xl text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-sm ${
              isDoctorSigned
                ? "bg-[rgba(118,157,116,0.2)] text-[#3b6b39] border border-[rgba(118,157,116,0.4)]"
                : "bg-[var(--ink)] text-white hover:bg-black"
            }`}
          >
            <PenTool size={14} />
            <span>{isDoctorSigned ? "Sudah Ditandatangani Dokter" : "Tanda Tangan Dokter"}</span>
          </button>

          {/* Print PDF Document Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-[var(--terracotta)] to-[#d95d4b] hover:opacity-95 text-white text-xs font-serif font-bold transition flex items-center gap-1.5 shadow-md"
          >
            <Printer size={15} />
            <span>Cetak / Print PDF Dokumen</span>
          </button>
        </div>
      </section>

      {/* Editable Medical History Form Document */}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm no-print">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-[var(--line)] space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="text-[#3b6b39]" size={20} />
                <h3 className="font-serif font-bold text-lg text-[var(--ink)]">Tanda Tangan Digital Dokter</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="text-gray-400 hover:text-gray-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs font-serif">
              <label className="font-bold text-[var(--ink-soft)] block">Nama Dokter Penanggung Jawab (DPJP):</label>
              <input
                type="text"
                value={signatureName}
                onChange={(e) => {
                  setSignatureName(e.target.value);
                  updateMedicalFormData({ doctorName: e.target.value });
                }}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] font-bold text-[var(--ink)]"
              />
            </div>

            <div className="space-y-2 text-xs font-serif">
              <div className="flex items-center justify-between">
                <label className="font-bold text-[var(--ink-soft)]">Goreskan Tanda Tangan Anda di Bawah:</label>
                <button
                  type="button"
                  onClick={clearCanvas}
                  className="text-[11px] text-[var(--terracotta)] font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} /> Hapus & Ulangi
                </button>
              </div>

              <div className="border-2 border-dashed border-[var(--line)] rounded-2xl p-1 bg-[var(--paper-soft)]">
                <canvas
                  ref={canvasRef}
                  width={380}
                  height={150}
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  onTouchStart={startDrawing}
                  onTouchMove={draw}
                  onTouchEnd={stopDrawing}
                  className="w-full bg-white rounded-xl cursor-crosshair touch-none"
                />
              </div>
              <p className="text-[10px] text-[var(--ink-muted)]">
                * Tanda tangan digital ini akan diverifikasi secara kriptografis dan dicatat dalam Audit Log Database.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setShowSignatureModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-serif font-bold text-[var(--ink-soft)] hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={saveSignature}
                className="px-5 py-2 rounded-xl text-xs font-serif font-bold bg-[#3b6b39] hover:bg-[#2f552e] text-white transition flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 size={14} />
                <span>Simpan Tanda Tangan</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
