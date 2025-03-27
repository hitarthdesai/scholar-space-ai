import { db } from "@/server/db";
import {
  assignmentAttempts,
  classroomParticpants,
  questionFeedbacks,
  questions,
  users,
} from "@/server/db/schema";

import { and, sql, eq } from "drizzle-orm";
import {
  EnumClassroomParticpantStatus,
  EnumClassroomRole,
} from "@/schemas/classroomSchema";
import { z } from "zod";

type GetAllStudentsAndQuestionsForSubmissionProps = {
  classroomId: string;
  assignmentId: string;
};

export const getAllStudentsAndQuestionsForSubmission = async ({
  classroomId,
  assignmentId,
}: GetAllStudentsAndQuestionsForSubmissionProps) => {
  try {
    const _questions = await db
      .select({
        id: questions.id,
        name: questions.name,
        type: questions.type,
        maxGrade: questions.grade,
        attempt: {
          id: classroomParticpants.userId,
          name: users.name,
          grade: questionFeedbacks.grade,
          feedback: questionFeedbacks.feedback,
          submissionDate: assignmentAttempts.submitted,
        },
      })
      .from(questions)
      .innerJoin(
        classroomParticpants,
        eq(classroomParticpants.classroomId, classroomId)
      )
      .innerJoin(users, eq(classroomParticpants.userId, users.id))
      .leftJoin(
        assignmentAttempts,
        and(
          eq(assignmentAttempts.userId, classroomParticpants.userId),
          eq(assignmentAttempts.assignmentId, questions.assignmentId)
        )
      )
      .leftJoin(
        questionFeedbacks,
        eq(questions.id, questionFeedbacks.questionId)
      )
      .where(
        and(
          eq(classroomParticpants.classroomId, classroomId),
          eq(classroomParticpants.role, EnumClassroomRole.Student),
          eq(
            classroomParticpants.status,
            EnumClassroomParticpantStatus.Accepted
          ),
          eq(questions.assignmentId, assignmentId)
        )
      )
      .orderBy(sql`${questions.id} ASC NULLS FIRST`);

    const groupedQuestions: (Omit<(typeof _questions)[0], "attempt"> & {
      attempts: (typeof _questions)[0]["attempt"][];
    })[] = [];

    _questions.reduce((acc, question) => {
      const { id, name, type, maxGrade, attempt } = question;

      const grouped_q = acc.find((q) => q.id === id);
      if (!grouped_q) {
        acc.push({
          id,
          name,
          type,
          maxGrade,
          attempts: [attempt],
        });
      } else {
        grouped_q.attempts.push(attempt);
      }

      return acc;
    }, groupedQuestions);

    return groupedQuestions;
  } catch (error) {
    console.error("Error getting students and questions for submission", error);
    return [];
  }
};
