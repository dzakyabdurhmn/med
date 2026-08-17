import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const year = new Date().getFullYear()
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-footer-column]',
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.12,
          scrollTrigger: {
            trigger: root,
            start: 'top 92%',
            once: true,
          },
        }
      )
      gsap.fromTo(
        '[data-footer-bar]',
        { autoAlpha: 0, y: 12 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          delay: 0.2,
          scrollTrigger: {
            trigger: root,
            start: 'top 92%',
            once: true,
          },
        }
      )
    }, root)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      ref={rootRef}
      className="no-print bg-[#FAFAF5] border-t border-[#E5E1CE] pt-24 pb-12 mt-28"
    >
      <div className="container-warm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-16 border-b border-[#E5E1CE]">
          {/* Brand Info Column */}
          <div data-footer-column className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 bg-[#A71D31] text-white font-semibold text-xs flex items-center justify-center rounded-[2px]">
                N
              </div>
              <span className="font-medium text-base text-[#191918] tracking-tight">
                NARASI ✦ MED-AI
              </span>
            </div>
            <p className="text-sm text-[#6A6A64] max-w-md leading-relaxed mb-4">
              Platform Asisten Dokumentasi Klinis berbasis AI untuk Layanan Kesehatan Indonesia.
            </p>
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.05em] text-[#9E1B2E] font-medium bg-[#FCEEEF] px-3 py-1 rounded-[2px] border border-[#F6D8DC]">
              GEMASTIK 2026 • Kategori Perangkat Lunak Kesehatan
            </div>
          </div>

          {/* Quick Links Column */}
          <div data-footer-column>
            <span className="eyebrow-warm mb-4">Navigasi Utama</span>
            <ul className="list-none p-0 m-0 space-y-2.5 text-xs uppercase tracking-[0.05em]">
              <li>
                <Link to="/" className="text-[#6A6A64] hover:text-[#191918] transition-colors no-underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-[#6A6A64] hover:text-[#191918] transition-colors no-underline">
                  Tentang &amp; Keamanan
                </Link>
              </li>
              <li>
                <Link to="/register" className="text-[#6A6A64] hover:text-[#191918] transition-colors no-underline">
                  Registrasi Dokter
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-[#6A6A64] hover:text-[#191918] transition-colors no-underline">
                  Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          {/* Standards & Compliance */}
          <div data-footer-column>
            <span className="eyebrow-warm mb-4">Standar &amp; Panduan</span>
            <ul className="list-none p-0 m-0 space-y-2.5 text-xs text-[#6A6A64]">
              <li>Standar SOAP Rekam Medis (Permenkes 24/2022)</li>
              <li>Klasifikasi Penyakit ICD-10 WHO</li>
              <li>Validasi Klinis AI (Gemini 2.5 Flash &amp; DeepSeek)</li>
              <li>Enkripsi Data Pasien End-to-End</li>
            </ul>
          </div>
        </div>

        {/* Legal & Copyright Bottom Bar */}
        <div
          data-footer-bar
          className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6A6A64]"
        >
          <p className="m-0">
            &copy; {year} Tim NARASI GEMASTIK 2026. Seluruh hak cipta dilindungi.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 uppercase tracking-[0.05em]">
            <span className="hidden sm:inline">•</span>
            <span>Kerahasiaan Medis Sesuai KODEKI</span>
            <span className="hidden sm:inline">•</span>
            <span>Inovasi Kesehatan AI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}