import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Lock,
  ArrowRight,
  AlertCircle,
  Stethoscope,
} from "lucide-react";
import { useMedicalStore } from "../store/medical-store";
import { loginDoctorUser } from "../server/medical-db";

export const Route = createFileRoute("/login")({
  component: DoctorLoginPage,
});

function DoctorLoginPage() {
  const navigate = useNavigate();
  const { setDoctorProfile, saveNowToDb } = useMedicalStore();

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

        await saveNowToDb();
        navigate({ to: "/consultation" });
      } else {
        setErrorMsg(res?.message || "Kredensial tidak valid. Silakan periksa Email / NIK dan Kata Sandi Anda.");
      }
    } catch (err: any) {
      setErrorMsg(`Terjadi kesalahan server: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16 space-y-8 font-sans">
      <div className="bg-white border-2 border-black rounded-none p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
        {/* Header */}
        <div className="text-center space-y-2 border-b-2 border-black pb-6">
          <div className="w-14 h-14 bg-black text-white flex items-center justify-center mx-auto mb-2 font-mono font-bold text-xl">
            <Stethoscope size={28} />
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest bg-black text-white px-2.5 py-1">
            PORTAL DOKTER DPJP
          </span>
          <h1 className="text-2xl font-black tracking-tight text-black uppercase">
            Masuk Akun Dokter
          </h1>
          <p className="text-xs text-neutral-700 font-medium">
            NARASI — Asisten Dokumentasi Klinis AI (Verifikasi SATUSEHAT)
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3.5 bg-neutral-100 border-2 border-black text-xs font-bold text-black flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs font-bold">
          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-black">
              Email Kedinasan ATAU NIK (16 Digit) *
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="contoh: dr.budi@kemenkes.go.id atau 3171..."
              className="w-full px-3.5 py-3 border-2 border-black bg-white font-mono text-xs text-black focus:outline-none focus:bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block uppercase tracking-wider text-black">
              Kata Sandi / Password *
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-3 border-2 border-black bg-white font-mono text-xs text-black focus:outline-none focus:bg-neutral-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider transition flex items-center justify-center gap-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)]"
          >
            {isLoading ? (
              <span>Memverifikasi Kredensial...</span>
            ) : (
              <>
                <Lock size={15} />
                <span>Masuk ke Konsol Dokumen</span>
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </form>

        {/* Footer CTAs */}
        <div className="pt-4 border-t-2 border-black text-center space-y-3 text-xs font-bold">
          <p className="text-neutral-600">Belum mendaftarkan lisensi SIP/STR dokter?</p>
          <Link
            to="/register"
            className="inline-block w-full py-2.5 bg-white border-2 border-black text-black hover:bg-neutral-100 transition uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
          >
            Registrasi Dokter (Verifikasi SATUSEHAT API)
          </Link>
        </div>
      </div>
    </main>
  );
}
