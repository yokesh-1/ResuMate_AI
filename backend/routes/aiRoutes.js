import express from'express'
import protect from "../middleware/authMiddleware.js";

import {enhanceJobDescription,enhanceProfessionalSummary,uploadResume, } from "../controllers/aiController.js";
import {suggestSkills} from '../controllers/skillsController.js'
import {reviewResumeAgent} from '../controllers/agentController.js'


const aiRouter = express.Router();

aiRouter.post("/enhanced-pro-sum", protect, enhanceProfessionalSummary);
aiRouter.post("/enhanced-job-desc", protect, enhanceJobDescription);
aiRouter.post("/upload-resume", protect, uploadResume);
aiRouter.post("/suggest-skills", protect, suggestSkills);
aiRouter.post("/review-agent", protect, reviewResumeAgent);

export default aiRouter;