import { createRequire } from "module";
import mammoth from "mammoth";

const require = createRequire(import.meta.url);
const { PDFParse } = require("pdf-parse");

/**
 * Extract plain text from an uploaded file buffer based on its mimetype.
 * Supports PDF, DOCX, and plain text fallback.
 */
export async function extractText(
  buffer: Buffer,
  mimetype: string,
  originalName: string
): Promise<string> {
  if (mimetype === "application/pdf" || originalName.endsWith(".pdf")) {
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    return result.text;
  }

  if (
    mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    originalName.endsWith(".docx")
  ) {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }

  if (
    mimetype === "application/msword" ||
    originalName.endsWith(".doc")
  ) {
    // .doc (legacy Word) is harder—try mammoth, fall back to raw
    try {
      const result = await mammoth.extractRawText({ buffer });
      return result.value;
    } catch {
      return buffer.toString("utf-8");
    }
  }

  // Fallback: treat as plain text
  return buffer.toString("utf-8");
}
