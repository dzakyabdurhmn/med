import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Sparkles,
  ArrowRight,
  Plus,
  Mic,
  FileText,
  ShieldCheck,
  X,
  Trash2,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import DoctorOnboardingModal from "../components/onboarding/DoctorOnboardingModal";

export const Route = createFileRoute("/")({ component: MedicalDashboardPage });

function MedicalDashboardPage() {
  const navigate = useNavigate();
  const {
    cases,
    activeCaseId,
    selectCase,
    deleteCase,
    createNewPatientCase,
    dbSyncStatus,
  } = useMedicalStore();

  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientDob, setNewPatientDob] = useState("14 Mei 1978");
  const [newPatientGender, setNewPatientGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [newPatientComplaint, setNewPatientComplaint] = useState("");

  const handleCreatePatient = () => {
    if (!newPatientName.trim()) return;

    createNewPatientCase({
      patientName: newPatientName.trim(),
      patientDob: newPatientDob,
      patientGender: newPatientGender,
      title: `Konsultasi ${newPatientName.trim()}`,
      rawNotes: newPatientComplaint.trim() || "Pemeriksaan klinis baru.",
    });

    setShowNewPatientModal(false);
    setNewPatientName("");
    setNewPatientComplaint("");
    navigate({ to: "/consultation" });
  };

  return (
    <main className="container-warm section-warm space-y-16">
      {/* Hero Section */}
      <section className="max-w-4xl space-y-6">
        <div className="badge-warm badge-warm-brand">
          <Sparkles size={13} className="text-[#9E1B2E]" />
          <span>NARASI — ASISTEN DOKUMENTASI KLINIS AI RESMI</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-[#191918] tracking-tight leading-[1.1] mb-6">
          Otomatisasi Rekam Medis dari Percakapan Suara Dokter &amp; Pasien
        </h1>

        <p className="text-lg text-[#474744] font-normal leading-relaxed max-w-3xl mb-8">
          Transkripsikan percakapan konsultasi klinis secara langsung, analisis catatan SOAP otomatis, dan hasilkan Resume Medis resmi berstandar Kemenkes RI.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Link
            to="/consultation"
            className="btn-warm btn-warm-primary btn-warm-base"
          >
            <Mic size={16} />
            <span>Mulai Dikte Suara Konsultasi</span>
            <ArrowRight size={16} />
          </Link>

          <button
            type="button"
            onClick={() => setShowNewPatientModal(true)}
            className="btn-warm btn-warm-outline btn-warm-base"
          >
            <Plus size={16} />
            <span>Tambah Pasien Baru</span>
          </button>
        </div>
      </section>

      {/* Status Metrics Strip */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-warm p-5 space-y-1">
          <span className="eyebrow-warm">Total Kasus</span>
          <div className="text-2xl font-medium text-[#191918]">{isHydrated ? cases.length : 0} PASIEN</div>
        </div>

        <div className="card-warm p-5 space-y-1">
          <span className="eyebrow-warm">Penyimpanan Rekam Medis</span>
          <div className="text-sm font-medium text-[#0E7A41] uppercase">
            {dbSyncStatus === "saving" ? "MENYIMPAN..." : "TERSIMPAN OTOMATIS"}
          </div>
        </div>

        <div className="card-warm p-5 space-y-1">
          <span className="eyebrow-warm">Layanan SATUSEHAT</span>
          <div className="text-sm font-medium text-[#9E1B2E] uppercase">
            SEGERA HADIR
          </div>
        </div>

        <div className="card-warm p-5 space-y-1">
          <span className="eyebrow-warm">Struktur Formulir</span>
          <div className="text-sm font-medium text-[#191918] uppercase">100% DAPAT DIEDIT</div>
        </div>
      </section>

      {/* 3 Step Workflow Section */}
      <section className="space-y-12">
        <div className="max-w-3xl space-y-2">
          <span className="eyebrow-warm">Alur Kerja Sistem</span>
          <h2 className="text-2xl sm:text-3xl font-medium text-[#191918] tracking-tight">
            Alur Dokumentasi Klinis AI
          </h2>
          <p className="text-sm text-[#6A6A64]">
            Proses lengkap dari konsultasi suara hingga penerbitan rekam medis berstandar Kemenkes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Step 1 Card */}
          <Link
            to="/register"
            className="card-warm p-6 space-y-4 no-underline block hover:border-[#D1D0C6] transition-colors"
          >
            <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center font-medium">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#191918] leading-snug">SATUSEHAT (Segera Hadir)</h3>
            <p className="text-sm text-[#474744] leading-relaxed">
              Penghubung layanan SATUSEHAT Kemenkes RI akan hadir dalam pembaruan mendatang.
            </p>
          </Link>

          {/* Step 2 Card */}
          <Link
            to="/consultation"
            className="card-warm p-6 space-y-4 no-underline block hover:border-[#D1D0C6] transition-colors"
          >
            <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center font-medium">
              <Mic size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#191918] leading-snug">Dikte Suara &amp; SOAP AI</h3>
            <p className="text-sm text-[#474744] leading-relaxed">
              Merekam percakapan Bahasa Indonesia real-time, analisis SOAP AI, dan pemetaan bukti kutipan klinis.
            </p>
          </Link>

          {/* Step 3 Card */}
          <Link
            to="/report"
            className="card-warm p-6 space-y-4 no-underline block hover:border-[#D1D0C6] transition-colors"
          >
            <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center font-medium">
              <FileText size={20} />
            </div>
            <h3 className="text-lg font-medium text-[#191918] leading-snug">Resume Medis &amp; Cetak PDF</h3>
            <p className="text-sm text-[#474744] leading-relaxed">
              Formulir rekam medis EHR resmi dengan stempel verifikasi Kemenkes dan Tanda Tangan DPJP.
            </p>
          </Link>
        </div>
      </section>

      {/* Active Patients Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="eyebrow-warm">Rekam Medis Pasien</span>
            <h2 className="text-2xl font-medium text-[#191918] tracking-tight">
              Daftar Pasien Aktif ({cases.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setShowNewPatientModal(true)}
            className="btn-warm btn-warm-primary btn-warm-sm"
          >
            <Plus size={14} />
            <span>Tambah Pasien</span>
          </button>
        </div>

        {cases.length === 0 ? (
          <div className="card-warm p-12 text-center space-y-4">
            <p className="text-base text-[#474744] font-medium">Belum ada kasus pasien terdaftar.</p>
            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="btn-warm btn-warm-primary btn-warm-base"
            >
              <Plus size={16} />
              <span>Input Pasien Pertama</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((c) => {
              const isSelected = c.id === activeCaseId;
              return (
                <div
                  key={c.id}
                  className={`card-warm p-6 space-y-4 flex flex-col justify-between ${
                    isSelected ? "border-[#A71D31]" : ""
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-warm badge-warm-brand">{c.patientMrn}</span>
                      <button
                        type="button"
                        onClick={() => deleteCase(c.id)}
                        className="text-[#6A6A64] hover:text-[#C73737] p-1 transition-colors"
                        title="Hapus pasien"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <h3 className="text-xl font-medium text-[#191918] leading-tight">{c.patientName}</h3>
                    <p className="text-xs text-[#6A6A64] line-clamp-1">{c.title}</p>
                    <div className="p-3 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] text-xs text-[#191918]">
                      <span className="text-[#6A6A64] block text-[10px] uppercase tracking-wider mb-0.5">Diagnosis Utama</span>
                      {c.diagnosis || "Belum diekstraksi"}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#ECEBDF] flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/consultation" });
                      }}
                      className="btn-warm btn-warm-primary btn-warm-sm flex-1"
                    >
                      <Mic size={12} />
                      <span>Dikte Suara</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/report" });
                      }}
                      className="btn-warm btn-warm-outline btn-warm-sm flex-1"
                    >
                      <FileText size={12} />
                      <span>Resume Medis</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* New Patient Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="card-warm p-6 max-w-md w-full border-[#D1D0C6] space-y-5">
            <div className="flex items-center justify-between border-b border-[#ECEBDF] pb-3">
              <span className="text-base font-medium text-[#191918]">Buat Sesi Pasien Baru</span>
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="text-[#6A6A64] hover:text-[#191918] p-1"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
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
                  value={newPatientComplaint}
                  onChange={(e) => setNewPatientComplaint(e.target.value)}
                  placeholder="Catatan keluhan pasien..."
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
                  type="button"
                  onClick={handleCreatePatient}
                  disabled={!newPatientName.trim()}
                  className="btn-warm btn-warm-primary btn-warm-sm"
                >
                  Simpan &amp; Mulai
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <DoctorOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </main>
  );
}