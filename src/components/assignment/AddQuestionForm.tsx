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
  type AddQuestionForm as AddQuestionFormType,
  addQuestionFormSchema,
  EnumAddQuestionResult,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { addQuestion } from "@/actions/addQuestion";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { SheetFooter } from "../ui/sheet";

type AddQuestionFormComponentProps = {
  assignmentId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddQuestionForm = ({
  assignmentId,
  setIsOpen,
}: AddQuestionFormComponentProps) => {
  const addQuestionFormDefaultValues: AddQuestionFormType = {
    question: "",
    name: "",
    assignmentId,
  };

  const router = useRouter();
  const form = useForm<AddQuestionFormType>({
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
      <form
        id={FormIds.AddQuestion}
        onSubmit={form.handleSubmit(executeAsync)}
        className="h-full"
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
              <FormDescription>Name of the question</FormDescription>
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
              <FormDescription>The question text</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <SheetFooter>
        <Button type="submit" form={FormIds.AddQuestion}>
          Add
        </Button>
      </SheetFooter>
    </Form>
  );
};
