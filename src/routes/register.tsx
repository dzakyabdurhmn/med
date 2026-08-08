import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useRef } from "react";
import {
  UserCheck,
  Stethoscope,
  ArrowRight,
  CheckCircle2,
  Lock,
  PenTool,
  RotateCcw,
  Activity,
  Heart,
  Wind,
  Brain,
  Layers,
  Scissors,
  Baby,
  Eye,
  Check,
  FileCheck2,
} from "lucide-react";
import {
  useMedicalStore,
  type DoctorSpecialtyKey,
  type DoctorProfile,
} from "../store/medical-store";

export const Route = createFileRoute("/register")({
  component: DoctorRegistrationPage,
});

const SPECIALTY_OPTIONS: {
  key: DoctorSpecialtyKey;
  title: string;
  subTitle: string;
  icon: any;
  color: string;
  badge: string;
  defaultOrgan: string;
  description: string;
}[] = [
  {
    key: "cardio",
    title: "Kardiologi & Kedokteran Vaskular",
    subTitle: "Spesialis Jantung (Sp.JP / FIHA)",
    icon: Heart,
    color: "#e11d48",
    badge: "Sp.JP",
    defaultOrgan: "heart",
    description: "Diagnosis kalsifikasi katup aorta, hipertrofi ventrikel (LVH), sindrom koroner akut, dan gagal jantung.",
  },
  {
    key: "pulmo",
    title: "Pulmonologi & Respirasi",
    subTitle: "Spesialis Paru (Sp.P / FAPSR)",
    icon: Wind,
    color: "#0284c7",
    badge: "Sp.P",
    defaultOrgan: "lungs",
    description: "Evaluasi konsolidasi lobaris, pneumonia bakterial, PPOK, tuberkulosis paru, dan efusi pleura.",
  },
  {
    key: "neuro",
    title: "Neurologi & Kedokteran Saraf",
    subTitle: "Spesialis Saraf (Sp.N / Sp.S)",
    icon: Brain,
    color: "#7c3aed",
    badge: "Sp.N",
    defaultOrgan: "brain",
    description: "Evaluasi infark serebri akut, MCA territory stroke, aneurisma intraserebral, dan defisit neurologis.",
  },
  {
    key: "internal",
    title: "Ilmu Penyakit Dalam",
    subTitle: "Spesialis Penyakit Dalam (Sp.PD / FINASIM)",
    icon: Layers,
    color: "#059669",
    badge: "Sp.PD",
    defaultOrgan: "liver",
    description: "Tata laksana steatohepatitis (NASH/MASLD), nefropati diabetik, sirosis hepatis, dan penyakit metabolik sistemik.",
  },
  {
    key: "surgery",
    title: "Bedah Umum & Subspesialis",
    subTitle: "Spesialis Bedah (Sp.B / FICS)",
    icon: Scissors,
    color: "#ea580c",
    badge: "Sp.B",
    defaultOrgan: "intestine",
    description: "Perencanaan bedah digestif, appendisitis perforasi, kolesistektomi laparoskopi, dan trauma torakoabdominal.",
  },
  {
    key: "pediatrics",
    title: "Ilmu Kesehatan Anak",
    subTitle: "Spesialis Anak (Sp.A)",
    icon: Baby,
    color: "#d97706",
    badge: "Sp.A",
    defaultOrgan: "lungs",
    description: "Evaluasi infeksi pernapasan akut anak, asma bronkiale pediatrik, dan pemantauan tumbuh kembang.",
  },
  {
    key: "ophthalmology",
    title: "Oftalmologi / Ilmu Kesehatan Mata",
    subTitle: "Spesialis Mata (Sp.M)",
    icon: Eye,
    color: "#0d9488",
    badge: "Sp.M",
    defaultOrgan: "eyeball",
    description: "Inspeksi retinopati diabetik, neuropati optik, glaukoma sudut terbuka, dan defek vaskular retina 3D.",
  },
  {
    key: "general",
    title: "Dokter Umum & Triase Primer",
    subTitle: "Dokter Layanan Primer (dr. / GP)",
    icon: Stethoscope,
    color: "#475569",
    badge: "dr.",
    defaultOrgan: "heart",
    description: "Konsultasi anamnesis komprehensif, triase kegawatdaruratan, rujukan subspesialis, dan rekam medis elektronik.",
  },
];

function DoctorRegistrationPage() {
  const { doctorProfile, setDoctorProfile, saveNowToDb } = useMedicalStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [formData, setFormData] = useState<DoctorProfile>(() => {
    if (doctorProfile) return doctorProfile;
    return {
      id: "doc-main",
      name: "",
      specialization: "Spesialis Jantung & Pembuluh Darah (Sp.JP)",
      specialtyKey: "cardio",
      licenseNumber: "",
      institution: "RS Jantung & Pembuluh Darah Harapan Kita",
      email: "",
      phone: "",
      signaturePin: "123456",
      isRegistered: false,
      registeredAt: new Date().toISOString(),
    };
  });

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
    if (canvasRef.current) {
      setFormData((prev) => ({
        ...prev,
        signatureDataUrl: canvasRef.current?.toDataURL("image/png"),
      }));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFormData((prev) => ({
      ...prev,
      signatureDataUrl: undefined,
    }));
  };

  const handleSelectSpecialty = (key: DoctorSpecialtyKey) => {
    const opt = SPECIALTY_OPTIONS.find((s) => s.key === key);
    if (!opt) return;
    setFormData({
      ...formData,
      specialtyKey: key,
      specialization: `${opt.subTitle} — ${opt.title}`,
    });
  };

  const handleSubmitRegistration = async () => {
    setDoctorProfile({
      ...formData,
      isRegistered: true,
      registeredAt: new Date().toISOString(),
    });

    await saveNowToDb();
    setStep(4);
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Header Banner */}
      <section className="bg-[var(--paper)] border border-[var(--line)] rounded-[30px] p-6 sm:p-8 shadow-[var(--shadow)] relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[rgba(235,124,107,0.12)] text-[var(--terracotta)] border border-[rgba(235,124,107,0.25)]">
              <UserCheck size={14} />
              <span>Portal Registrasi & Onboarding Dokter DPJP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[var(--ink)]">
              Registrasi Dokter & Pemilihan Spesialis
            </h1>
            <p className="text-xs sm:text-sm text-[var(--ink-soft)] font-serif max-w-2xl">
              Daftarkan identitas profesional, nomor SIP/STR, pilih bidang spesialisasi klinis, dan siapkan tanda tangan elektronik resmi untuk validasi rekam medis AI.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/consultation"
              className="px-4 py-2.5 rounded-2xl bg-white border border-[var(--line)] text-xs font-serif font-bold text-[var(--ink)] hover:bg-[var(--paper-soft)] transition shadow-xs"
            >
              Langsung ke Konsultasi
            </Link>
          </div>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="mt-8 pt-6 border-t border-[var(--line)] grid grid-cols-4 gap-2 sm:gap-4">
          {[
            { num: 1, label: "Identitas Dokter" },
            { num: 2, label: "Bidang Spesialis" },
            { num: 3, label: "Tanda Tangan Digital" },
            { num: 4, label: "Siap Praktik" },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as any)}
                className={`p-2.5 sm:p-3 rounded-2xl border text-left transition flex items-center gap-2 sm:gap-3 ${
                  isActive
                    ? "bg-[rgba(235,124,107,0.12)] border-[var(--terracotta)] shadow-xs"
                    : isDone
                    ? "bg-white border-[#3b6b39] text-[#3b6b39]"
                    : "bg-white/60 border-[var(--line)] opacity-70"
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center font-bold text-xs ${
                    isActive
                      ? "bg-[var(--terracotta)] text-white"
                      : isDone
                      ? "bg-[#3b6b39] text-white"
                      : "bg-[var(--paper-soft)] text-[var(--ink-muted)]"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </div>
                <div className="hidden sm:block">
                  <div className="text-[10px] uppercase font-bold text-[var(--ink-muted)]">Langkah {s.num}</div>
                  <div className="text-xs font-serif font-bold text-[var(--ink)] line-clamp-1">{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Step 1: Doctor Identity Form */}
      {step === 1 && (
        <section className="bg-white border border-[var(--line)] rounded-[26px] p-6 sm:p-8 shadow-[var(--shadow)] space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[rgba(235,124,107,0.12)] text-[var(--terracotta)] flex items-center justify-center">
              <UserCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[var(--ink)]">Langkah 1: Identitas & Lisensi Dokter</h2>
              <p className="text-xs text-[var(--ink-soft)] font-serif">
                Masukkan nama lengkap beserta gelar, nomor izin praktik SIP/STR, dan institusi rumah sakit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs font-serif">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="font-bold text-[var(--ink)] block">
                Nama Lengkap Dokter Penanggung Jawab Pelayanan (DPJP) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Contoh: dr. Adrian Santoso, Sp.JP, FIHA"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] font-bold text-sm text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
              />
              <p className="text-[11px] text-[var(--ink-muted)]">
                Nama ini akan dicetak pada seluruh Formulir Riwayat Medis, Resep Elektronik, dan Lembar Evaluasi AI.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[var(--ink)] block">
                Nomor SIP / STR (Surat Izin Praktik) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="Contoh: 503/482/SIP.D/2024"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] font-mono font-semibold text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[var(--ink)] block">
                Institusi / Rumah Sakit / Klinik Utama <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="Contoh: RS Jantung & Pembuluh Darah Harapan Kita"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] font-bold text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[var(--ink)] block">Email Kedinasan Dokter</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="dokter@rumah-sakit.ac.id"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-[var(--ink)] block">Nomor Kontak / WhatsApp Dokter</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="0812-xxxx-xxxx"
                className="w-full px-4 py-3 rounded-xl border border-[var(--line)] font-mono text-xs text-[var(--ink)] focus:outline-none focus:border-[var(--terracotta)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 rounded-xl bg-[var(--ink)] hover:bg-black text-white font-serif font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut ke Pemilihan Spesialis</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* Step 2: Choose Specialist Grid */}
      {step === 2 && (
        <section className="bg-white border border-[var(--line)] rounded-[26px] p-6 sm:p-8 shadow-[var(--shadow)] space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[var(--ink)]">Langkah 2: Pilih Bidang Spesialisasi</h2>
              <p className="text-xs text-[var(--ink-soft)] font-serif">
                Sistem AI dan Atlas Anatomi 3D akan menyesuaikan default template anamnesis dan algoritma triase organ sesuai bidang Anda.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SPECIALTY_OPTIONS.map((spec) => {
              const isSelected = formData.specialtyKey === spec.key;
              const IconComp = spec.icon;
              return (
                <button
                  key={spec.key}
                  type="button"
                  onClick={() => handleSelectSpecialty(spec.key)}
                  className={`p-4 sm:p-5 rounded-2xl border text-left transition relative flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? "bg-[rgba(235,124,107,0.08)] border-[var(--terracotta)] ring-2 ring-[var(--terracotta)]/20 shadow-md"
                      : "bg-white border-[var(--line)] hover:border-[var(--ink-muted)] hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shadow-xs"
                        style={{ backgroundColor: spec.color }}
                      >
                        <IconComp size={20} />
                      </div>
                      <div>
                        <div className="font-serif font-bold text-sm text-[var(--ink)]">{spec.title}</div>
                        <div className="text-xs font-serif font-medium text-[var(--terracotta)]">{spec.subTitle}</div>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isSelected ? "bg-[var(--terracotta)] text-white" : "bg-neutral-100 text-neutral-600"
                      }`}
                    >
                      {spec.badge}
                    </span>
                  </div>

                  <p className="text-xs text-[var(--ink-soft)] font-serif leading-relaxed">
                    {spec.description}
                  </p>

                  <div className="pt-2 border-t border-[var(--line)] flex items-center justify-between text-[11px]">
                    <span className="text-[var(--ink-muted)] font-mono">Organ Utama: {spec.defaultOrgan.toUpperCase()}</span>
                    {isSelected && (
                      <span className="text-[var(--terracotta)] font-bold flex items-center gap-1">
                        <Check size={13} /> Terpilih
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 rounded-xl border border-[var(--line)] text-xs font-serif font-bold text-[var(--ink-soft)] hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 rounded-xl bg-[var(--ink)] hover:bg-black text-white font-serif font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut ke Tanda Tangan Digital</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* Step 3: Electronic Signature & PIN */}
      {step === 3 && (
        <section className="bg-white border border-[var(--line)] rounded-[26px] p-6 sm:p-8 shadow-[var(--shadow)] space-y-6">
          <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PenTool size={20} />
            </div>
            <div>
              <h2 className="text-xl font-serif font-bold text-[var(--ink)]">Langkah 3: Tanda Tangan Digital & PIN Verifikasi</h2>
              <p className="text-xs text-[var(--ink-soft)] font-serif">
                Goreskan tanda tangan resmi Anda pada kanvas di bawah untuk otomatisasi pengesahan rekam medis.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-serif font-bold text-[var(--ink)]">
                Kanvas Tanda Tangan Elektronik Dokter DPJP:
              </label>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-[var(--terracotta)] font-serif font-bold hover:underline flex items-center gap-1"
              >
                <RotateCcw size={13} /> Hapus & Ulangi
              </button>
            </div>

            <div className="border-2 border-dashed border-[var(--line)] rounded-2xl p-2 bg-[var(--paper-soft)]">
              <canvas
                ref={canvasRef}
                width={700}
                height={180}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full bg-white rounded-xl cursor-crosshair touch-none h-[180px]"
              />
            </div>
            <p className="text-[11px] text-[var(--ink-muted)] font-serif">
              * Tanda tangan ini disimpan secara aman dan terenkripsi, digunakan untuk pengesahan otomatis saat Anda mengklik "Verifikasi & Tanda Tangani" pada lembar PDF.
            </p>

            <div className="pt-2 max-w-xs space-y-1.5">
              <label className="text-xs font-serif font-bold text-[var(--ink)] flex items-center gap-1.5">
                <Lock size={13} />
                PIN Verifikasi Cepat (6 Angka)
              </label>
              <input
                type="password"
                maxLength={6}
                value={formData.signaturePin || "123456"}
                onChange={(e) => setFormData({ ...formData, signaturePin: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] font-mono text-center font-bold tracking-widest text-sm text-[var(--ink)]"
                placeholder="123456"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-[var(--line)]">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl border border-[var(--line)] text-xs font-serif font-bold text-[var(--ink-soft)] hover:bg-gray-50 transition"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleSubmitRegistration}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-[var(--terracotta)] to-[#d95d4b] hover:opacity-95 text-white font-serif font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <CheckCircle2 size={16} />
              <span>Simpan Profil & Aktifkan Dokter</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 4: Ready to Practice Summary */}
      {step === 4 && (
        <section className="bg-white border border-[#3b6b39] rounded-[26px] p-8 shadow-xl space-y-6 text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#3b6b39] flex items-center justify-center mx-auto shadow-inner animate-bounce">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
              Profil Dokter Berhasil Diaktifkan!
            </h2>
            <p className="text-xs text-[var(--ink-soft)] font-serif">
              Data Anda telah tersinkronisasi ke PostgreSQL Neon DB. Seluruh modul konsultasi suara, rekam medis, dan triase anatomi 3D kini beroperasi di bawah kredensial resmi Anda.
            </p>
          </div>

          {/* Doctor Credential Badge Card */}
          <div className="max-w-md mx-auto bg-[var(--paper-soft)] border border-[var(--line)] rounded-2xl p-5 text-left space-y-3 font-serif">
            <div className="flex items-center justify-between">
              <div className="font-bold text-sm text-[var(--ink)]">{formData.name}</div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[var(--terracotta)] text-white">
                {formData.specialtyKey.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-[var(--ink-soft)]">{formData.specialization}</div>
            <div className="text-[11px] text-[var(--ink-muted)] pt-2 border-t border-[var(--line)] flex items-center justify-between">
              <span>SIP: {formData.licenseNumber}</span>
              <span>{formData.institution}</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[var(--ink)] hover:bg-black text-white font-serif font-bold text-xs flex items-center justify-center gap-2 shadow-md transition"
            >
              <Activity size={15} />
              <span>Mulai Sesi Konsultasi Suara Pasien</span>
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white border border-[var(--line)] hover:bg-gray-50 text-[var(--ink)] font-serif font-bold text-xs flex items-center justify-center gap-2 transition"
            >
              <FileCheck2 size={15} />
              <span>Buka Formulir Medical Report</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
