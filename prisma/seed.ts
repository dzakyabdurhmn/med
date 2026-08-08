import { PrismaClient } from '../src/generated/prisma/client.js'
import { getDatabaseUrl } from '../src/database-url.js'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
  connectionString: getDatabaseUrl(),
})

const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding Medical Database (Neon PostgreSQL)...')

  // Clean up existing records
  await prisma.auditLog.deleteMany()
  await prisma.verificationRecord.deleteMany()
  await prisma.reportOrganHighlight.deleteMany()
  await prisma.medicalReport.deleteMany()
  await prisma.patientProfile.deleteMany()
  await prisma.medicalGlossary.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create Doctor & Radiologist Users
  const doctor = await prisma.user.create({
    data: {
      email: 'dr.adrian@siloam-gemastik.id',
      name: 'dr. Adrian Santoso, Sp.JP (K)',
      role: 'DOCTOR',
      licenseNumber: 'SIP.31.71.01.1002.2024',
      specialization: 'Spesialis Jantung & Pembuluh Darah (Kardiologi Intervensi)',
    },
  })

  const radiologist = await prisma.user.create({
    data: {
      email: 'dr.maya@siloam-gemastik.id',
      name: 'dr. Maya Putri, Sp.Rad',
      role: 'RADIOLOGIST',
      licenseNumber: 'SIP.31.71.01.2005.2025',
      specialization: 'Spesialis Radiologi Diagnostik & Intervensional',
    },
  })
  console.log(`Created Radiologist: ${radiologist.name}`)

  // 2. Create Patient User & Medical Record Profile
  const patientUser = await prisma.user.create({
    data: {
      email: 'budi.santoso@gmail.com',
      name: 'Budi Santoso',
      role: 'PATIENT',
    },
  })

  const patientProfile = await prisma.patientProfile.create({
    data: {
      userId: patientUser.id,
      mrn: 'MRN-2026-0042',
      nik: '3171012304680001',
      dateOfBirth: new Date('1968-04-23'),
      gender: 'MALE',
      bloodType: 'O+',
      allergies: ['Penicillin'],
      chronicHistory: ['Hipertensi Stage 2', 'Dislipidemia'],
      emergencyContact: 'Ibu Ratna (Istri) - 0812-3456-7890',
    },
  })
  console.log(`Created Patient Profile: ${patientProfile.mrn}`)

  // 3. Create Sample Medical Report with 3D Organ Highlights
  const report = await prisma.medicalReport.create({
    data: {
      reportNumber: 'RPT-2026-0089',
      title: 'Ekokardiografi & Evaluasi Stenosis Katup Aorta',
      status: 'VERIFIED',
      patientId: patientUser.id,
      doctorId: doctor.id,
      radiologyModality: 'Echocardiogram 2D Doppler',
      rawMedicalNotes:
        'Pasien Tn. Budi (58 th) mengeluh sesak nafas saat aktivitas dan nyeri dada atipikal. Pemeriksaan ekokardiografi menunjukkan kalsifikasi katup aorta dengan area pembukaan berkurang (AVA 0.9 cm²), gradien puncak 48 mmHg. Terlihat hipertrofi konsentrik pada ventrikel kiri dengan ketebalan dinding septum 14 mm. Fraksi ejeksi (LVEF) 54%. Regurgitasi mitral derajat ringan.',
      clinicalFindings:
        'Kalsifikasi signifikan pada kuspis katup aorta dengan pembukaan terbatas. Hipertrofi ventrikel kiri kompensatorik. Fungsi sistolik ventrikel kiri masih terjaga.',
      aiDiagnosis:
        'Severe Calcific Aortic Valve Stenosis dengan Left Ventricular Hypertrophy (LVH) Kompensatorik.',
      clinicalRecommendations:
        'Konsultasi Bedah Toraks Kardiovaskular untuk evaluasi TAVR/SAVR. Kontrol tekanan darah ketat target < 130/80 mmHg. Hindari aktivitas fisik kompetitif.',
      patientFriendlySummary:
        'Pintu utama aliran darah jantung (katup aorta) mengalami penyempitan akibat pengapuran, sehingga otot bilik kiri jantung harus bekerja lebih keras dan menebal. Diperlukan penanganan dokter spesialis jantung untuk rencana pelebaran atau penggantian katup.',
      aiConfidenceScore: 0.96,
      disclaimerAccepted: true,
      primaryOrgan: 'heart',
      verifiedAt: new Date(),
      organHighlights: {
        create: [
          {
            organId: 'heart',
            hotspotId: 'aorta',
            label: 'Katup Aorta Mengalami Stenosis Kalsifikasi',
            severity: 'SEVERE',
            clinicalFinding: 'Aortic Valve Area (AVA) 0.9 cm², gradien puncak 48 mmHg.',
            laymanExplanation: 'Katup pembuluh darah utama menyempit sehingga menghambat aliran darah ke seluruh tubuh.',
            isHighlighted: true,
          },
          {
            organId: 'heart',
            hotspotId: 'left-ventricle',
            label: 'Hipertrofi Konsentrik Ventrikel Kiri',
            severity: 'MODERATE',
            clinicalFinding: 'Ketebalan septum interventrikular 14 mm (menebal).',
            laymanExplanation: 'Dinding bilik pompa utama jantung menebal karena harus memompa dengan tekanan lebih tinggi.',
            isHighlighted: true,
          },
          {
            organId: 'heart',
            hotspotId: 'mitral',
            label: 'Regurgitasi Katup Mitral Ringan',
            severity: 'MILD',
            clinicalFinding: 'Kebocoran minimal tanpa dilatasi atrium kiri.',
            laymanExplanation: 'Sedikit kebocoran pada katup pembatas yang masih terkontrol aman.',
            isHighlighted: true,
          },
        ],
      },
    },
  })

  // 4. Create Doctor Verification Signature
  await prisma.verificationRecord.create({
    data: {
      reportId: report.id,
      doctorId: doctor.id,
      doctorNotes: 'Diagnosis dan highlight spasial 3D telah diverifikasi sesuai protokol klinis PERKI 2026.',
      digitalSignatureHash: 'sha256-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      isApproved: true,
    },
  })

  // 5. Create Medical Glossary Terms
  await prisma.medicalGlossary.createMany({
    data: [
      {
        term: 'Stenosis Aorta',
        latinTerm: 'Stenosis Valvulae Aortae',
        category: 'Cardiovascular',
        laymanDefinition: 'Penyempitan pada katup pembuluh darah utama jantung sehingga darah sulit dipompa keluar.',
        clinicalDefinition: 'Penyempitan orifisium katup aorta yang meningkatkan afterload ventrikel kiri.',
      },
      {
        term: 'Hipertrofi Ventrikel Kiri (LVH)',
        latinTerm: 'Hypertrophia Ventriculi Sinistri',
        category: 'Cardiovascular',
        laymanDefinition: 'Penebalan otot bilik kiri jantung karena bekerja ekstra keras memompa darah.',
        clinicalDefinition: 'Peningkatan massa miokard ventrikel kiri sebagai respon kompensasi kelebihan beban tekanan atau volume.',
      },
      {
        term: 'Infiltrat Paru',
        latinTerm: 'Infiltratum Pulmonis',
        category: 'Pulmonology',
        laymanDefinition: 'Bercak putih pada foto rontgen yang menandakan adanya cairan atau infeksi pada paru-paru.',
        clinicalDefinition: 'Akumulasi substansi asing (eksudat, pus, atau darah) di dalam rongga alveolar paru.',
      },
    ],
  })

  // 6. Create Audit Log
  await prisma.auditLog.create({
    data: {
      userId: doctor.id,
      reportId: report.id,
      action: 'DOCTOR_VERIFIED_REPORT',
      details: 'Laporan RPT-2026-0089 berhasil diverifikasi dengan tanda tangan digital.',
    },
  })

  console.log('✅ Medical Database Seed Completed Successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding medical database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
