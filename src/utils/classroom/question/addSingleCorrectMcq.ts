"use server";

import {
  type AddSingleCorrectMCQQuestionForm,
  EnumAddQuestionResult,
  EnumQuestionType,
} from "@/schemas/questionSchema";
import { db } from "@/server/db";
import { questionOptions } from "@/server/db/schema";
import { addQuestionToDb } from "@/utils/classroom/addQuestionToDb";
import { putObject } from "@/utils/storage/s3/putObject";
import { randomUUID } from "crypto";
import { mergeMcqOptionsAndCorrectness } from "./mergeMcqOptionsAndCorrectness";

type AddSingleCorrectMcqProps = AddSingleCorrectMCQQuestionForm;

export const addSingleCorrectMcq = async ({
  question,
  name,
  assignmentId,
  options,
  correctOption,
}: AddSingleCorrectMcqProps) => {
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

    await addQuestionToDb({
      questionId: newQuestionId,
      name,
      assignmentId,
      type: EnumQuestionType.SingleCorrectMcq,
    });

    const mergedOptions = mergeMcqOptionsAndCorrectness({
      options,
      correctOptions: [correctOption],
    });

    await db.insert(questionOptions).values(
      mergedOptions.map((option) => ({
        ...option,
        questionId: newQuestionId,
        optionId: randomUUID(),
      }))
    );

    return { type: EnumAddQuestionResult.QuestionAdded };
  } catch (e) {
    console.error(e);
    return { type: EnumAddQuestionResult.Error };
  }
};
