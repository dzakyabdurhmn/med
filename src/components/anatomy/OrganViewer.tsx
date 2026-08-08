"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  Layers3,
  Maximize2,
  Minimize2,
  RotateCcw,
  ScanLine,
  Plus,
  Minus,
  Zap,
  Crosshair,
  Loader2,
  Flame,
} from "lucide-react";
import type { Hotspot, Organ } from "../../lib/anatomy-data";
import type { AnatomyViewer } from "../../lib/three/viewer";
import { type PathologyType, PATHOLOGY_PRESETS } from "../../lib/three/pathology-mutator";

type Props = {
  organ: Organ;
  autoRotate?: boolean;
  onAutoRotate?: (enabled: boolean) => void;
  selectedHotspotId?: string | null;
  onSelectHotspot?: (hotspot: Hotspot | null) => void;
  symptomMode?: boolean;
  symptomHotspotIds?: string[];
  onToggleSymptomMode?: (enabled: boolean) => void;
  pathologyType?: PathologyType;
};

export function OrganViewer({
  organ,
  autoRotate = true,
  onAutoRotate,
  selectedHotspotId,
  onSelectHotspot,
  symptomMode = true,
  symptomHotspotIds = [],
  onToggleSymptomMode,
  pathologyType = "normal",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<AnatomyViewer | null>(null);
  const organRef = useRef(organ);
  const autoRotateRef = useRef(autoRotate);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [sectionActive, setSectionActive] = useState(false);
  const [layersActive, setLayersActive] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    organRef.current = organ;
  }, [organ]);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  const handleSelect = useCallback(
    (hotspot: Hotspot | null) => {
      onSelectHotspot?.(hotspot);
    },
    [onSelectHotspot],
  );

  useEffect(() => {
    let cancelled = false;
    let viewer: AnatomyViewer | null = null;

    void import("../../lib/three/viewer").then(({ AnatomyViewer: Viewer }) => {
      if (cancelled || !mountRef.current) return;
      viewer = new Viewer(mountRef.current, {
        onSelect: handleSelect,
        onLoading: (isLoading, value) => {
          setLoading(isLoading);
          setProgress(value);
        },
      });
      viewerRef.current = viewer;
      viewer.setAutoRotate(autoRotateRef.current);
      const current = organRef.current;
      viewer
        .setOrgan(current.model, current.hotspots, current.accent)
        .then(() => {
          if (symptomMode) {
            viewer?.setSymptomMode(true, symptomHotspotIds);
          }
        })
        .catch(() => {
          setLoading(false);
          setProgress(0);
        });
    });

    return () => {
      cancelled = true;
      viewerRef.current = null;
      viewer?.dispose();
    };
  }, [handleSelect]);

  useEffect(() => {
    viewerRef.current
      ?.setOrgan(organ.model, organ.hotspots, organ.accent)
      .then(() => {
        if (symptomMode) {
          viewerRef.current?.setSymptomMode(true, symptomHotspotIds);
        }
      })
      .catch(() => {
        setLoading(false);
        setProgress(0);
      });
  }, [organ]);

  useEffect(() => {
    viewerRef.current?.setAutoRotate(autoRotate);
  }, [autoRotate]);

  useEffect(() => {
    if (selectedHotspotId !== undefined) {
      viewerRef.current?.highlightHotspot(selectedHotspotId);
    }
  }, [selectedHotspotId]);

  useEffect(() => {
    viewerRef.current?.setSymptomMode(symptomMode, symptomHotspotIds);
  }, [symptomMode, symptomHotspotIds]);

  useEffect(() => {
    viewerRef.current?.applyPathology(pathologyType);
  }, [pathologyType]);

  const activePathologyConfig = PATHOLOGY_PRESETS[pathologyType] || PATHOLOGY_PRESETS.normal;

  const handleZoomIn = () => {
    viewerRef.current?.zoom(-1);
  };

  const handleZoomOut = () => {
    viewerRef.current?.zoom(1);
  };

  const handleReset = () => {
    viewerRef.current?.reset();
    setSectionActive(false);
    setLayersActive(false);
    viewerRef.current?.setAutoRotate(autoRotate);
    viewerRef.current?.setSymptomMode(symptomMode, symptomHotspotIds);
  };

  const handleToggleSection = () => {
    const active = viewerRef.current?.toggleCrossSection() ?? false;
    setSectionActive(active);
  };

  const handleToggleLayers = () => {
    const active = viewerRef.current?.toggleLayers() ?? false;
    setLayersActive(active);
  };

  const handleToggleRotate = () => {
    const next = !autoRotate;
    onAutoRotate?.(next);
    viewerRef.current?.setAutoRotate(next);
  };

  const handleToggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <div
      ref={containerRef}
      className="viewer-shell relative w-full h-full min-h-[560px] rounded-[24px] overflow-hidden select-none bg-gradient-to-b from-[#fbf8f4] via-[#f5ede3] to-[#eaddce]"
      aria-label={`${organ.name} 3D Clinical Model`}
    >
      {/* Soft Ambient Light Halo */}
      <div
        className="viewer-glow pointer-events-none"
        style={{ "--organ-accent": symptomMode ? "#ef4444" : organ.accent } as React.CSSProperties}
      />

      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="three-mount" />

      {/* Top-Left Organ Identification Badge & Active 3D Mutation Status */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex flex-col gap-2">
        <div className="pointer-events-auto bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[var(--line)] shadow-sm flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center font-bold text-base"
            style={{
              backgroundColor: `${organ.accent}20`,
              color: organ.accent,
            }}
          >
            {organ.icon}
          </div>
          <div>
            <div className="text-xs font-serif font-bold text-[var(--ink)] flex items-center gap-1.5">
              <span>{organ.name}</span>
              <span className="text-[11px] font-normal text-[var(--ink-soft)] italic font-serif">
                ({organ.scientificName})
              </span>
            </div>
            <div className="text-[9px] font-sans font-bold uppercase tracking-wider text-[var(--ink-muted)] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>3D Anatomical Reconstruction</span>
            </div>
          </div>
        </div>

        {/* Dynamic 3D Pathology Deformation Status Indicator */}
        {pathologyType !== "normal" && (
          <div className="pointer-events-auto bg-red-950/90 backdrop-blur-md text-white px-3.5 py-1.5 rounded-xl border border-red-500/40 shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <Flame size={14} className="text-red-400 animate-pulse" />
            <div className="text-[11px] font-serif">
              <span className="font-bold text-red-200">3D AI Mutation: </span>
              <span className="text-white/90">{activePathologyConfig.badge}</span>
            </div>
          </div>
        )}
      </div>

      {/* Top-Right Camera Navigation Dock */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5">
        <button
          type="button"
          onClick={handleZoomIn}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[var(--ink)] border border-[var(--line)] shadow-sm transition flex items-center justify-center"
          title="Perbesar Kamera (+)"
        >
          <Plus size={16} />
        </button>
        <button
          type="button"
          onClick={handleZoomOut}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[var(--ink)] border border-[var(--line)] shadow-sm transition flex items-center justify-center"
          title="Perkecil Kamera (-)"
        >
          <Minus size={16} />
        </button>
        <button
          type="button"
          onClick={handleReset}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[var(--ink)] border border-[var(--line)] shadow-sm transition flex items-center justify-center"
          title="Reset Orientasi Normal"
        >
          <Crosshair size={16} />
        </button>
        <button
          type="button"
          onClick={handleToggleRotate}
          className={`w-9 h-9 rounded-xl border shadow-sm transition flex items-center justify-center ${
            autoRotate
              ? "bg-[var(--terracotta)] text-white border-[var(--terracotta)]"
              : "bg-white/90 hover:bg-white text-[var(--ink-soft)] border-[var(--line)]"
          }`}
          title="Auto-Orbit Rotasi"
        >
          <RotateCcw size={15} className={autoRotate ? "animate-spin" : ""} style={{ animationDuration: "8s" }} />
        </button>
        <button
          type="button"
          onClick={handleToggleFullscreen}
          className="w-9 h-9 rounded-xl bg-white/90 hover:bg-white text-[var(--ink)] border border-[var(--line)] shadow-sm transition flex items-center justify-center"
          title="Layar Penuh"
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>
      </div>

      {/* Bottom Floating Clinical Mode Control Dock */}
      <div className="absolute bottom-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        {/* Left Clinical Tools Pill */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-[var(--line)] shadow-md">
          <button
            type="button"
            onClick={() => {
              const next = !symptomMode;
              onToggleSymptomMode?.(next);
              viewerRef.current?.setSymptomMode(next, symptomHotspotIds);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-bold transition flex items-center gap-1.5 border ${
              symptomMode
                ? "bg-red-50 text-red-700 border-red-300 shadow-sm"
                : "bg-transparent text-[var(--ink-soft)] border-transparent hover:bg-[var(--paper-soft)]"
            }`}
          >
            <Zap size={13} className={symptomMode ? "text-red-600 animate-pulse" : "text-gray-400"} />
            <span>{symptomMode ? "Highlight Patologi: ON" : "Patologi: OFF"}</span>
          </button>

          <div className="w-[1px] h-4 bg-[var(--line)]" />

          <button
            type="button"
            onClick={handleToggleSection}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition flex items-center gap-1.5 border ${
              sectionActive
                ? "bg-[var(--ink)] text-white border-[var(--ink)] shadow-sm"
                : "bg-transparent text-[var(--ink-soft)] border-transparent hover:bg-[var(--paper-soft)]"
            }`}
          >
            <ScanLine size={13} />
            <span>Tomografi</span>
          </button>

          <button
            type="button"
            onClick={handleToggleLayers}
            className={`px-3 py-1.5 rounded-xl text-xs font-serif font-semibold transition flex items-center gap-1.5 border ${
              layersActive
                ? "bg-[var(--ink)] text-white border-[var(--ink)] shadow-sm"
                : "bg-transparent text-[var(--ink-soft)] border-transparent hover:bg-[var(--paper-soft)]"
            }`}
          >
            <Layers3 size={13} />
            <span>Grid CT</span>
          </button>
        </div>

        {/* Right Interaction Hint */}
        <div className="pointer-events-auto hidden sm:flex items-center gap-2 bg-white/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-[var(--line)] text-[11px] font-serif text-[var(--ink-soft)] shadow-sm">
          <span>Geser untuk rotasi 360° • Klik landmark untuk inspeksi</span>
        </div>
      </div>

      {/* Loading State Spinner */}
      {loading && (
        <div className="absolute inset-0 z-20 bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3 transition-opacity">
          <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--line)] shadow-lg flex items-center justify-center">
            <Loader2 size={24} className="animate-spin text-[var(--terracotta)]" />
          </div>
          <div className="text-center">
            <strong className="font-serif text-sm font-bold text-[var(--ink)] block">
              Memuat Rekonstruksi 3D {organ.name}...
            </strong>
            <span className="text-xs font-serif text-[var(--ink-muted)]">
              {Math.max(10, Math.round(progress * 100))}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
