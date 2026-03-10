export function cleanAndParseJson(rawResponse: string): any {
  try {
    return JSON.parse(rawResponse);
  } catch {
  }

  let cleaned = rawResponse.replace(/```(?:json)?\s*/g, "").trim();

  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]\}]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  try {
    return JSON.parse(cleaned);
  } catch {
  }

  cleaned = cleaned.replace(/(?<=["'])([^"']*?)\n([^"']*?)(?=["'])/g, (_, before, after) => {
    return `${before}\\n${after}`;
  });

  try {
    return JSON.parse(cleaned);
  } catch (finalError) {
    console.error("All JSON parse attempts failed. Raw response:", rawResponse.substring(0, 500));
    throw new Error("Failed to parse JSON response from Gemini.");
  }
}
