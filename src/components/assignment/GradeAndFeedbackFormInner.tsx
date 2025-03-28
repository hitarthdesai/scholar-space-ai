"use client";

import { editGradeAndFeedback } from "@/actions/editGradeAndFeedback";
import { Form } from "@/components/ui/form";
import { toast } from "@/components/ui/use-toast";
import {
  gradeAndFeedbackFormSchema,
  EnumEditGradeAndFeedbackResult,
  type GradeAndFeedbackForm as GradeAndFeedbackFormType,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { toastDescriptionEditGradeAndFeedback } from "@/utils/constants/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type DefaultValues, useForm } from "react-hook-form";
import {
  SubmissionRenderer,
  type SubmissionRendererProps,
} from "./SubmissionRenderer";
import { Suspense } from "react";

type GradeAndFeedbackFormInnerProps = {
  questionId: string;
  studentId: string;
  grade: number | undefined;
  feedback: string | undefined;
} & Omit<SubmissionRendererProps, "form">;

export const GradeAndFeedbackFormInner = (
  props: GradeAndFeedbackFormInnerProps
) => {
  const { questionId, studentId, grade, feedback, ...rest } = props;
  console.log("IN FORM INNER", { feedback, grade });
  const defaultValues: DefaultValues<GradeAndFeedbackFormType> = {
    questionId,
    studentId,
    grade: grade ?? undefined,
    feedback: feedback ?? "",
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
  const { executeAsync } = useAction(editGradeAndFeedback, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumEditGradeAndFeedbackResult.GradedSuccessfully;

      toast({
        title: isErroneous
          ? "Error in editing grade and feedback"
          : "Grade and feedback edited successfully",
        description: toastDescriptionEditGradeAndFeedback[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      if (!isErroneous) {
        router.refresh();
      }
    },
  });

  return (
    <Form {...form}>
      <form
        id={`${FormIds.GradeAndFeedback}-${studentId}-${questionId}`}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full w-full flex-col"
      >
        <Suspense fallback={<p>Loading...</p>}>
          <SubmissionRenderer {...rest} form={form} />
        </Suspense>
      </form>
    </Form>
  );
};
