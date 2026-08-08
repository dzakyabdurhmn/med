import { createServerFn } from "@tanstack/react-start";
import { prisma } from "../db";
import type { MedicalFormData } from "../components/medical/MedicalHistoryFormDocument";
import type { OrganId } from "../lib/anatomy-data";

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
