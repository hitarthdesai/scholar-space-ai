import { auth } from "@/utils/auth/config";
import assert from "assert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getAllStudentsAndQuestionsForSubmission } from "@/utils/classroom/getAllStudentsAndQuestionsForSubmission";
import {
  EnumSubmissionsViewMode,
  questionDisplayConfigByType,
} from "@/utils/constants/misc";
import { cn } from "@/utils/cn";
import { SubmissionRenderer } from "./SubmissionRenderer";
import { getObject } from "@/utils/storage/s3/getObject";

type StudentSubmissionProps = {
  classroomId: string;
  assignmentId: string;
};

export async function SubmissionsByStudents({
  classroomId,
  assignmentId,
}: StudentSubmissionProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const data = await getAllStudentsAndQuestionsForSubmission({
    classroomId,
    assignmentId,
  });

  const groupedSubmissions: (Pick<
    (typeof data)[0]["attempt"],
    "id" | "name" | "submissionDate"
  > & {
    questions: (Pick<(typeof data)[0], "id" | "name" | "type" | "maxGrade"> &
      Pick<(typeof data)[0]["attempt"], "grade" | "feedback">)[];
  })[] = [];

  data.reduce((acc, { id: questionId, type, name, maxGrade, attempt }) => {
    const grouped_q = acc.find((a) => a.id === attempt.id);
    if (!grouped_q) {
      acc.push({
        id: attempt.id,
        name: attempt.name,
        submissionDate: attempt.submissionDate,
        questions: [
          {
            id: questionId,
            name,
            type,
            maxGrade,
            grade: attempt.grade,
            feedback: attempt.feedback,
          },
        ],
      });
    } else {
      grouped_q.questions.push({
        id: questionId,
        name,
        type,
        maxGrade,
        grade: attempt.grade,
        feedback: attempt.feedback,
      });
    }

    return acc;
  }, groupedSubmissions);

  return (
    <div className="flex w-full flex-col gap-4">
      {groupedSubmissions.map(
        ({ id: studentId, name: studentName, submissionDate, questions }) => (
          <Card key={studentId}>
            <CardHeader>
              <CardTitle className="flex flex-row gap-2">
                {studentName}
                <span className="text-sm text-muted-foreground">
                  {submissionDate ? (
                    `submitted ${new Date(submissionDate).toLocaleString(
                      undefined,
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}`
                  ) : (
                    <p className="text-yellow-700">No submission</p>
                  )}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="multiple" className="w-full">
                {questions.map(
                  async ({
                    id: questionId,
                    name: questionName,
                    type,
                    maxGrade,
                    grade,
                    feedback,
                  }) => {
                    const questionText = await getObject({
                      fileName: `questions/${questionId}/question.txt`,
                    });
                    const displayConfig = questionDisplayConfigByType[type];
                    const gradeDisplayValue =
                      grade !== null ? grade.toString() : "-";

                    return (
                      <AccordionItem
                        key={`${studentId}-${questionId}`}
                        value={`${studentId}-${questionId}`}
                        disabled={!submissionDate}
                      >
                        <AccordionTrigger className="hover:no-underline">
                          <div className="flex w-full items-center justify-between pr-4">
                            <div className="flex flex-row items-center gap-1">
                              <Badge
                                className={cn(
                                  "flex w-fit items-center gap-2",
                                  displayConfig.badgeStyles
                                )}
                              >
                                {displayConfig.icon}
                              </Badge>
                              {questionName}
                            </div>
                            <Badge className="ml-auto mr-4">
                              {gradeDisplayValue}/{maxGrade}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="flex flex-col gap-2">
                          <div className="flex flex-col gap-1 rounded-md bg-muted p-2">
                            <p className="text-sm font-medium text-muted-foreground">
                              Question:{" "}
                            </p>
                            <p className="w-full text-sm">
                              {questionText ?? ""}
                            </p>
                          </div>
                          <SubmissionRenderer
                            type={type}
                            questionId={questionId}
                            studentId={studentId}
                            grade={grade ?? undefined}
                            feedback={feedback ?? undefined}
                          />
                        </AccordionContent>
                      </AccordionItem>
                    );
                  }
                )}
              </Accordion>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
