import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Mic,
  FileText,
  Box,
  UserCheck,
  ShieldCheck,
  Search,
  Activity,
  Lock,
  LogOut,
  Stethoscope,
} from 'lucide-react'
import { useMedicalStore } from '../store/medical-store'

export default function Header() {
  const { doctorProfile, isDoctorRegistered, cases, setDoctorProfile } = useMedicalStore()

  const hasPatientCases = cases.length > 0

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Apakah Anda yakin ingin keluar dari sesi dokter saat ini?")) {
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
      window.location.href = "/register";
    }
  };

  return (
    <header className="topbar no-print">
      {/* Brand Logo */}
      <Link to="/" className="brand">
        <strong>
          MED-AI Atelier<sup>✦</sup>
        </strong>
        <em>Clinical 3D & AI Medical Assistant</em>
      </Link>

      {/* Main Multi-Page Navigation with Role & Clinical Gating */}
      <nav className="main-nav" aria-label="Main Navigation">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: 'active' }}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
        </Link>

        {/* Step 1: Doctor Registration / Profile */}
        <Link
          to="/register"
          activeProps={{ className: 'active' }}
        >
          <UserCheck size={15} />
          <span>{isDoctorRegistered ? "Profil DPJP" : "Registrasi / Login"}</span>
        </Link>

        {/* Step 2: Consultation (Requires Registered Doctor) */}
        <Link
          to="/consultation"
          activeProps={{ className: 'active' }}
          className={!isDoctorRegistered ? "opacity-60 hover:opacity-100" : ""}
          title={!isDoctorRegistered ? "Memerlukan Registrasi / Login Dokter DPJP" : "Konsultasi Suara AI"}
        >
          {!isDoctorRegistered ? <Lock size={13} className="text-amber-500" /> : <Mic size={15} />}
          <span>Konsultasi AI</span>
        </Link>

        {/* Step 3: Medical Report (Requires Registered Doctor & Active Patient Case) */}
        <Link
          to="/report"
          activeProps={{ className: 'active' }}
          className={(!isDoctorRegistered || !hasPatientCases) ? "opacity-60 hover:opacity-100" : ""}
          title={
            !isDoctorRegistered
              ? "Memerlukan Registrasi / Login Dokter"
              : !hasPatientCases
              ? "Memerlukan Pasien / Indikasi Klinis"
              : "Lembar Rekam Medis (EHR)"
          }
        >
          {(!isDoctorRegistered || !hasPatientCases) ? (
            <Lock size={13} className="text-amber-500" />
          ) : (
            <FileText size={15} />
          )}
          <span>Medical Report</span>
        </Link>

        {/* Step 4: 3D Anatomy (Requires Registered Doctor & Active Patient Case Indication) */}
        <Link
          to="/anatomy"
          activeProps={{ className: 'active' }}
          className={(!isDoctorRegistered || !hasPatientCases) ? "opacity-60 hover:opacity-100" : ""}
          title={
            !isDoctorRegistered
              ? "Memerlukan Registrasi / Login Dokter"
              : !hasPatientCases
              ? "Memerlukan Indikasi Patologi Pasien"
              : "Stasiun Rekonstruksi 3D"
          }
        >
          {(!isDoctorRegistered || !hasPatientCases) ? (
            <Lock size={13} className="text-amber-500" />
          ) : (
            <Box size={15} />
          )}
          <span>3D Anatomy</span>
        </Link>

        <Link
          to="/about"
          activeProps={{ className: 'active' }}
        >
          <ShieldCheck size={15} />
          <span>Tentang</span>
        </Link>
      </nav>

      {/* Search Box */}
      <div className="search-box">
        <Search size={15} />
        <input
          type="search"
          placeholder="Cari pasien, organ, ICD-10..."
          aria-label="Cari pasien, organ, ICD-10"
        />
      </div>

      {/* Doctor Profile & GEMASTIK Badge */}
      <div className="flex items-center gap-2.5">
        <span className="gemastik-badge hidden xl:inline-flex">
          <Activity size={13} />
          GEMASTIK 2026
        </span>

        {isDoctorRegistered && doctorProfile ? (
          <div className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white/90 border border-[var(--line)] shadow-xs">
            <Link
              to="/register"
              className="text-right hidden md:block leading-tight pr-1 hover:opacity-80 transition"
              title={`DPJP Aktif: ${doctorProfile.name}`}
            >
              <div className="text-[11px] font-bold text-[var(--ink)] line-clamp-1 max-w-[130px]">
                {doctorProfile.name}
              </div>
              <div className="text-[9px] font-medium text-[var(--terracotta)]">
                {doctorProfile.specialtyKey.toUpperCase()} • {doctorProfile.licenseNumber.split("/")[0] || "SIP Aktif"}
              </div>
            </Link>

            <Link
              to="/register"
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs shadow-inner"
              style={{
                background: 'linear-gradient(140deg, #c46854, #efb59c)',
                border: '1px solid rgba(82,64,50,0.4)',
              }}
              title="Pengaturan Profil Dokter"
            >
              DPJP
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-neutral-400 hover:text-red-600 transition rounded-full hover:bg-neutral-100"
              title="Keluar / Ganti Dokter"
            >
              <LogOut size={13} />
            </button>
          </div>
        ) : (
          <Link
            to="/register"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[var(--terracotta)] text-white text-xs font-serif font-bold hover:bg-[#d95d4b] transition shadow-xs"
          >
            <Stethoscope size={13} />
            <span>Login / Registrasi DPJP</span>
          </Link>
        )}
      </div>
    </header>
  )
}
