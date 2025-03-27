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
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getAllStudentsAndQuestionsForSubmission } from "@/utils/classroom/getAllStudentsAndQuestionsForSubmission";
import { questionDisplayConfigByType } from "@/utils/constants/misc";
import { cn } from "@/utils/cn";
import { SubmissionRenderer } from "./SubmissionRenderer";
import { getObject } from "@/utils/storage/s3/getObject";

// Mock data

const questions = [
  {
    id: 1,
    title: "Question 1",
    type: "code",
    description: "Write a function to find the maximum value in an array.",
    maxScore: 10,
  },
  {
    id: 2,
    title: "Question 2",
    type: "mcq-single",
    description:
      "Which data structure would be most efficient for implementing a priority queue?",
    options: ["Array", "Linked List", "Heap", "Stack"],
    correctAnswer: 2,
    maxScore: 5,
  },
  {
    id: 3,
    title: "Question 3",
    type: "mcq-multi",
    description:
      "Select all sorting algorithms with O(n log n) average time complexity.",
    options: [
      "Bubble Sort",
      "Merge Sort",
      "Quick Sort",
      "Insertion Sort",
      "Heap Sort",
    ],
    correctAnswers: [1, 2, 4],
    maxScore: 5,
  },
  {
    id: 4,
    title: "Question 4",
    type: "code",
    description: "Implement a function to check if a string is a palindrome.",
    maxScore: 10,
  },
];

// Helper function to get question by ID
const getQuestionById = (id) => {
  return questions.find((question) => question.id === id);
};

// Component to render MCQ multiple choice submission
const MCQMultiSubmission = ({ submission }) => {
  const question = getQuestionById(submission.questionId);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="font-medium">{question.description}</div>
        <Badge
          variant={
            submission.score === 0
              ? "destructive"
              : submission.score < question.maxScore
                ? "outline"
                : "default"
          }
        >
          {submission.score}/{question.maxScore}
        </Badge>
      </div>
      <div className="space-y-1">
        {question.options.map((option, index) => {
          const isSelected = submission.answer?.includes(index);
          const isCorrect = question.correctAnswers.includes(index);
          const isCorrectSelection = isSelected && isCorrect;
          const isIncorrectSelection = isSelected && !isCorrect;
          const isMissedCorrect = !isSelected && isCorrect;

          return (
            <div
              key={index}
              className={`flex items-center rounded-md p-2 ${
                isCorrectSelection
                  ? "bg-green-100 dark:bg-green-900/20"
                  : isIncorrectSelection
                    ? "bg-red-100 dark:bg-red-900/20"
                    : isMissedCorrect
                      ? "bg-amber-100 dark:bg-amber-900/20"
                      : ""
              }`}
            >
              {isCorrectSelection && (
                <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
              )}
              {isIncorrectSelection && (
                <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
              )}
              {isMissedCorrect && (
                <AlertCircle className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
              )}
              {!isSelected && !isCorrect && <div className="mr-2 h-4 w-4" />}
              <span>{option}</span>
            </div>
          );
        })}
      </div>
      <div className="text-sm text-muted-foreground">
        <span className="font-medium">Feedback:</span> {submission.feedback}
      </div>
    </div>
  );
};

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

  const groupedQuestions = await getAllStudentsAndQuestionsForSubmission({
    classroomId,
    assignmentId,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      {groupedQuestions.map(
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
                {/* <AccordionTrigger
                headerClassname="flex w-full items-center justify-between"
                className="px-4 hover:bg-secondary hover:no-underline"
              >
                </AccordionTrigger> */}
                <div className="rounded-md bg-muted p-2">
                  <p className="text-sm font-medium text-muted-foreground">
                    Question:{" "}
                  </p>
                  <p className="w-full py-1 text-sm">{questionText}</p>
                </div>
                <Accordion type="single" collapsible className="w-full">
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
                        >
                          <AccordionTrigger className="hover:no-underline">
                            <div className="flex w-full items-center justify-between pr-4">
                              <div className="flex flex-row gap-2">
                                <span>{name}</span>
                                <span className="text-sm text-muted-foreground">
                                  {submissionDate
                                    ? `submitted ${new Date(
                                        submissionDate
                                      ).toLocaleString(undefined, {
                                        weekday: "short",
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                      })}`
                                    : "No submission"}
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
