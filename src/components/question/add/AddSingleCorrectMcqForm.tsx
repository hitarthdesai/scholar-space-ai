"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
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
  type AddSingleCorrectMCQQuestionForm,
  addSingleCorrectMCQQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/questionSchema";
import { XIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";
import { CheckIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import { addQuestion } from "@/actions/addQuestion";
import { toastDescriptionAddQuestion } from "@/utils/constants/toast";
import { toast } from "@/components/ui/use-toast";
import { SheetFooter } from "@/components/ui/sheet";
import { FormIds } from "@/utils/constants/form";
import { AddQuestionFormCommonFields } from "./AddQuestionFormCommonFields";
import {
  type WithCloseFormSheetMethod,
  type WithCloseQuestionTypeDialogMethod,
} from "@/utils/types";

type AddSingleCorrectMcqFormProps = {
  assignmentId: string;
};

const defaultOptions: McqOption[] = [
  { value: "1", label: "" },
  { value: "2", label: "" },
];

export function AddSingleCorrectMcqForm({
  assignmentId,
  closeSheet,
  closeQuestionTypeDialog,
}: WithCloseQuestionTypeDialogMethod<
  WithCloseFormSheetMethod<AddSingleCorrectMcqFormProps>
>) {
  const defaultValues: DefaultValues<AddSingleCorrectMCQQuestionForm> = {
    type: EnumQuestionType.SingleCorrectMcq,
    assignmentId,
    name: "",
    question: "",
    options: defaultOptions,
    correctOption: defaultOptions[0].value,
  };

  const form = useForm<AddSingleCorrectMCQQuestionForm>({
    resolver: zodResolver(addSingleCorrectMCQQuestionFormSchema),
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
  };

  return (
    <Form {...form}>
      <form
        id={FormIds.AddSingleCorrectMcq}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full flex-col gap-4"
      >
        <AddQuestionFormCommonFields
          type={EnumQuestionType.SingleCorrectMcq}
          form={form}
        />
        <div className="border-t-2 border-border pt-4">
          <FormField
            control={form.control}
            name="correctOption"
            render={({ field }) => (
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
                <FormControl>
                  <RadioGroup
                    {...field}
                    onValueChange={field.onChange}
                    defaultValue={defaultOptions[0].value}
                  >
                    {options.map(({ value, label }, i) => {
                      return (
                        <div className="flex items-center gap-4" key={i}>
                          <FormItem className="flex items-center gap-4">
                            <FormLabel className="min-w-3 text-right">
                              {i + 1}.
                            </FormLabel>
                            <FormControl>
                              <RadioGroupItem
                                value={value}
                                indicator={
                                  <CheckIcon className="h-3.5 w-3.5 fill-primary" />
                                }
                                className="!m-0"
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
                  </RadioGroup>
                </FormControl>
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
