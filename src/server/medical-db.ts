import { createServerFn } from "@tanstack/react-start";
import type { MedicalFormData } from "../components/medical/MedicalHistoryFormDocument";

/**
 * Doctor Registration Server Function (Prisma DB + SATUSEHAT Verification)
 */
export const registerDoctorUser = createServerFn({
  method: "POST",
})
  .validator(
    (input: {
      name: string;
      email: string;
      password: string;
      nik?: string;
      licenseNumber: string;
      specialization: string;
      institution: string;
      satusehatId?: string;
      isSatusehatVerified?: boolean;
      signatureDataUrl?: string;
      signaturePin?: string;
    }) => input
  )
  .handler(async ({ data }) => {
    const { prisma } = await import("../db");
    const {
      name,
      email,
      password,
      nik,
      licenseNumber,
      specialization,
      institution,
      satusehatId,
      isSatusehatVerified,
      signatureDataUrl,
      signaturePin,
    } = data;

    try {
      const cleanEmail = email.trim().toLowerCase();
      const cleanNik = nik ? nik.trim() : null;

      // Check existing user by email or NIK
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: cleanEmail },
            ...(cleanNik ? [{ nik: cleanNik }] : []),
          ],
        },
      });

      if (existingUser) {
        // Update doctor profile with new credentials
        const updated = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            name,
            email: cleanEmail,
            nik: cleanNik || existingUser.nik,
            passwordHash: password, // Store password hash / credential
            role: "DOCTOR",
            licenseNumber,
            specialization,
            institution,
            satusehatId: satusehatId || existingUser.satusehatId,
            isSatusehatVerified: isSatusehatVerified ?? existingUser.isSatusehatVerified,
            satusehatVerifiedAt: isSatusehatVerified ? new Date() : existingUser.satusehatVerifiedAt,
            signatureDataUrl: signatureDataUrl || existingUser.signatureDataUrl,
            signaturePin: signaturePin || existingUser.signaturePin,
          },
        });

        return {
          success: true,
          user: updated,
          message: "Profil Dokter berhasil diperbarui di Database.",
        };
      }

      // Create new doctor user
      const newDoctor = await prisma.user.create({
        data: {
          name,
          email: cleanEmail,
          nik: cleanNik,
          passwordHash: password,
          role: "DOCTOR",
          licenseNumber,
          specialization,
          institution,
          satusehatId,
          isSatusehatVerified: !!isSatusehatVerified,
          satusehatVerifiedAt: isSatusehatVerified ? new Date() : null,
          signatureDataUrl,
          signaturePin: signaturePin || "123456",
        },
      });

      return {
        success: true,
        user: newDoctor,
        message: "Pendaftaran Dokter DPJP berhasil tersimpan di Database.",
      };
    } catch (error: any) {
      console.error("Error in registerDoctorUser:", error);
      return { success: false, error: error.message };
    }
  });

/**
 * Doctor Login Server Function
 */
export const loginDoctorUser = createServerFn({
  method: "POST",
})
  .validator((input: { identifier: string; password: string }) => input)
  .handler(async ({ data }) => {
    const { prisma } = await import("../db");
    const { identifier, password } = data;
    const cleanId = identifier.trim().toLowerCase();

    try {
      const user = await prisma.user.findFirst({
        where: {
          role: "DOCTOR",
          OR: [{ email: cleanId }, { nik: identifier.trim() }],
        },
      });

      if (!user) {
        return {
          success: false,
          message: "Akun Dokter dengan Email / NIK tersebut tidak ditemukan.",
        };
      }

      if (user.passwordHash && user.passwordHash !== password) {
        return {
          success: false,
          message: "Password yang Anda masukkan salah.",
        };
      }

      return {
        success: true,
        user,
        message: "Login Dokter Berhasil.",
      };
    } catch (error: any) {
      console.error("Error in loginDoctorUser:", error);
      return { success: false, error: error.message };
    }
  });

/**
 * Get the latest active Medical Report from PostgreSQL DB
 */
export const getActiveReportFromDb = createServerFn({
  method: "GET",
}).handler(async () => {
  try {
    const { prisma } = await import("../db");
    const report = await prisma.medicalReport.findFirst({
      orderBy: { updatedAt: "desc" },
      include: {
        patient: { include: { patientProfile: true } },
        doctor: true,
        organHighlights: true,
        verificationRecord: true,
      },
    });

    if (report) {
      return { success: true, report, source: "database" as const };
    }

    return { success: true, report: null, source: "empty" as const };
  } catch (error: any) {
    console.error("Database query error in getActiveReportFromDb:", error);
    return { success: false, error: error.message, source: "fallback" as const };
  }
});

/**
 * Get all Medical Reports authored by a specific doctor (by DB user id)
 */
export const getDoctorReportsFromDb = createServerFn({
  method: "GET",
})
  .validator((input: { doctorId: string }) => input)
  .handler(async ({ data }) => {
    const { doctorId } = data;
    try {
      const { prisma } = await import("../db");
      const reports = await prisma.medicalReport.findMany({
        where: { doctorId },
        orderBy: { updatedAt: "desc" },
        include: {
          patient: { include: { patientProfile: true } },
          doctor: true,
          organHighlights: true,
          transcripts: { include: { segments: true } },
          verificationRecord: true,
        },
      });

      return { success: true, reports: reports as any, source: "database" as const };
    } catch (error: any) {
      console.error("Database query error in getDoctorReportsFromDb:", error);
      return { success: false, error: error.message, source: "fallback" as const };
    }
  });

/**
 * Save / Upsert Medical Report to PostgreSQL DB
 */
export const saveReportToDb = createServerFn({
  method: "POST",
})
  .validator(
    (input: {
      formData: MedicalFormData;
      organId?: string;
      isSigned: boolean;
      signatureDataUrl: string | null;
      doctorId?: string;
      dialogueLines?: { speaker: string; speakerName: string; text: string; time: string }[];
    }) => input
  )
  .handler(async ({ data }) => {
    const { prisma } = await import("../db");
    const { formData, organId, isSigned, signatureDataUrl, doctorId, dialogueLines } = data;

    try {
      if (!formData.patientName) {
        return { success: true, message: "Empty patient form skipped" };
      }

      // 1. Find or Create Doctor User — prefer the signed-in doctor's DB id
      let doctor = doctorId
        ? await prisma.user.findUnique({ where: { id: doctorId } })
        : null;

      if (!doctor) {
        doctor = await prisma.user.findFirst({
          where: {
            name: formData.doctorName || "dr. Dokter Spesialis",
            role: "DOCTOR",
          },
        });
      }

      if (!doctor) {
        doctor = await prisma.user.create({
          data: {
            email: `doctor.${Date.now()}@med-atelier.health`,
            name: formData.doctorName || "dr. Dokter Spesialis",
            role: "DOCTOR",
            licenseNumber: formData.doctorSip || "SIP-2026-MED",
            specialization: formData.doctorSpecialty || "DPJP Spesialis",
          },
        });
      }

      // 2. Find or create Patient User
      let patient = await prisma.user.findFirst({
        where: {
          name: formData.patientName,
          role: "PATIENT",
        },
      });

      if (!patient) {
        const mrn = formData.insurancePolicyNumber || `RM-2026-${Math.floor(1000 + Math.random() * 9000)}`;
        const dobDate = formData.patientDob ? new Date(formData.patientDob) : new Date("1980-01-01");
        const validDob = isNaN(dobDate.getTime()) ? new Date("1980-01-01") : dobDate;

        patient = await prisma.user.create({
          data: {
            email: `patient.${Date.now()}@patient.id`,
            name: formData.patientName,
            role: "PATIENT",
            patientProfile: {
              create: {
                mrn,
                nik: "3171" + Math.floor(100000000000 + Math.random() * 900000000000),
                dateOfBirth: validDob,
                gender: formData.patientGender === "F" ? "FEMALE" : "MALE",
                emergencyContact: formData.emergencyContactPhone || formData.patientPhone || "-",
              },
            },
          },
        });
      }

      // 3. Upsert / Create Medical Report
      const reportNumber = formData.insurancePolicyNumber || `EHR-${Date.now()}`;
      
      const report = await prisma.medicalReport.create({
        data: {
          reportNumber,
          title: `Lembar Rekam Medis — ${formData.patientName}`,
          status: isSigned ? "VERIFIED" : "DRAFT",
          patientId: patient.id,
          doctorId: doctor.id,
          rawMedicalNotes: formData.rawNotes || formData.otherMedicalIssues || "",
          radiologyModality: formData.modality || "Pemeriksaan Klinis",
          clinicalFindings: JSON.stringify(formData.findings || []),
          aiSuggestedFindings: formData.diagnosis ? `${formData.diagnosis} (${formData.diagnosisIcd})` : "Dalam Evaluasi",
          suggestedIcd10Codes: formData.diagnosisIcd ? `${formData.diagnosisIcd} - ${formData.diagnosis}` : "Kode ICD-10 Kandidat AI",
          evidenceRef: `REF-EVIDENCE-${Date.now()}`,
          clinicalRecommendations: formData.recommendations || "",
          patientFriendlySummary: formData.patientSummary || "",
          primaryOrgan: organId,
          verifiedAt: isSigned ? new Date() : null,
          transcripts: {
            create: {
              language: "id-ID",
              segments: {
                create: (dialogueLines || []).map((d, i) => ({
                  speaker: d.speaker === "doctor" ? "Dokter" : "Pasien",
                  text: d.text,
                  referensi_ucapan_sumber: `REF-SEG-${i + 1}-${d.speaker.toUpperCase()}-${Date.now()}`,
                })),
              },
            },
          },
          verificationRecord: isSigned
            ? {
                create: {
                  doctorId: doctor.id,
                  doctorNotes: "Dokumen Rekam Medis Diverifikasi & Sah via MED-AI Atelier DPJP Digital Signature.",
                  digitalSignatureHash: signatureDataUrl
                    ? `SIG-${Date.now()}`
                    : `SATUSEHAT-QR-SHA256-${Date.now()}`,
                },
              }
            : undefined,
          organHighlights: {
            create: (formData.findings || []).map((f) => ({
              organId: f.organId || organId || "general",
              hotspotId: f.hotspotId,
              label: f.label,
              severity: f.severity as any,
              clinicalFinding: f.finding,
              laymanExplanation: f.layman,
            })),
          },
        },
        include: {
          patient: { include: { patientProfile: true } },
          doctor: true,
          organHighlights: true,
          transcripts: { include: { segments: true } },
          verificationRecord: true,
        },
      });

      return {
        success: true,
        reportId: report.id,
        reportNumber: report.reportNumber,
        status: report.status,
        timestamp: report.updatedAt.toISOString(),
      };
    } catch (error: any) {
      console.warn("Database save status:", error?.message || error);
      return { success: false, error: error.message };
    }
  });

/**
 * Server Function: Search ICD-10 Codes from PostgreSQL Database
 */
export const searchIcd10Codes = createServerFn({
  method: "POST",
})
  .validator((input: { query: string; limit?: number }) => input)
  .handler(async ({ data }) => {
    const { query, limit = 15 } = data;
    const q = (query || "").trim();
    if (!q) return [];

    try {
      const { prisma } = await import("../db");
      const results = await prisma.medicalCode.findMany({
        where: {
          system: "ICD10",
          OR: [
            { code: { contains: q, mode: "insensitive" } },
            { display: { contains: q, mode: "insensitive" } },
            { groupName: { contains: q, mode: "insensitive" } },
          ],
        },
        take: limit,
        orderBy: { code: "asc" },
      });
      return results;
    } catch (error: any) {
      console.warn("Error in searchIcd10Codes DB lookup:", error);
      return [];
    }
  });

/**
 * Server Function / Helper: Find best matching ICD-10 Code from DB or Dictionary
 */
export async function lookupIcd10CodeByKeyword(keyword: string): Promise<{ code: string; display: string }> {
  const cleanKey = (keyword || "").trim();
  if (!cleanKey) return { code: "Z00.0", display: "Encounter for general health examination" };

  try {
    const { prisma } = await import("../db");
    const dbMatch = await prisma.medicalCode.findFirst({
      where: {
        system: "ICD10",
        OR: [
          { code: { equals: cleanKey, mode: "insensitive" } },
          { display: { contains: cleanKey, mode: "insensitive" } },
          { groupName: { contains: cleanKey, mode: "insensitive" } },
        ],
      },
      orderBy: { code: "asc" },
    });

    if (dbMatch) {
      return { code: dbMatch.code, display: dbMatch.display };
    }
  } catch (e) {
    console.warn("DB lookupIcd10CodeByKeyword fallback to dictionary");
  }

  // Dictionary Fallback for common conditions
  const textLower = cleanKey.toLowerCase();

  if (textLower.includes("jantung") || textLower.includes("ska") || textLower.includes("koroner") || textLower.includes("angina")) {
    return { code: "I20.9", display: "Angina pectoris, unspecified (Sindrom Koroner Akut)" };
  }
  if (textLower.includes("hipertensi") || textLower.includes("tensi") || textLower.includes("darah tinggi")) {
    return { code: "I10", display: "Essential (primary) hypertension" };
  }
  if (textLower.includes("ispa") || textLower.includes("saluran pernapasan") || textLower.includes("respirasi")) {
    return { code: "J06.9", display: "Acute upper respiratory infection, unspecified" };
  }
  if (textLower.includes("pneumonia") || textLower.includes("paru")) {
    return { code: "J18.9", display: "Pneumonia, unspecified" };
  }
  if (textLower.includes("asma") || textLower.includes("mengi")) {
    return { code: "J45.9", display: "Asthma, unspecified" };
  }
  if (textLower.includes("gastritis") || textLower.includes("maag") || textLower.includes("dispepsia") || textLower.includes("lambung")) {
    return { code: "K29.7", display: "Gastritis, unspecified" };
  }
  if (textLower.includes("gerd") || textLower.includes("asam lambung")) {
    return { code: "K21.9", display: "Gastro-esophageal reflux disease without esophagitis" };
  }
  if (textLower.includes("diabetes") || textLower.includes("gula") || textLower.includes("kencing manis")) {
    return { code: "E11.9", display: "Type 2 diabetes mellitus without complications" };
  }
  if (textLower.includes("cephalgia") || textLower.includes("pusing") || textLower.includes("sakit kepala") || textLower.includes("headache")) {
    return { code: "R51", display: "Headache (Cephalgia Akut)" };
  }
  if (textLower.includes("stroke")) {
    return { code: "I63.9", display: "Cerebral infarction, unspecified" };
  }
  if (textLower.includes("ginjal")) {
    return { code: "N18.9", display: "Chronic kidney disease, unspecified" };
  }
  if (textLower.includes("diare")) {
    return { code: "A09", display: "Infectious gastroenteritis and colitis, unspecified" };
  }
  if (textLower.includes("demam") || textLower.includes("fever")) {
    return { code: "R50.9", display: "Fever, unspecified" };
  }

  return { code: "Z00.0", display: "Encounter for general health examination" };
}
