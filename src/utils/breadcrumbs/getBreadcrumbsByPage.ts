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
      page: (typeof EnumPage)["ClassroomParticipants"];
      classroomId: string;
    }
  | {
      page: (typeof EnumPage)["ClassroomAssignments"];
      classroomId: string;
    }
  | {
      page: (typeof EnumPage)["ClassroomFiles"];
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
    case EnumPage.ClassroomParticipants:
    case EnumPage.ClassroomAssignments:
    case EnumPage.ClassroomFiles:
      const [{ classroomId, classroomName }] = await db
        .select({
          classroomId: classrooms.id,
          classroomName: classrooms.name,
        })
        .from(classrooms)
        .where(eq(classrooms.id, props.classroomId));

      const breadcrumbs = [
        {
          label: "Classrooms",
          href: "/classrooms",
        },
        {
          label: classroomName,
          href: `/classrooms/${classroomId}`,
        },
      ];

      switch (props.page) {
        case EnumPage.ClassroomParticipants: {
          breadcrumbs.push({
            label: "Participants",
            href: `/classrooms/${classroomId}/participants`,
          });
          return breadcrumbs;
        }

        case EnumPage.ClassroomAssignments: {
          breadcrumbs.push({
            label: "Assignments",
            href: `/classrooms/${classroomId}/assignments`,
          });
          return breadcrumbs;
        }

        case EnumPage.ClassroomFiles: {
          breadcrumbs.push({
            label: "Files",
            href: `/classrooms/${classroomId}/files`,
          });
          return breadcrumbs;
        }

        default:
          return breadcrumbs;
      }

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
          label: "Classrooms",
          href: "/classrooms",
        },
        {
          label: classroomName,
          href: `/classrooms/${classroomId}`,
        },
        {
          label: "Assignments",
          href: `/classrooms/${classroomId}/assignments`,
        },
        {
          label: assignmentName,
          href: `/classrooms/${classroomId}/assignments/${assignmentId}`,
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
          label: "Classrooms",
          href: "/classrooms",
        },
        {
          label: classroomName,
          href: `/classrooms/${classroomId}`,
        },
        {
          label: "Assignments",
          href: `/classrooms/${classroomId}/assignments`,
        },
        {
          label: assignmentName,
          href: `/classrooms/${classroomId}/assignments/${assignmentId}`,
        },
        {
          label: questionName,
          href: `/classrooms/${classroomId}/assignments/${assignmentId}/questions/${questionid}`,
        },
      ];
    }

    default:
      return [];
  }
}
