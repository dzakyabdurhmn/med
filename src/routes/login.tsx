import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  UserCheck,
  Mail,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import { loginDoctorUser } from "../server/medical-db";

export const Route = createFileRoute("/login")({
  component: DoctorLoginPage,
});

function DoctorLoginPage() {
  const navigate = useNavigate();
  const { setDoctorProfile, loadDoctorCasesFromDb } = useMedicalStore();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!identifier.trim() || !password.trim()) {
      setErrorMsg("Mohon masukkan Email / NIK dan kata sandi Anda.");
      return;
    }

    setIsLoading(true);

    try {
      try {
        const res = await loginDoctorUser({
          data: {
            identifier: identifier.trim(),
            password: password.trim(),
          },
        });

        if (res && res.success && res.user) {
          const user = res.user;
          setDoctorProfile({
            id: user.id,
            name: user.name,
            specialization: user.specialization || "Dokter Penanggung Jawab Pelayanan",
            specialtyKey: "general",
            licenseNumber: user.licenseNumber || "SIP/STR Active",
            institution: user.institution || "Klinik / RS Mitra",
            email: user.email,
            phone: "-",
            nik: user.nik || undefined,
            satusehatId: user.satusehatId || undefined,
            isSatusehatVerified: user.isSatusehatVerified,
            satusehatVerifiedAt: user.satusehatVerifiedAt ? new Date(user.satusehatVerifiedAt).toISOString() : undefined,
            signatureDataUrl: user.signatureDataUrl || undefined,
            signaturePin: user.signaturePin || "123456",
            isRegistered: true,
            registeredAt: user.createdAt ? new Date(user.createdAt).toISOString() : new Date().toISOString(),
          });

          await loadDoctorCasesFromDb(user.id);
          navigate({ to: "/consultation" });
          return;
        }

        setErrorMsg(res.message || "Login gagal. Periksa kembali Email / NIK dan kata sandi Anda.");
        return;
      } catch (err: any) {
        console.warn("DB login check notice:", err.message);
        setErrorMsg("Terjadi kesalahan saat memverifikasi kredensial. Coba lagi beberapa saat.");
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="container-warm section-warm flex justify-center">
      <div className="card-warm p-8 max-w-md w-full border-[#D1D0C6] space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 border-b border-[#ECEBDF] pb-6">
          <div className="w-12 h-12 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center mx-auto">
            <UserCheck size={24} />
          </div>
          <span className="badge-warm badge-warm-brand">
            PORTAL DOKTER
          </span>
          <h1 className="text-2xl font-medium text-[#191918]">
            Masuk Akun Dokter
          </h1>
          <p className="text-xs text-[#6A6A64]">
            NARASI — Asisten Dikte Suara &amp; Catatan Medis Dokter
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-4 bg-[#FBEBEB] border border-[#F5DBDB] text-xs text-[#C73737] rounded-[2px] flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="uppercase tracking-[0.05em] text-[#474744] block font-medium">
              Email atau NIK Dokter *
            </label>
            <div className="relative flex items-center">
              <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6A6A64] pointer-events-none shrink-0" />
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="contoh: dr.budi@kemenkes.go.id atau 3171..."
                className="input-warm"
                style={{ paddingLeft: "42px" }}
              />
            </div>
          </div>

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

          <button
            type="submit"
            disabled={isLoading}
            className="btn-warm btn-warm-primary btn-warm-base w-full"
          >
            {isLoading ? (
              <span>Memproses...</span>
            ) : (
              <>
                <Lock size={15} />
                <span>Masuk</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer CTAs */}
        <div className="pt-4 border-t border-[#ECEBDF] text-center space-y-3 text-xs">
          <p className="text-[#6A6A64]">Belum mendaftarkan lisensi SIP/STR dokter?</p>
          <Link
            to="/register"
            className="btn-warm btn-warm-outline btn-warm-base w-full"
          >
            Registrasi Akun Dokter Baru
          </Link>
        </div>
      </div>
    </main>
  );
}