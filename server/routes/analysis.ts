import { Router } from "express";
import multer from "multer";
import { handleAnalysis } from "../controllers/analysisController.js";

const router = Router();

// In-memory file storage (stateless — nothing persisted)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];
    if (allowed.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Unsupported file type. Upload PDF, DOCX, or TXT."));
    }
  },
});

router.post("/analyze", upload.single("file"), handleAnalysis);

export default router;
