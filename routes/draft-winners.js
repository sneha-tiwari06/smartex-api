import express from "express";
import {
  addDraft,
  deleteDraft,
  getDraft,
  getDrafts,
  updateDraft,
  publishDraft
} from "../controllers/draft-winners.js";

const router = express.Router();

router.get("/", getDrafts);
router.get("/:id", getDraft);
router.post("/", addDraft);
router.delete("/:id", deleteDraft);
router.put("/:id", updateDraft);
router.post("/:id/publish", publishDraft);

export default router;
