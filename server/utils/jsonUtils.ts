export function cleanAndParseJson(rawResponse: string): any {
  // Step 1: Try direct parse (works when responseMimeType is set)
  try {
    return JSON.parse(rawResponse);
  } catch {
    // continue to cleaning steps
  }

  // Step 2: Strip markdown fences
  let cleaned = rawResponse.replace(/```(?:json)?\s*/g, "").trim();

  // Step 3: Extract the JSON object/array from surrounding text
  const jsonMatch = cleaned.match(/[\[{][\s\S]*[\]\}]/);
  if (jsonMatch) {
    cleaned = jsonMatch[0];
  }

  // Step 4: Try parsing the extracted JSON
  try {
    return JSON.parse(cleaned);
  } catch {
    // continue to aggressive cleaning
  }

  // Step 5: Fix common issues — unescaped newlines/tabs inside string values
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
