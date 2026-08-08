import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Stethoscope,
  Mic,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  Plus,
  Trash2,
  Activity,
  Database,
  ShieldCheck,
  PenTool,
  RotateCcw,
  CheckCircle2,
  Box,
  ChevronRight,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import type { OrganId } from "../lib/anatomy-data";
import DoctorOnboardingModal from "../components/onboarding/DoctorOnboardingModal";

export const Route = createFileRoute("/")({ component: MedicalDashboardPage });

function MedicalDashboardPage() {
  const navigate = useNavigate();
  const {
    doctorProfile,
    isDoctorRegistered,
    cases,
    activeCaseId,
    selectCase,
    deleteCase,
    createNewPatientCase,
    dbSyncStatus,
  } = useMedicalStore();

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPatientName, setNewPatientName] = useState("");
  const [newPatientAge, setNewPatientAge] = useState("45 tahun");
  const [newPatientGender, setNewPatientGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");
  const [newPatientOrgan, setNewPatientOrgan] = useState<OrganId>("heart");
  const [newPatientComplaint, setNewPatientComplaint] = useState("");

  const handleCreatePatient = () => {
    if (!newPatientName.trim()) return;

    createNewPatientCase({
      patientName: newPatientName.trim(),
      patientAge: newPatientAge,
      patientGender: newPatientGender,
      organId: newPatientOrgan,
      title: `Konsultasi ${newPatientName.trim()}`,
      rawNotes: newPatientComplaint.trim() || "Pemeriksaan klinis baru.",
    });

    setShowNewPatientModal(false);
    setNewPatientName("");
    setNewPatientComplaint("");
    navigate({ to: "/consultation" });
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Hero Banner */}
      <section className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-[#1c1815] via-[#2c221c] to-[#120f0d] text-white p-8 sm:p-12 shadow-2xl border border-neutral-800">
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-[var(--terracotta)]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-serif font-bold text-amber-200 tracking-wide">
            <Sparkles size={14} className="text-amber-400" />
            <span>Platform AI Rekam Medis & Rekonstruksi 3D Klinis GEMASTIK 2026</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold leading-tight tracking-tight text-white">
            Transformasi Suara Klinis Menjadi <span className="text-[var(--terracotta)]">Rekam Medis & 3D</span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 font-serif leading-relaxed">
            Sistem rekam medis terintegrasi dengan verifikasi dokter DPJP, live transkripsi audio anamnesis, formulir standar EHR siap cetak, dan visualisasi patologi organ 3D interaktif yang bermutasi secara nyata sesuai patofisiologi pasien.
          </p>

          {/* Quick Actions & Status Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            {isDoctorRegistered && doctorProfile ? (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold">
                  <UserCheck size={16} />
                </div>
                <div>
                  <div className="font-bold text-white">{doctorProfile.name}</div>
                  <div className="text-neutral-400 text-[11px]">
                    {doctorProfile.specialization} • SIP: {doctorProfile.licenseNumber}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOnboardingOpen(true)}
                  className="ml-2 text-[10px] text-amber-300 hover:underline font-bold"
                >
                  Ubah DPJP
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setIsOnboardingOpen(true)}
                className="px-5 py-3 rounded-xl bg-[var(--terracotta)] hover:bg-[#d95d4b] text-white font-serif font-bold text-sm transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                <Stethoscope size={16} />
                <span>Mulai Onboarding Dokter DPJP</span>
                <ArrowRight size={16} />
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-serif font-bold text-sm border border-white/20 transition flex items-center gap-2"
            >
              <Plus size={16} />
              <span>+ Buat Pasien Baru</span>
            </button>

            <Link
              to="/anatomy"
              className="px-5 py-3 rounded-xl bg-purple-900/40 hover:bg-purple-900/60 text-purple-200 border border-purple-500/40 font-serif font-bold text-sm transition flex items-center gap-2"
            >
              <Box size={16} />
              <span>Buka Stasiun 3D</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Clinical Metrics / Status Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--ink-muted)]">Total Pasien</div>
            <div className="text-xl font-bold font-serif text-[var(--ink)]">{cases.length} Kasus</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <Database size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--ink-muted)]">Database Neon</div>
            <div className="text-xs font-bold font-serif text-emerald-700">Tersinkronisasi Realtime</div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--ink-muted)]">Status DPJP</div>
            <div className="text-xs font-bold font-serif text-[var(--ink)]">
              {doctorProfile ? doctorProfile.specialtyKey.toUpperCase() : "Belum Onboarding"}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <PenTool size={20} />
          </div>
          <div>
            <div className="text-[10px] uppercase font-bold text-[var(--ink-muted)]">Tanda Tangan</div>
            <div className="text-xs font-bold font-serif text-[var(--ink)]">
              {doctorProfile?.signatureDataUrl ? "Tersedia (Sah)" : "Belum Ada"}
            </div>
          </div>
        </div>
      </section>

      {/* 4-Step Integrated Clinical Pipeline */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
              Alur Kerja Terpadu Stasiun Medis
            </h2>
            <p className="text-xs text-[var(--ink-soft)] font-serif">
              Dari registrasi DPJP, rekaman suara anamnesis, formulir rekam medis resmi (EHR), hingga rekonstruksi anatomi 3D.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1: Onboarding Doctor */}
          <div
            onClick={() => setIsOnboardingOpen(true)}
            className="p-6 rounded-3xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--terracotta)] transition hover:shadow-md cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[rgba(235,124,107,0.12)] text-[var(--terracotta)] flex items-center justify-center font-bold">
                <Stethoscope size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--terracotta)]">
                  Langkah 1
                </span>
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] group-hover:text-[var(--terracotta)] transition">
                  Onboarding Dokter DPJP
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Setup identitas dokter, gelar spesialisasi, nomor SIP/STR, serta tanda tangan digital dan PIN pengesahan.
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-[var(--terracotta)] flex items-center gap-1">
              <span>{isDoctorRegistered ? "Buka Pengaturan DPJP" : "Mulai Onboarding"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </div>

          {/* Step 2: Voice Consultation */}
          <Link
            to="/consultation"
            className="p-6 rounded-3xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--terracotta)] transition hover:shadow-md group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
                <Mic size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Langkah 2
                </span>
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] group-hover:text-amber-800 transition">
                  Anamnesis Suara & AI
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Merekam dialog klinis secara realtime dengan Web Speech API dan inferensi AI DeepSeek untuk ekstraksi diagnosis & ICD-10.
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-amber-800 flex items-center gap-1">
              <span>Buka Konsol Suara</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Step 3: Medical Report EHR Form */}
          <Link
            to="/report"
            className="p-6 rounded-3xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--terracotta)] transition hover:shadow-md group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center justify-center font-bold">
                <FileText size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                  Langkah 3
                </span>
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] group-hover:text-emerald-800 transition">
                  Formulir Medical Report
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Lembar rekam medis standar rumah sakit A4 dengan 100% kolom dapat diedit, ditandatangani DPJP, dan dicetak sebagai PDF.
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-emerald-800 flex items-center gap-1">
              <span>Buka & Cetak Dokumen</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Step 4: 3D Pathology Station */}
          <Link
            to="/anatomy"
            className="p-6 rounded-3xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--terracotta)] transition hover:shadow-md group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-700 border border-purple-200 flex items-center justify-center font-bold">
                <Layers size={24} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700">
                  Langkah 4
                </span>
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] group-hover:text-purple-800 transition">
                  3D Anatomy & Patologi
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Inspeksi organ 3D resolusi tinggi dengan mutasi visual otomatis (paru tar hitam, pendarahan luka tusuk, infark, dan batu ginjal).
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-purple-800 flex items-center gap-1">
              <span>Buka Stasiun 3D</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </section>

      {/* Patient Cases Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
              Daftar Pasien Klinis Aktif
            </h2>
            <p className="text-xs text-[var(--ink-soft)] font-serif">
              Data pasien tersimpan secara persisten ke Database PostgreSQL Neon.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowNewPatientModal(true)}
            className="px-4 py-2 rounded-xl bg-[var(--terracotta)] text-white text-xs font-serif font-bold hover:bg-[#d95d4b] transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} />
            <span>+ Buat Pasien Baru</span>
          </button>
        </div>

        {cases.length === 0 ? (
          <div className="p-12 rounded-[28px] bg-[var(--paper)] border-2 border-dashed border-[var(--line)] text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[rgba(235,124,107,0.1)] text-[var(--terracotta)] mx-auto flex items-center justify-center">
              <Stethoscope size={32} />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-lg font-serif font-bold text-[var(--ink)]">
                Belum Ada Pasien Terdaftar
              </h3>
              <p className="text-xs text-[var(--ink-soft)] font-serif">
                Klik tombol di bawah untuk membuat sesi pasien baru dan memulai anamnesis suara.
              </p>
            </div>
            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setShowNewPatientModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink)] hover:bg-black text-white text-xs font-serif font-bold transition shadow-sm"
              >
                <Plus size={15} />
                <span>+ Buat Pasien Baru Sekarang</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c) => {
              const isSelected = c.id === activeCaseId;
              return (
                <div
                  key={c.id}
                  className={`p-5 rounded-2xl bg-[var(--paper)] border transition space-y-3.5 flex flex-col justify-between ${
                    isSelected
                      ? "border-[var(--terracotta)] ring-2 ring-[var(--terracotta)]/20 shadow-md"
                      : "border-[var(--line)] shadow-xs hover:border-[var(--ink-muted)]"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--paper-soft)] text-[var(--ink-soft)] font-bold">
                        {c.patientMrn}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded ${
                            c.severity === "CRITICAL"
                              ? "bg-red-100 text-red-700"
                              : c.severity === "SEVERE"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-emerald-100 text-emerald-800"
                          }`}
                        >
                          {c.severity}
                        </span>
                        <button
                          type="button"
                          onClick={() => deleteCase(c.id)}
                          className="text-neutral-400 hover:text-red-600 p-1 transition"
                          title="Hapus Kasus Pasien"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="font-serif font-bold text-base text-[var(--ink)]">{c.patientName}</h4>
                      <p className="text-xs text-[var(--ink-soft)] font-serif line-clamp-1">{c.title}</p>
                    </div>

                    <div className="text-[11px] text-[var(--ink-soft)] font-serif bg-white p-2.5 rounded-xl border border-[var(--line)] space-y-1">
                      <div><strong>DPJP:</strong> {c.doctorName}</div>
                      <div><strong>Diagnosis:</strong> {c.diagnosis || "Belum diekstraksi"}</div>
                      <div><strong>Keluhan:</strong> {c.rawNotes || "-"}</div>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-[var(--line)] gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/consultation" });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[var(--ink)] hover:bg-black text-white text-xs font-serif font-bold transition flex items-center gap-1"
                    >
                      <Mic size={13} />
                      <span>Konsultasi</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/report" });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-white border border-[var(--line)] hover:bg-[var(--paper-soft)] text-xs font-serif font-bold text-[var(--ink)] transition flex items-center gap-1"
                    >
                      <FileText size={13} />
                      <span>EHR Form</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/anatomy" });
                      }}
                      className="px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 text-xs font-serif font-bold transition flex items-center gap-1"
                    >
                      <Box size={13} />
                      <span>3D</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* New Patient Case Creation Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white border border-[var(--line)] rounded-[28px] max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 font-serif">
            <div className="flex items-center justify-between border-b border-[var(--line)] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[rgba(235,124,107,0.12)] text-[var(--terracotta)] flex items-center justify-center font-bold">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--ink)]">Buat Sesi Pasien Baru</h3>
                  <p className="text-[11px] text-[var(--ink-soft)]">
                    Mulai sesi konsultasi medis dengan formulir rekam medis bersih.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="text-neutral-400 hover:text-black font-bold p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[var(--ink)] block">
                  Nama Lengkap Pasien <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newPatientName}
                  onChange={(e) => setNewPatientName(e.target.value)}
                  placeholder="Contoh: Tn. Bambang Sutrisno"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] font-bold text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[var(--ink)] block">Usia Pasien</label>
                  <input
                    type="text"
                    value={newPatientAge}
                    onChange={(e) => setNewPatientAge(e.target.value)}
                    placeholder="Contoh: 54 tahun"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[var(--ink)] block">Jenis Kelamin</label>
                  <select
                    value={newPatientGender}
                    onChange={(e) => setNewPatientGender(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--terracotta)]"
                  >
                    <option value="Laki-laki">Laki-laki (M)</option>
                    <option value="Perempuan">Perempuan (F)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--ink)] block">Fokus Organ Utama (3D)</label>
                <select
                  value={newPatientOrgan}
                  onChange={(e) => setNewPatientOrgan(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[var(--line)] text-[var(--ink)] bg-white font-bold focus:outline-none focus:border-[var(--terracotta)]"
                >
                  <option value="heart">🫀 Cor / Jantung (Kardiologi)</option>
                  <option value="lungs">🫁 Pulmo / Paru-paru (Pulmonologi)</option>
                  <option value="brain">🧠 Encephalon / Otak (Neurologi)</option>
                  <option value="liver">🟤 Hepar / Hati (Penyakit Dalam)</option>
                  <option value="kidneys">🫘 Ren / Ginjal (Nefrologi)</option>
                  <option value="stomach">🥣 Gaster / Lambung (Gastroenterologi)</option>
                  <option value="intestine">〰️ Intestinum / Usus (Bedah Digestif)</option>
                  <option value="eyeball">👁️ Bulbus Oculi / Mata (Oftalmologi)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--ink)] block">Keluhan Utama / Alasan Kunjungan</label>
                <textarea
                  rows={3}
                  value={newPatientComplaint}
                  onChange={(e) => setNewPatientComplaint(e.target.value)}
                  placeholder="Contoh: Nyeri dada kiri menjalar ke rahang, sesak napas saat aktivitas ringan, riwayat merokok 20 tahun..."
                  className="w-full p-3 rounded-xl border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[var(--line)]">
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="px-4 py-2 rounded-xl border border-[var(--line)] text-xs font-bold text-[var(--ink-soft)] hover:bg-neutral-50 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleCreatePatient}
                disabled={!newPatientName.trim()}
                className="px-5 py-2.5 rounded-xl bg-[var(--terracotta)] hover:bg-[#d95d4b] disabled:opacity-50 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5"
              >
                <CheckCircle2 size={14} />
                <span>Simpan & Mulai Konsultasi</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Doctor Onboarding Modal */}
      <DoctorOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
