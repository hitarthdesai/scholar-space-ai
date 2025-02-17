"use client";

import { addQuestion } from "@/actions/addQuestion";
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
import { SheetFooter } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  addQuestionFormSchema,
  EnumAddQuestionResult,
  EnumQuestionType,
  type AddCodeQuestionForm as AddCodeQuestionFormType,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { toastDescriptionAddQuestion } from "@/utils/constants/toast";
import {
  type WithCloseQuestionTypeDialogMethod,
  type WithCloseFormSheetMethod,
} from "@/utils/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { type DefaultValues, useForm } from "react-hook-form";
import { AddQuestionFormCommonFields } from "./AddQuestionFormCommonFields";

type AddCodeQuestionFormProps = {
  assignmentId: string;
};

export function AddCodeQuestionForm({
  assignmentId,
  closeSheet,
  closeQuestionTypeDialog,
}: WithCloseQuestionTypeDialogMethod<
  WithCloseFormSheetMethod<AddCodeQuestionFormProps>
>) {
  const defaultValues: DefaultValues<AddCodeQuestionFormType> = {
    type: EnumQuestionType.Code,
    assignmentId,
    name: "",
    question: "",
    starterCode: "",
  };

  const form = useForm<AddCodeQuestionFormType>({
    resolver: zodResolver(addQuestionFormSchema),
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

  return (
    <Form {...form}>
      <form
        id={FormIds.AddCodeQuestion}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full flex-col gap-4"
      >
        <AddQuestionFormCommonFields
          type={EnumQuestionType.SingleCorrectMcq}
          form={form}
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
              <FormDescription>
                Stubbed code to assist the user in solving questions
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <SheetFooter>
        <Button type="submit" form={FormIds.AddCodeQuestion}>
          Add
        </Button>
      </SheetFooter>
    </Form>
  );
}
