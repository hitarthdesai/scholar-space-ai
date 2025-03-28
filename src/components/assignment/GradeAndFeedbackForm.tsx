import { QuestionType, EnumQuestionType } from "@/schemas/questionSchema";
import { getObject } from "@/utils/storage/s3/getObject";
import { getSingleCorrectMcqByIdForGrading } from "@/utils/classroom/question/getSingleCorrectMcqByIdForGrading";
import { getMultiCorrectMcqByIdForGrading } from "@/utils/classroom/question/getMultiCorrectMcqByIdForGrading";
import { GradeAndFeedbackFormInner } from "./GradeAndFeedbackFormInner";

type GradeAndFeedbackFormProps = {
  type: QuestionType;
  questionId: string;
  questionName: string;
  maxGrade: number;
  studentId: string;
  grade: number | undefined;
  feedback: string | undefined;
};

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

export const GradeAndFeedbackForm = async (
  props: GradeAndFeedbackFormProps
) => {
  const { type, questionId, studentId } = props;
  const questionTextPromise = getObject({
    fileName: `questions/${questionId}/question.txt`,
  });
  const dataPromise = getDataPromiseByQuestionType(type, questionId, studentId);

  const combinedPromsise = Promise.all([questionTextPromise, dataPromise]).then(
    ([questionText, data]) => ({
      ...data,
      questionText: questionText ?? "",
    })
  );

  return (
    <GradeAndFeedbackFormInner {...props} dataPromise={combinedPromsise} />
  );
};
