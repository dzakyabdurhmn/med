import { createServerFn } from "@tanstack/react-start";

export type SatuSehatVerificationResult = {
  success: boolean;
  isVerified: boolean;
  satusehatId?: string;
  officialName?: string;
  nik?: string;
  gender?: string;
  birthDate?: string;
  qualifications?: string[];
  active?: boolean;
  message: string;
  rawDetails?: any;
};

/**
 * Fetch OAuth2 Access Token from SATUSEHAT Auth Endpoint
 */
async function getSatuSehatAccessToken(): Promise<{ success: boolean; token?: string; error?: string }> {
  const clientId = process.env.SATUSEHAT_CLIENT_ID || "FqekkDa3pqiuH7mfG77UAFd2BIfuynx0kROPjnbzmcn6F5vY";
  const clientSecret = process.env.SATUSEHAT_CLIENT_SECRET || "FupmEuB8GfIAXqpM6vJBjYLwsN4Y05WGQvqnr8AEbpX2S19XAAFd97L8Arq7Olpf";
  const authUrl =
    process.env.SATUSEHAT_AUTH_URL ||
    "https://api-satusehat-stg.dto.kemkes.go.id/oauth2/v1/accesstoken?grant_type=client_credentials";

  try {
    const bodyParams = new URLSearchParams();
    bodyParams.append("client_id", clientId);
    bodyParams.append("client_secret", clientSecret);

    const response = await fetch(authUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: bodyParams.toString(),
    });

    if (!response.ok) {
      const errText = await response.text();
      return {
        success: false,
        error: `SATUSEHAT Auth Failed (${response.status}): ${errText}`,
      };
    }

    const data = await response.json();
    if (data.access_token) {
      return { success: true, token: data.access_token };
    }

    return { success: false, error: "Access token missing in SATUSEHAT auth response" };
  } catch (err: any) {
    return { success: false, error: err.message || "Network error fetching SATUSEHAT token" };
  }
}

/**
 * Server Function: Verify Doctor Practitioner with SATUSEHAT API by NIK
 */
export const verifyPractitionerWithSatuSehat = createServerFn({
  method: "POST",
})
  .validator((input: { nik: string; doctorName?: string }) => input)
  .handler(async ({ data }): Promise<SatuSehatVerificationResult> => {
    const { nik, doctorName } = data;

    const cleanNik = nik ? nik.trim() : "";
    if (!cleanNik || cleanNik.length < 10) {
      return {
        success: false,
        isVerified: false,
        message: "Nomor NIK tidak valid. Harus berupa 16 digit angka kependudukan.",
      };
    }

    // 1. Get OAuth Access Token
    const authResult = await getSatuSehatAccessToken();
    if (!authResult.success || !authResult.token) {
      console.warn("SATUSEHAT Auth Error:", authResult.error);
      return {
        success: false,
        isVerified: false,
        message: authResult.error || "Gagal melakukan otentikasi dengan Server SATUSEHAT Kemenkes RI.",
      };
    }

    // 2. Query Practitioner Endpoint by NIK Identifier
    const baseUrl = process.env.SATUSEHAT_BASE_URL || "https://api-satusehat-stg.dto.kemkes.go.id/fhir-kemenkes/v1";
    const queryUrl = `${baseUrl}/Practitioner?identifier=https://fhir.kemkes.go.id/id/nik|${cleanNik}`;

    try {
      const response = await fetch(queryUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${authResult.token}`,
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          isVerified: false,
          message: `SATUSEHAT Practitioner Query HTTP ${response.status}: ${errText}`,
        };
      }

      const bundle = await response.json();

      if (bundle && bundle.entry && bundle.entry.length > 0) {
        const practitioner = bundle.entry[0].resource;
        const satusehatId = practitioner.id;
        const officialName =
          practitioner.name && practitioner.name.length > 0
            ? practitioner.name[0].text || practitioner.name[0].given?.join(" ")
            : doctorName || "Dokter Terverifikasi";
        const gender = practitioner.gender || "-";
        const birthDate = practitioner.birthDate || "-";
        const qualifications = (practitioner.qualification || []).map((q: any) =>
          q.code?.text || q.code?.coding?.[0]?.display || "Kualifikasi Medis"
        );

        return {
          success: true,
          isVerified: true,
          satusehatId,
          officialName,
          nik: cleanNik,
          gender,
          birthDate,
          qualifications,
          active: practitioner.active ?? true,
          message: `Terverifikasi Resmi SATUSEHAT Kemenkes RI (ID: ${satusehatId})`,
          rawDetails: practitioner,
        };
      }

      // If bundle total is 0 or no entry found in STG environment:
      return {
        success: true,
        isVerified: false,
        message: `NIK ${cleanNik} tidak ditemukan dalam registri Practitioner SATUSEHAT Kemenkes RI STG.`,
      };
    } catch (err: any) {
      return {
        success: false,
        isVerified: false,
        message: `Gagal menghubungi SATUSEHAT Practitioner API: ${err.message}`,
      };
    }
  });
