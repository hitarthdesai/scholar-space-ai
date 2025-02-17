"use client";

import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type DefaultValues, useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import {
  toastDescriptionDeleteQuestion,
  toastDescriptionEditQuestion,
} from "@/utils/constants/toast";
import {
  editSingleCorrectMcqFormSchema,
  type EditSingleCorrectMcqForm as EditSingleCorrectMcqFormType,
  EnumDeleteQuestionResult,
  EnumEditQuestionResult,
  EnumQuestionType,
  MCQ_OPTIONS_MAX_LENGTH,
  MCQ_OPTIONS_MIN_LENGTH,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { editQuestion } from "@/actions/editQuestion";
import { useRouter } from "next/navigation";
import { Input } from "../../ui/input";
import { SheetFooter } from "../../ui/sheet";
import { LoadingButton } from "../../ui/loading-button";
import { deleteQuestion } from "@/actions/deleteQuestion";
import { type WithCloseFormSheetMethod } from "@/utils/types";
import { QuestionFormCommonFields } from "../add/QuestionFormCommonFields";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckIcon } from "@radix-ui/react-icons";
import { XIcon } from "lucide-react";

type EditSingleCorrectMcqFormProps = Omit<EditSingleCorrectMcqFormType, "type">;

export const EditSingleCorrectMcqForm = ({
  id,
  name,
  question,
  options: defaultOptions,
  correctOption,
  closeSheet,
}: WithCloseFormSheetMethod<EditSingleCorrectMcqFormProps>) => {
  const defaultValues: DefaultValues<EditSingleCorrectMcqFormType> = {
    id,
    name,
    question,
    options: defaultOptions,
    correctOption,
    type: EnumQuestionType.SingleCorrectMcq,
  };

  const router = useRouter();
  const form = useForm<EditSingleCorrectMcqFormType>({
    resolver: zodResolver(editSingleCorrectMcqFormSchema),
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

  const onSubmit = async (data: EditSingleCorrectMcqFormType) => {
    const hasNameChanged = data.name !== defaultValues.name;
    const hasQuestionChanged = data.question !== defaultValues.question;
    const hasOptionsChanged =
      JSON.stringify(data.options) !== JSON.stringify(defaultValues.options);
    const hasCorrectOptionChanged =
      data.correctOption !== defaultValues.correctOption;

    if (
      !hasNameChanged &&
      !hasQuestionChanged &&
      !hasOptionsChanged &&
      !hasCorrectOptionChanged
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
      correctOption: hasCorrectOptionChanged
        ? data.correctOption
        : correctOption,
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
        id={FormIds.EditQuestion}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-4"
      >
        <QuestionFormCommonFields />
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
};
