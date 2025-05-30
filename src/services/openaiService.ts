import openai from "../config/openai";
import { QuestionInput } from "../types";

// Function to generate multiple interview questions based on job requirements
export const generateInterviewQuestions = async (input: QuestionInput, numQuestions: number = 25) => {
  const prompt = `Generate ${numQuestions} ${input.experience} level technical interview questions for a candidate with knowledge of the following technologies: ${input.jobRequirements}. 
  The questions should specifically address practical scenarios or real-world applications for these skills. 
  Please ensure each question follows the format below:

  Question: <question text>
  Difficulty: <difficulty level>
  Evaluation Criteria: <evaluation criteria>

  The evaluation criteria should assess correctness, efficiency, code clarity, and real-world applicability of the solution.
  
  Repeat the above format for each question.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });

    const content = response.choices[0].message.content || "";
    
    // If no content was returned, throw an error
    if (!content) {
      throw new Error('No questions were generated by the AI.');
    }

    const questions = content.split("\n\n").map((q) => {
      const questionMatch = q.match(/Question:\s*(.*?)(?=\nDifficulty:|\n|$)/i);
      const difficultyMatch = q.match(/Difficulty:\s*(.*?)(?=\nEvaluation Criteria:|\n|$)/i);
      const evaluationMatch = q.match(/Evaluation Criteria:\s*([\s\S]*?)(?=\n\n|$)/i);

      return {
        question: questionMatch ? questionMatch[1].trim() : "",
        difficulty: difficultyMatch ? difficultyMatch[1].trim() : "Not Specified", // Default to "Not Specified" if missing
        evaluationCriteria: evaluationMatch ? evaluationMatch[1].trim() : "Not Provided", // Default to "Not Provided" if missing
      };
    });

    console.log(questions);
    return questions;
  } catch (error) {
    console.error("Error generating questions:", error);
    throw error;
  }
};
