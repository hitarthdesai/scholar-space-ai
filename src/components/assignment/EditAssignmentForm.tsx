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
  type Assignment,
  EnumDeleteAssignmentResult,
} from "@/schemas/assignmentSchema";
import { toast } from "@/components/ui/use-toast";
import {
  toastDescriptionDeleteAssignment,
  toastDescriptionRenameAssignment,
} from "@/utils/constants/toast";

import { renameAssignment } from "@/actions/renameAssignment";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { LoadingButton } from "../ui/loading-button";
import { SheetFooter } from "../ui/sheet";
import { deleteAssignment } from "@/actions/deleteAssignment";

type EditAssignmentFormProps = {
  assignment: Assignment;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditAssignmentForm = ({
  assignment,
  setIsOpen,
}: EditAssignmentFormProps) => {
  const router = useRouter();

  const renameAssignmentFormDefaultValues: RenameAssignmentForm = {
    newName: assignment.name,
    assignmentId: assignment.id,
  };

  const form = useForm<RenameAssignmentForm>({
    resolver: zodResolver(renameAssignmentFormSchema),
    defaultValues: renameAssignmentFormDefaultValues,
  });

  const { executeAsync: executeEdit, isExecuting: isEditing } = useAction(
    renameAssignment,
    {
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
    }
  );

  const { executeAsync: executeDelete, isExecuting: isDeleting } = useAction(
    deleteAssignment,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumDeleteAssignmentResult.AssignmentDeleted;

        toast({
          title: isErroneous
            ? "Error in deleting assignment"
            : "Assignment deleted successfully",
          description: toastDescriptionDeleteAssignment[data.type],
          variant: isErroneous ? "destructive" : "default",
        });

        if (!isErroneous) {
          setIsOpen(false);
          router.refresh();
        }
      },
    }
  );

  const disableActions = isEditing || isDeleting;

  return (
    <Form {...form}>
      <form
        id={FormIds.EditAssignment}
        onSubmit={form.handleSubmit(executeEdit)}
        className="h-full"
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
              <FormDescription>Updated name of the assignment</FormDescription>
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
          onClick={async () => {
            await executeDelete({ assignmentId: assignment.id });
          }}
        >
          Delete
        </LoadingButton>
        <LoadingButton
          disabled={disableActions}
          isLoading={isEditing}
          type="submit"
          form={FormIds.EditAssignment}
        >
          Save
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
};
