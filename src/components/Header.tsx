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
} from 'lucide-react'
import { useMedicalStore } from '../store/medical-store'

export default function Header() {
  const { doctorProfile } = useMedicalStore()

  return (
    <header className="topbar no-print">
      {/* Brand Logo */}
      <Link to="/" className="brand">
        <strong>
          MED-AI Atelier<sup>✦</sup>
        </strong>
        <em>Clinical 3D & AI Medical Assistant</em>
      </Link>

      {/* Main Multi-Page Navigation */}
      <nav className="main-nav" aria-label="Main Navigation">
        <Link
          to="/"
          activeOptions={{ exact: true }}
          activeProps={{ className: 'active' }}
        >
          <LayoutDashboard size={15} />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/register"
          activeProps={{ className: 'active' }}
        >
          <UserCheck size={15} />
          <span>Registrasi Dokter</span>
        </Link>
        <Link
          to="/consultation"
          activeProps={{ className: 'active' }}
        >
          <Mic size={15} />
          <span>Konsultasi AI</span>
        </Link>
        <Link
          to="/report"
          activeProps={{ className: 'active' }}
        >
          <FileText size={15} />
          <span>Medical Report</span>
        </Link>
        <Link
          to="/anatomy"
          activeProps={{ className: 'active' }}
        >
          <Box size={15} />
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
      <div className="flex items-center gap-3">
        <span className="gemastik-badge hidden md:inline-flex">
          <Activity size={13} />
          GEMASTIK 2026
        </span>
        <Link
          to="/register"
          className="flex items-center gap-2 p-1 pl-2.5 rounded-full bg-white/80 border border-[var(--line)] hover:border-[var(--terracotta)] transition shadow-xs group"
          title={doctorProfile ? `Dokter: ${doctorProfile.name} (${doctorProfile.specialization})` : "Daftar Akun Dokter"}
        >
          <div className="text-right hidden lg:block leading-tight pr-1">
            <div className="text-[11px] font-bold text-[var(--ink)] line-clamp-1 max-w-[140px]">
              {doctorProfile?.name || "Profil Dokter"}
            </div>
            <div className="text-[9px] font-medium text-[var(--terracotta)]">
              {doctorProfile ? `${doctorProfile.specialtyKey.toUpperCase()} DPJP` : "Registrasi"}
            </div>
          </div>
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-serif font-bold text-xs shadow-inner"
            style={{
              background: 'linear-gradient(140deg, #c46854, #efb59c)',
              border: '1px solid rgba(82,64,50,0.4)',
            }}
          >
            MD
          </div>
        </Link>
      </div>
    </header>
  )
}


