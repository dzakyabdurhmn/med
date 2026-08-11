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
  ShieldCheck,
  Search,
  AlertCircle,
  Check,
  FileText,
  Activity,
} from "lucide-react";
import {
  useMedicalStore,
  type DoctorSpecialtyKey,
  type DoctorProfile,
} from "../store/medical-store";
import { verifyPractitionerWithSatuSehat, type SatuSehatVerificationResult } from "../server/satusehat";
import { registerDoctorUser } from "../server/medical-db";

export const Route = createFileRoute("/register")({
  component: DoctorRegistrationPage,
});

const SPECIALTY_OPTIONS: {
  key: DoctorSpecialtyKey;
  title: string;
  subTitle: string;
  badge: string;
  description: string;
}[] = [
  {
    key: "cardio",
    title: "Kardiologi & Kedokteran Vaskular",
    subTitle: "Spesialis Jantung (Sp.JP / FIHA)",
    badge: "Sp.JP",
    description: "Evaluasi kalsifikasi aorta, hipertrofi ventrikel, sindrom koroner akut, dan gagal jantung.",
  },
  {
    key: "pulmo",
    title: "Pulmonologi & Kedokteran Respirasi",
    subTitle: "Spesialis Paru (Sp.P / FAPSR)",
    badge: "Sp.P",
    description: "Evaluasi konsolidasi lobaris, pneumonia, PPOK, tuberkulosis paru, dan efusi pleura.",
  },
  {
    key: "neuro",
    title: "Neurologi & Kedokteran Saraf",
    subTitle: "Spesialis Saraf (Sp.N / Sp.S)",
    badge: "Sp.N",
    description: "Evaluasi infark serebri akut, MCA stroke, aneurisma intraserebral, dan defisit neurologis.",
  },
  {
    key: "internal",
    title: "Ilmu Penyakit Dalam",
    subTitle: "Spesialis Penyakit Dalam (Sp.PD / FINASIM)",
    badge: "Sp.PD",
    description: "Tata laksana steatohepatitis, nefropati diabetik, sirosis hepatis, dan penyakit metabolik.",
  },
  {
    key: "surgery",
    title: "Bedah Umum & Subspesialis",
    subTitle: "Spesialis Bedah (Sp.B / FICS)",
    badge: "Sp.B",
    description: "Bedah digestif, appendisitis perforasi, kolesistektomi, dan trauma torakoabdominal.",
  },
  {
    key: "pediatrics",
    title: "Ilmu Kesehatan Anak",
    subTitle: "Spesialis Anak (Sp.A)",
    badge: "Sp.A",
    description: "Infeksi pernapasan akut anak, asma bronkiale pediatrik, dan pemantauan tumbuh kembang.",
  },
  {
    key: "ophthalmology",
    title: "Oftalmologi / Kesehatan Mata",
    subTitle: "Spesialis Mata (Sp.M)",
    badge: "Sp.M",
    description: "Retinopati diabetik, neuropati optik, glaukoma sudut terbuka, dan kelainan vaskular retina.",
  },
  {
    key: "general",
    title: "Dokter Umum & Triase Primer",
    subTitle: "Dokter Layanan Primer (dr. / GP)",
    badge: "dr.",
    description: "Anamnesis komprehensif, triase primer, rujukan spesialis, dan rekam medis elektronik.",
  },
];

function DoctorRegistrationPage() {
  const { doctorProfile, setDoctorProfile, saveNowToDb } = useMedicalStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [nikInput, setNikInput] = useState(doctorProfile?.nik || "3171012304850001");
  const [isVerifyingSatusehat, setIsVerifyingSatusehat] = useState(false);
  const [satusehatResult, setSatusehatResult] = useState<SatuSehatVerificationResult | null>(null);

  const [formData, setFormData] = useState({
    name: doctorProfile?.name || "dr. Adrian Santoso, Sp.JP, FIHA",
    email: doctorProfile?.email || "adrian.santoso@kemenkes.go.id",
    password: "Password123!",
    licenseNumber: doctorProfile?.licenseNumber || "503/482/SIP.D/2026",
    specialization: doctorProfile?.specialization || "Spesialis Jantung (Sp.JP) — Kardiologi & Vaskular",
    specialtyKey: (doctorProfile?.specialtyKey || "cardio") as DoctorSpecialtyKey,
    institution: doctorProfile?.institution || "RS Pusat Jantung Harapan Kita",
    phone: doctorProfile?.phone || "081234567890",
    signaturePin: doctorProfile?.signaturePin || "123456",
  });

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    doctorProfile?.signatureDataUrl || null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Handler: Verifikasi SATUSEHAT Live API
  const handleVerifySatuSehat = async () => {
    if (!nikInput || nikInput.trim().length < 10) {
      alert("Masukkan 16 Digit NIK Kependudukan Dokter.");
      return;
    }

    setIsVerifyingSatusehat(true);
    setSatusehatResult(null);

    try {
      const res = await verifyPractitionerWithSatuSehat({
        data: {
          nik: nikInput.trim(),
          doctorName: formData.name,
        },
      });

      setSatusehatResult(res);

      if (res && res.isVerified && res.officialName) {
        setFormData((prev) => ({
          ...prev,
          name: res.officialName || prev.name,
        }));
      }
    } catch (e: any) {
      setSatusehatResult({
        success: false,
        isVerified: false,
        message: `Error memanggil SATUSEHAT API: ${e.message}`,
      });
    } finally {
      setIsVerifyingSatusehat(false);
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
    ctx.lineWidth = 3;
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
      setSignatureDataUrl(canvasRef.current.toDataURL("image/png"));
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureDataUrl(null);
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
    setErrorMsg("");
    setIsSaving(true);

    try {
      // 1. Save to Prisma Database via Server Function
      const dbRes = await registerDoctorUser({
        data: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          nik: nikInput.trim(),
          licenseNumber: formData.licenseNumber,
          specialization: formData.specialization,
          institution: formData.institution,
          satusehatId: satusehatResult?.satusehatId || undefined,
          isSatusehatVerified: satusehatResult?.isVerified || false,
          signatureDataUrl: signatureDataUrl || undefined,
          signaturePin: formData.signaturePin,
        },
      });

      if (!dbRes.success) {
        setErrorMsg(dbRes.error || "Gagal menyimpan data ke Database.");
        setIsSaving(false);
        return;
      }

      // 2. Set Local Doctor Profile Session
      const updatedProfile: DoctorProfile = {
        id: dbRes.user?.id || "doc-" + Date.now(),
        name: formData.name,
        specialization: formData.specialization,
        specialtyKey: formData.specialtyKey,
        licenseNumber: formData.licenseNumber,
        institution: formData.institution,
        email: formData.email,
        phone: formData.phone,
        nik: nikInput.trim(),
        satusehatId: satusehatResult?.satusehatId || undefined,
        isSatusehatVerified: satusehatResult?.isVerified || false,
        satusehatVerifiedAt: satusehatResult?.isVerified ? new Date().toISOString() : undefined,
        signaturePin: formData.signaturePin,
        signatureDataUrl: signatureDataUrl || undefined,
        isRegistered: true,
        registeredAt: new Date().toISOString(),
      };

      setDoctorProfile(updatedProfile);
      await saveNowToDb();
      setStep(4);
    } catch (e: any) {
      setErrorMsg(`Error registrasi: ${e.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 space-y-8 font-sans">
      {/* Top Banner Header */}
      <section className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-2 border-black pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold bg-black text-white uppercase tracking-widest">
              <UserCheck size={14} />
              <span>NARASI — REGISTRASI DOKTER DPJP</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight uppercase">
              Onboarding Dokter & Verifikasi SATUSEHAT API
            </h1>
            <p className="text-xs sm:text-sm text-neutral-700 font-medium max-w-2xl leading-relaxed">
              Verifikasi kredensial NIK Dokter secara real-time dengan Platform Kemenkes RI SATUSEHAT API, daftarkan lisensi SIP/STR, dan siapkan tanda tangan digital.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="px-4 py-2.5 bg-white border-2 border-black text-xs font-bold text-black hover:bg-neutral-100 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              Sudah Memiliki Akun? Login
            </Link>
          </div>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="grid grid-cols-4 gap-2 sm:gap-3 text-xs font-bold">
          {[
            { num: 1, label: "Verifikasi & Identitas" },
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
                className={`p-3 border-2 border-black text-left transition flex items-center gap-2.5 ${
                  isActive
                    ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : isDone
                    ? "bg-neutral-200 text-black border-black"
                    : "bg-white text-neutral-600 opacity-60"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-none flex items-center justify-center font-mono font-bold text-xs ${
                    isActive ? "bg-white text-black" : "bg-black text-white"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </div>
                <div className="hidden sm:block truncate">
                  <div className="text-[9px] uppercase font-mono tracking-wider">Langkah {s.num}</div>
                  <div className="text-xs font-bold uppercase truncate">{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* STEP 1: SATUSEHAT VERIFICATION & CREDENTIALS */}
      {step === 1 && (
        <section className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-black pb-4">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono font-bold">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-black uppercase">
                Langkah 1: Verifikasi SATUSEHAT & Identitas Dokter
              </h2>
              <p className="text-xs text-neutral-700 font-medium">
                Masukkan NIK untuk mengecek status terverifikasi di SATUSEHAT Kemenkes RI API STG.
              </p>
            </div>
          </div>

          {/* SATUSEHAT API Live Verification Bar */}
          <div className="p-5 border-2 border-black bg-neutral-50 space-y-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-black flex items-center gap-1.5">
                <Activity size={15} />
                LIVE API: SATUSEHAT PRACTITIONER KEMENKES RI
              </span>
              <span className="text-[10px] font-mono font-bold bg-black text-white px-2 py-0.5">
                STG API ACTIVE
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="flex-1 space-y-1">
                <label className="text-[10px] font-mono font-bold uppercase text-black block">
                  Nomor Induk Kependudukan (NIK 16 Digit) *
                </label>
                <input
                  type="text"
                  maxLength={16}
                  value={nikInput}
                  onChange={(e) => setNikInput(e.target.value)}
                  placeholder="3171012304850001"
                  className="w-full px-3.5 py-2.5 border-2 border-black bg-white font-mono font-bold text-xs text-black focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={handleVerifySatuSehat}
                disabled={isVerifyingSatusehat}
                className="px-5 py-2.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shrink-0 self-end shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                {isVerifyingSatusehat ? (
                  <span>Mengirim Ke SATUSEHAT...</span>
                ) : (
                  <>
                    <Search size={14} />
                    <span>Verifikasi SATUSEHAT</span>
                  </>
                )}
              </button>
            </div>

            {/* SATUSEHAT Verification Result Card */}
            {satusehatResult && (
              <div
                className={`p-4 border-2 border-black text-xs font-mono space-y-2 ${
                  satusehatResult.isVerified
                    ? "bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "bg-neutral-100 text-black"
                }`}
              >
                <div className="flex items-center justify-between border-b border-black pb-2">
                  <span className="font-bold uppercase tracking-wider flex items-center gap-1.5">
                    {satusehatResult.isVerified ? (
                      <CheckCircle2 size={16} className="text-black" />
                    ) : (
                      <AlertCircle size={16} />
                    )}
                    STATUS: {satusehatResult.isVerified ? "TERVERIFIKASI RESMI SATUSEHAT" : "MEMERLUKAN TINJAUAN"}
                  </span>
                  {satusehatResult.satusehatId && (
                    <span className="text-[10px] font-bold bg-black text-white px-2 py-0.5">
                      ID: {satusehatResult.satusehatId}
                    </span>
                  )}
                </div>

                <p className="font-medium text-xs leading-relaxed">{satusehatResult.message}</p>

                {satusehatResult.isVerified && (
                  <div className="pt-2 border-t border-dashed border-black text-[11px] grid grid-cols-2 gap-2">
                    <div><strong>Nama Resmi:</strong> {satusehatResult.officialName}</div>
                    <div><strong>Jenis Kelamin:</strong> {satusehatResult.gender}</div>
                    <div><strong>Tgl Lahir:</strong> {satusehatResult.birthDate}</div>
                    <div><strong>Kualifikasi:</strong> {satusehatResult.qualifications?.join(", ") || "Spesialis Medis"}</div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Identity & License Input Form */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="uppercase tracking-wider text-black block">
                Nama Lengkap Dokter & Gelar Spesialis *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="dr. Adrian Santoso, Sp.JP, FIHA"
                className="w-full px-4 py-3 border-2 border-black font-bold text-sm text-black bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-black block">
                Nomor SIP / STR (Surat Izin Praktik) *
              </label>
              <input
                type="text"
                required
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                placeholder="503/482/SIP.D/2026"
                className="w-full px-4 py-3 border-2 border-black font-mono font-bold text-xs text-black bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-black block">
                Institusi RS / Klinik Utama *
              </label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder="RS Pusat Jantung Harapan Kita"
                className="w-full px-4 py-3 border-2 border-black font-bold text-xs text-black bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-black block">
                Email Kedinasan Dokter *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="adrian.santoso@kemenkes.go.id"
                className="w-full px-4 py-3 border-2 border-black text-xs text-black bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="uppercase tracking-wider text-black block">
                Kata Sandi Akun / Password *
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full px-4 py-3 border-2 border-black font-mono text-xs text-black bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <span>Lanjut ke Pilih Spesialis</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 2: SPECIALTY SELECTION */}
      {step === 2 && (
        <section className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-black pb-4">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono font-bold">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-black uppercase">
                Langkah 2: Pilih Bidang Spesialisasi Medis
              </h2>
              <p className="text-xs text-neutral-700 font-medium">
                Pilih bidang spesialisasi untuk mengonfigurasi formulir SOAP & parameter dokumentasi AI.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {SPECIALTY_OPTIONS.map((spec) => {
              const isSelected = formData.specialtyKey === spec.key;
              return (
                <button
                  key={spec.key}
                  type="button"
                  onClick={() => handleSelectSpecialty(spec.key)}
                  className={`p-4 border-2 border-black text-left transition flex flex-col justify-between space-y-2.5 ${
                    isSelected
                      ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
                      : "bg-white text-black hover:bg-neutral-100"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 border-b border-current pb-2">
                    <div>
                      <div className="font-black text-sm uppercase">{spec.title}</div>
                      <div className="text-[11px] font-mono font-medium opacity-90">{spec.subTitle}</div>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 uppercase ${
                        isSelected ? "bg-white text-black" : "bg-black text-white"
                      }`}
                    >
                      {spec.badge}
                    </span>
                  </div>

                  <p className="text-[11px] leading-relaxed opacity-95">{spec.description}</p>

                  {isSelected && (
                    <div className="text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1 pt-1">
                      <Check size={13} /> DIPILIH
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-5 py-2.5 border-2 border-black text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <span>Lanjut ke Tanda Tangan Digital</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </section>
      )}

      {/* STEP 3: DIGITAL SIGNATURE & PIN */}
      {step === 3 && (
        <section className="bg-white border-2 border-black rounded-none p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
          <div className="flex items-center gap-3 border-b-2 border-black pb-4">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-mono font-bold">
              <PenTool size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-black uppercase">
                Langkah 3: Tanda Tangan Digital & PIN Pengesahan
              </h2>
              <p className="text-xs text-neutral-700 font-medium">
                Goreskan tanda tangan pada kanvas untuk validasi dokumen Resume Medis resmi.
              </p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-neutral-100 border-2 border-black text-xs font-bold text-black flex items-start gap-2">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-bold">
              <label className="uppercase tracking-wider text-black">
                Kanvas Tanda Tangan Elektronik Dokter DPJP:
              </label>
              <button
                type="button"
                onClick={clearCanvas}
                className="text-xs text-black font-mono font-bold underline flex items-center gap-1 hover:opacity-80"
              >
                <RotateCcw size={12} /> Hapus & Ulangi
              </button>
            </div>

            <div className="border-2 border-black rounded-none p-1 bg-neutral-100 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <canvas
                ref={canvasRef}
                width={700}
                height={170}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full bg-white cursor-crosshair touch-none h-[170px]"
              />
            </div>

            <div className="pt-2 max-w-xs space-y-1.5 text-xs font-bold">
              <label className="uppercase tracking-wider text-black flex items-center gap-1.5">
                <Lock size={13} />
                PIN Pengesahan Cepat (6 Digit)
              </label>
              <input
                type="password"
                maxLength={6}
                value={formData.signaturePin}
                onChange={(e) => setFormData({ ...formData, signaturePin: e.target.value })}
                className="w-full px-4 py-2.5 border-2 border-black font-mono text-center font-bold tracking-widest text-sm text-black bg-white focus:outline-none"
                placeholder="123456"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t-2 border-black">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 border-2 border-black text-black font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition"
            >
              Kembali
            </button>
            <button
              type="button"
              onClick={handleSubmitRegistration}
              disabled={isSaving}
              className="px-8 py-3.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center gap-2 transition shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <CheckCircle2 size={16} />
              <span>{isSaving ? "Menyimpan ke Database..." : "Simpan & Aktifkan Dokter"}</span>
            </button>
          </div>
        </section>
      )}

      {/* STEP 4: READY TO PRACTICE */}
      {step === 4 && (
        <section className="bg-white border-2 border-black rounded-none p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6 text-center">
          <div className="w-16 h-16 bg-black text-white flex items-center justify-center mx-auto font-mono font-bold text-2xl">
            ✓
          </div>

          <div className="space-y-1 max-w-lg mx-auto">
            <h2 className="text-2xl font-black text-black uppercase">
              Dokter DPJP Berhasil Terdaftar!
            </h2>
            <p className="text-xs text-neutral-700 font-medium leading-relaxed">
              Kredensial dan tanda tangan digital Anda tersimpan di Database PostgreSQL. Anda kini dapat langsung memulai sesi konsultasi dikte suara.
            </p>
          </div>

          {/* Credential Card */}
          <div className="max-w-md mx-auto bg-neutral-100 border-2 border-black p-5 text-left space-y-3 text-xs font-mono font-bold shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between">
              <div className="text-sm text-black">{formData.name}</div>
              <span className="text-[10px] bg-black text-white px-2 py-0.5">
                {formData.specialtyKey.toUpperCase()}
              </span>
            </div>
            <div className="text-neutral-700 font-sans">{formData.specialization}</div>
            <div className="text-[11px] pt-2 border-t border-black flex items-center justify-between">
              <span>SIP: {formData.licenseNumber}</span>
              <span>{formData.institution}</span>
            </div>
            {satusehatResult?.satusehatId && (
              <div className="text-[10px] bg-white border border-black p-2 text-black">
                SATUSEHAT PRACTITIONER ID: {satusehatResult.satusehatId} (VERIFIED)
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              to="/consultation"
              className="w-full sm:w-auto px-6 py-3.5 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] transition"
            >
              <Activity size={15} />
              <span>Mulai Dikte Suara Konsultasi</span>
            </Link>

            <Link
              to="/report"
              className="w-full sm:w-auto px-6 py-3.5 bg-white border-2 border-black text-black font-mono font-bold text-xs uppercase tracking-wider hover:bg-neutral-100 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center gap-2"
            >
              <FileText size={15} />
              <span>Formulir Resume Medis</span>
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
