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
  editClassroomFormSchema,
  EnumEditClassroomResult,
  type EditClassroomForm as EditClassroomFormType,
  type Classroom,
  EnumDeleteClassroomResult,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import {
  toastDescriptionDeleteClassroom,
  toastDescriptionEditClassroom,
} from "@/utils/constants/toast";

import { editClassroom } from "@/actions/editClassroom";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { SheetFooter } from "../ui/sheet";
import { LoadingButton } from "../ui/loading-button";
import { deleteClassroom } from "@/actions/deleteClassroom";

type EditFileFormProps = {
  classroom: Classroom;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const EditFileForm = ({ classroom, setIsOpen }: EditFileFormProps) => {
  const router = useRouter();

  const editClassroomFormDefaultValues: EditClassroomFormType = {
    newName: classroom.name,
    classroomId: classroom.id,
  };

  const form = useForm<EditClassroomFormType>({
    resolver: zodResolver(editClassroomFormSchema),
    defaultValues: editClassroomFormDefaultValues,
  });

  const { executeAsync: executeEdit, isExecuting: isEditing } = useAction(
    editClassroom,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumEditClassroomResult.ClassroomEdited;
        toast({
          title: isErroneous
            ? "Error in editing classroom"
            : "Classroom edited successfully",
          description: toastDescriptionEditClassroom[data.type],
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
    deleteClassroom,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumDeleteClassroomResult.ClassroomDeleted;
        toast({
          title: isErroneous
            ? "Error in deleting classroom"
            : "Classroom deleted successfully",
          description: toastDescriptionDeleteClassroom[data.type],
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
        id={FormIds.EditClassroom}
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
              <FormDescription>Updated name of the classroom</FormDescription>
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
            await executeDelete({ classroomId: classroom.id });
          }}
        >
          Delete
        </LoadingButton>
        <LoadingButton
          disabled={disableActions}
          isLoading={isEditing}
          type="submit"
          form={FormIds.EditClassroom}
        >
          Save
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
};
