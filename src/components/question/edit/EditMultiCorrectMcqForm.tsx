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
  type EditMultiCorrectMcqForm as EditMultiCorrectMcqFormType,
  EnumDeleteQuestionResult,
  editMultiCorrectMcqFormSchema,
  EnumEditQuestionResult,
} from "@/schemas/questionSchema";
import { XIcon } from "lucide-react";
import { type DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";
import {
  toastDescriptionDeleteQuestion,
  toastDescriptionEditQuestion,
} from "@/utils/constants/toast";
import { toast } from "@/components/ui/use-toast";
import { SheetFooter } from "@/components/ui/sheet";
import { FormIds } from "@/utils/constants/form";
import { QuestionFormCommonFields } from "../add/QuestionFormCommonFields";
import { type WithCloseFormSheetMethod } from "@/utils/types";
import { Checkbox } from "@/components/ui/checkbox";
import { deleteQuestion } from "@/actions/deleteQuestion";
import { editQuestion } from "@/actions/editQuestion";
import { LoadingButton } from "@/components/ui/loading-button";

type EditMultiCorrectMcqFormProps = Omit<EditMultiCorrectMcqFormType, "type">;

export function EditMultiCorrectMcqForm({
  id,
  name,
  question,
  options: defaultOptions,
  correctOptions: defaultCorrectOptions,
  closeSheet,
}: WithCloseFormSheetMethod<EditMultiCorrectMcqFormProps>) {
  const defaultValues: DefaultValues<EditMultiCorrectMcqFormType> = {
    id,
    name,
    question,
    options: defaultOptions,
    correctOptions: defaultCorrectOptions,
    type: EnumQuestionType.MultiCorrectMcq,
  };

  const router = useRouter();
  const form = useForm<EditMultiCorrectMcqFormType>({
    resolver: zodResolver(editMultiCorrectMcqFormSchema),
    defaultValues,
  });

  const { executeAsync: executeEdit, isExecuting: isEditing } = useAction(
    editQuestion,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous = data.type !== EnumEditQuestionResult.QuestionEdited;

        toast({
          title: isErroneous
            ? "Error in editing Question"
            : "Question edited successfully",
          description: toastDescriptionEditQuestion[data.type],
          variant: isErroneous ? "destructive" : "default",
        });

        if (!isErroneous) {
          form.reset();
          closeSheet();
          router.refresh();
        }
      },
    }
  );

  const onSubmit = async (data: EditMultiCorrectMcqFormType) => {
    const hasNameChanged = data.name !== defaultValues.name;
    const hasQuestionChanged = data.question !== defaultValues.question;
    const hasOptionsChanged =
      JSON.stringify(data.options) !== JSON.stringify(defaultValues.options);
    const hasCorrectOptionsChanged =
      JSON.stringify(data.correctOptions) !==
      JSON.stringify(defaultValues.correctOptions);

    if (
      !hasNameChanged &&
      !hasQuestionChanged &&
      !hasOptionsChanged &&
      !hasCorrectOptionsChanged
    ) {
      toast({
        title: "No changes detected",
        description: "You haven't made any changes to the form.",
        variant: "default",
      });
      return;
    }

    await executeEdit({
      ...data,
      name: hasNameChanged ? data.name : undefined,
      question: hasQuestionChanged ? data.question : undefined,
      options: hasOptionsChanged ? data.options : defaultOptions,
      correctOptions: hasCorrectOptionsChanged
        ? data.correctOptions
        : defaultCorrectOptions,
    });
  };

  const { executeAsync: executeDelete, isExecuting: isDeleting } = useAction(
    deleteQuestion,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumDeleteQuestionResult.QuestionDeleted;

        toast({
          title: isErroneous
            ? "Error in deleting Question"
            : "Question deleted successfully",
          description: toastDescriptionDeleteQuestion[data.type],
          variant: isErroneous ? "destructive" : "default",
        });

        if (!isErroneous) {
          closeSheet();
          router.refresh();
        }
      },
    }
  );

  const disableActions = isEditing || isDeleting;

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
        id={FormIds.EditQuestion}
        onSubmit={form.handleSubmit(onSubmit)}
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
      <SheetFooter className="flex w-full items-center justify-between">
        <LoadingButton
          disabled={disableActions}
          isLoading={isDeleting}
          variant="destructive"
          onClick={async () =>
            executeDelete({
              questionId: id,
            })
          }
        >
          Delete
        </LoadingButton>
        <LoadingButton
          disabled={disableActions}
          isLoading={isEditing}
          type="submit"
          form={FormIds.EditQuestion}
        >
          Save
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
}
