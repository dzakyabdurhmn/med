import { createFileRoute } from '@tanstack/react-router'
import { buildOfficialReportPdf, buildReportResponse } from '../server/report-pdf'
import type { MedicalFormData } from '../components/medical/MedicalHistoryFormDocument'

/**
 * Official PDF export endpoint.
 * A plain HTTP server route (no seroval/RPC involved) that streams the
 * generated hospital document straight to the browser as a downloadable PDF.
 */
export const Route = createFileRoute('/api/report-pdf')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const body = await request.json()
        const data = { ...body }

        if (!data || typeof data !== 'object' || !data.formData) {
          return new Response('Missing formData', { status: 400 })
        }

        const formData = data.formData as MedicalFormData
        const reportNumber =
          formData.insurancePolicyNumber ||
          `RME-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`

        const pdfBytes = await buildOfficialReportPdf({
          formData,
          isDoctorSigned: Boolean(data.isDoctorSigned),
          signedAtTimestamp: data.signedAtTimestamp ?? null,
          signatureDataUrl: data.signatureDataUrl ?? null,
        })

        return buildReportResponse(pdfBytes, reportNumber)
      },
    },
  },
})