import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  UserPlus,
  Stethoscope,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  FileBadge,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import type { DoctorSpecialtyKey, DoctorProfile } from "../store/medical-store";
import { registerDoctorUser } from "../server/medical-db";

export const Route = createFileRoute("/register")({
  component: DoctorRegisterPage,
});

const SPECIALTY_OPTIONS: {
  key: DoctorSpecialtyKey;
  label: string;
  badge: string;
}[] = [
  { key: "cardio", label: "Kardiologi & Kedokteran Vaskular (Sp.JP)", badge: "Sp.JP" },
  { key: "pulmo", label: "Pulmonologi & Respirasi (Sp.P)", badge: "Sp.P" },
  { key: "neuro", label: "Neurologi & Kedokteran Saraf (Sp.N)", badge: "Sp.N" },
  { key: "internal", label: "Ilmu Penyakit Dalam (Sp.PD)", badge: "Sp.PD" },
  { key: "surgery", label: "Bedah Umum & Subspesialis (Sp.B)", badge: "Sp.B" },
  { key: "pediatrics", label: "Ilmu Kesehatan Anak (Sp.A)", badge: "Sp.A" },
];

function DoctorRegisterPage() {
  const navigate = useNavigate();
  const { setDoctorProfile, loadDoctorCasesFromDb } = useMedicalStore();

  const [name, setName] = useState("");
  const [specialtyKey, setSpecialtyKey] = useState<DoctorSpecialtyKey>("cardio");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [institution, setInstitution] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone] = useState("081234567890");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const chosenSpec = SPECIALTY_OPTIONS.find((s) => s.key === specialtyKey);
  const registeredName = name.trim()
    ? `dr. ${name.trim().replace(/^dr\.?\s*/i, "")}, ${chosenSpec?.badge || "Sp"}`
    : "";

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    if (!name.trim() || !licenseNumber.trim() || !institution.trim() || !email.trim() || !password.trim()) {
      return;
    }

    setIsLoading(true);

    try {
      // Persist account to PostgreSQL (User table) so login can find it
      const regRes = (await registerDoctorUser({
        data: {
          name: registeredName,
          email: email.trim(),
          password: password.trim(),
          licenseNumber: licenseNumber.trim(),
          specialization: chosenSpec?.label || "Dokter Penanggung Jawab Pelayanan",
          institution: institution.trim(),
          signaturePin: "123456",
        },
      })) as {
        success?: boolean;
        user?: { id: string };
        error?: string;
      };

      if (!regRes.success || !regRes.user) {
        setErrorMsg(regRes.error || "Pendaftaran gagal disimpan ke database. Coba lagi.");
        return;
      }

      const dbUser = regRes.user;
      const updatedProfile: DoctorProfile = {
        id: dbUser.id,
        name: registeredName,
        specialization: chosenSpec?.label || "Dokter Penanggung Jawab Pelayanan",
        specialtyKey,
        licenseNumber: licenseNumber.trim(),
        institution: institution.trim(),
        email: email.trim(),
        phone: phone.trim() || "081234567890",
        signaturePin: "123456",
        isRegistered: true,
        registeredAt: new Date().toISOString(),
      };

      setDoctorProfile(updatedProfile);
      await loadDoctorCasesFromDb(updatedProfile.id, updatedProfile);

      setIsSuccess(true);
      setTimeout(() => {
        navigate({ to: "/consultation" });
      }, 1000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container-warm section-warm flex justify-center py-8">
      <div className="card-warm p-8 max-w-xl w-full border-[#D1D0C6] space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 border-b border-[#ECEBDF] pb-6">
          <div className="w-12 h-12 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center mx-auto">
            <UserPlus size={24} />
          </div>
          <span className="badge-warm badge-warm-brand">
            REGISTRASI AKUN DOKTER DPJP
          </span>
          <h1 className="text-2xl font-medium text-[#191918]">
            Pendaftaran Praktik Dokter
          </h1>
          <p className="text-xs text-[#6A6A64]">
            Lengkapi data diri dan lisensi SIP/STR Anda untuk memulai sesi dikte klinis AI NARASI.
          </p>
        </div>

        {/* Success Alert */}
        {isSuccess && (
          <div className="p-4 bg-[#EAFBF1] border border-[#BFF0D4] text-xs text-[#0E7A41] rounded-[2px] flex items-center gap-2">
            <CheckCircle2 size={16} className="shrink-0" />
            <span>Registrasi Dokter Berhasil! Mengalihkan ke konsol konsultasi...</span>
          </div>
        )}

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-[#FBEBEB] border border-[#F5DBDB] text-xs text-[#C73737] rounded-[2px] flex items-center gap-2">
            <ShieldCheck size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleRegister} className="space-y-4 text-xs">
          {/* Doctor Name */}
          <div className="space-y-1">
            <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
              Nama Dokter *
            </label>
            <div className="relative flex items-center">
              <Stethoscope size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A6A64] pointer-events-none shrink-0" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="contoh: Budi Santoso"
                className="input-warm"
                style={{ paddingLeft: "42px" }}
              />
            </div>
            <p className="text-[11px] text-[#6A6A64]">
              Cukup nama saja — gelar &quot;dr.&quot; dan spesialisasi otomatis ditambahkan.
            </p>
            {registeredName && (
              <div className="input-warm bg-[#F3F2E7] border-dashed text-[#9E1B2E] flex items-center gap-2">
                <CheckCircle2 size={14} />
                <span>Nama terdaftar: <strong>{registeredName}</strong></span>
              </div>
            )}
          </div>

          {/* Specialty & License */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
                Bidang Spesialisasi Medis *
              </label>
              <select
                value={specialtyKey}
                onChange={(e) => setSpecialtyKey(e.target.value as DoctorSpecialtyKey)}
                className="input-warm cursor-pointer"
              >
                {SPECIALTY_OPTIONS.map((s) => (
                  <option key={s.key} value={s.key}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
                Nomor SIP / STR *
              </label>
              <div className="relative flex items-center">
                <FileBadge size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A6A64] pointer-events-none shrink-0" />
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  placeholder="503/482/SIP.D/2026"
                  className="input-warm"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>
          </div>

          {/* Institution & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
                Rumah Sakit / Klinik Praktik *
              </label>
              <div className="relative flex items-center">
                <Building size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A6A64] pointer-events-none shrink-0" />
                <input
                  type="text"
                  required
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  placeholder="RSUP Persahabatan / Klinik Utama"
                  className="input-warm"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
                Email Kedinasan *
              </label>
              <div className="relative flex items-center">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A6A64] pointer-events-none shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dokter@kemenkes.go.id"
                  className="input-warm"
                  style={{ paddingLeft: "42px" }}
                />
              </div>
            </div>
          </div>

          {/* Password */}
          <div className="space-y-1">
            <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
              Kata Sandi / Password *
            </label>
            <div className="relative flex items-center">
              <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A6A64] pointer-events-none shrink-0" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-warm font-mono"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

          {/* SATUSEHAT Integration Card (DISABLED / COMING SOON) */}
          <div className="p-4 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] space-y-3 opacity-90">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#9E1B2E] font-medium uppercase tracking-wider">
                <ShieldCheck size={16} />
                <span>Layanan SATUSEHAT Kemenkes RI</span>
              </div>
              <span className="badge-warm badge-warm-brand flex items-center gap-1 text-[10px]">
                <Clock size={10} />
                <span>SEGERA HADIR</span>
              </span>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#6A6A64] block">
                Nomor ID SATUSEHAT Dokter
              </label>
              <input
                type="text"
                disabled
                placeholder="Penghubung SATUSEHAT Kemenkes RI segera hadir"
                className="input-warm bg-[#ECEAE0] text-[#8C8C84] cursor-not-allowed border-[#D8D6C8]"
              />
            </div>
            <p className="text-[11px] text-[#6A6A64] italic">
              * Pendaftaran akun dokter dapat langsung digunakan sepenuhnya. Layanan SATUSEHAT akan diaktifkan pada pembaruan mendatang.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || isSuccess}
            className="btn-warm btn-warm-primary btn-warm-base w-full"
          >
            {isLoading ? (
              <span>Memproses Pendaftaran...</span>
            ) : (
              <>
                <UserPlus size={15} />
                <span>Daftar Akun Dokter &amp; Mulai Praktik</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div className="pt-4 border-t border-[#ECEBDF] text-center space-y-2 text-xs">
          <p className="text-[#6A6A64]">Sudah mendaftarkan akun dokter?</p>
          <Link
            to="/login"
            className="btn-warm btn-warm-outline btn-warm-base w-full"
          >
            Masuk ke Konsol Dokumen Dokter
          </Link>
        </div>
      </div>
    </main>
  );
}