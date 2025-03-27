import { EnumQuestionType, QuestionType } from "@/schemas/questionSchema";
import { getSingleCorrectMcqByIdForGrading } from "@/utils/classroom/question/getSingleCorrectMcqByIdForGrading";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getObject } from "@/utils/storage/s3/getObject";
import { Badge } from "../ui/badge";

type SubmissionRendererProps = {
  type: QuestionType;
  studentId: string;
  questionId: string;
  grade: number | undefined;
  feedback: string | undefined;
};

export const SubmissionRenderer = async ({
  type,
  studentId,
  questionId,
  feedback,
}: SubmissionRendererProps) => {
  switch (type) {
    case EnumQuestionType.Code:
      const attemptCode = await getObject({
        fileName: `questionAttempts/${questionId}/${studentId}/solution`,
      });

      return (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
            <pre>{attemptCode ?? ""}</pre>
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Feedback:</span> {feedback}
          </div>
        </div>
      );

    case EnumQuestionType.SingleCorrectMcq:
      const { selectedOption, correctAnswer, options } =
        await getSingleCorrectMcqByIdForGrading({
          id: questionId,
          userId: studentId,
        });

      return (
        <div className="space-y-2">
          <div className="space-y-1">
            {options.map(({ value, label }) => (
              <div
                key={value}
                className={`flex items-center justify-between rounded-md p-2 ${
                  value === correctAnswer
                    ? "bg-green-100 dark:bg-green-900/20"
                    : ""
                }`}
              >
                {value === correctAnswer ? (
                  <div className="flex w-full items-center">
                    <div className="flex items-center">
                      <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                      <span>{label}</span>
                    </div>
                    {value === selectedOption && (
                      <Badge className="ml-auto" variant="secondary">
                        Answered
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="flex w-full items-center">
                    <div className="flex items-center">
                      <div className="mr-2 h-4 w-4" />
                      <span>{label}</span>
                    </div>
                    {value === selectedOption && (
                      <Badge className="ml-auto" variant="secondary">
                        Answered
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Feedback:</span> {feedback}
          </div>
        </div>
      );
    // case EnumQuestionType.MultiCorrectMcq:
    //   return <MCQMultiSubmission submission={submission} />;
    default:
      return <div>Unknown submission type</div>;
  }
};
