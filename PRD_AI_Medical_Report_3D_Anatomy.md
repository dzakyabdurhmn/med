# Product Requirements Document (PRD)
## MED-AI: AI-Powered Medical Report Assistant dengan Visualisasi Anatomi 3D Interaktif

**Kompetisi:** GEMASTIK — Kategori Software Development  
**Tech Stack:** TanStack Start (React full-stack), Three.js (WebGL 3D Engine), NVIDIA AI (DeepSeek-V3), Prisma ORM, Tailwind CSS / Vanilla CSS  
**Versi Dokumen:** 1.0 (Final Architecture & Specifications)  
**Tanggal:** 8 Agustus 2026  

---

## 1. Latar Belakang & Masalah

Rumah sakit dan fasilitas kesehatan modern menghadapi beban administratif yang sangat besar dalam siklus penyusunan dan interpretasi laporan medis (*medical report*).
1. **Beban Administratif Dokter**: Dokter spesialis dan radiolog menghabiskan 30-40% waktu kerja untuk mengetik, merangkum, dan menstrukturkan catatan klinis mentah dan temuan radiologis.
2. **Kesenjangan Pemahaman Pasien (Health Literacy Gap)**: Pasien awam kesulitan memahami terminologi medis yang kompleks (contoh: *hypertrophic cardiomyopathy with subaortic stenosis* atau *infiltrat bronkopulmonal basalis*).
3. **Ketiadaan Representasi Visual Spasial**: Hasil diagnosis konvensional hanya berupa teks 2 dimensi atau lembaran cetak tanpa visualisasi spasial 3D interaktif yang menunjukkan lokasi persis organ tubuh yang terdampak.

**Visi Produk**: Menghadirkan asisten medis AI berstandar internasional yang mempercepat alur kerja klinisi dengan *human-in-the-loop verification*, sekaligus mempermudah pasien memahami kondisi kesehatannya melalui model anatomi 3D interaktif beresolusi tinggi.

---

## 2. Tujuan Produk & Ruang Lingkup

| No | Target Spesifikasi |
|---|---|
| **G1** | **Automasi Ekstraksi AI**: Mengubah catatan medis dokter & laporan lab mentah menjadi laporan terstruktur dalam format standar klinis. |
| **G2** | **Penerjemah Bahasa Awam**: Menghasilkan ringkasan dan glosarium istilah medis yang mudah dipahami pasien secara otomatis. |
| **G3** | **Visualisasi 3D Spasial Real-Time**: Memetakan temuan patologis ke dalam 9 organ anatomis 3D (Jantung, Otak, Paru, Hati, Ginjal, Mata, Usus, Pankreas, Kulit) dengan *dynamic hotspot highlighting*. |
| **G4** | **Dual Portal (Dokter & Pasien)**: Dashboard terintegrasi dengan validasi tanda tangan dokter (verifikasi klinis) sebelum laporan dipublikasikan ke pasien. |

**Batasan Klinis (Safety & Ethics)**:
- Sistem adalah **Clinical Decision Support & Patient Education Tool**, bukan pengganti pertimbangan medis dokter.
- Wajib menerapkan *Human-in-the-Loop*: Laporan AI berstatus `DRAFT` atau `PENDING_VERIFICATION` dan hanya dapat dibaca pasien setelah diverifikasi (`VERIFIED`) oleh dokter berlisensi.

---

## 3. Arsitektur Teknis

```
Frontend / Client Layer (TanStack Start & React 19)
   │
   ├── Portal Dokter (Input Raw Notes, AI Analysis, 3D Preview, Signature)
   ├── Portal Pasien (Patient-Friendly Summary, 3D Anatomy Visualizer)
   │
API & Server Functions Layer
   │
   ├── /api/ai/chat        → NVIDIA OpenAI-Compatible Adapter (DeepSeek AI)
   ├── /api/ai/structured  → Structured JSON schema extraction (Organ, Hotspot, Severity)
   ├── /api/reports        → CRUD & Verifikasi Laporan Medis
   │
3D Biomechanic Engine (Three.js + Draco + Meshopt)
   │
   ├── AnatomyViewer       → WebGL Engine, Scene Graph, Lighting, Clipping Plane
   ├── HotspotLayer        → Depth-tested Screen Billboards, Dynamic Pulse Glow
   └── AnatomyAssetManager → Fast GLTF/GLB Streaming & Memory Management
   │
Data Persistence Layer
   └── PostgreSQL / SQLite via Prisma ORM (Users, Reports, OrganHighlights, AuditLogs)
```

---

## 4. Fitur Utama

### F1. AI Medical Report Parser & Structured Extractor
- Input: Teks catatan klinis, anamnesis, hasil laboratorium, dan pembacaan radiologi.
- Engine: NVIDIA OpenAI-Compatible API (`deepseek-ai/deepseek-v4-pro` / `deepseek-v3`).
- Output:
  - **Temuan Klinis**: Ringkasan sistematis temuan dokter.
  - **Diagnosis Sementara & Diferensial**: Kode klasifikasi patologis.
  - **Rekomendasi Terapi**: Langkah pemeriksaan lanjutan atau obat.
  - **Entitas 3D Anatomis**: `organId`, `hotspotId`, `severity` (NORMAL, MILD, MODERATE, SEVERE, CRITICAL), serta catatan spasial.

### F2. Engine Anatomi 3D Interaktif (9 Organ Tubuh)
- Mendukung 9 model organ 3D resolusi tinggi:
  1. **Jantung (Heart)**: Aorta, Atrium Kiri/Kanan, Ventrikel Kiri/Kanan, Katup Mitral.
  2. **Otak (Brain)**: Lobus Frontal, Parietal, Temporal, Serebelum.
  3. **Paru-Paru (Lungs)**: Trakea, Paru Kanan (3 Lobus), Paru Kiri (2 Lobus), Bronkus, Segmen Basal.
  4. **Hati (Liver)**: Lobus Kanan, Lobus Kiri, Porta Hepatis.
  5. **Ginjal (Kidneys)**: Korteks Ginjal, Medula Ginjal, Ureter & Pelvis Renalis.
  6. **Mata (Eye)**: Kornea, Iris & Pupil, Saraf Optik (CN II).
  7. **Usus (Intestines)**: Duodenum, Jejunum/Ileum, Kolon.
  8. **Pankreas (Pancreas)**: Kaput, Korpus, Kauda, Duktus Pankreatikus Wirsung.
  9. **Kulit (Skin)**: Epidermis, Dermis, Hipodermis, Unit Pilosebasea.
- **Interaktivitas**: Auto-rotate, OrbitControls, Zoom, Isolasi, Cross-Section (potongan melintang), dan Wireframe Inspection.

### F3. Dynamic Severity Highlighting
- Titik landmark (hotspots) secara otomatis menyala dan berdenyut (*pulsing animation*) dengan kode warna berdasarkan tingkat keparahan temuan medis:
  - **Normal**: Hijau Emerald (`#22c55e`)
  - **Mild**: Biru Sky (`#38bdf8`)
  - **Moderate**: Kuning Amber (`#eab308`)
  - **Severe**: Oranye (`#f97316`)
  - **Critical**: Merah Scarlet (`#ef4444`)

### F4. Human-In-The-Loop Verification & Audit Trail
- Dokter dapat meninjau, mengedit teks, menyesuaikan titik koordinat 3D, dan menandatangani laporan secara digital.
- Setiap aktivitas sistem (pembuatan laporan, ekstraksi AI, verifikasi dokter, pembacaan pasien) tercatat dalam `AuditLog` untuk kepatuhan regulasi UU Perlindungan Data Pribadi (UU PDP No. 27/2022).

---

## 5. Skema Data Relasional (Prisma)

1. **`User`**: Akun pengguna dengan `Role` (DOCTOR, PATIENT, RADIOLOGIST, ADMIN).
2. **`PatientProfile`**: Profil rekam medis (MRN, NIK, Golongan Darah, Riwayat Alergi, Penyakit Kronis).
3. **`MedicalReport`**: Laporan medis utama (No. Laporan, Status, Raw Notes, AI Findings, Patient Summary, Primary Organ).
4. **`ReportOrganHighlight`**: Pemetaan temuan medis ke koordinat organ 3D (`organId`, `hotspotId`, `severity`, `colorHex`).
5. **`VerificationRecord`**: Catatan persetujuan dokter berlisensi dan tanda tangan digital.
6. **`MedicalGlossary`**: Kamus terminologi medis bahasa awam.
7. **`AuditLog`**: Log audit keamanan akses data medis pasien.

---

## 6. Metrik Keberhasilan Kompetisi GEMASTIK

1. **Efisiensi Klinis**: Mengurangi waktu pembuatan resume medis dokter hingga >60%.
2. **Akurasi Pemetaan 3D**: Akurasi linking entitas medis AI ke landmark 3D ≥ 95%.
3. **Interaktivitas Visual 3D**: Waktu rendering model 3D < 1.5 detik dengan frame rate stabil 60 FPS pada browser standar.
4. **User Engagement Pasien**: Peningkatan pemahaman pasien terhadap hasil diagnosis berkat visualisasi spasial 3D dan ringkasan bahasa awam.
