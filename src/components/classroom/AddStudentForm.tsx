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
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAddStudent } from "@/utils/constants/toast";
import {
  type AddStudentForm,
  addStudentFormSchema,
  EnumAddStudentResult,
} from "@/schemas/studentSchema";
import { FormIds } from "@/utils/constants/form";
import { addStudent } from "@/actions/addStudent";

type AddStudentFormComponentProps = {
  classroomId: string;
};

export const AddStudentFormComponent = ({
  classroomId,
}: AddStudentFormComponentProps) => {
  const addStudentFormDefaultValues: AddStudentForm = {
    email: "",
    classroomId,
  };

  const form = useForm<AddStudentForm>({
    resolver: zodResolver(addStudentFormSchema),
    defaultValues: addStudentFormDefaultValues,
  });

  const { executeAsync } = useAction(addStudent, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAddStudentResult.StudentAdded;

      toast({
        title: isErroneous
          ? "Error in adding student"
          : "Student added successfully",
        description: toastDescriptionAddStudent[data.type],
        variant: isErroneous ? "destructive" : "default",
      });
    },
  });

  return (
    <Form {...form}>
      <form id={FormIds.AddStudent} onSubmit={form.handleSubmit(executeAsync)}>
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormDescription>Your student&apos;s email</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
