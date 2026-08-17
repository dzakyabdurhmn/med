import { useState, useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { gsap } from 'gsap'
import {
  LayoutDashboard,
  Mic,
  FileText,
  UserCheck,
  ShieldCheck,
  LogOut,
  LogIn,
  Menu,
  X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useMedicalStore } from '../store/medical-store'
import { useLogoutWarningModal } from './LogoutWarningModal'

interface NavItem {
  to: '/' | '/about' | '/register' | '/login' | '/consultation' | '/report'
  label: string
  icon: LucideIcon
  exact?: boolean
  disabled?: boolean
}

export default function Header() {
  const { doctorProfile, isDoctorRegistered, cases, clearDoctorSession } = useMedicalStore()
  const [isHydrated, setIsHydrated] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const { showLogoutWarning, Modal } = useLogoutWarningModal()

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  const loggedIn = isHydrated && isDoctorRegistered
  const hasPatientCases = cases.length > 0

  const handleLogout = () => {
    clearDoctorSession()
    window.location.href = '/login'
  }

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    // Tampilkan modal peringatan logout
    showLogoutWarning(handleLogout, {
      userName: doctorProfile?.name || 'Dokter',
      isDoctor: true,
    })
  }

  // GSAP animation for the mobile menu panel
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return

    if (isMenuOpen) {
      const ctx = gsap.context(() => {
        gsap.set(panel, { autoAlpha: 1, y: 0 })
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: -16 },
          { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' }
        )
        gsap.fromTo(
          panel.querySelectorAll('[data-menu-link]'),
          { autoAlpha: 0, x: -16 },
          {
            autoAlpha: 1,
            x: 0,
            duration: 0.28,
            ease: 'power2.out',
            stagger: 0.07,
            delay: 0.08,
          }
        )
      }, panel)
      return () => ctx.revert()
    }

    const tl = gsap.timeline({
      onComplete: () => gsap.set(panel, { visibility: 'hidden' }),
    })
    tl.to(panel, { autoAlpha: 0, y: -16, duration: 0.22, ease: 'power2.in' })
    return () => {
      tl.kill()
    }
  }, [isMenuOpen])

  // Close the menu with Escape
  useEffect(() => {
    if (!isMenuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMenuOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isMenuOpen])

  const loggedOutItems: NavItem[] = [
    { to: '/', label: 'Beranda', icon: LayoutDashboard, exact: true },
    { to: '/about', label: 'Tentang', icon: ShieldCheck },
    { to: '/register', label: 'Registrasi', icon: UserCheck },
    { to: '/login', label: 'Masuk', icon: LogIn },
  ]

  const loggedInItems: NavItem[] = [
    { to: '/', label: 'Beranda', icon: LayoutDashboard, exact: true },
    { to: '/consultation', label: 'Konsultasi', icon: Mic },
    {
      to: '/report',
      label: 'Resume',
      icon: FileText,
      disabled: !hasPatientCases,
    },
  ]

  const navItems = loggedIn ? loggedInItems : loggedOutItems

  const linkClass = ({ disabled }: NavItem) =>
    `flex items-center gap-1.5 text-[#6A6A64] hover:text-[#191918] transition-colors [&.active]:text-[#9E1B2E] [&.active]:font-medium no-underline ${
      disabled ? 'opacity-50 pointer-events-none' : ''
    }`

  return (
    <>
      <header className="no-print bg-[#FAFAF5] border-b border-[#E5E1CE] sticky top-0 z-40 py-3">
        <div className="container-warm flex items-center justify-between gap-4">
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

          {/* Desktop Navigation Items - hidden on mobile */}
          <nav
            className="hidden lg:flex items-center gap-6 text-xs uppercase tracking-[0.05em]"
            aria-label="Navigasi Utama"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={item.exact ? { exact: true } : undefined}
                className={linkClass(item)}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Action Button - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-3 flex-shrink-0">
            {loggedIn && doctorProfile ? (
              <div className="flex items-center gap-2.5 p-1 pl-3 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px]">
                <div className="text-right leading-tight hidden md:block">
                  <div className="text-xs font-medium text-[#191918]">{doctorProfile.name}</div>
                  <div className="text-[10px] uppercase text-[#0E7A41] tracking-wider font-normal">
                    Tervalidasi
                  </div>
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
              <Link to="/login" className="btn-warm btn-warm-primary btn-warm-sm">
                <LogIn size={14} />
                <span>Login</span>
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((v) => !v)}
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            className="lg:hidden flex items-center justify-center w-9 h-9 text-[#191918] bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] hover:bg-[#F4F4EB] transition-colors"
          >
            {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Mobile Menu Panel - GSAP animated */}
        <div
          id="mobile-nav-panel"
          ref={panelRef}
          className="lg:hidden container-warm pb-4 pt-1"
          style={{ visibility: 'hidden' }}
        >
          <nav aria-label="Navigasi Utama" className="flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                data-menu-link
                activeOptions={item.exact ? { exact: true } : undefined}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-2.5 py-2.5 px-2 text-xs uppercase tracking-[0.05em] text-[#6A6A64] hover:text-[#191918] hover:bg-[#F4F4EB] transition-colors no-underline ${
                  item.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                <item.icon size={14} />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-3 pt-4 border-t border-[#E5E1CE]">
            {loggedIn && doctorProfile ? (
              <div className="flex items-center justify-between gap-3">
                <div className="leading-tight min-w-0">
                  <div className="text-xs font-medium text-[#191918] truncate">
                    {doctorProfile.name}
                  </div>
                  <div className="text-[10px] uppercase text-[#0E7A41] tracking-wider font-normal">
                    Tervalidasi
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogoutClick}
                  className="btn-warm btn-warm-outline btn-warm-sm px-3 text-[#C73737] hover:bg-[#FBEBEB] transition-colors"
                  title="Keluar dari akun"
                >
                  <LogOut size={13} />
                  <span>Keluar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="btn-warm btn-warm-primary btn-warm-sm w-full"
              >
                <LogIn size={14} />
                <span>Login</span>
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