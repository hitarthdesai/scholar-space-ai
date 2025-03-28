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
import { MailWarningIcon } from "lucide-react";

type QuestionSubmissionProps = {
  classroomId: string;
  assignmentId: string;
};

export async function SubmissionsByQuestions({
  classroomId,
  assignmentId,
}: QuestionSubmissionProps) {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const data = await getAllStudentsAndQuestionsForSubmission({
    classroomId,
    assignmentId,
  });

  const groupedSubmissions: (Omit<(typeof data)[0], "attempt"> & {
    attempts: (typeof data)[0]["attempt"][];
  })[] = [];

  data.reduce((acc, question) => {
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
  }, groupedSubmissions);

  return (
    <div className="flex w-full flex-col gap-4">
      {groupedSubmissions.map(
        async ({ name, type, maxGrade, attempts, id: questionId }) => {
          const questionText = await getObject({
            fileName: `questions/${questionId}/question.txt`,
          });

          const displayConfig = questionDisplayConfigByType[type];

          return (
            <Card key={questionId}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex w-full flex-row items-center gap-2">
                  <Badge
                    className={cn(
                      "flex w-fit items-center gap-2",
                      displayConfig.badgeStyles
                    )}
                  >
                    {displayConfig.icon}
                  </Badge>
                  {name}{" "}
                  <Badge variant="secondary">
                    {maxGrade} {maxGrade === 1 ? "point" : "points"}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-1 rounded-md bg-muted p-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Question:{" "}
                  </p>
                  <p className="w-full text-sm">{questionText}</p>
                </div>
                <Accordion type="multiple" className="w-full">
                  {attempts.map(
                    ({
                      id: studentId,
                      name,
                      grade,
                      feedback,
                      submissionDate,
                    }) => {
                      const gradeDisplayValue = !!grade
                        ? grade.toString()
                        : "-";

                      return (
                        <AccordionItem
                          key={`${questionId}-${studentId}`}
                          value={`${questionId}-${studentId}`}
                          disabled={!submissionDate}
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex w-full items-center justify-between pr-4">
                              <div className="flex flex-col gap-1">
                                <span>{name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {submissionDate ? (
                                    `submitted ${new Date(
                                      submissionDate
                                    ).toLocaleString(undefined, {
                                      weekday: "short",
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}`
                                  ) : (
                                    <p className="text-yellow-700">
                                      No submission
                                    </p>
                                  )}
                                </span>
                              </div>
                              <Badge className="ml-auto mr-4">
                                {gradeDisplayValue}/{maxGrade}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
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
          );
        }
      )}
    </div>
  );
}
