import { Router } from "express";
import express from "express";
import { generateQuiz } from "../controllers/quizController";

const router = express.Router();

router.post("/quiz", generateQuiz);

export default router;
