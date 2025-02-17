"use server";

import {
  type AddCodeQuestionForm,
  EnumAddQuestionResult,
} from "@/schemas/questionSchema";
import { addQuestionToDb } from "@/utils/classroom/addQuestionToDb";
import { putObject } from "@/utils/storage/s3/putObject";
import { randomUUID } from "crypto";

type AddCodeQuestionProps = AddCodeQuestionForm;

export const addCodeQuestion = async ({
  question,
  name,
  assignmentId,
  starterCode,
}: AddCodeQuestionProps) => {
  try {
    const newQuestionId = randomUUID();
    const questionTextFileName = `questions/${newQuestionId}/question.txt`;
    const questionTextBuffer = Buffer.from(question, "utf-8");
    const didQuestionTextUploadSucceed = await putObject({
      body: questionTextBuffer,
      fileName: questionTextFileName,
      contentType: "text/plain",
    });

    if (!didQuestionTextUploadSucceed) {
      return { type: EnumAddQuestionResult.NotUploaded };
    }

    const starterCodeFileName = `questions/${newQuestionId}/starterCode.txt`;
    const starterCodeBuffer = Buffer.from(starterCode, "utf-8");
    const didStarterCodeUploadSucceed = await putObject({
      body: starterCodeBuffer,
      fileName: starterCodeFileName,
      contentType: "text/plain",
    });

    if (!didStarterCodeUploadSucceed) {
      return { type: EnumAddQuestionResult.NotUploaded };
    }

    await addQuestionToDb({
      questionId: newQuestionId,
      name,
      assignmentId,
    });

    return { type: EnumAddQuestionResult.QuestionAdded };
  } catch (e) {
    console.error(e);
    return { type: EnumAddQuestionResult.Error };
  }
};
