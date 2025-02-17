import { McqOption } from "@/schemas/questionSchema";
import { mergeMcqOptionsAndCorrectness } from "./mergeMcqOptionsAndCorrectness";
import { db } from "@/server/db";
import { questionOptions } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

type EditMcqProps = {
  id: string;
  newOptions: McqOption[];
  newCorrectOptions: string[];
};

export const editMcq = async ({
  id,
  newOptions,
  newCorrectOptions,
}: EditMcqProps): Promise<void> => {
  const mergedOptions = mergeMcqOptionsAndCorrectness({
    options: newOptions,
    correctOptions: newCorrectOptions,
  });

  const options = mergedOptions.map((option) => ({
    ...option,
    questionId: id,
    optionId: randomUUID(),
  }));

  return db.transaction(async (tx) => {
    await tx.delete(questionOptions).where(eq(questionOptions.questionId, id));
    await tx.insert(questionOptions).values(options);
  });
};
