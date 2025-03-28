import { type QuestionType, EnumQuestionType } from "@/schemas/questionSchema";
import { getObject } from "@/utils/storage/s3/getObject";
import { getSingleCorrectMcqByIdForGrading } from "@/utils/classroom/question/getSingleCorrectMcqByIdForGrading";
import { getMultiCorrectMcqByIdForGrading } from "@/utils/classroom/question/getMultiCorrectMcqByIdForGrading";
import { GradeAndFeedbackFormInner } from "./GradeAndFeedbackFormInner";
import { type SubmissionRendererProps } from "./SubmissionRenderer";

type GradeAndFeedbackFormProps = {
  type: QuestionType;
  questionId: string;
  studentId: string;
  grade: number | undefined;
  feedback: string | undefined;
} & Omit<SubmissionRendererProps, "form" | "dataPromise">;

const getDataPromiseByQuestionType = (
  type: QuestionType,
  questionId: string,
  studentId: string
) => {
  switch (type) {
    case EnumQuestionType.Code: {
      return getObject({
        fileName: `questionAttempts/${questionId}/${studentId}/solution`,
      }).then((res) => ({
        type: EnumQuestionType.Code,
        attemptCode: res,
      }));
    }

    case EnumQuestionType.SingleCorrectMcq: {
      return getSingleCorrectMcqByIdForGrading({
        id: questionId,
        userId: studentId,
      }).then((res) => ({
        type: EnumQuestionType.SingleCorrectMcq,
        selectedOption: res.selectedOption,
        correctAnswer: res.correctAnswer,
        options: res.options,
      }));
    }

    case EnumQuestionType.MultiCorrectMcq: {
      return getMultiCorrectMcqByIdForGrading({
        id: questionId,
        userId: studentId,
      }).then((res) => ({
        type: EnumQuestionType.MultiCorrectMcq,
        selectedOptions: res.selectedOptions,
        correctAnswers: res.correctAnswers,
        options: res.options,
      }));
    }
  }
};

export const GradeAndFeedbackForm = (props: GradeAndFeedbackFormProps) => {
  const { type, questionId, studentId } = props;
  const dataPromise = getDataPromiseByQuestionType(type, questionId, studentId);

  return <GradeAndFeedbackFormInner {...props} dataPromise={dataPromise} />;
};
