import React, { useState, useRef, useEffect } from "react";
import {
  Stethoscope,
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
  Mic,
  FileText,
  X,
  ShieldCheck,
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
    color: "#A71D31",
    badge: "Sp.JP",
    defaultOrgan: "heart",
    description: "Diagnosis kalsifikasi katup aorta, hipertrofi ventrikel (LVH), sindrom koroner akut, dan gagal jantung.",
  },
  {
    key: "pulmo",
    title: "Pulmonologi & Respirasi",
    subTitle: "Spesialis Paru (Sp.P / FAPSR)",
    icon: Wind,
    color: "#0891B2",
    badge: "Sp.P",
    defaultOrgan: "lungs",
    description: "Evaluasi konsolidasi lobaris, pneumonia bakterial, PPOK, tuberkulosis paru, dan mutasi paru perokok.",
  },
  {
    key: "neuro",
    title: "Neurologi & Kedokteran Saraf",
    subTitle: "Spesialis Saraf (Sp.N / Sp.S)",
    icon: Brain,
    color: "#8E40CC",
    badge: "Sp.N",
    defaultOrgan: "brain",
    description: "Evaluasi infark serebri akut, MCA territory stroke, aneurisma intraserebral, dan defisit neurologis.",
  },
  {
    key: "internal",
    title: "Ilmu Penyakit Dalam",
    subTitle: "Spesialis Penyakit Dalam (Sp.PD / FINASIM)",
    icon: Layers,
    color: "#1EBD66",
    badge: "Sp.PD",
    defaultOrgan: "liver",
    description: "Tata laksana steatohepatitis (NASH/MASLD), nefropati diabetik, sirosis hepatis, dan penyakit metabolik.",
  },
  {
    key: "surgery",
    title: "Bedah Umum & Subspesialis",
    subTitle: "Spesialis Bedah (Sp.B / FICS)",
    icon: Scissors,
    color: "#F97316",
    badge: "Sp.B",
    defaultOrgan: "intestine",
    description: "Perencanaan bedah digestif, appendisitis perforasi, kolesistektomi laparoskopi, dan trauma torakoabdominal.",
  },
  {
    key: "pediatrics",
    title: "Ilmu Kesehatan Anak",
    subTitle: "Spesialis Anak (Sp.A)",
    icon: Baby,
    color: "#9C7100",
    badge: "Sp.A",
    defaultOrgan: "lungs",
    description: "Evaluasi infeksi pernapasan akut anak, asma bronkiale pediatrik, dan pemantauan tumbuh kembang klinis.",
  },
];

export default function DoctorOnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: DoctorOnboardingModalProps) {
  const { doctorProfile, setDoctorProfile, saveNowToDb } = useMedicalStore();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  const [formData, setFormData] = useState({
    name: doctorProfile?.name || "",
    specialtyKey: doctorProfile?.specialtyKey || ("cardio" as DoctorSpecialtyKey),
    specialization: doctorProfile?.specialization || "Spesialis Jantung (Sp.JP / FIHA) — Kardiologi & Kedokteran Vaskular",
    licenseNumber: doctorProfile?.licenseNumber || "",
    institution: doctorProfile?.institution || "",
    email: doctorProfile?.email || "",
    phone: doctorProfile?.phone || "",
    signaturePin: doctorProfile?.signaturePin || "123456",
  });

  const [signatureDataUrl, setSignatureDataUrl] = useState<string | null>(
    doctorProfile?.signatureDataUrl || null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (isOpen && doctorProfile) {
      setFormData({
        name: doctorProfile.name || "",
        specialtyKey: doctorProfile.specialtyKey || "cardio",
        specialization: doctorProfile.specialization || "Spesialis Jantung (Sp.JP / FIHA) — Kardiologi & Kedokteran Vaskular",
        licenseNumber: doctorProfile.licenseNumber || "",
        institution: doctorProfile.institution || "",
        email: doctorProfile.email || "",
        phone: doctorProfile.phone || "",
        signaturePin: doctorProfile.signaturePin || "123456",
      });
      setSignatureDataUrl(doctorProfile.signatureDataUrl || null);
    }
  }, [isOpen, doctorProfile]);

  if (!isOpen) return null;

  const handleSelectSpecialty = (key: DoctorSpecialtyKey) => {
    const spec = SPECIALTY_OPTIONS.find((s) => s.key === key);
    if (!spec) return;
    setFormData((prev) => ({
      ...prev,
      specialtyKey: key,
      specialization: `${spec.subTitle} — ${spec.title}`,
    }));
  };

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

    if (onComplete) onComplete();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000000]/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="card-warm max-w-2xl w-full border-[#D1D0C6] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#ECEBDF] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center">
              <Stethoscope size={20} />
            </div>
            <div>
              <span className="badge-warm badge-warm-brand">
                ONBOARDING DOKTER DPJP
              </span>
              <h2 className="text-xl font-medium text-[#191918]">
                Pengaturan Profil Praktik Klinis
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#6A6A64] hover:text-[#191918] p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Stepper Wizard Bar */}
        <div className="px-6 py-3 bg-[#F3F2E7] border-b border-[#E3E2D8] grid grid-cols-4 gap-2">
          {[
            { num: 1, label: "Profil & SIP" },
            { num: 2, label: "Bidang Spesialis" },
            { num: 3, label: "Tanda Tangan Digital" },
            { num: 4, label: "Alur Praktik" },
          ].map((s) => {
            const isActive = step === s.num;
            const isDone = step > s.num;
            return (
              <button
                key={s.num}
                type="button"
                onClick={() => setStep(s.num as any)}
                className={`btn-warm btn-warm-sm flex items-center justify-start gap-2 ${
                  isActive ? "btn-warm-primary" : isDone ? "btn-warm-outline bg-[#FFFEF2]" : "btn-warm-ghost opacity-60"
                }`}
              >
                <span className="text-xs font-medium">{isDone ? "✓" : s.num}.</span>
                <span className="truncate">{s.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* STEP 1: DOCTOR PROFILE & PRESET */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#191918]">
                  Identitas Dokter &amp; Nomor SIP Resmi
                </h3>
                <p className="text-xs text-[#6A6A64]">
                  Isi data identitas Anda di bawah ini:
                </p>
              </div>

              {/* Form Input */}
              <div className="space-y-3 pt-2">
                <div className="space-y-1">
                  <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Nama Lengkap &amp; Gelar Medis *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-warm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Nomor SIP / STR *</label>
                    <input
                      type="text"
                      required
                      value={formData.licenseNumber}
                      onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                      className="input-warm"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs uppercase tracking-[0.05em] text-[#474744] block">Institusi RS / Klinik *</label>
                    <input
                      type="text"
                      required
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="input-warm"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SPECIALTY SELECTION */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#191918]">
                  Pilih Bidang Spesialisasi Medis
                </h3>
                <p className="text-xs text-[#6A6A64]">
                  Bidang ini menentukan parameter AI &amp; template rekam medis EHR.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SPECIALTY_OPTIONS.map((spec) => {
                  const isSelected = formData.specialtyKey === spec.key;
                  return (
                    <button
                      key={spec.key}
                      type="button"
                      onClick={() => handleSelectSpecialty(spec.key)}
                      className={`card-warm p-4 text-left transition-colors cursor-pointer space-y-2 ${
                        isSelected ? "border-[#A71D31] bg-[#FCEEEF]" : "hover:border-[#D1D0C6]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm text-[#191918]">{spec.title}</span>
                        <span className="badge-warm badge-warm-brand">{spec.badge}</span>
                      </div>
                      <p className="text-xs text-[#474744]">{spec.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* STEP 3: DIGITAL SIGNATURE */}
          {step === 3 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#191918]">
                  Goreskan Tanda Tangan Digital Dokter DPJP
                </h3>
                <p className="text-xs text-[#6A6A64]">
                  Tanda tangan ini akan dicetak otomatis pada formulir Resume Medis resmi.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <label className="uppercase tracking-[0.05em] text-[#474744] block">Kanvas Tanda Tangan:</label>
                  <button
                    type="button"
                    onClick={clearCanvas}
                    className="text-[#9E1B2E] hover:underline text-xs flex items-center gap-1"
                  >
                    <RotateCcw size={12} /> Hapus &amp; Ulangi
                  </button>
                </div>

                <div className="border border-[#E3E2D8] bg-[#FFFFFF] rounded-[2px] p-1">
                  <canvas
                    ref={canvasRef}
                    width={560}
                    height={150}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full bg-white cursor-crosshair touch-none h-[150px]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: WORKFLOW OVERVIEW */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="space-y-1">
                <h3 className="text-base font-medium text-[#191918] flex items-center gap-2">
                  <Sparkles size={18} className="text-[#9E1B2E]" />
                  Orientasi Alur Praktik Klinis
                </h3>
                <p className="text-xs text-[#6A6A64]">
                  Stasiun kerja Anda telah siap. Berikut alur terpadu yang dapat langsung Anda jalankan:
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="card-warm p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#9E1B2E] font-medium">
                    <Mic size={16} />
                    <span>1. Anamnesis Suara Web Speech</span>
                  </div>
                  <p className="text-xs text-[#474744]">
                    Merekam percakapan klinis dokter-pasien secara realtime dengan transkrip Bahasa Indonesia.
                  </p>
                </div>

                <div className="card-warm p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#F97316] font-medium">
                    <Sparkles size={16} />
                    <span>2. Ekstraksi AI DeepSeek Pro</span>
                  </div>
                  <p className="text-xs text-[#474744]">
                    Ekstraksi otomatis diagnosa klinis, kode ICD-10, riwayat penyakit, dan tanda vital.
                  </p>
                </div>

                <div className="card-warm p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#0E7A41] font-medium">
                    <FileText size={16} />
                    <span>3. Formulir Riwayat Medis EHR</span>
                  </div>
                  <p className="text-xs text-[#474744]">
                    Formulir standar A4 yang 100% dapat diedit, ditandatangani secara digital, dan dicetak sebagai PDF.
                  </p>
                </div>

                <div className="card-warm p-4 space-y-1.5">
                  <div className="flex items-center gap-2 text-[#8E40CC] font-medium">
                    <ShieldCheck size={16} />
                    <span>4. Tanda Tangan &amp; PDF</span>
                  </div>
                  <p className="text-xs text-[#474744]">
                    Pengesahan digital DPJP, penyimpanan database terenkripsi, dan ekspor dokumen PDF.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-[#EAFBF1] border border-[#BFF0D4] rounded-[2px] text-xs text-[#0E7A41] flex items-center gap-3">
                <CheckCircle2 size={24} className="shrink-0" />
                <div>
                  <strong className="block font-medium">Profil Dokter Terdaftar: {formData.name}</strong>
                  <span className="text-xs text-[#474744]">
                    Spesialisasi: {formData.specialization} • SIP: {formData.licenseNumber} • {formData.institution}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-5 border-t border-[#ECEBDF] bg-[#FAFAF5] flex items-center justify-between gap-3">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="btn-warm btn-warm-outline btn-warm-sm"
            >
              <ArrowLeft size={14} />
              <span>Sebelumnya</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="btn-warm btn-warm-outline btn-warm-sm"
            >
              Batal
            </button>
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="btn-warm btn-warm-primary btn-warm-sm"
            >
              <span>Lanjut ke Langkah {step + 1}</span>
              <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSaveAndFinish}
              className="btn-warm btn-warm-primary btn-warm-base"
            >
              <CheckCircle2 size={15} />
              <span>Selesaikan Onboarding &amp; Mulai Praktik</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
