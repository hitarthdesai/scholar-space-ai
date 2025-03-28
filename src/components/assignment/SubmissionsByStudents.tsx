import { auth } from "@/utils/auth/config";
import assert from "assert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { getAllStudentsAndQuestionsForSubmission } from "@/utils/classroom/getAllStudentsAndQuestionsForSubmission";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { TriangleAlertIcon } from "lucide-react";
import { GradeAndFeedbackForm } from "./GradeAndFeedbackForm";
import { Badge } from "../ui/badge";
import { cn } from "@/utils/cn";
import { questionDisplayConfigByType } from "@/utils/constants/misc";
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
    <Tabs className="flex w-full flex-col gap-4">
      <TabsList className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-7">
        {groupedSubmissions.map(({ id, name, submissionDate }) => (
          <TabsTrigger key={id} value={id}>
            <div className="flex items-center gap-2">
              {!submissionDate && (
                <TriangleAlertIcon className="h-4 w-4 text-yellow-700" />
              )}
              {name}
            </div>
          </TabsTrigger>
        ))}
      </TabsList>
      {groupedSubmissions.map(
        ({ id: studentId, name: studentName, submissionDate, questions }) => (
          <TabsContent key={studentId} value={studentId}>
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
                      const displayConfig = questionDisplayConfigByType[type];
                      const questionText = await getObject({
                        fileName: `questions/${questionId}/question.txt`,
                      });

                      return (
                        <AccordionItem
                          key={`${studentId}-${questionId}`}
                          value={`${studentId}-${questionId}`}
                          disabled={!submissionDate}
                          className="w-full"
                        >
                          <GradeAndFeedbackForm
                            type={type}
                            questionId={questionId}
                            questionName={questionName}
                            maxGrade={maxGrade}
                            studentId={studentId}
                            grade={grade ?? undefined}
                            feedback={feedback ?? undefined}
                            accordionTriggerTitle={
                              <div className="flex w-full grow flex-row items-center gap-1">
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
                            }
                            accordionContentDescription={
                              <div className="flex flex-col gap-1 rounded-md bg-muted p-2">
                                <p className="text-sm font-medium text-muted-foreground">
                                  Question:{" "}
                                </p>
                                <p className="w-full text-sm">{questionText}</p>
                              </div>
                            }
                          />
                        </AccordionItem>
                      );
                    }
                  )}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        )
      )}
    </Tabs>
  );
}
