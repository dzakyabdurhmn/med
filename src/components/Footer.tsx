export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="app-footer no-print max-w-[1720px] mx-auto mt-16 border-t border-[var(--line)] px-4 py-8 text-[var(--muted)]">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-serif font-semibold text-sm text-[var(--ink)]">
            MED-AI 3D Anatomy Atelier
          </span>
          <span>•</span>
          <span>Inovasi AI & Visualisasi 3D Interaktif untuk GEMASTIK 2026</span>
        </div>
        <p className="m-0 font-serif italic text-xs">
          &copy; {year} Tim GEMASTIK 2026 — Validated with DeepSeek R1 & Medical Guidelines
        </p>
      </div>
    </footer>
  )
}

