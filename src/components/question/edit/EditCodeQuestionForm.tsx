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
  editCodeQuestionFormSchema,
  type EditCodeQuestionForm as EditCodeQuestionFormType,
  EnumDeleteQuestionResult,
  EnumEditQuestionResult,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { editQuestion } from "@/actions/editQuestion";
import { useRouter } from "next/navigation";
import { Textarea } from "../../ui/textarea";
import { Input } from "../../ui/input";
import { SheetFooter } from "../../ui/sheet";
import { LoadingButton } from "../../ui/loading-button";
import { deleteQuestion } from "@/actions/deleteQuestion";
import { type WithCloseFormSheetMethod } from "@/utils/types";

export type EditQuestionFormProps = {
  id: string;
  name: string;
  question: string;
  starterCode: string;
};

export const EditCodeQuestionForm = ({
  id,
  name,
  question,
  starterCode,
  closeSheet,
}: WithCloseFormSheetMethod<EditQuestionFormProps>) => {
  const editQuestionFormDefaultValues: DefaultValues<EditCodeQuestionFormType> =
    {
      questionId: id,
      name,
      question,
      starterCode,
    };

  const router = useRouter();
  const form = useForm<EditCodeQuestionFormType>({
    resolver: zodResolver(editCodeQuestionFormSchema),
    defaultValues: editQuestionFormDefaultValues,
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

  const onSubmit = async (data: EditCodeQuestionFormType) => {
    const hasNameChanged = data.name !== editQuestionFormDefaultValues.name;
    const hasQuestionChanged =
      data.question !== editQuestionFormDefaultValues.question;
    const hasStarterCodeChanged =
      data.starterCode !== editQuestionFormDefaultValues.starterCode;

    if (!hasNameChanged && !hasQuestionChanged && !hasStarterCodeChanged) {
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
      starterCode: hasStarterCodeChanged ? data.starterCode : undefined,
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

  return (
    <Form {...form}>
      <form
        id={FormIds.EditQuestion}
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex h-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormDescription>Updated name of the question</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea required {...field} />
              </FormControl>
              <FormDescription>Updated question text</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="starterCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Starter code</FormLabel>
              <FormControl>
                <Textarea required {...field} />
              </FormControl>
              <FormDescription>Updated starter code</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
