import { db } from "@/server/db";
import { questionFeedbacks } from "@/server/db/schema";

type EditGradeAndFeedbackInDbProps = {
  studentId: string;
  questionId: string;
  grade: number;
  feedback: string;
};

export async function editGradeAndFeedbackInDb({
  studentId,
  questionId,
  grade,
  feedback,
}: EditGradeAndFeedbackInDbProps) {
  await db
    .insert(questionFeedbacks)
    .values({
      questionId,
      grade,
      feedback,
      userId: studentId,
    })
    .onConflictDoUpdate({
      target: [questionFeedbacks.userId, questionFeedbacks.questionId],
      set: { grade: grade, feedback: feedback },
    });
}
