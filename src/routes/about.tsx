import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Activity,
  ShieldCheck,
  Zap,
  Box,
  ArrowRight,
  Sparkles,
  Cpu,
  Database,
  Globe,
  Code2,
  Layers,
  Brain,
} from 'lucide-react'

export const Route = createFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 py-8 space-y-8 font-sans">
      {/* Hero Banner */}
      <section className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 font-mono text-xs font-bold bg-black text-white uppercase tracking-widest mx-auto">
          <Sparkles size={14} className="animate-pulse" />
          <span>Karya Inovasi GEMASTIK 2026</span>
        </div>

        <div className="space-y-3">
          <h1 className="text-3xl sm:text-5xl font-black text-black uppercase tracking-tight leading-tight">
            MED-AI 3D Anatomy Atelier
          </h1>
          <p className="text-sm sm:text-base font-medium text-neutral-700 italic">
            "Menghubungkan Catatan Medis Klinis dengan Pemahaman Spasial 3D Berbasis AI"
          </p>
        </div>

        <p className="text-xs sm:text-sm text-neutral-700 font-medium max-w-3xl mx-auto leading-relaxed">
          Platform interaktif berestetika atelier yang mengintegrasikan penalaran Large Language Model (NVIDIA DeepSeek)
          dengan simulasi 3D real-time WebGL (Three.js) untuk menjembatani komunikasi antara dokter dan pasien.
        </p>
      </section>

      {/* 3 Core Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 hover:bg-neutral-50 transition">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black">
            <Zap size={24} />
          </div>
          <h3 className="text-lg font-black uppercase text-black">NVIDIA AI Reasoning Engine</h3>
          <p className="text-xs font-sans text-neutral-700 font-medium leading-relaxed">
            Mengekstrak temuan klinis, derajat keparahan (severity), diagnosis banding, dan penjelasan awam dari
            catatan mentah radiologi / resume medis secara otomatis dan terstruktur.
          </p>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 hover:bg-neutral-50 transition">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black">
            <Box size={24} />
          </div>
          <h3 className="text-lg font-black uppercase text-black">Interactive 3D WebGL (Three.js)</h3>
          <p className="text-xs font-sans text-neutral-700 font-medium leading-relaxed">
            9 sistem organ biologis lengkap dengan depth prepass, clipping plane cross-section, dynamic lighting,
            dan highlight landmark patologi beranimasi.
          </p>
        </div>

        <div className="bg-white border-2 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-3 hover:bg-neutral-50 transition">
          <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black">
            <ShieldCheck size={24} />
          </div>
          <h3 className="text-lg font-black uppercase text-black">Human-In-The-Loop Verification</h3>
          <p className="text-xs font-sans text-neutral-700 font-medium leading-relaxed">
            Menjamin keamanan klinis dengan alur verifikasi dan tanda tangan digital dokter spesialis sebelum hasil resume
            dipublikasikan kepada pasien (kepatuhan UU PDP No. 27/2022).
          </p>
        </div>
      </section>

      {/* System Architecture Details */}
      <section className="bg-white border-2 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] space-y-6">
        <div className="flex items-center gap-3 border-b-2 border-black pb-4">
          <div className="w-10 h-10 bg-black text-white flex items-center justify-center shrink-0">
            <Code2 size={20} />
          </div>
          <h2 className="text-2xl font-black uppercase text-black">Arsitektur & Spesifikasi Teknis</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Frontend */}
          <div className="border-2 border-black p-5 space-y-3 bg-neutral-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                <Globe size={16} />
              </div>
              <h4 className="font-black uppercase text-sm text-black">Frontend & Visualisasi 3D</h4>
            </div>
            <ul className="space-y-2 text-xs font-sans font-medium text-neutral-700 list-disc pl-5">
              <li>
                <span className="font-bold text-black">Framework:</span> TanStack Start (Full-stack React) &amp; TanStack Router
              </li>
              <li>
                <span className="font-bold text-black">3D Engine:</span> Three.js WebGL Renderer, OrbitControls, GLTFLoader dengan Draco &amp; Meshopt
              </li>
              <li>
                <span className="font-bold text-black">Desain:</span> NARASI Design System — Brutalist &amp; Monospace Aesthetic
              </li>
              <li>
                <span className="font-bold text-black">Animasi:</span> Native CSS + React transitions untuk performa optimal
              </li>
            </ul>
          </div>

          {/* Backend */}
          <div className="border-2 border-black p-5 space-y-3 bg-neutral-50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
                <Database size={16} />
              </div>
              <h4 className="font-black uppercase text-sm text-black">Backend, AI &amp; Database</h4>
            </div>
            <ul className="space-y-2 text-xs font-sans font-medium text-neutral-700 list-disc pl-5">
              <li>
                <span className="font-bold text-black">AI Engine:</span> NVIDIA OpenAI-compatible API (DeepSeek-V4 Pro)
              </li>
              <li>
                <span className="font-bold text-black">Database ORM:</span> Prisma Client dengan PostgreSQL / SQLite
              </li>
              <li>
                <span className="font-bold text-black">Keamanan Data:</span> Sesuai UU Perlindungan Data Pribadi No. 27/2022 &amp; Standar Rekam Medis
              </li>
              <li>
                <span className="font-bold text-black">Validasi Input:</span> Zod Type-safe Validation Schemas
              </li>
            </ul>
          </div>
        </div>

        {/* Additional Tech Stack Row */}
        <div className="border-2 border-black p-5 bg-white space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black text-white flex items-center justify-center shrink-0">
              <Layers size={16} />
            </div>
            <h4 className="font-black uppercase text-sm text-black">Tech Stack Overview</h4>
          </div>
          <div className="flex flex-wrap gap-2">
            {['React', 'TypeScript', 'Tailwind CSS', 'Three.js', 'Prisma', 'PostgreSQL', 'Zod', 'TanStack Router'].map((tech) => (
              <span
                key={tech}
                className="px-3 py-1.5 border-2 border-black text-xs font-mono font-bold bg-white text-black"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t-2 border-black pt-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold">
            <Brain size={16} className="text-black" />
            <span className="uppercase text-black">AI-Powered Medical Documentation</span>
          </div>
          <Link
            to="/"
            className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-mono font-bold text-xs uppercase tracking-wider transition shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] flex items-center gap-2 cursor-pointer"
          >
            <span>Buka 3D Atelier &amp; Visualizer</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer Note */}
      <div className="text-center text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-widest border-t-2 border-black pt-6">
        <span>NARASI — Asisten Dokumentasi Klinis AI • GEMASTIK 2026</span>
      </div>
    </main>
  )
}