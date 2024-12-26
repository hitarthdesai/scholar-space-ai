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
import {
  toastDescriptionDeleteFile,
  toastDescriptionEditFile,
} from "@/utils/constants/toast";

import { editFile } from "@/actions/editFile";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { SheetFooter } from "../ui/sheet";
import { LoadingButton } from "../ui/loading-button";
import { deleteFile } from "@/actions/deleteFile";
import {
  type EditFileForm as EditFileFormType,
  editFileFormSchema,
  EnumDeleteFileResult,
  EnumEditFileResult,
  type File,
} from "@/schemas/fileSchema";

type EditFileFormProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  file: File;
};

export const EditFileForm = ({ file, setIsOpen }: EditFileFormProps) => {
  const router = useRouter();

  const editClassroomFormDefaultValues: EditFileFormType = {
    newName: file.name,
    fileId: file.id,
  };

  const form = useForm<EditFileFormType>({
    resolver: zodResolver(editFileFormSchema),
    defaultValues: editClassroomFormDefaultValues,
  });

  const { executeAsync: executeEdit, isExecuting: isEditing } = useAction(
    editFile,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous = data.type !== EnumEditFileResult.FileEdited;
        toast({
          title: isErroneous
            ? "Error in editing classroom"
            : "Classroom edited successfully",
          description: toastDescriptionEditFile[data.type],
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
    deleteFile,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous = data.type !== EnumDeleteFileResult.FileDeleted;
        toast({
          title: isErroneous
            ? "Error in deleting file"
            : "File deleted successfully",
          description: toastDescriptionDeleteFile[data.type],
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
        id={FormIds.EditFile}
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
              <FormDescription>Updated name of the file</FormDescription>
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
            await executeDelete({ fileId: file.id });
          }}
        >
          Delete
        </LoadingButton>
        <LoadingButton
          disabled={disableActions}
          isLoading={isEditing}
          type="submit"
          form={FormIds.EditFile}
        >
          Save
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
};
