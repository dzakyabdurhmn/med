import React, { useState, useRef, useEffect } from "react";
import {
  UserCheck,
  Stethoscope,
  PenTool,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Heart,
  Wind,
  Brain,
  Layers,
  Scissors,
  Baby,
  Check,
  QrCode,
  ShieldCheck,
  Mic,
  FileText,
  X,
} from "lucide-react";
import {
  useMedicalStore,
  type DoctorSpecialtyKey,
  type DoctorProfile,
} from "../../store/medical-store";

interface DoctorOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

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
    description: "Evaluasi konsolidasi lobaris, pneumonia bakterial, PPOK, tuberkulosis paru, dan mutasi paru perokok.",
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
    description: "Tata laksana steatohepatitis (NASH/MASLD), nefropati diabetik, sirosis hepatis, dan penyakit metabolik.",
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
    description: "Evaluasi infeksi pernapasan akut anak, asma bronkiale pediatrik, dan pemantauan tumbuh kembang klinis.",
  },
];

const DOCTOR_PRESETS: {
  name: string;
  specialtyKey: DoctorSpecialtyKey;
  specialization: string;
  licenseNumber: string;
  institution: string;
  email: string;
  phone: string;
  badge: string;
}[] = [
  {
    name: "dr. Adrian Santoso, Sp.JP, FIHA",
    specialtyKey: "cardio",
    specialization: "Spesialis Jantung (Sp.JP / FIHA) — Kardiologi & Kedokteran Vaskular",
    licenseNumber: "503/482/SIP.D/2026",
    institution: "RS Pusat Jantung & Vaskular Harapan Kita",
    email: "adrian.santoso@harapkita.go.id",
    phone: "0812-3456-7890",
    badge: "Sp.JP (Jantung)",
  },
  {
    name: "dr. Budi Hartono, Sp.P, FAPSR",
    specialtyKey: "pulmo",
    specialization: "Spesialis Paru (Sp.P / FAPSR) — Pulmonologi & Kedokteran Respirasi",
    licenseNumber: "503/129/SIP.P/2026",
    institution: "RSUP Persahabatan Jakarta",
    email: "budi.hartono@rsuppersahabatan.go.id",
    phone: "0813-8822-1100",
    badge: "Sp.P (Paru)",
  },
  {
    name: "dr. Sarah Wijaya, Sp.N",
    specialtyKey: "neuro",
    specialization: "Spesialis Saraf (Sp.N) — Neurologi & Kedokteran Otak",
    licenseNumber: "503/992/SIP.N/2026",
    institution: "RS Pusat Otak Nasional (RS PON)",
    email: "sarah.wijaya@rspon.co.id",
    phone: "0811-9922-3344",
    badge: "Sp.N (Saraf)",
  },
  {
    name: "dr. Hendra Pratama, Sp.PD, FINASIM",
    specialtyKey: "internal",
    specialization: "Spesialis Penyakit Dalam (Sp.PD) — Ilmu Penyakit Dalam",
    licenseNumber: "503/771/SIP.PD/2026",
    institution: "RSUP Nasional Dr. Cipto Mangunkusumo",
    email: "hendra.pratama@rscm.co.id",
    phone: "0812-5566-7788",
    badge: "Sp.PD (Internist)",
  },
  {
    name: "dr. Dimas Surya, Sp.B, Subsp.BD",
    specialtyKey: "surgery",
    specialization: "Spesialis Bedah Digestif (Sp.B) — Bedah Umum & Subspesialis",
    licenseNumber: "503/332/SIP.B/2026",
    institution: "RSUP Fatmawati",
    email: "dimas.surya@rsfatmawati.go.id",
    phone: "0813-1122-3344",
    badge: "Sp.B (Bedah)",
  },
  {
    name: "dr. Maya Anggraini, Sp.A",
    specialtyKey: "pediatrics",
    specialization: "Spesialis Anak (Sp.A) — Ilmu Kesehatan Anak",
    licenseNumber: "503/612/SIP.A/2026",
    institution: "RSIA Bunda Jakarta",
    email: "maya.anggraini@rsiabunda.co.id",
    phone: "0815-9988-7766",
    badge: "Sp.A (Anak)",
  },
];

export default function DoctorOnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: DoctorOnboardingModalProps) {
  const {
    doctorProfile,
    setDoctorProfile,
    selectOrgan,
    saveNowToDb,
  } = useMedicalStore();

  const [step, setStep] = useState<number>(1);
  const [formData, setFormData] = useState(() => {
    const defaultPreset = DOCTOR_PRESETS[0];
    return {
      name: doctorProfile?.name || defaultPreset.name,
      specialization: doctorProfile?.specialization || defaultPreset.specialization,
      specialtyKey: (doctorProfile?.specialtyKey || defaultPreset.specialtyKey) as DoctorSpecialtyKey,
      licenseNumber: doctorProfile?.licenseNumber || defaultPreset.licenseNumber,
      institution: doctorProfile?.institution || defaultPreset.institution,
      email: doctorProfile?.email || defaultPreset.email,
      phone: doctorProfile?.phone || defaultPreset.phone,
      signaturePin: doctorProfile?.signaturePin || "123456",
    };
  });

  const handleApplyPreset = (preset: typeof DOCTOR_PRESETS[0]) => {
    setFormData((prev) => ({
      ...prev,
      name: preset.name,
      specialtyKey: preset.specialtyKey,
      specialization: preset.specialization,
      licenseNumber: preset.licenseNumber,
      institution: preset.institution,
      email: preset.email,
      phone: preset.phone,
    }));
  };

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    doctorProfile?.signatureDataUrl || null
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Sync initial canvas if signature exists
  useEffect(() => {
    if (step === 3 && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.strokeStyle = "#1c1815";
        ctx.lineWidth = 2.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (signatureDataUrl) {
          const img = new Image();
          img.onload = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
          };
          img.src = signatureDataUrl;
        }
      }
    }
  }, [step, signatureDataUrl]);

  if (!isOpen) return null;

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
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
    const spec = SPECIALTY_OPTIONS.find((s) => s.key === key);
    if (spec) {
      setFormData((prev) => ({
        ...prev,
        specialtyKey: key,
        specialization: spec.title,
      }));
      selectOrgan(spec.defaultOrgan as any);
    }
  };

  const handleSaveAndFinish = async () => {
    const updatedProfile: DoctorProfile = {
      id: doctorProfile?.id || "doc-" + Date.now(),
      name: formData.name,
      specialization: formData.specialization,
      specialtyKey: formData.specialtyKey,
      licenseNumber: formData.licenseNumber,
      institution: formData.institution,
      email: formData.email,
      phone: formData.phone,
      signaturePin: formData.signaturePin,
      signatureDataUrl: signatureDataUrl || undefined,
      isRegistered: true,
      registeredAt: new Date().toISOString(),
    };

    setDoctorProfile(updatedProfile);
    await saveNowToDb();
    onComplete?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-[var(--paper)] border border-[var(--line-strong)] rounded-[32px] max-w-3xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-6 sm:p-7 border-b border-[var(--line)] bg-white flex items-center justify-between relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--terracotta)] to-[#d95d4b] text-white flex items-center justify-center shadow-md">
              <Stethoscope size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--terracotta)] bg-[rgba(235,124,107,0.12)] px-2 py-0.5 rounded-full">
                  Onboarding DPJP
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck size={11} /> GEMASTIK 2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[var(--ink)] leading-tight mt-0.5">
                Setup Stasiun Kerja Dokter & Spesialisasi
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-[var(--paper-soft)] hover:bg-neutral-200 text-[var(--ink-soft)] hover:text-black transition flex items-center justify-center font-bold"
            title="Tutup Modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Wizard Indicator */}
        <div className="bg-[var(--paper-soft)] px-6 py-3 border-b border-[var(--line)] grid grid-cols-4 gap-2">
          {[
            { num: 1, label: "Identitas DPJP" },
            { num: 2, label: "Pilih Spesialis" },
            { num: 3, label: "Tanda Tangan" },
            { num: 4, label: "Alur Praktik" },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num)}
                className={`py-2 px-2.5 rounded-xl border text-left transition flex items-center gap-2 ${
                  isActive
                    ? "bg-white border-[var(--terracotta)] shadow-xs ring-1 ring-[var(--terracotta)]/20"
                    : isDone
                    ? "bg-emerald-50/80 border-emerald-300 text-emerald-800"
                    : "bg-white/40 border-transparent text-[var(--ink-muted)] opacity-60"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                    isActive
                      ? "bg-[var(--terracotta)] text-white"
                      : isDone
                      ? "bg-emerald-600 text-white"
                      : "bg-neutral-200 text-neutral-600"
                  }`}
                >
                  {isDone ? "✓" : s.num}
                </div>
                <div className="hidden sm:block truncate">
                  <div className="text-[9px] font-bold uppercase text-[var(--ink-muted)]">Langkah {s.num}</div>
                  <div className="text-xs font-serif font-bold text-[var(--ink)] truncate">{s.label}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* STEP 1: DOCTOR CREDENTIALS */}
          {step === 1 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] flex items-center gap-2">
                  <UserCheck size={18} className="text-[var(--terracotta)]" />
                  Identitas Dokter Penanggung Jawab Pelayanan (DPJP)
                </h3>
                <p className="text-xs text-[var(--ink-soft)] font-serif">
                  Pilih profil dokter spesialis siap pakai (1-klik) atau lengkapi data dokter kustom di bawah.
                </p>
              </div>

              {/* Quick Specialist Presets Bar */}
              <div className="p-3.5 rounded-2xl bg-[var(--paper-soft)] border border-[var(--line)] space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--terracotta)] flex items-center gap-1.5">
                    <Stethoscope size={13} />
                    Pilih Profil Dokter Cepat (1-Klik):
                  </span>
                  <span className="text-[9px] text-[var(--ink-muted)]">Otomatis isi SIP & RS</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {DOCTOR_PRESETS.map((preset) => {
                    const isSelected = formData.name === preset.name;
                    return (
                      <button
                        key={preset.specialtyKey}
                        type="button"
                        onClick={() => handleApplyPreset(preset)}
                        className={`p-2 rounded-xl border text-left transition flex flex-col justify-between ${
                          isSelected
                            ? "bg-white border-[var(--terracotta)] ring-2 ring-[var(--terracotta)]/20 shadow-xs font-bold"
                            : "bg-white/80 border-[var(--line)] hover:bg-white text-[var(--ink-soft)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-0.5">
                          <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800">
                            {preset.badge}
                          </span>
                          {isSelected && <span className="text-[9px] text-[var(--terracotta)] font-bold">✓ Aktif</span>}
                        </div>
                        <div className="text-[11px] font-serif font-bold text-[var(--ink)] line-clamp-1">{preset.name}</div>
                        <div className="text-[9px] text-[var(--ink-muted)] line-clamp-1">{preset.institution}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-serif">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-bold text-[var(--ink)] block">
                    Nama Lengkap Dokter & Gelar Spesialis <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: dr. Adrian Santoso, Sp.JP, FIHA"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] font-bold text-sm text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--terracotta)] shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[var(--ink)] block">
                    Nomor SIP / STR Resmi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.licenseNumber}
                    onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                    placeholder="Contoh: 503/482/SIP.D/2026"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] font-mono font-bold text-xs text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--terracotta)] shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[var(--ink)] block">
                    Institusi RS / Klinik Utama <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="Contoh: RS Pusat Jantung & Vaskular Harapan Kita"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] font-bold text-xs text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--terracotta)] shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[var(--ink)] block">Email Kedinasan Dokter</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="dokter@harapkita.go.id"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] text-xs text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--terracotta)] shadow-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-[var(--ink)] block">Nomor Kontak / WhatsApp Dokter</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812-3456-7890"
                    className="w-full px-4 py-2.5 rounded-xl border border-[var(--line)] font-mono text-xs text-[var(--ink)] bg-white focus:outline-none focus:border-[var(--terracotta)] shadow-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SPECIALTY SELECTION */}
          {step === 2 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] flex items-center gap-2">
                  <Stethoscope size={18} className="text-[var(--terracotta)]" />
                  Pilih Bidang Spesialisasi Medis
                </h3>
                <p className="text-xs text-[var(--ink-soft)] font-serif">
                  Spesialisasi ini akan mengatur prioritas organ pada Atlas 3D dan menyesuaikan parameter inferensi DeepSeek AI.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALTY_OPTIONS.map((spec) => {
                  const isSelected = formData.specialtyKey === spec.key;
                  const IconComp = spec.icon;
                  return (
                    <button
                      key={spec.key}
                      type="button"
                      onClick={() => handleSelectSpecialty(spec.key)}
                      className={`p-3.5 rounded-2xl border text-left transition relative flex flex-col justify-between space-y-2 ${
                        isSelected
                          ? "bg-[rgba(235,124,107,0.1)] border-[var(--terracotta)] ring-2 ring-[var(--terracotta)]/25 shadow-md"
                          : "bg-white border-[var(--line)] hover:border-[var(--ink-muted)] hover:shadow-xs"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold shadow-xs shrink-0"
                            style={{ backgroundColor: spec.color }}
                          >
                            <IconComp size={18} />
                          </div>
                          <div>
                            <div className="font-serif font-bold text-xs text-[var(--ink)]">{spec.title}</div>
                            <div className="text-[11px] font-serif font-semibold text-[var(--terracotta)]">
                              {spec.subTitle}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                            isSelected ? "bg-[var(--terracotta)] text-white" : "bg-neutral-100 text-neutral-700"
                          }`}
                        >
                          {spec.badge}
                        </span>
                      </div>

                      <p className="text-[11px] text-[var(--ink-soft)] font-serif line-clamp-2 leading-relaxed">
                        {spec.description}
                      </p>

                      <div className="pt-1.5 border-t border-[var(--line)] flex items-center justify-between text-[10px]">
                        <span className="text-[var(--ink-muted)] font-mono">Organ Utama: {spec.defaultOrgan.toUpperCase()}</span>
                        {isSelected && (
                          <span className="text-[var(--terracotta)] font-bold flex items-center gap-1">
                            <Check size={12} /> Dipilih
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL SIGNATURE */}
          {step === 3 && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] flex items-center gap-2">
                  <PenTool size={18} className="text-[var(--terracotta)]" />
                  Tanda Tangan Digital & PIN Pengesahan DPJP
                </h3>
                <p className="text-xs text-[var(--ink-soft)] font-serif">
                  Goreskan tanda tangan resmi pada kanvas di bawah untuk memvalidasi dokumen rekam medis secara sah.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-serif">
                  <label className="font-bold text-[var(--ink)]">Kanvas Tanda Tangan Elektronik Dokter DPJP:</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-xs text-[var(--terracotta)] font-bold hover:underline flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Hapus & Ulangi
                  </button>
                </div>

                <div className="border-2 border-dashed border-[var(--line)] rounded-2xl p-1 bg-neutral-50 shadow-inner">
                  <canvas
                    ref={canvasRef}
                    width={600}
                    height={160}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full bg-white rounded-xl cursor-crosshair touch-none h-[160px]"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200 text-xs text-emerald-900 font-serif flex items-center gap-3">
                  <QrCode size={36} className="text-emerald-700 shrink-0" />
                  <div>
                    <strong className="block font-bold">Stempel Audit Trail Kriptografis</strong>
                    <span className="text-[11px] text-emerald-800">
                      Tanda tangan ini otomatis diverifikasi dan tersimpan resmi dalam sistem Rekam Medis Elektronik (RME).
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: WORKFLOW OVERVIEW */}
          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] flex items-center gap-2">
                  <Sparkles size={18} className="text-[var(--terracotta)]" />
                  Orientasi Alur Praktik Klinis 4-Pilar
                </h3>
                <p className="text-xs text-[var(--ink-soft)] font-serif">
                  Stasiun kerja Anda telah siap. Berikut alur terpadu yang dapat langsung Anda jalankan:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-serif">
                <div className="p-4 rounded-2xl bg-white border border-[var(--line)] space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-[var(--terracotta)] font-bold">
                    <Mic size={16} />
                    <span>1. Anamnesis Suara Web Speech</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-soft)] leading-relaxed">
                    Merekam percakapan klinis dokter-pasien secara realtime dengan transkrip Bahasa Indonesia.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[var(--line)] space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-amber-600 font-bold">
                    <Sparkles size={16} />
                    <span>2. Ekstraksi AI DeepSeek Pro</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-soft)] leading-relaxed">
                    Ekstraksi otomatis diagnosa klinis, kode ICD-10, riwayat penyakit, terapi obat, dan tanda vital.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[var(--line)] space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-emerald-600 font-bold">
                    <FileText size={16} />
                    <span>3. Formulir Riwayat Medis EHR</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-soft)] leading-relaxed">
                    Formulir standar A4 yang 100% dapat diedit, ditandatangani secara digital, dan dicetak sebagai PDF resmi.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white border border-[var(--line)] space-y-2 shadow-xs">
                  <div className="flex items-center gap-2 text-purple-600 font-bold">
                    <Layers size={16} />
                    <span>4. Mutasi Anatomi 3D Interaktif</span>
                  </div>
                  <p className="text-[11px] text-[var(--ink-soft)] leading-relaxed">
                    Visualisasi organ 3D berukuran besar yang otomatis bermutasi sesuai patologi nyata pasien (tar paru, luka pendarahan, infark).
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs font-serif text-amber-950 flex items-center gap-3">
                <CheckCircle2 size={24} className="text-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-bold">Profil Dokter Terdaftar: {formData.name}</strong>
                  <span className="text-[11px] text-neutral-700">
                    Spesialisasi: {formData.specialization} • SIP: {formData.licenseNumber} • {formData.institution}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[var(--line)] bg-white flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="px-4 py-2.5 rounded-xl border border-[var(--line)] text-xs font-serif font-bold text-[var(--ink-soft)] hover:bg-[var(--paper-soft)] transition flex items-center gap-1.5"
            >
              <ArrowLeft size={14} />
              <span>Sebelumnya</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[var(--line)] text-xs font-serif font-bold text-[var(--ink-soft)] hover:bg-[var(--paper-soft)] transition"
            >
              Batal
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s + 1)}
              className="px-6 py-2.5 rounded-xl bg-[var(--ink)] hover:bg-black text-white font-serif font-bold text-xs flex items-center gap-2 shadow-md transition"
            >
              <span>Lanjut ke Langkah {step + 1}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndFinish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--terracotta)] to-[#d95d4b] hover:opacity-95 text-white font-serif font-bold text-xs flex items-center gap-2 shadow-lg transition"
            >
              <CheckCircle2 size={15} />
              <span>Selesaikan Onboarding & Mulai Praktik</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
