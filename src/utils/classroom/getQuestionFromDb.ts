import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  classroomStudents,
  questions,
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
  return db
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
    .innerJoin(classrooms, eq(classrooms.id, classroomAssignments.classroomId))
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
}
