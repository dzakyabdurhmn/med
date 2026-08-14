import { Link } from '@tanstack/react-router'
import { FileQuestion, Home, MessageSquare, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="container-warm section-warm min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="card-warm p-8 sm:p-12 max-w-xl w-full text-center space-y-6">
        {/* Specimen / 404 Badge */}
        <div className="w-16 h-16 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center mx-auto">
          <FileQuestion className="w-8 h-8" />
        </div>

        {/* Header */}
        <div className="space-y-2">
          <span className="badge-warm badge-warm-brand mx-auto">
            Error 404 — Specimen Uncharted
          </span>
          <h1 className="text-3xl sm:text-4xl font-medium text-[#191918]">
            Halaman Tidak Ditemukan
          </h1>
          <p className="text-sm text-[#6A6A64] italic">
            "Halaman atau rujukan spesimen klinis yang Anda cari tidak terdaftar."
          </p>
        </div>

        {/* Message */}
        <p className="text-xs text-[#474744] leading-relaxed max-w-md mx-auto">
          Tautan yang Anda ikuti mungkin tidak valid, atau halaman telah dipindahkan di dalam sistem NARASI.
        </p>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="btn-warm btn-warm-primary btn-warm-base w-full sm:w-auto"
          >
            <Home className="w-4 h-4" />
            <span>Kembali ke Beranda</span>
          </Link>

          <Link
            to="/consultation"
            className="btn-warm btn-warm-outline btn-warm-base w-full sm:w-auto"
          >
            <MessageSquare className="w-4 h-4 text-[#9E1B2E]" />
            <span>Konsultasi AI</span>
          </Link>
        </div>

        {/* Quick Links */}
        <div className="pt-6 border-t border-[#ECEBDF] flex items-center justify-center gap-6 text-xs text-[#6A6A64]">
          <Link to="/consultation" className="text-[#6A6A64] hover:text-[#191918] transition-colors flex items-center gap-1.5 no-underline">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Konsultasi AI</span>
          </Link>
          <span>•</span>
          <Link to="/report" className="text-[#6A6A64] hover:text-[#191918] transition-colors flex items-center gap-1.5 no-underline">
            <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
            <span>Resume Medis</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
