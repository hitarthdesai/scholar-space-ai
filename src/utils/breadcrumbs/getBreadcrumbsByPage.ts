import { Breadcrumbs } from "./types";
import { EnumPage } from "../constants/page";
import { db } from "@/server/db";
import {
  assignments,
  classroomAssignments,
  classrooms,
  questions,
} from "@/server/db/schema";
import { and, eq } from "drizzle-orm";

export type GetBreadcrumbsByPageProps =
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
      classroomId: string;
      assignmentId: string;
    }
  | {
      page: (typeof EnumPage)["Question"];
      classroomId: string;
      assignmentId: string;
      questionId: string;
    };

export async function getBreadcrumbsByPage(
  props: GetBreadcrumbsByPageProps
): Promise<Breadcrumbs> {
  switch (props.page) {
    case EnumPage.Classroom:
    case EnumPage.ClassroomParticipants:
    case EnumPage.ClassroomAssignments:
    case EnumPage.ClassroomFiles:
      const [{ classroomName }] = await db
        .select({
          classroomId: classrooms.id,
          classroomName: classrooms.name,
        })
        .from(classrooms)
        .where(eq(classrooms.id, props.classroomId));

      const links = [
        {
          label: "Home",
          href: "/",
        },
        {
          label: "Classrooms",
          href: "/classrooms",
        },
      ];

      if (props.page !== EnumPage.Classroom) {
        links.push({
          label: classroomName,
          href: `/classrooms/${props.classroomId}`,
        });
      }

      return links;

    case EnumPage.Assignment: {
      const [{ classroomName, assignmentName }] = await db
        .select({
          classroomName: classrooms.name,
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
        .where(
          and(
            eq(classroomAssignments.classroomId, props.classroomId),
            eq(classroomAssignments.assignmentId, props.assignmentId)
          )
        );

      const links = [
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
          href: `/classrooms/${props.classroomId}`,
        },
        {
          label: "Assignments",
          href: `/classrooms/${props.classroomId}/assignments`,
        },
      ];

      return links;
    }

    case EnumPage.Question: {
      const [{ classroomName, assignmentName, questionName }] = await db
        .select({
          classroomName: classrooms.name,
          assignmentName: assignments.name,
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
        .where(
          and(
            eq(classroomAssignments.classroomId, props.classroomId),
            eq(classroomAssignments.assignmentId, props.assignmentId),
            eq(questions.id, props.questionId)
          )
        );

      const links = [
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
          href: `/classrooms/${props.classroomId}`,
        },
        {
          label: assignmentName,
          href: `/classrooms/${props.classroomId}/assignments/${props.assignmentId}`,
        },
      ];

      return links;
    }

    default:
      return [];
  }
}
