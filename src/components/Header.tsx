import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Mic,
  FileText,
  UserCheck,
  ShieldCheck,
  Lock,
  LogOut,
  Stethoscope,
  LogIn,
} from 'lucide-react'
import { useMedicalStore } from '../store/medical-store'

export default function Header() {
  const { doctorProfile, isDoctorRegistered, cases, setDoctorProfile } = useMedicalStore()

  const hasPatientCases = cases.length > 0

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin keluar dari akun dokter saat ini?")) {
      setDoctorProfile({
        id: "",
        name: "",
        specialization: "",
        specialtyKey: "general",
        licenseNumber: "",
        institution: "",
        email: "",
        phone: "",
        isRegistered: false,
        registeredAt: "",
      });
      window.location.href = "/login";
    }
  };

  return (
    <header className="no-print bg-white border-b-2 border-black sticky top-0 z-40 px-4 py-3 font-sans">
      <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-black text-white font-mono font-black text-sm flex items-center justify-center border-2 border-black">
            N
          </div>
          <div>
            <div className="font-black text-base uppercase tracking-wider text-black group-hover:underline">
              NARASI ✦
            </div>
            <div className="text-[10px] font-mono text-neutral-600 font-bold uppercase tracking-tight">
              Asisten Dokumentasi Klinis AI
            </div>
          </div>
        </Link>

        {/* Navigation Items */}
        <nav className="flex items-center gap-1 sm:gap-2 font-mono text-xs font-bold" aria-label="Main Navigation">
          <Link
            to="/"
            activeOptions={{ exact: true }}
            className="px-3 py-1.5 border-2 border-transparent hover:border-black transition flex items-center gap-1.5 text-black [&.active]:bg-black [&.active]:text-white [&.active]:border-black"
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">Dashboard</span>
          </Link>

          <Link
            to="/register"
            className="px-3 py-1.5 border-2 border-transparent hover:border-black transition flex items-center gap-1.5 text-black [&.active]:bg-black [&.active]:text-white [&.active]:border-black"
          >
            <UserCheck size={14} />
            <span>Registrasi SATUSEHAT</span>
          </Link>

          <Link
            to="/login"
            className="px-3 py-1.5 border-2 border-transparent hover:border-black transition flex items-center gap-1.5 text-black [&.active]:bg-black [&.active]:text-white [&.active]:border-black"
          >
            <LogIn size={14} />
            <span>Login</span>
          </Link>

          <Link
            to="/consultation"
            className={`px-3 py-1.5 border-2 border-transparent hover:border-black transition flex items-center gap-1.5 text-black [&.active]:bg-black [&.active]:text-white [&.active]:border-black ${
              !isDoctorRegistered ? "opacity-60" : ""
            }`}
          >
            {!isDoctorRegistered ? <Lock size={12} /> : <Mic size={14} />}
            <span>Konsultasi Suara</span>
          </Link>

          <Link
            to="/report"
            className={`px-3 py-1.5 border-2 border-transparent hover:border-black transition flex items-center gap-1.5 text-black [&.active]:bg-black [&.active]:text-white [&.active]:border-black ${
              (!isDoctorRegistered || !hasPatientCases) ? "opacity-60" : ""
            }`}
          >
            {(!isDoctorRegistered || !hasPatientCases) ? <Lock size={12} /> : <FileText size={14} />}
            <span>Resume Medis</span>
          </Link>

          <Link
            to="/about"
            className="px-3 py-1.5 border-2 border-transparent hover:border-black transition flex items-center gap-1.5 text-black [&.active]:bg-black [&.active]:text-white [&.active]:border-black"
          >
            <ShieldCheck size={14} />
            <span className="hidden md:inline">Tentang</span>
          </Link>
        </nav>

        {/* Doctor Status Badge */}
        <div className="flex items-center gap-2 font-mono text-xs font-bold">
          {isDoctorRegistered && doctorProfile ? (
            <div className="flex items-center gap-2 p-1 pl-3 bg-neutral-100 border-2 border-black">
              <div className="text-right leading-tight hidden md:block">
                <div className="text-[11px] font-black text-black">{doctorProfile.name}</div>
                <div className="text-[9px] text-neutral-600">DPJP VERIFIED</div>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="p-1.5 bg-black text-white hover:bg-neutral-800 transition"
                title="Keluar"
              >
                <LogOut size={13} />
              </button>
            </div>
          ) : (
            <Link
              to="/register"
              className="px-3.5 py-1.5 bg-black text-white border-2 border-black uppercase hover:bg-neutral-800 transition flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <Stethoscope size={14} />
              <span>Verifikasi SATUSEHAT</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
