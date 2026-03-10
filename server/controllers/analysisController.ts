import { Request, Response } from "express";
import type { Multer } from "multer";
import { extractText } from "../utils/textExtractor.js";
import { preprocessResume } from "../utils/preprocessor.js";
import { analyzeWithATS } from "../services/atsAnalyzer.js";
import { analyzeHumanReadability } from "../services/humanAnalyzer.js";
import { analyzeInterviewReadiness } from "../services/interviewAnalyzer.js";
import { checkReality } from "../services/realityChecker.js";
import type {
  AnalysisType,
  JobLevel,
  AnalysisResponse,
} from "../types/index.js";

export async function handleAnalysis(req: Request & { file?: Express.Multer.File }, res: Response) {
  try {
    const file = req.file;
    if (!file) {
      res.status(400).json({
        success: false,
        error: "No resume file provided. Upload a PDF, DOCX, or TXT file.",
      });
      return;
    }

    const analysisType = req.body.analysisType as AnalysisType;
    if (!analysisType || !["ats", "interview", "reality"].includes(analysisType)) {
      res.status(400).json({
        success: false,
        error:
          'Invalid or missing analysisType. Must be "ats", "interview", or "reality".',
      });
      return;
    }

    const rawText = await extractText(
      file.buffer,
      file.mimetype,
      file.originalname
    );

    if (!rawText || rawText.trim().length < 20) {
      res.status(422).json({
        success: false,
        error:
          "Could not extract meaningful text from the uploaded file. Ensure the file is not image-based or corrupted.",
      });
      return;
    }

    const resume = preprocessResume(rawText);

    let response: AnalysisResponse;

    switch (analysisType) {
      case "ats": {
        const [atsResult, humanResult] = await Promise.all([
          analyzeWithATS(resume),
          analyzeHumanReadability(resume),
        ]);
        response = {
          success: true,
          analysisType,
          data: {
            ats: atsResult,
            human: humanResult,
          },
        };
        break;
      }

      case "interview": {
        const analysis = await analyzeInterviewReadiness(resume);
        response = {
          success: true,
          analysisType,
          data: analysis,
        };
        break;
      }

      case "reality": {
        const targetLevel = req.body.targetLevel as JobLevel;
        if (!targetLevel || !["entry", "mid", "senior"].includes(targetLevel)) {
          return res.status(400).json({
            success: false,
            error:
              'Invalid or missing targetLevel. Must be "entry", "mid", or "senior".',
          });
        }
        const analysis = await checkReality(resume, targetLevel);
        response = {
          success: true,
          analysisType,
          data: analysis,
        };
        break;
      }

      default:
        return res.status(400).json({
          success: false,
          error: "Invalid analysis type.",
        });
    }

    res.status(200).json(response);
  } catch (err) {
    console.error("Analysis error:", err);
    res.status(500).json({
      success: false,
      error: "Internal server error during analysis.",
    });
  }
}
