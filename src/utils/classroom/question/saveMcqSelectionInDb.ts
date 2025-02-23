import { db } from "@/server/db";
import { questionSelectedOptions } from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

type SaveMcqSelectionInDbProps = {
  userId: string;
  questionId: string;
  selectedOptions: string[];
};

export function saveMcqSelectionInDb({
  userId,
  questionId,
  selectedOptions,
}: SaveMcqSelectionInDbProps) {
  return db.transaction(async (tx) => {
    await tx
      .delete(questionSelectedOptions)
      .where(
        and(
          eq(questionSelectedOptions.questionId, questionId),
          eq(questionSelectedOptions.userId, userId)
        )
      );

    if (selectedOptions.length === 0) return;

    const selections = selectedOptions.map((so) => ({
      questionId,
      userId,
      optionId: so,
    }));

    await tx.insert(questionSelectedOptions).values(selections);
  });
}
