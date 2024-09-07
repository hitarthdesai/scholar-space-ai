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
import { useForm } from "react-hook-form";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAddQuestion } from "@/utils/constants/toast";
import {
  type AddQuestionForm,
  addQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/assignmentSchema";
import { FormIds } from "@/utils/constants/form";
import { addQuestion } from "@/actions/addQuestion";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";

type AddQuestionFormComponentProps = {
  assignmentId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddQuestionFormComponent = ({
  assignmentId,
  setIsOpen,
}: AddQuestionFormComponentProps) => {
  const addQuestionFormDefaultValues: AddQuestionForm = {
    question: "",
    assignmentId,
  };

  const router = useRouter();
  const form = useForm<AddQuestionForm>({
    resolver: zodResolver(addQuestionFormSchema),
    defaultValues: addQuestionFormDefaultValues,
  });

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
        setIsOpen(false);
        router.refresh();
      }
    },
  });

  return (
    <Form {...form}>
      <form id={FormIds.AddQuestion} onSubmit={form.handleSubmit(executeAsync)}>
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Question</FormLabel>
              <FormControl>
                <Textarea required {...field} />
              </FormControl>
              <FormDescription>The question text</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
