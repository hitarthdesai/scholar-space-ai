import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  classroomStudents,
  questions,
  userQuestions,
} from "@/server/db/schema";
import { and, eq, or } from "drizzle-orm";

type GetQuestionFromDbProps = {
  questionId: string;
  userId: string;
};

export async function getQuestionFromDb({
  questionId,
  userId,
}: GetQuestionFromDbProps) {
  return db.transaction(async (tx) => {
    const _questions = await tx
      .select({
        id: questions.id,
        question: questions.question,
        assignmentId: assignments.id,
      })
      .from(questions)
      .innerJoin(assignments, eq(questions.assignmentId, assignments.id))
      .innerJoin(
        classroomAssignments,
        eq(classroomAssignments.assignmentId, assignments.id)
      )
      .innerJoin(
        classrooms,
        eq(classrooms.id, classroomAssignments.classroomId)
      )
      .leftJoin(
        classroomStudents,
        eq(classroomStudents.classroomId, classrooms.id)
      )
      .where(
        and(
          eq(questions.id, questionId),
          or(
            eq(classrooms.teacherId, userId),
            eq(classroomStudents.studentId, userId)
          )
        )
      );

    if (_questions.length === 0) {
      return _questions;
    }

    // If a userQuestion entry does not exist, make a new one
    const results = await tx
      .select({ id: userQuestions.conversationId })
      .from(userQuestions)
      .where(
        and(
          eq(userQuestions.userId, userId),
          eq(userQuestions.questionId, questionId)
        )
      );

    if (results.length === 0) {
      await tx.insert(userQuestions).values({
        userId,
        questionId,
        // Add url to storage object here
        answer: "",
      });
    }

    return _questions;
  });
}
