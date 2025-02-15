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
  EnumQuestionType,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { addQuestion } from "@/actions/addQuestion";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Button } from "../../ui/button";
import { SheetFooter } from "../../ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddCodeQuestionFormFields } from "./AddCodeQuestionFormFields";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AddSingleCorrectFormFields } from "./AddSingleCorrectMcqFormFields";

type AddQuestionFormComponentProps = {
  assignmentId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddQuestionForm = ({
  assignmentId,
  setIsOpen,
}: AddQuestionFormComponentProps) => {
  const addQuestionFormDefaultValues: AddQuestionFormType = {
    assignmentId,
    type: EnumQuestionType.SingleCorrectMcq,
    name: "",
    question: "",
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

  const questionType = form.watch("type");

  return (
    <Form {...form}>
      <form
        id={FormIds.AddQuestion}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full flex-col gap-4"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EnumQuestionType.Code}>Code</SelectItem>
                    <SelectItem value={EnumQuestionType.SingleCorrectMcq}>
                      Single-correct MCQ
                    </SelectItem>
                    <SelectItem value={EnumQuestionType.MultiCorrectMcq}>
                      Multi-correct MCQ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The type of question you want to ask
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
        {questionType === EnumQuestionType.Code && (
          <AddCodeQuestionFormFields form={form} />
        )}
        {questionType === EnumQuestionType.SingleCorrectMcq && (
          <AddSingleCorrectFormFields form={form} />
        )}
      </form>
      <SheetFooter>
        <Button type="submit" form={FormIds.AddQuestion}>
          Add
        </Button>
      </SheetFooter>
    </Form>
  );
};
