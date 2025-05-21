import { Request, Response } from "express";
import { generateQuizQuestions } from "../services/quizService";
import { QuestionInput } from "../types";

export const generateQuiz = async (req: Request, res: Response) => {
  try {
    const input: QuestionInput = req.body;

    const questions = await generateQuizQuestions(input, 10); 
  res.json({ questions });
  } catch (error) {
    console.error("Quiz generation failed:", error);
    res.status(500).json({ message: "Failed to generate quiz." });
  }
};
