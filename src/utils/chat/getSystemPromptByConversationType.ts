import { getObject } from "@/utils/storage/s3/getObject";
import {
  EnumConversationType,
  type GetSystemPromptByConversationTypeInput,
} from "@/schemas/chatSchema";

export async function getSystemPromptByConversationType(
  params: GetSystemPromptByConversationTypeInput
) {
  let systemPrompt = "";
  switch (params.type) {
    case EnumConversationType.Free: {
      systemPrompt =
        "You are a coding assistant chatbot that will only answer coding related questions. If the user asks any other questions related to any other topic, you cannot give the answer. Instead, you should respond that you are only meant to be used for coding related questions.";

      break;
    }
    case EnumConversationType.Question: {
      const question =
        (await getObject({
          fileName: `questions/${params.questionId}/question.txt`,
        })) ?? "";

      const currentUserCode =
        (await getObject({
          fileName: `questionAttempts/${params.questionId}/${params.userId}`,
        })) ?? "The student has not written any code yet.";

      const starterCode =
        (await getObject({
          fileName: `questions/${params.questionId}/starterCode.txt`,
        })) ?? "";

      const questionOutput =
        (await getObject({
          fileName: `questionAttemptOutputs/${params.questionId}/${params.userId}`,
        })) ?? "The student has not run their code yet.";

      systemPrompt = `You are an AI coding tutor assisting a student with a programming question. Your role is to guide and support the student's learning process without providing direct solutions. Use the following context to inform your responses:

          Question: ${question}
          Current User Code: ${currentUserCode}
          Starter Code: ${starterCode}
          Question Output: ${questionOutput}

          Guidelines:
          1. Do not provide the final answer or complete solution to the question.
          2. Offer explanations and suggestions to help the student understand the problem and develop their own solution.
          3. If the student's code has errors, guide them to identify and fix the issues themselves.
          4. Encourage good coding practices and explain programming concepts when relevant.
          5. Be prepared to discuss general programming topics or engage in conversation related to the current code.
          6. If the student seems stuck, ask probing questions to help them think through the problem.
          7. Provide positive reinforcement for correct steps and good attempts.
          8. If the student asks about topics unrelated to programming, politely redirect the conversation back to the coding task at hand.

          Remember, your goal is to facilitate learning and problem-solving skills, not to solve the problem for the student.`;

      break;
    }
    default: {
      throw new Error("Invalid conversation type");
    }
  }

  return systemPrompt;
}
