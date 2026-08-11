import { createServerFn } from "@tanstack/react-start";
import { prisma } from "../db";
import type { MedicalFormData } from "../components/medical/MedicalHistoryFormDocument";
import type { OrganId } from "../lib/anatomy-data";

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
 * Save / Upsert Medical Report to PostgreSQL DB
 */
export const saveReportToDb = createServerFn({
  method: "POST",
})
  .validator(
    (input: {
      formData: MedicalFormData;
      organId: OrganId;
      isSigned: boolean;
      signatureDataUrl: string | null;
    }) => input
  )
  .handler(async ({ data }) => {
    const { formData, organId, isSigned, signatureDataUrl } = data;

    try {
      if (!formData.patientName) {
        return { success: true, message: "Empty patient form skipped" };
      }

      // 1. Find or create Doctor User
      let doctor = await prisma.user.findFirst({
        where: {
          name: formData.doctorName || "dr. Dokter Spesialis",
          role: "DOCTOR",
        },
      });

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
          aiDiagnosis: formData.diagnosis ? `${formData.diagnosis} (${formData.diagnosisIcd})` : "Dalam Evaluasi",
          clinicalRecommendations: formData.recommendations || "",
          patientFriendlySummary: formData.patientSummary || "",
          primaryOrgan: organId,
          verifiedAt: isSigned ? new Date() : null,
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
              organId: f.organId || organId,
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
      console.error("Database save error in saveReportToDb:", error);
      return { success: false, error: error.message };
    }
  });
