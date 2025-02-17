"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  EnumQuestionType,
  MCQ_OPTIONS_MAX_LENGTH,
  MCQ_OPTIONS_MIN_LENGTH,
  type McqOption,
  type AddMultiCorrectMCQQuestionForm,
  addMultiCorrectMCQQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/questionSchema";
import { XIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { addQuestion } from "@/actions/addQuestion";
import { toastDescriptionAddQuestion } from "@/utils/constants/toast";
import { toast } from "@/components/ui/use-toast";
import { SheetFooter } from "@/components/ui/sheet";
import { FormIds } from "@/utils/constants/form";
import { QuestionFormCommonFields } from "./QuestionFormCommonFields";
import {
  type WithCloseFormSheetMethod,
  type WithCloseQuestionTypeDialogMethod,
} from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";

type AddSingleCorrectMcqFormProps = {
  assignmentId: string;
};

const defaultOptions: McqOption[] = [
  { value: "1", label: "" },
  { value: "2", label: "" },
];

export function AddMultiCorrectMcqForm({
  assignmentId,
  closeSheet,
  closeQuestionTypeDialog,
}: WithCloseQuestionTypeDialogMethod<
  WithCloseFormSheetMethod<AddSingleCorrectMcqFormProps>
>) {
  const defaultValues: DefaultValues<AddMultiCorrectMCQQuestionForm> = {
    type: EnumQuestionType.MultiCorrectMcq,
    assignmentId,
    name: "yo yo yo yo",
    question: "yo yo yo yo",
    options: defaultOptions,
    correctOptions: defaultOptions.map((o) => o.value),
  };

  const form = useForm<AddMultiCorrectMCQQuestionForm>({
    resolver: zodResolver(addMultiCorrectMCQQuestionFormSchema),
    defaultValues,
  });

  const router = useRouter();
  const { executeAsync } = useAction(addQuestion, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAddQuestionResult.QuestionAdded;

      toast({
        title: isErroneous
          ? "Error in adding Question"
          : "Question added successfully",
        description: toastDescriptionAddQuestion[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      if (!isErroneous) {
        form.reset();
        closeSheet();
        closeQuestionTypeDialog();
        router.refresh();
      }
    },
  });

  const options = form.watch("options");
  const correctOptions = form.watch("correctOptions");

  const addOption = () => {
    form.setValue("options", [
      ...options,
      { value: new Date().getTime().toString(), label: "" },
    ]);
  };

  const removeOption = (value: string) => {
    form.setValue(
      "options",
      options.filter((o) => o.value !== value)
    );
    form.setValue(
      "correctOptions",
      correctOptions.filter((o) => o !== value)
    );
  };

  const toggleCorrectOption = (value: string) => {
    if (correctOptions.includes(value)) {
      form.setValue(
        "correctOptions",
        correctOptions.filter((o) => o !== value)
      );
    } else {
      form.setValue("correctOptions", [...correctOptions, value]);
    }
  };

  return (
    <Form {...form}>
      <form
        id={FormIds.AddSingleCorrectMcq}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full flex-col gap-4"
      >
        <QuestionFormCommonFields />
        <div className="border-t-2 border-border pt-4">
          <FormField
            control={form.control}
            name="correctOptions"
            render={() => (
              <FormItem>
                <FormLabel className="mb-4 flex items-center justify-between">
                  Options
                  <Button
                    type="button"
                    size="sm"
                    disabled={options.length >= MCQ_OPTIONS_MAX_LENGTH}
                    onClick={addOption}
                  >
                    Add more
                  </Button>
                </FormLabel>

                {options.map(({ value, label }, i) => {
                  return (
                    <div className="flex items-center gap-4" key={i}>
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="min-w-3 text-right">
                          {i + 1}.
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            value={value}
                            checked={correctOptions.includes(value)}
                            onCheckedChange={() => toggleCorrectOption(value)}
                            className="!mt-0"
                          />
                        </FormControl>
                      </FormItem>
                      <Input
                        required
                        value={label}
                        placeholder="Label your Option"
                        onChange={(e) => {
                          form.setValue(
                            "options",
                            options.map((o) => {
                              if (o.value === value) {
                                return { ...o, label: e.target.value };
                              }
                              return o;
                            })
                          );
                        }}
                      />
                      <Button
                        className="ml-6"
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={options.length === MCQ_OPTIONS_MIN_LENGTH}
                        onClick={() => removeOption(value)}
                      >
                        <XIcon size={16} />
                      </Button>
                    </div>
                  );
                })}
                <FormDescription>
                  Options for the multiple choice question
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
      <SheetFooter>
        <Button type="submit" form={FormIds.AddSingleCorrectMcq}>
          Add
        </Button>
      </SheetFooter>
    </Form>
  );
}
