"use client";

import {
  EnumQuestionType,
  type GradeAndFeedbackForm,
} from "@/schemas/questionSchema";
import { CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { Badge } from "../ui/badge";
import { UseFormReturn } from "react-hook-form";
import { use } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { questionDisplayConfigByType } from "@/utils/constants/misc";
import { cn } from "@/utils/cn";
import { AccordionTrigger, AccordionContent } from "../ui/accordion";

export type GradeAndFeedbackDataPromiseType = Promise<
  | {
      type: (typeof EnumQuestionType)["Code"];
      questionText: string;
      attemptCode: string | undefined;
    }
  | {
      type: (typeof EnumQuestionType)["SingleCorrectMcq"];
      questionText: string;
      selectedOption: string;
      correctAnswer: string;
      options: { value: string; label: string }[];
    }
  | {
      type: (typeof EnumQuestionType)["MultiCorrectMcq"];
      questionText: string;
      selectedOptions: string[];
      correctAnswers: string[];
      options: { value: string; label: string }[];
    }
>;

type SubmissionRendererPropsByTypeProps = {
  form: UseFormReturn<GradeAndFeedbackForm>;
  data: Awaited<GradeAndFeedbackDataPromiseType>;
};

type SubmissionRendererProps = {
  questionName: string;
  maxGrade: number;
  form: UseFormReturn<GradeAndFeedbackForm>;
  dataPromise: GradeAndFeedbackDataPromiseType;
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
                <Textarea {...field} />
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
  questionName,
  maxGrade,
  dataPromise,
}: SubmissionRendererProps) => {
  const data = use(dataPromise);
  if (!data) return null;

  const questionType = data.type;
  const displayConfig = questionDisplayConfigByType[questionType];

  return (
    <>
      <AccordionTrigger className="hover:no-underline">
        <div className="flex w-full items-center justify-between pr-4">
          <div className="flex flex-row items-center gap-1">
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
          <FormField
            control={form.control}
            name="grade"
            render={({ field }) => (
              <FormItem className="flex flex-col items-end">
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
        </div>
      </AccordionTrigger>
      <AccordionContent className="flex flex-col gap-2">
        <div className="flex flex-col gap-1 rounded-md bg-muted p-2">
          <p className="text-sm font-medium text-muted-foreground">
            Question:{" "}
          </p>
          <p className="w-full text-sm">{data.questionText}</p>
        </div>
        <SubmissionRendererByType form={form} data={data} />
      </AccordionContent>
    </>
  );
};
