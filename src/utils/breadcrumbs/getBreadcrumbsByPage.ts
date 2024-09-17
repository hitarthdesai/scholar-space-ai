import { type Breadcrumb } from "./types";
import { EnumPage } from "../constants/page";
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
      page: (typeof EnumPage)["ClassroomInvitations"];
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
    case EnumPage.ClassroomInvitations:
      const [{ classroomId, classroomName }] = await db
        .select({
          classroomId: classrooms.id,
          classroomName: classrooms.name,
        })
        .from(classrooms)
        .where(eq(classrooms.id, props.classroomId));

      const breadcrumbs = [
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

      if (props.page === EnumPage.ClassroomInvitations) {
        breadcrumbs.push({
          label: "Invitations",
          href: `/classrooms/${classroomId}/invitations`,
        });
      }

      return breadcrumbs;

    case EnumPage.Assignment: {
      const [{ classroomId, classroomName, assignmentId, assignmentName }] =
        await db
          .select({
            classroomId: classroomAssignments.classroomId,
            classroomName: classrooms.name,
            assignmentId: assignments.id,
            assignmentName: assignments.name,
          })
          .from(classroomAssignments)
          .innerJoin(
            classrooms,
            eq(classroomAssignments.classroomId, classrooms.id)
          )
          .innerJoin(
            assignments,
            eq(classroomAssignments.assignmentId, props.assignmentId)
          );

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

    case EnumPage.Question: {
      const [
        {
          classroomId,
          classroomName,
          assignmentId,
          assignmentName,
          questionid,
          questionName,
        },
      ] = await db
        .select({
          classroomId: classroomAssignments.classroomId,
          classroomName: classrooms.name,
          assignmentId: questions.assignmentId,
          assignmentName: assignments.name,
          questionid: questions.id,
          questionName: questions.name,
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
        {
          label: questionName,
          href: `/questions/${questionid}`,
        },
      ];
    }

    default:
      return [];
  }
}
