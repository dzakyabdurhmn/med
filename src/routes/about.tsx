import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Activity,
  ShieldCheck,
  Zap,
  Box,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-10">
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold bg-[rgba(118,157,116,0.15)] text-[#3b6b39] border border-[rgba(118,157,116,0.3)]">
          <Activity size={14} className="text-[#3b6b39]" />
          <span>Karya Inovasi GEMASTIK 2026 — Divisi Pengembangan Perangkat Lunak</span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-serif font-bold text-[var(--ink)] tracking-tight">
          MED-AI 3D Anatomy Atelier
        </h1>
        <em className="block text-lg font-hand text-[var(--lavender)]">
          Menghubungkan Catatan Medis Klinis dengan Pemahaman Spasial 3D Berbasis AI
        </em>
        <p className="text-[var(--ink-soft)] text-sm sm:text-base font-serif leading-relaxed pt-2">
          Platform interaktif berestetika atelier yang mengintegrasikan penalaran Large Language Model (NVIDIA DeepSeek)
          dengan simulasi 3D real-time WebGL (Three.js) untuk menjembatani komunikasi antara dokter dan pasien.
        </p>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 rounded-[26px] bg-[var(--paper)] border border-[var(--line)] shadow-[var(--shadow)] space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--coral-light)] text-[var(--coral)] flex items-center justify-center font-bold">
            <Zap size={22} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[var(--ink)]">NVIDIA AI Reasoning Engine</h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed font-serif">
            Mengekstrak temuan klinis, derajat keparahan (severity), diagnosis banding, dan penjelasan awam dari
            catatan mentah radiologi / resume medis secara otomatis dan terstruktur.
          </p>
        </div>

        <div className="p-7 rounded-[26px] bg-[var(--paper)] border border-[var(--line)] shadow-[var(--shadow)] space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--sage-light)] text-[var(--sage)] flex items-center justify-center font-bold">
            <Box size={22} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[var(--ink)]">Interactive 3D WebGL (Three.js)</h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed font-serif">
            9 sistem organ biologis lengkap dengan depth prepass, clipping plane cross-section, dynamic lighting,
            dan highlight landmark patologi beranimasi.
          </p>
        </div>

        <div className="p-7 rounded-[26px] bg-[var(--paper)] border border-[var(--line)] shadow-[var(--shadow)] space-y-3">
          <div className="w-11 h-11 rounded-2xl bg-[var(--lavender-light)] text-[var(--lavender)] flex items-center justify-center font-bold">
            <ShieldCheck size={22} />
          </div>
          <h3 className="text-xl font-serif font-bold text-[var(--ink)]">Human-In-The-Loop Verification</h3>
          <p className="text-xs text-[var(--muted)] leading-relaxed font-serif">
            Menjamin keamanan klinis dengan alur verifikasi dan tanda tangan digital dokter spesialis sebelum hasil resume
            dipublikasikan kepada pasien (kepatuhan UU PDP No. 27/2022).
          </p>
        </div>
      </section>

      {/* System Architecture Details */}
      <section className="p-8 md:p-10 rounded-[30px] bg-[var(--paper)] border border-[var(--line)] shadow-[var(--shadow)] space-y-6">
        <div className="flex items-center gap-3 border-b border-[var(--line)] pb-4">
          <Sparkles className="text-[var(--coral)]" size={22} />
          <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">Arsitektur & Spesifikasi Teknis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--coral)]" />
              Frontend & Visualisasi 3D
            </h4>
            <ul className="space-y-2 text-xs text-[var(--ink-soft)] font-serif list-disc pl-5">
              <li><strong>Framework:</strong> TanStack Start (Full-stack React) & TanStack Router</li>
              <li><strong>3D Engine:</strong> Three.js WebGL Renderer, OrbitControls, GLTFLoader dengan Draco & Meshopt</li>
              <li><strong>Desain:</strong> Cream Atelier Design System dengan tipografi Cormorant Garamond & DM Sans</li>
              <li><strong>Animasi:</strong> GSAP (GreenSock) untuk transisi halus antar spesimen organ</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="font-serif font-bold text-base text-[var(--ink)] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[var(--sage)]" />
              Backend, AI & Database
            </h4>
            <ul className="space-y-2 text-xs text-[var(--ink-soft)] font-serif list-disc pl-5">
              <li><strong>AI Engine:</strong> NVIDIA OpenAI-compatible API (`deepseek-ai/deepseek-v4-pro`)</li>
              <li><strong>Database ORM:</strong> Prisma Client dengan SQLite / PostgreSQL</li>
              <li><strong>Keamanan Data:</strong> Sesuai UU Perlindungan Data Pribadi No. 27/2022 & Standar Rekam Medis</li>
              <li><strong>Validasi Input:</strong> Zod Type-safe Validation Schemas</li>
            </ul>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Link
            to="/"
            className="lesson-button inline-flex items-center gap-2 max-w-xs text-center"
          >
            <span>Buka 3D Atelier & Visualizer</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </main>
  )
}
