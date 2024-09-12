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
import { toastDescriptionEditQuestion } from "@/utils/constants/toast";
import {
  type EditFormDefaultValues,
  editFormDefaultValuesSchema,
  editQuestionFormSchema,
  type EditQuestionForm as EditQuestionFormType,
  EnumEditQuestionResult,
} from "@/schemas/questionSchema";
import { FormIds } from "@/utils/constants/form";
import { editQuestion } from "@/actions/editQuestion";
import { use, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

export type EditQuestionFormProps = {
  editPromise: Promise<EditFormDefaultValues>;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditQuestionForm = ({
  setIsOpen,
  editPromise,
}: EditQuestionFormProps) => {
  const _editQuestionData = use(editPromise);
  const { data, error } =
    editFormDefaultValuesSchema.safeParse(_editQuestionData);

  const editQuestionFormDefaultValues: EditQuestionFormType = {
    name: data?.[0]?.name ?? undefined,
    question: data?.[1] ?? undefined,
    questionId: data?.[0].id ?? "",
  };

  const router = useRouter();
  const form = useForm<EditQuestionFormType>({
    resolver: zodResolver(editQuestionFormSchema),
    defaultValues: editQuestionFormDefaultValues,
  });

  const { executeAsync } = useAction(editQuestion, {
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
        setIsOpen(false);
        router.refresh();
      }
    },
  });

  const onSubmit = async (data: EditQuestionFormType) => {
    const hasNameChanged = data.name !== editQuestionFormDefaultValues.name;
    const hasQuestionChanged =
      data.question !== editQuestionFormDefaultValues.question;

    if (!hasNameChanged && !hasQuestionChanged) {
      toast({
        title: "No changes detected",
        description: "You haven't made any changes to the form.",
        variant: "default",
      });
      return;
    }

    await executeAsync({
      ...data,
      name: hasNameChanged ? data.name : undefined,
      question: hasQuestionChanged ? data.question : undefined,
    });
  };

  if (error) {
    return <div>ERROR</div>;
  }

  return (
    <Form {...form}>
      <form id={FormIds.EditQuestion} onSubmit={form.handleSubmit(onSubmit)}>
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
      </form>
    </Form>
  );
};
