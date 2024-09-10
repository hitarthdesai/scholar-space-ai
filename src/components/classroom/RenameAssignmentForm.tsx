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
import {
  renameAssignmentFormSchema,
  EnumRenameAssignmentResult,
  type RenameAssignmentForm,
} from "@/schemas/assignmentSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionRenameAssignment } from "@/utils/constants/toast";

import { renameAssignment } from "@/actions/renameAssignment";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";

type RenameAssignmentFormProps = {
  assignmentId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const RenameAssignmentFormComponent = ({
  assignmentId,
  setIsOpen,
}: RenameAssignmentFormProps) => {
  const router = useRouter();

  const renameAssignmentFormDefaultValues: RenameAssignmentForm = {
    newName: "",
    assignmentId: assignmentId,
  };

  const form = useForm<RenameAssignmentForm>({
    resolver: zodResolver(renameAssignmentFormSchema),
    defaultValues: renameAssignmentFormDefaultValues,
  });

  const { executeAsync } = useAction(renameAssignment, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumRenameAssignmentResult.AssignmentRenamed;

      toast({
        title: isErroneous
          ? "Error in renaming Assignment"
          : "Assignment renamed successfully",
        description: toastDescriptionRenameAssignment[data.type],
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
        id={FormIds.RenameAssignment}
        onSubmit={form.handleSubmit(executeAsync)}
      >
        <FormField
          control={form.control}
          name="newName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormDescription>
                What would you like to rename this Assignment to?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
