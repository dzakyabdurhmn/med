import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Mic,
  FileText,
  UserCheck,
  ShieldCheck,
  LogOut,
  Stethoscope,
  LogIn,
} from 'lucide-react'
import { useMedicalStore } from '../store/medical-store'
import { useLogoutWarningModal } from './LogoutWarningModal'

export default function Header() {
  const { doctorProfile, isDoctorRegistered, cases, setDoctorProfile } = useMedicalStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const { showLogoutWarning, Modal } = useLogoutWarningModal()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const loggedIn = isHydrated && isDoctorRegistered
  const hasPatientCases = cases.length > 0

  const handleLogout = () => {
    setDoctorProfile({
      id: '',
      name: '',
      specialization: '',
      specialtyKey: 'general',
      licenseNumber: '',
      institution: '',
      email: '',
      phone: '',
      isRegistered: false,
      registeredAt: '',
    })
    window.location.href = '/login'
  }

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Tampilkan modal peringatan logout
    showLogoutWarning(handleLogout, {
      userName: doctorProfile?.name || 'Dokter',
      isDoctor: true
    })
  }

  return (
    <>
      <header className="no-print bg-[#FAFAF5] border-b border-[#E5E1CE] sticky top-0 z-40 py-3">
        <div className="container-warm flex flex-wrap items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 group flex-shrink-0 no-underline">
            <div className="w-8 h-8 bg-[#A71D31] text-white font-semibold text-sm flex items-center justify-center rounded-[2px] shadow-none">
              N
            </div>
            <div>
              <div className="font-medium text-base text-[#191918] tracking-tight leading-none group-hover:text-[#9E1B2E] transition-colors flex items-center gap-1">
                NARASI <span className="text-[#A71D31] text-xs">✦</span>
              </div>
              <div className="text-[10px] text-[#6A6A64] font-normal uppercase tracking-wider mt-0.5">
                Asisten Dokumentasi Klinis AI
              </div>
            </div>
          </Link>

          {/* Navigation Items - Text Links, 24px gap, no underlines */}
          <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.05em]" aria-label="Navigasi Utama">
            {/* Beranda */}
            <Link
              to="/"
              activeOptions={{ exact: true }}
              className="flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline"
            >
              <LayoutDashboard size={14} />
              <span>Beranda</span>
            </Link>

            {/* Show only when NOT logged in */}
            {!loggedIn && (
              <>
                <Link
                  to="/about"
                  className="flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline"
                >
                  <ShieldCheck size={14} />
                  <span>Tentang</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline"
                >
                  <UserCheck size={14} />
                  <span>Registrasi</span>
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline"
                >
                  <LogIn size={14} />
                  <span>Masuk</span>
                </Link>
              </>
            )}

            {/* Show only when logged in */}
            {loggedIn && (
              <>
                <Link
                  to="/consultation"
                  className="flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline"
                >
                  <Mic size={14} />
                  <span>Konsultasi</span>
                </Link>

                <Link
                  to="/report"
                  className={`flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline ${
                    !hasPatientCases ? 'opacity-50 pointer-events-none' : ''
                  }`}
                >
                  <FileText size={14} />
                  <span>Resume</span>
                </Link>
              </>
            )}
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {loggedIn && doctorProfile ? (
              <div className="flex items-center gap-2.5 p-1 pl-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px]">
                <div className="text-right leading-tight hidden md:block">
                  <div className="text-xs font-medium text-[#191918]">{doctorProfile.name}</div>
                  <div className="text-[10px] uppercase text-[#0E7A41] tracking-wider font-normal">Tervalidasi</div>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="btn-warm btn-warm-outline btn-warm-sm px-2 text-[#C73737] hover:bg-[#FBEBEB] transition-colors"
                  title="Keluar dari akun"
                >
                  <LogOut size={13} />
                </button>
              </div>
            ) : (
              <Link
                to="/register"
                className="btn-warm btn-warm-primary btn-warm-sm"
              >
                <Stethoscope size={14} />
                <span>Verifikasi</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Modal Logout Warning */}
      <Modal />
    </>
  )
}