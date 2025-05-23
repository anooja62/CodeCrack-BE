import openai from "../config/openai";
import { QuestionInput } from "../types";

export const generateQuizQuestions = async (input: QuestionInput, numQuestions = 10) => {
  const prompt = `Generate ${numQuestions} ${input.experience} level technical quiz questions based on the following technologies: ${input.jobRequirements}.
Each question should be multiple-choice with 4 options and clearly indicate the correct answer.
Format:

Question: <question text>
Options:
A) <option>
B) <option>
C) <option>
D) <option>
Answer: <correct option letter>`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content || "";
    const questions = content.split(/\n\n+/).map((block) => {
      const questionMatch = block.match(/Question:\s*(.*)/);
      const optionsMatch = block.match(/Options:\s*A\)\s*(.*?)\nB\)\s*(.*?)\nC\)\s*(.*?)\nD\)\s*(.*?)(?=\n|$)/);
      const answerMatch = block.match(/Answer:\s*([A-D])/);

      const letterToIndex = { A: 0, B: 1, C: 2, D: 3 };

      return {
        question: questionMatch?.[1] || "",
        options: optionsMatch ? [optionsMatch[1], optionsMatch[2], optionsMatch[3], optionsMatch[4]] : [],
        answer: letterToIndex[answerMatch?.[1] as keyof typeof letterToIndex] ?? -1,
      };
      
    });
    return questions;
} catch (error) {
  console.error("Error generating quiz questions:", error);
  throw error;
}
};