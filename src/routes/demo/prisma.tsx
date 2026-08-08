import { createFileRoute } from '@tanstack/react-router'
import { createServerFn } from '@tanstack/react-start'
import { prisma } from '#/db'
import { Activity, ShieldCheck, FileText } from 'lucide-react'

const getMedicalReports = createServerFn({
  method: 'GET',
}).handler(async () => {
  return await prisma.medicalReport.findMany({
    include: {
      patient: true,
      doctor: true,
      organHighlights: true,
    },
    orderBy: { createdAt: 'desc' },
  })
})

export const Route = createFileRoute('/demo/prisma')({
  component: DemoPrisma,
  loader: async () => await getMedicalReports(),
})

function DemoPrisma() {
  const reports = Route.useLoaderData()

  return (
    <main className="max-w-5xl mx-auto px-4 py-12 space-y-8">
      <header className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center font-bold">
          <Activity size={24} />
        </div>
        <div>
          <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
            Neon PostgreSQL + Prisma ORM
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Database Rekam Medis & Laporan Klinis</h1>
        </div>
      </header>

      <div className="grid gap-4">
        {reports.map((report) => (
          <div key={report.id} className="p-6 rounded-3xl bg-slate-950/70 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="text-sky-400" size={18} />
                <h3 className="font-bold text-white text-base">{report.title}</h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/30">
                  {report.reportNumber}
                </span>
              </div>
              <span className="text-xs px-3 py-1 rounded-xl font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                <ShieldCheck size={14} />
                {report.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Dokter Penanggung Jawab:</span>
                <span className="font-bold text-slate-100">{report.doctor?.name || 'dr. Adrian Santoso, Sp.JP'}</span>
                <span className="text-[11px] text-teal-400 block">{report.doctor?.specialization}</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
                <span className="text-slate-400 block">Pasien:</span>
                <span className="font-bold text-slate-100">{report.patient?.name || 'Budi Santoso'}</span>
                <span className="text-[11px] text-sky-400 block">Organ Terkait: {(report.primaryOrgan || 'heart').toUpperCase()}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 text-xs space-y-1">
              <span className="font-bold text-amber-300 uppercase tracking-wide">Diagnosis Klinis:</span>
              <p className="text-slate-200">{report.aiDiagnosis}</p>
            </div>

            {report.organHighlights && report.organHighlights.length > 0 && (
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  3D Organ Hotspot Highlights ({report.organHighlights.length} Titik Landmark):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {report.organHighlights.map((hl) => (
                    <div key={hl.id} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                      <div className="font-bold text-sky-300">{hl.label}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Severity: <span className="text-amber-400 font-semibold">{hl.severity}</span></div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  )
}
