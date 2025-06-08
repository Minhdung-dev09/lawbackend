import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import { createConsultation, getAllConsultations, updateStatus, getMyConsultations } from "../controllers/consultationController.js";

const router = express.Router();

router.post("/", protect, createConsultation);
router.get("/my", protect, getMyConsultations);
router.get("/", protect, admin, getAllConsultations);
router.put("/:id/status", protect, admin, updateStatus);

export default router;