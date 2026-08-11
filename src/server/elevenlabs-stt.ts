import { createServerFn } from "@tanstack/react-start";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";

export type SpeakerRole = "doctor" | "patient";

/**
 * Heuristic & NLP Speaker Intent Classifier:
 * Automatically classifies spoken text into Doctor (DPJP) vs Patient without manual toggle.
 */
export function classifySpeakerRole(text: string): SpeakerRole {
  const lower = text.toLowerCase().trim();

  // Typical Doctor phrasing patterns in Indonesian clinical consultations
  const doctorKeywords = [
    "selamat pagi", "selamat siang", "selamat sore", "ada yang bisa dibantu",
    "sejak kapan", "berapa lama", "ada keluhan lain", "coba saya periksa",
    "buka mulutnya", "tarik napas", "hembuskan", "tekanan darah", "tensi",
    "resep", "obat ini", "diminum", "kali sehari", "sesudah makan", "sebelum makan",
    "istirahat yang cukup", "kontrol lagi", "bapak", "ibu", "dek", "pak", "bu"
  ];

  // Typical Patient phrasing patterns
  const patientKeywords = [
    "saya", "rasanya", "nyeri", "sakit", "pusing", "mual", "muntah", "sesak",
    "batuk", "demam", "gatal", "lemas", "sudah 3 hari", "kemarin", "tadi malam",
    "ngilu", "terikat", "panas", "dada saya", "perut saya", "kepala saya"
  ];

  let doctorScore = 0;
  let patientScore = 0;

  for (const kw of doctorKeywords) {
    if (lower.includes(kw)) doctorScore += 1.5;
  }

  for (const kw of patientKeywords) {
    if (lower.includes(kw)) patientScore += 1.5;
  }

  // Question mark or asking words usually imply Doctor during anamnesis
  if (lower.endsWith("?") || lower.startsWith("apakah") || lower.startsWith("bagaimana") || lower.startsWith("sejak")) {
    doctorScore += 1.0;
  }

  if (patientScore > doctorScore) {
    return "patient";
  }

  return "doctor";
}

/**
 * Server Function: Transcribe audio with ElevenLabs Speech-to-Text API
 */
export const transcribeWithElevenLabs = createServerFn({
  method: "POST",
})
  .validator(
    (input: {
      audioBase64?: string;
      sourceUrl?: string;
    }) => input
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.ELEVENLABS_API_KEY || "sk_35f73def359786662aa34dab3751bacbe9dd2686ad8e46e5";

    try {
      const client = new ElevenLabsClient({ apiKey });

      if (data.sourceUrl) {
        const response = await client.speechToText.convert({
          modelId: "scribe_v2",
          sourceUrl: data.sourceUrl,
        });
        return {
          success: true,
          transcript: (response as any).text || (response as any).transcript || "",
          rawResponse: response,
        };
      }

      if (data.audioBase64) {
        // Convert base64 audio to Blob / File buffer for ElevenLabs STT SDK
        const buffer = Buffer.from(data.audioBase64, "base64");
        const blob = new Blob([buffer], { type: "audio/mp3" });
        const file = new File([blob], "recorded_speech.mp3", { type: "audio/mp3" });

        const response = await client.speechToText.convert({
          modelId: "scribe_v2",
          file: file,
        });

        return {
          success: true,
          transcript: (response as any).text || (response as any).transcript || "",
          rawResponse: response,
        };
      }
    } catch (err: any) {
      console.warn("ElevenLabs STT API call fallback:", err?.message || err);
    }

    return {
      success: false,
      transcript: "",
    };
  });
