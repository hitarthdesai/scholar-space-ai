"use client";

import {
  EnumQuestionType,
  type GradeAndFeedbackForm,
} from "@/schemas/questionSchema";
import { CheckCircle, XCircle, AlertCircle, SaveIcon } from "lucide-react";
import { Badge } from "../ui/badge";
import { type UseFormReturn } from "react-hook-form";
import { type ReactNode, use } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { AccordionTrigger, AccordionContent } from "../ui/accordion";
import { LoadingButton } from "../ui/loading-button";
import { FormIds } from "@/utils/constants/form";

export type GradeAndFeedbackDataPromiseType = Promise<
  | {
      type: (typeof EnumQuestionType)["Code"];
      attemptCode: string | undefined;
    }
  | {
      type: (typeof EnumQuestionType)["SingleCorrectMcq"];
      selectedOption: string;
      correctAnswer: string;
      options: { value: string; label: string }[];
    }
  | {
      type: (typeof EnumQuestionType)["MultiCorrectMcq"];
      selectedOptions: string[];
      correctAnswers: string[];
      options: { value: string; label: string }[];
    }
>;

type SubmissionRendererPropsByTypeProps = {
  form: UseFormReturn<GradeAndFeedbackForm>;
  data: Awaited<GradeAndFeedbackDataPromiseType>;
};

export type SubmissionRendererProps = {
  questionName: string;
  maxGrade: number;
  form: UseFormReturn<GradeAndFeedbackForm>;
  dataPromise: GradeAndFeedbackDataPromiseType;
  accordionTriggerTitle?: ReactNode;
  accordionContentDescription?: ReactNode;
};

const FeedbackField = ({
  form,
}: {
  form: UseFormReturn<GradeAndFeedbackForm>;
}) => {
  return (
    <div className="flex flex-row gap-4">
      <FormField
        control={form.control}
        name="feedback"
        render={({ field }) => (
          <FormItem className="w-full grow">
            <FormLabel className="text-muted-foreground">Feedback:</FormLabel>
            <FormControl>
              <div className="w-full grow">
                <Textarea required {...field} />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

const SubmissionRendererByType = ({
  form,
  data,
}: SubmissionRendererPropsByTypeProps) => {
  switch (data.type) {
    case EnumQuestionType.Code: {
      const { attemptCode } = data;

      return (
        <div className="space-y-2">
          <div className="overflow-x-auto rounded-md bg-slate-950 p-4 font-mono text-sm text-slate-50">
            <pre>{attemptCode ?? ""}</pre>
          </div>
          <FeedbackField form={form} />
        </div>
      );
    }

    case EnumQuestionType.SingleCorrectMcq: {
      const { selectedOption, correctAnswer, options } = data;

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
          <FeedbackField form={form} />
        </div>
      );
    }

    case EnumQuestionType.MultiCorrectMcq: {
      const { selectedOptions, correctAnswers, options } = data;

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
          <FeedbackField form={form} />
        </div>
      );
    }
    default:
      return null;
  }
};

export const SubmissionRenderer = ({
  form,
  maxGrade,
  dataPromise,
  accordionTriggerTitle,
  accordionContentDescription,
}: SubmissionRendererProps) => {
  const data = use(dataPromise);
  if (!data) return null;

  const {
    formState: { isSubmitting, disabled },
    getValues,
  } = form;

  const { studentId, questionId } = getValues();

  return (
    <>
      <div className="flex w-full items-center justify-between gap-4">
        <AccordionTrigger
          headerClassname="w-full"
          className="flex w-full grow items-center justify-between hover:no-underline"
        >
          {accordionTriggerTitle}
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem className="flex w-full flex-col items-end pr-4">
                <FormControl>
                  <div className="flex max-w-24 flex-row items-center gap-1">
                    <Input
                      type="number"
                      required
                      {...field}
                      onChange={(e) => {
                        const value = e.target.valueAsNumber;
                        field.onChange(isNaN(value) ? "" : value);
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="text-right"
                    />
                    <p>/</p>
                    <p>{maxGrade}</p>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </AccordionTrigger>
        <LoadingButton
          type="submit"
          form={`${FormIds.GradeAndFeedback}-${studentId}-${questionId}`}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled}
          isLoading={isSubmitting}
          size="icon"
          variant="ghost"
        >
          <SaveIcon />
        </LoadingButton>
      </div>
      <AccordionContent className="flex flex-col gap-2">
        {accordionContentDescription}
        <SubmissionRendererByType form={form} data={data} />
      </AccordionContent>
    </>
  );
};
