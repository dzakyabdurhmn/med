"use client";

import { useState } from "react";
import {
  organs,
  organById,
  type OrganId,
  getSeverityColor,
} from "../../lib/anatomy-data";
import { OrganViewer } from "./OrganViewer";
import {
  Activity,
  Heart,
  Brain,
  Eye,
  Stethoscope,
  CheckCircle2,
  Info,
  Layers,
  Sparkles,
} from "lucide-react";

export type ClinicalFindingItem = {
  id: string;
  organId: OrganId;
  hotspotId?: string;
  title: string;
  description: string;
  severity: "NORMAL" | "MILD" | "MODERATE" | "SEVERE" | "CRITICAL";
  laymanExplanation?: string;
};

type Props = {
  initialOrganId?: OrganId;
  findings?: ClinicalFindingItem[];
  reportTitle?: string;
  isVerified?: boolean;
};

export function AnatomyViewerWithReport({
  initialOrganId = "heart",
  findings = [],
  reportTitle,
  isVerified = false,
}: Props) {
  const [selectedOrganId, setSelectedOrganId] = useState<OrganId>(initialOrganId);
  const [selectedHotspotId, setSelectedHotspotId] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);

  const activeOrgan = organById[selectedOrganId] || organs[0];
  const organFindings = findings.filter((f) => f.organId === selectedOrganId);

  const getOrganIcon = (id: OrganId) => {
    switch (id) {
      case "heart":
        return Heart;
      case "brain":
        return Brain;
      case "eyeball":
        return Eye;
      default:
        return Activity;
    }
  };

  return (
    <div className="w-full rounded-3xl bg-slate-950/70 border border-slate-800/80 p-5 md:p-7 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide uppercase bg-sky-500/10 text-sky-400 border border-sky-500/30">
              Interactive 3D Biomechanic Visualizer
            </span>
            {isVerified && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 size={12} /> Dokter Terverifikasi
              </span>
            )}
          </div>
          <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Stethoscope className="text-sky-400" size={24} />
            {reportTitle || `Visualisasi Anatomi 3D: ${activeOrgan.name}`}
          </h3>
          <p className="text-sm text-slate-400 mt-0.5">
            Interaksi visual 3D untuk memetakan hasil diagnosis klinis dan temuan patologis secara presisi.
          </p>
        </div>

        {/* Organ Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
          {organs.map((org) => {
            const Icon = getOrganIcon(org.id);
            const isSelected = org.id === selectedOrganId;
            const hasFindings = findings.some((f) => f.organId === org.id);
            return (
              <button
                key={org.id}
                type="button"
                onClick={() => {
                  setSelectedOrganId(org.id);
                  setSelectedHotspotId(null);
                }}
                className={`relative px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap transition flex items-center gap-2 ${
                  isSelected
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/25 border border-sky-400"
                    : "bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
                }`}
              >
                <Icon size={14} className={isSelected ? "text-white" : "text-sky-400"} />
                <span>{org.name}</span>
                {hasFindings && (
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isSelected ? "bg-amber-300 ring-2 ring-white/40" : "bg-amber-400 animate-pulse"
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid Content: 3D Canvas + Clinical Findings Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 3D WebGL Canvas */}
        <div className="lg:col-span-8">
          <OrganViewer
            organ={activeOrgan}
            autoRotate={autoRotate}
            onAutoRotate={setAutoRotate}
            selectedHotspotId={selectedHotspotId}
            onSelectHotspot={(hotspot) => setSelectedHotspotId(hotspot?.id ?? null)}
          />
        </div>

        {/* Clinical Landmark & Findings Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* Quick Stats / Info Card */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Info size={14} className="text-sky-400" /> Profil Organ
              </span>
              <span className="text-slate-500">{activeOrgan.system}</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">{activeOrgan.description}</p>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Vaskularisasi</span>
                <span className="text-slate-200 font-medium line-clamp-1" title={activeOrgan.bloodSupply}>
                  {activeOrgan.bloodSupply}
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-slate-500 block">Lokasi Anatomis</span>
                <span className="text-slate-200 font-medium line-clamp-1" title={activeOrgan.location}>
                  {activeOrgan.location}
                </span>
              </div>
            </div>
          </div>

          {/* Landmark Hotspots List */}
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 shadow-md space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Layers size={14} className="text-sky-400" /> Landmark & Highlight Temuan
              </span>
              <span className="text-[11px] text-sky-400 font-normal">
                {activeOrgan.hotspots.length} titik aktif
              </span>
            </h4>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1 no-scrollbar">
              {activeOrgan.hotspots.map((hotspot) => {
                const isSelected = selectedHotspotId === hotspot.id;
                const finding = organFindings.find((f) => f.hotspotId === hotspot.id);
                return (
                  <button
                    key={hotspot.id}
                    type="button"
                    onClick={() => {
                      const nextId = isSelected ? null : hotspot.id;
                      setSelectedHotspotId(nextId);
                      if (nextId) setAutoRotate(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border transition flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-sky-500/15 border-sky-400/80 shadow-md ring-1 ring-sky-400/50"
                        : "bg-slate-950/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full mt-0.5 shrink-0"
                      style={{
                        backgroundColor: finding ? getSeverityColor(finding.severity) : hotspot.color,
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-slate-200 truncate">{hotspot.label}</span>
                        {finding && (
                          <span
                            className="px-1.5 py-0.2 text-[10px] rounded font-semibold uppercase shrink-0"
                            style={{
                              color: getSeverityColor(finding.severity),
                              backgroundColor: `${getSeverityColor(finding.severity)}18`,
                            }}
                          >
                            {finding.severity}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                        {finding ? finding.title : hotspot.detail}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Layman AI Explanation Note */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-sky-950/40 to-slate-900/60 border border-sky-500/20 text-xs text-sky-200">
            <div className="flex items-center gap-1.5 font-semibold text-sky-300 mb-1">
              <Sparkles size={14} /> Penjelasan Awam AI
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Titik berwarna menunjukkan posisi struktur anatomis. Klik pada titik atau daftar untuk memusatkan kamera
              dan membaca laporan medis terperinci.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
