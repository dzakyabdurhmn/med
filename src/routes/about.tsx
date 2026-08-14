import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  FileText,
  Stethoscope,
  BookOpen,
  Award,
  UserCheck,
  Activity,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: AboutPage,
})

function AboutPage() {
  return (
    <main className="container-warm section-warm space-y-12">
      {/* Hero Banner */}
      <section className="card-warm p-8 space-y-6 text-center max-w-4xl mx-auto">
        <div className="badge-warm badge-warm-brand mx-auto">
          <Sparkles size={13} className="text-[#9E1B2E]" />
          <span>Karya Inovasi Klinis GEMASTIK 2026</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-medium text-[#191918] tracking-tight leading-tight">
            Metodologi Klinis &amp; Landasan Akademik NARASI
          </h1>
          <p className="text-base text-[#6A6A64] italic">
            "Standardisasi Dokumentasi Rekam Medis Elektronik &amp; Analisis Konsultasi Dokter-Pasien"
          </p>
        </div>

        <p className="text-sm text-[#474744] leading-relaxed max-w-2xl mx-auto">
          NARASI dirancang sebagai sistem pendukung keputusan klinis (*Clinical Decision Support System*) dan dokumentasi rekam medis otomatis yang memadukan analisis percakapan klinis Bahasa Indonesia dengan standar pelayanan kesehatan Kemenkes RI.
        </p>
      </section>

      {/* 3 Core Clinical Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card-warm p-6 space-y-4">
          <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center">
            <Stethoscope size={20} />
          </div>
          <h3 className="text-lg font-medium text-[#191918]">Metodologi SOAP &amp; Triase Klinis</h3>
          <p className="text-xs text-[#474744] leading-relaxed">
            Penataan catatan medis terstruktur berdasarkan format Subjektif, Objektif, Asesmen, dan Plan (SOAP) serta klasifikasi derajat keparahan kondisi pasien secara sistematis.
          </p>
        </div>

        <div className="card-warm p-6 space-y-4">
          <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center">
            <BookOpen size={20} />
          </div>
          <h3 className="text-lg font-medium text-[#191918]">Kodifikasi ICD-10 WHO</h3>
          <p className="text-xs text-[#474744] leading-relaxed">
            Penyajian rekomendasi kode diagnosis internasional (ICD-10) berbasis bukti percakapan untuk mendukung ketepatan klasifikasi penyakit dan efisiensi Resume Medis.
          </p>
        </div>

        <div className="card-warm p-6 space-y-4">
          <div className="w-10 h-10 bg-[#FCEEEF] text-[#9E1B2E] border border-[#F6D8DC] rounded-[2px] flex items-center justify-center">
            <ShieldCheck size={20} />
          </div>
          <h3 className="text-lg font-medium text-[#191918]">Etika &amp; Kerahasiaan KODEKI</h3>
          <p className="text-xs text-[#474744] leading-relaxed">
            Perlindungan privasi data medis pasien sesuai UU Perlindungan Data Pribadi No. 27/2022 dan Permenkes No. 24/2022 tentang Rekam Medis Elektronik.
          </p>
        </div>
      </section>

      {/* Clinical Governance Section */}
      <section className="card-warm p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-[#ECEBDF] pb-4">
          <div className="w-10 h-10 bg-[#F3F2E7] text-[#191918] border border-[#E3E2D8] rounded-[2px] flex items-center justify-center shrink-0">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#191918]">Standar Mutu &amp; Keamanan Layanan Klinis</h2>
            <p className="text-xs text-[#6A6A64]">Prinsip tata kelola medis dalam proses dokumentasi rekam medis pasien</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Clinical Verification Card */}
          <div className="p-5 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] space-y-3">
            <div className="flex items-center gap-2">
              <UserCheck size={18} className="text-[#9E1B2E]" />
              <h4 className="font-medium text-sm text-[#191918]">Verifikasi Dokter DPJP (Human-in-the-Loop)</h4>
            </div>
            <p className="text-xs text-[#474744] leading-relaxed">
              Sistem bersifat sebagai asisten yang memberikan usulan temuan klinis. Keputusan diagnosis akhir, penulisan resep, dan pengesahan dokumen sepenuhnya berada di bawah otoritas klinis Dokter DPJP.
            </p>
          </div>

          {/* Evidence Linking Card */}
          <div className="p-5 bg-[#F3F2E7] border border-[#E3E2D8] rounded-[2px] space-y-3">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#9E1B2E]" />
              <h4 className="font-medium text-sm text-[#191918]">Jejak Bukti Transkripsi Klinis</h4>
            </div>
            <p className="text-xs text-[#474744] leading-relaxed">
              Setiap kandidat kode ICD-10 dan temuan SOAP yang dihasilkan terhubung langsung dengan bukti ucapan dalam konsultasi, menjamin transparansi dan kemudahan audit rekam medis.
            </p>
          </div>
        </div>

        {/* Standards Grid */}
        <div className="p-5 bg-[#FFFEF2] border border-[#ECEBDF] rounded-[2px] space-y-3">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-[#9E1B2E]" />
            <h4 className="font-medium text-sm text-[#191918]">Acuan Regulasi &amp; Pedoman Klinis Nasional</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              'Permenkes RI No. 24/2022 (Rekam Medis)',
              'UU Pelindungan Data Pribadi No. 27/2022',
              'Klasifikasi Penyakit ICD-10 WHO',
              'Kode Etik Kedokteran Indonesia (KODEKI)',
              'Standar Resume Medis Pelayanan Kesehatan',
            ].map((std) => (
              <span
                key={std}
                className="badge-warm badge-warm-brand"
              >
                {std}
              </span>
            ))}
          </div>
        </div>

        {/* Footer CTA inside Card */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECEBDF] pt-4">
          <div className="flex items-center gap-2 text-xs text-[#6A6A64]">
            <Stethoscope size={16} className="text-[#9E1B2E]" />
            <span className="uppercase tracking-wider">Dokumentasi Klinis Berstandar Kemenkes RI</span>
          </div>
          <Link
            to="/consultation"
            className="btn-warm btn-warm-primary btn-warm-base"
          >
            <span>Mulai Konsultasi Medis</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}