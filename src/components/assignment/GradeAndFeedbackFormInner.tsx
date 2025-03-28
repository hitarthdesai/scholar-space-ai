"use client";

import { addQuestion } from "@/actions/addQuestion";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  gradeAndFeedbackFormSchema,
  EnumGradeAndFeedbackResult,
  type GradeAndFeedbackForm as GradeAndFeedbackFormType,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { toastDescriptionAddQuestion } from "@/utils/constants/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type DefaultValues, useForm } from "react-hook-form";
import {
  SubmissionRenderer,
  type GradeAndFeedbackDataPromiseType,
} from "./SubmissionRenderer";
import { Suspense } from "react";

type GradeAndFeedbackFormInnerProps = {
  questionId: string;
  questionName: string;
  maxGrade: number;
  studentId: string;
  grade: number | undefined;
  feedback: string | undefined;
  dataPromise: GradeAndFeedbackDataPromiseType;
};

export const GradeAndFeedbackFormInner = (
  props: GradeAndFeedbackFormInnerProps
) => {
  const { questionId, studentId, grade, feedback, ...rest } = props;
  const defaultValues: DefaultValues<GradeAndFeedbackFormType> = {
    questionId,
    studentId,
    grade: grade ?? undefined,
    feedback: feedback ?? undefined,
  };

  const gradeAndFeedbackFormSchemaWithMaxGrade =
    gradeAndFeedbackFormSchema.extend({
      grade: gradeAndFeedbackFormSchema.shape.grade.max(
        rest.maxGrade,
        `Grade cannot be greater than ${rest.maxGrade}`
      ),
    });

  const form = useForm<GradeAndFeedbackFormType>({
    resolver: zodResolver(gradeAndFeedbackFormSchemaWithMaxGrade),
    defaultValues,
  });

  const router = useRouter();
  const { executeAsync } = useAction(addQuestion, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumGradeAndFeedbackResult.GradedSuccessfully;

      toast({
        title: isErroneous
          ? "Error in adding Question"
          : "Question added successfully",
        description: toastDescriptionAddQuestion[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      if (!isErroneous) {
        form.reset();
        router.refresh();
      }
    },
  });

  return (
    <Form {...form}>
      <form
        id={FormIds.GradeAndFeedback}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full flex-col gap-4"
      >
        <Suspense fallback={<p>Loading...</p>}>
          <SubmissionRenderer {...rest} form={form} />
        </Suspense>
      </form>
    </Form>
  );
};
