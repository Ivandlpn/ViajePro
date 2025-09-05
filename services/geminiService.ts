import { GoogleGenAI } from "@google/genai";
import type { Anomaly } from '../types';

// FIX: Aligned with @google/genai coding guidelines.
// The API key is now sourced exclusively from the `process.env.API_KEY`
// environment variable, removing the hardcoded simulated key. It is assumed
// to be pre-configured and valid in the execution environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

export const generateTripSummary = async (anomalies: Anomaly[]): Promise<string> => {
  // The check for API key presence was removed as per guidelines.
  if (anomalies.length === 0) {
    return "No anomalies were recorded on this trip.";
  }

  const promptAnomalies = anomalies.map(a => {
    const locationInfo = a.location ? `\n  Coordinates: ${a.location.lat.toFixed(6)}, ${a.location.lng.toFixed(6)}` : '';
    return `- Anomaly: ${a.defect} (${a.element})\n  Severity: ${a.level}\n  Location: PK ${a.pk}${locationInfo}\n  Notes: ${a.notes}`
  }
  ).join('\n');

  const prompt = `
    You are a railway maintenance supervisor's assistant.
    Based on the following list of anomalies recorded during a train cabin inspection, write a concise summary report.
    The report should be in Spanish.
    Start with a brief overview, then highlight the most severe issues (IAL level) first.
    The tone should be professional and direct.

    Anomalies recorded:
    ${promptAnomalies}

    Generate the summary report now.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error generating AI summary. Please check the console for details.";
  }
};
