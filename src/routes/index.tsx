import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Stethoscope,
  Mic,
  FileText,
  Sparkles,
  ArrowRight,
  UserCheck,
  Plus,
  Trash2,
  Activity,
  Database,
  ShieldCheck,
  PenTool,
  CheckCircle2,
  Lock,
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
  const [newPatientDob, setNewPatientDob] = useState("14 Mei 1978");
  const [newPatientGender, setNewPatientGender] = useState<"Laki-laki" | "Perempuan">("Laki-laki");

  const [newPatientOrgan, setNewPatientOrgan] = useState<OrganId>("lungs");
  const [newPatientComplaint, setNewPatientComplaint] = useState("");

  const handleCreatePatient = () => {
    if (!newPatientName.trim()) return;

    createNewPatientCase({
      patientName: newPatientName.trim(),
      patientDob: newPatientDob,
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
    <div className="space-y-8 pb-16 font-sans">
      {/* Hero Banner */}
      <section className="bg-white border-2 border-black p-8 sm:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold bg-black text-white uppercase tracking-widest">
          <Sparkles size={14} className="animate-pulse" />
          <span>NARASI — ASISTEN DOKUMENTASI KLINIS AI RESMI</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
          Otomatisasi Rekam Medis Dari Percakapan Suara Dokter & Pasien
        </h1>

        <p className="text-sm sm:text-base text-neutral-800 font-medium max-w-3xl leading-relaxed">
          Verifikasi identitas Dokter DPJP via API SATUSEHAT Kemenkes, transkripsikan percakapan konsultasi klinis secara real-time, dan hasilkan Resume Medis terintegrasi database PostgreSQL.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center gap-3 font-mono font-bold text-xs">
          {isDoctorRegistered && doctorProfile ? (
            <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-100 border-2 border-black">
              <UserCheck size={18} />
              <div>
                <div className="text-black font-black">{doctorProfile.name}</div>
                <div className="text-[10px] text-neutral-600">
                  SATUSEHAT FHIR VERIFIED • NIK: {doctorProfile.licenseNumber || "TERVERIFIKASI"}
                </div>
              </div>
            </div>
          ) : (
            <Link
              to="/register"
              className="px-6 py-3.5 bg-black hover:bg-neutral-800 text-white uppercase tracking-wider transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-2"
            >
              <Stethoscope size={16} />
              <span>Verifikasi SATUSEHAT & Login DPJP</span>
              <ArrowRight size={16} />
            </Link>
          )}

          <button
            type="button"
            onClick={() => setShowNewPatientModal(true)}
            className="px-6 py-3.5 border-2 border-black bg-white hover:bg-neutral-100 text-black uppercase tracking-wider transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
          >
            <Plus size={16} />
            <span>+ Pasien Baru</span>
          </button>
        </div>
      </section>

      {/* Status Metrics Strip */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 font-mono text-xs font-bold">
        <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] text-neutral-600 uppercase">Total Kasus</div>
          <div className="text-2xl font-black text-black">{cases.length} PASIEN</div>
        </div>

        <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] text-neutral-600 uppercase">Penyimpanan Rekam Medis</div>
          <div className="text-xs font-black text-black uppercase">
            {dbSyncStatus === "saving" ? "MENYIMPAN..." : "TERSIMPAN AUTOMATIS"}
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] text-neutral-600 uppercase">Integrasi SATUSEHAT</div>
          <div className="text-xs font-black text-black uppercase">
            {isDoctorRegistered ? "TERVERIFIKASI FHIR" : "PENDING LOG IN"}
          </div>
        </div>

        <div className="p-4 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-1">
          <div className="text-[10px] text-neutral-600 uppercase">Struktur Formulir</div>
          <div className="text-xs font-black text-black uppercase">100% EDITABLE EHR</div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section className="space-y-4">
        <h2 className="text-xl font-black uppercase text-black font-mono">
          Alur Kerja Dokumentasi NARASI
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs font-bold">
          {/* Step 1 */}
          <Link
            to="/register"
            className="p-6 bg-white border-2 border-black hover:bg-neutral-50 transition shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 block"
          >
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">
              01
            </div>
            <h3 className="text-base font-black uppercase text-black">Verifikasi Dokter SATUSEHAT</h3>
            <p className="text-xs font-sans text-neutral-700 font-medium leading-relaxed">
              Pemeriksaan Practitioner NIK ke API Kemenkes SATUSEHAT resmi & autentikasi login database.
            </p>
          </Link>

          {/* Step 2 */}
          <Link
            to="/consultation"
            className="p-6 bg-white border-2 border-black hover:bg-neutral-50 transition shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 block"
          >
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">
              02
            </div>
            <h3 className="text-base font-black uppercase text-black">Dikte Suara & Evidence-Link</h3>
            <p className="text-xs font-sans text-neutral-700 font-medium leading-relaxed">
              Merekam ucapan Bahasa Indonesia real-time, speaker diarization, dan pemetaan bukti kutipan.
            </p>
          </Link>

          {/* Step 3 */}
          <Link
            to="/report"
            className="p-6 bg-white border-2 border-black hover:bg-neutral-50 transition shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 block"
          >
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black">
              03
            </div>
            <h3 className="text-base font-black uppercase text-black">Resume Medis & Cetak PDF</h3>
            <p className="text-xs font-sans text-neutral-700 font-medium leading-relaxed">
              Formulir rekam medis EHR resmi dengan stempel QR verifikasi Kemenkes dan Tanda Tangan DPJP.
            </p>
          </Link>
        </div>
      </section>

      {/* Active Patients Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between font-mono">
          <h2 className="text-xl font-black uppercase text-black">
            Daftar Pasien Aktif ({cases.length})
          </h2>
          <button
            type="button"
            onClick={() => setShowNewPatientModal(true)}
            className="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-bold text-xs uppercase transition"
          >
            + Pasien Baru
          </button>
        </div>

        {cases.length === 0 ? (
          <div className="p-10 border-2 border-black bg-white text-center space-y-4 font-mono">
            <p className="font-bold text-black uppercase">Belum ada kasus pasien terdaftar.</p>
            <button
              type="button"
              onClick={() => setShowNewPatientModal(true)}
              className="px-6 py-3 bg-black text-white font-bold text-xs uppercase hover:bg-neutral-800 transition"
            >
              + Input Pasien Pertama
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 font-mono text-xs font-bold">
            {cases.map((c) => {
              const isSelected = c.id === activeCaseId;
              return (
                <div
                  key={c.id}
                  className={`p-5 border-2 border-black bg-white space-y-4 flex flex-col justify-between transition ${
                    isSelected ? "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]" : "shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="bg-black text-white px-2 py-0.5">{c.patientMrn}</span>
                      <button
                        type="button"
                        onClick={() => deleteCase(c.id)}
                        className="text-neutral-500 hover:text-black font-bold"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="font-black text-lg text-black font-sans uppercase">{c.patientName}</div>
                    <div className="text-neutral-700 font-sans font-medium text-xs line-clamp-1">{c.title}</div>
                    <div className="p-2 border border-black bg-neutral-50 text-[11px] font-sans font-medium text-black">
                      Diagnosis: {c.diagnosis || "Belum diekstraksi"}
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t-2 border-black gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/consultation" });
                      }}
                      className="px-3 py-2 bg-black text-white text-xs font-mono uppercase hover:bg-neutral-800"
                    >
                      Dikte Suara
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        selectCase(c.id);
                        navigate({ to: "/report" });
                      }}
                      className="px-3 py-2 border-2 border-black text-black text-xs font-mono uppercase hover:bg-neutral-100"
                    >
                      Resume Medis
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
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-white border-2 border-black p-6 max-w-md w-full shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-4 font-sans text-xs font-bold">
            <div className="flex items-center justify-between border-b-2 border-black pb-3 font-mono">
              <span className="font-black text-sm uppercase">BUAT SESI PASIEN BARU</span>
              <button
                type="button"
                onClick={() => setShowNewPatientModal(false)}
                className="font-bold text-black"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
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
                  value={newPatientComplaint}
                  onChange={(e) => setNewPatientComplaint(e.target.value)}
                  placeholder="Catatan keluhan pasien..."
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
                  type="button"
                  onClick={handleCreatePatient}
                  disabled={!newPatientName.trim()}
                  className="px-5 py-2 bg-black text-white hover:bg-neutral-800 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] disabled:opacity-50"
                >
                  Simpan & Mulai
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
    </div>
  );
}
