import { EnumQuestionType, QuestionType } from "@/schemas/questionSchema";
import { getSingleCorrectMcqByIdForGrading } from "@/utils/classroom/question/getSingleCorrectMcqByIdForGrading";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { getObject } from "@/utils/storage/s3/getObject";
import { Badge } from "../ui/badge";
import { getMultiCorrectMcqByIdForGrading } from "@/utils/classroom/question/getMultiCorrectMcqByIdForGrading";

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
    case EnumQuestionType.Code: {
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
    }

    case EnumQuestionType.SingleCorrectMcq: {
      const { selectedOption, correctAnswer, options } =
        await getSingleCorrectMcqByIdForGrading({
          id: questionId,
          userId: studentId,
        });

      return (
        <div className="space-y-2">
          <div className="space-y-1">
            {options.map(({ value, label }) => {
              const isSelected = selectedOption === value;
              const isCorrect = correctAnswer === value;
              const isCorrectSelection = isSelected && isCorrect;
              const isIncorrectSelection = isSelected && !isCorrect;
              const isMissedCorrect = !isSelected && isCorrect;

              return (
                <div
                  key={value}
                  className={`flex items-center justify-between rounded-md p-2 ${
                    isCorrectSelection
                      ? "bg-green-100 dark:bg-green-900/20"
                      : isIncorrectSelection
                        ? "bg-red-100 dark:bg-red-900/20"
                        : isMissedCorrect
                          ? "bg-amber-100 dark:bg-amber-900/20"
                          : ""
                  }`}
                >
                  <div className="flex w-full items-center">
                    <div className="flex items-center">
                      {isCorrectSelection && (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                      {isIncorrectSelection && (
                        <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                      {isMissedCorrect && (
                        <AlertCircle className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                      {!isSelected && !isCorrect && (
                        <div className="mr-2 h-4 w-4" />
                      )}
                      <span>{label}</span>
                    </div>
                    {isSelected && (
                      <Badge className="ml-auto" variant="secondary">
                        Answered
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Feedback:</span> {feedback}
          </div>
        </div>
      );
    }

    case EnumQuestionType.MultiCorrectMcq: {
      const { selectedOptions, correctAnswers, options } =
        await getMultiCorrectMcqByIdForGrading({
          id: questionId,
          userId: studentId,
        });

      return (
        <div className="space-y-2">
          <div className="space-y-1">
            {options.map(({ value, label }) => {
              const isSelected = selectedOptions?.includes(value);
              const isCorrect = correctAnswers?.includes(value);
              const isCorrectSelection = isSelected && isCorrect;
              const isIncorrectSelection = isSelected && !isCorrect;
              const isMissedCorrect = !isSelected && isCorrect;

              return (
                <div
                  key={value}
                  className={`flex items-center justify-between rounded-md p-2 ${
                    isCorrectSelection
                      ? "bg-green-100 dark:bg-green-900/20"
                      : isIncorrectSelection
                        ? "bg-red-100 dark:bg-red-900/20"
                        : isMissedCorrect
                          ? "bg-amber-100 dark:bg-amber-900/20"
                          : ""
                  }`}
                >
                  <div className="flex w-full items-center">
                    <div className="flex items-center">
                      {isCorrectSelection && (
                        <CheckCircle className="mr-2 h-4 w-4 text-green-600 dark:text-green-400" />
                      )}
                      {isIncorrectSelection && (
                        <XCircle className="mr-2 h-4 w-4 text-red-600 dark:text-red-400" />
                      )}
                      {isMissedCorrect && (
                        <AlertCircle className="mr-2 h-4 w-4 text-amber-600 dark:text-amber-400" />
                      )}
                      {!isSelected && !isCorrect && (
                        <div className="mr-2 h-4 w-4" />
                      )}
                      <span>{label}</span>
                    </div>
                    {isSelected && (
                      <Badge className="ml-auto" variant="secondary">
                        Answered
                      </Badge>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">Feedback:</span> {feedback}
          </div>
        </div>
      );
    }
    default:
      return null;
  }
};
