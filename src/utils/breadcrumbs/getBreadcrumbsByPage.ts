import { Breadcrumb } from "./types";
import { EnumPage, Page } from "../constants/page";
import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  questions,
} from "@/server/db/schema";
import { eq } from "drizzle-orm";

type GetBreadcrumbsByPageProps =
  | {
      page: (typeof EnumPage)["Classroom"];
      classroomId: string;
    }
  | {
      page: (typeof EnumPage)["Assignment"];
      assignmentId: string;
    }
  | {
      page: (typeof EnumPage)["Question"];
      questionId: string;
    };

export async function getBreadcrumbsByPage(
  props: GetBreadcrumbsByPageProps
): Promise<Breadcrumb[]> {
  switch (props.page) {
    case EnumPage.Classroom:
      const [{ classroomId, classroomName }] = await db
        .select({
          classroomId: classrooms.id,
          classroomName: classrooms.name,
        })
        .from(classrooms)
        .where(eq(classrooms.id, props.classroomId));

      return [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Classrooms",
          href: "/classrooms",
        },
        {
          label: classroomName,
          href: `/classrooms/${classroomId}`,
        },
      ];

    case EnumPage.Assignment: {
      const [{ classroomId, classroomName }] = await db
        .select({
          classroomId: classroomAssignments.classroomId,
          classroomName: classrooms.name,
        })
        .from(classroomAssignments)
        .innerJoin(
          classrooms,
          eq(classroomAssignments.classroomId, classrooms.id)
        )
        .where(eq(classroomAssignments.assignmentId, props.assignmentId));

      return [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Classrooms",
          href: "/classrooms",
        },
        {
          label: classroomName,
          href: `/classrooms/${classroomId}`,
        },
      ];
    }

    case EnumPage.Question: {
      const [{ classroomId, classroomName, assignmentId, assignmentName }] =
        await db
          .select({
            classroomId: classroomAssignments.classroomId,
            classroomName: classrooms.name,
            assignmentId: questions.assignmentId,
            assignmentName: assignments.name,
          })
          .from(classroomAssignments)
          .innerJoin(
            classrooms,
            eq(classroomAssignments.classroomId, classrooms.id)
          )
          .innerJoin(
            assignments,
            eq(classroomAssignments.assignmentId, assignments.id)
          )
          .innerJoin(questions, eq(assignments.id, questions.assignmentId))
          .where(eq(questions.id, props.questionId));

      return [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Classrooms",
          href: "/classrooms",
        },
        {
          label: classroomName,
          href: `/classrooms/${classroomId}`,
        },
        {
          label: assignmentName,
          href: `/assignments/${assignmentId}`,
        },
      ];
    }

    default:
      return [];
  }
}
