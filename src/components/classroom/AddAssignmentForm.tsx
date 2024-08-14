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
import { toastDescriptionAddAssignment } from "@/utils/constants/toast";
import {
  type AddAssignmentForm,
  addAssignmentFormSchema,
  EnumAddAssignmentResult,
} from "@/schemas/assignmentSchema";
import { FormIds } from "@/utils/constants/form";
import { addAssignment } from "@/actions/addAssignment";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";

type AddStudentFormComponentProps = {
  classroomId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const AddAssignmentFormComponent = ({
  classroomId,
  setIsOpen,
}: AddStudentFormComponentProps) => {
  const router = useRouter();
  const addAssignmentFormDefaultValues: AddAssignmentForm = {
    name: "",
    classroomId,
  };

  const form = useForm<AddAssignmentForm>({
    resolver: zodResolver(addAssignmentFormSchema),
    defaultValues: addAssignmentFormDefaultValues,
  });

  const { executeAsync } = useAction(addAssignment, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAddAssignmentResult.AssignmentAdded;

      toast({
        title: isErroneous
          ? "Error in creating assignment"
          : "Assignment created successfully",
        description: toastDescriptionAddAssignment[data.type],
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
        id={FormIds.AddAssignment}
        onSubmit={form.handleSubmit(executeAsync)}
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
              <FormDescription>Name of your assignment</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
