import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Stethoscope,
  Mic,
  FileText,
  Layers,
  Sparkles,
  ArrowRight,
  UserCheck,
  Plus,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";

export const Route = createFileRoute("/")({ component: MedicalDashboardPage });

function MedicalDashboardPage() {
  const {
    doctorProfile,
    isDoctorRegistered,
    cases,
  } = useMedicalStore();

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
            Sistem rekam medis terintegrasi dengan verifikasi dokter DPJP, live transkripsi audio anamnesis, formulir standar EHR siap cetak, dan visualisasi patologi organ 3D interaktif yang bermutasi sesuai kondisi nyata pasien.
          </p>

          {/* Quick Status / Registered Doctor Banner */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            {isDoctorRegistered && doctorProfile ? (
              <div className="flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-xs">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-bold">
                  <UserCheck size={16} />
                </div>
                <div>
                  <div className="font-bold text-white">{doctorProfile.name}</div>
                  <div className="text-neutral-400 text-[11px]">{doctorProfile.specialization} • SIP: {doctorProfile.licenseNumber}</div>
                </div>
              </div>
            ) : (
              <Link
                to="/register"
                className="px-5 py-3 rounded-xl bg-[var(--terracotta)] hover:bg-[#d95d4b] text-white font-serif font-bold text-sm transition flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                <Stethoscope size={16} />
                <span>Registrasi Dokter & Pilih Spesialisasi</span>
                <ArrowRight size={16} />
              </Link>
            )}

            <Link
              to="/consultation"
              className="px-5 py-3 rounded-xl bg-white/15 hover:bg-white/25 text-white font-serif font-bold text-sm border border-white/20 transition flex items-center gap-2"
            >
              <Mic size={16} />
              <span>Mulai Sesi Konsultasi Baru</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 4-Step Clinical Flow Navigator */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
              Alur Kerja Klinis Terpadu
            </h2>
            <p className="text-xs text-[var(--ink-soft)] font-serif">
              Dari registrasi dokter DPJP, rekaman suara konsultasi, hingga formulir rekam medis resmi dan inspeksi 3D.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Step 1: Doctor Register */}
          <Link
            to="/register"
            className="p-6 rounded-3xl bg-[var(--paper)] border border-[var(--line)] hover:border-[var(--terracotta)] transition hover:shadow-md group flex flex-col justify-between space-y-4"
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
                  Registrasi Dokter
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Daftarkan profil dokter, pilih spesialisasi medis (Kardiologi, Paru, Saraf, Bedah, dll.), nomor SIP/STR, dan tanda tangan digital.
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-[var(--terracotta)] flex items-center gap-1">
              <span>{isDoctorRegistered ? "Edit Profil Dokter" : "Daftar Sekarang"}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Step 2: Consultation & Recording */}
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
                  Konsultasi & Rekaman
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Mulai rekaman audio dokter-pasien secara langsung dengan transkrip Web Speech API (Bahasa Indonesia) dan ekstraksi AI otomatis.
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-amber-800 flex items-center gap-1">
              <span>Buka Konsol Rekaman</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Step 3: Medical Report Form */}
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
                  Medical Report (EHR)
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Dokumen resmi rekam medis A4 dengan 100% kolom dapat diedit (Nama, Alergi, Terapi Obat, ICD-10, Vital Signs, Tanda Tangan DPJP).
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-emerald-800 flex items-center gap-1">
              <span>Lihat & Cetak Dokumen</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>

          {/* Step 4: 3D Anatomy Station */}
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
                  3D Anatomy Patologi
                </h3>
              </div>
              <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                Inspeksi organ 3D interaktif berukuran besar dengan mutasi patologis nyata (Paru perokok hitam tar, Luka tusuk pendarahan, Infark miokard).
              </p>
            </div>
            <div className="text-xs font-serif font-bold text-purple-800 flex items-center gap-1">
              <span>Buka Stasiun 3D</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition" />
            </div>
          </Link>
        </div>
      </section>

      {/* Patient Cases Section or Blank State */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
              Daftar Pasien Klinis Terdaftar
            </h2>
            <p className="text-xs text-[var(--ink-soft)] font-serif">
              Semua pasien tersimpan secara persisten ke Database PostgreSQL Neon DB.
            </p>
          </div>
          <Link
            to="/consultation"
            className="px-4 py-2 rounded-xl bg-[var(--terracotta)] text-white text-xs font-serif font-bold hover:bg-[#d95d4b] transition flex items-center gap-1.5 shadow-xs"
          >
            <Plus size={14} />
            <span>+ Konsultasi Pasien Baru</span>
          </Link>
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
                Mulai sesi konsultasi pertama Anda dengan merekam percakapan klinis pasien atau daftarkan pasien baru dari formulir blank flow.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/consultation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[var(--ink)] hover:bg-black text-white text-xs font-serif font-bold transition shadow-sm"
              >
                <Mic size={15} />
                <span>Mulai Konsultasi Pasien Pertama</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cases.map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl bg-[var(--paper)] border border-[var(--line)] shadow-xs hover:border-[var(--terracotta)] transition space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--paper-soft)] text-[var(--ink-soft)] font-bold">
                    {c.patientMrn}
                  </span>
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
                </div>

                <div>
                  <h4 className="font-serif font-bold text-base text-[var(--ink)]">{c.patientName}</h4>
                  <p className="text-xs text-[var(--ink-soft)] font-serif line-clamp-1">{c.title}</p>
                </div>

                <div className="text-[11px] text-[var(--ink-soft)] font-serif bg-white p-2.5 rounded-xl border border-[var(--line)] space-y-1">
                  <div><strong>DPJP:</strong> {c.doctorName}</div>
                  <div><strong>Keluhan:</strong> {c.rawNotes}</div>
                </div>

                <div className="pt-1 flex items-center justify-between border-t border-[var(--line)]">
                  <Link
                    to="/consultation"
                    className="text-xs font-serif font-bold text-[var(--terracotta)] hover:underline flex items-center gap-1"
                  >
                    <span>Lanjut Konsultasi</span>
                    <ArrowRight size={12} />
                  </Link>
                  <Link
                    to="/report"
                    className="text-xs font-serif text-[var(--ink-soft)] hover:text-[var(--ink)]"
                  >
                    Lihat Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
