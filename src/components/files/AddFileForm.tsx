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
  addFileFormSchema,
  EnumAddFileResult,
  type AddFileForm as AddFileFormType,
} from "@/schemas/fileSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAddFile } from "@/utils/constants/toast";

import { addFile } from "@/actions/addFile";
import { FormIds } from "@/utils/constants/form";
import { useState, type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { SheetFooter } from "../ui/sheet";
import { LoadingButton } from "../ui/loading-button";

type AddFileFormProps = {
  classroomId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const addFileFormDefaultValues: AddFileFormType = {
  classroomId: "",
  file: "",
  name: "",
};

const EnumReadFileStatus = {
  PendingUpload: "pendingUpload",
  LoadingFile: "loadingFile",
  Success: "success",
  Error: "error",
} as const;

type ReadFileStatus =
  (typeof EnumReadFileStatus)[keyof typeof EnumReadFileStatus];

export const AddFileForm = ({ classroomId, setIsOpen }: AddFileFormProps) => {
  const [_, setFileStatus] = useState<ReadFileStatus>(
    EnumReadFileStatus.PendingUpload
  );
  const [fileName, setFileName] = useState<string>("");
  const router = useRouter();
  const form = useForm<AddFileFormType>({
    resolver: zodResolver(addFileFormSchema),
    defaultValues: addFileFormDefaultValues,
    values: {
      classroomId,
      name: fileName,
    },
  });

  const { executeAsync, isExecuting: isAdding } = useAction(addFile, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAddFileResult.FileAdded;

      toast({
        title: isErroneous ? "Error in adding file" : "File added successfully",
        description: toastDescriptionAddFile[data.type],
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
        id={FormIds.AddFile}
        onSubmit={form.handleSubmit(executeAsync)}
        className="h-full"
      >
        <FormField
          control={form.control}
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  {...fieldProps}
                  type="file"
                  accept="application/pdf"
                  onChange={(event) => {
                    setFileStatus(EnumReadFileStatus.LoadingFile);

                    const file = event.target.files?.item(0);
                    if (!file) {
                      setFileStatus(EnumReadFileStatus.Error);
                      return;
                    }

                    const reader = new FileReader();
                    reader.onload = () => {
                      const result = reader.result;
                      if (typeof result !== "string") {
                        setFileStatus(EnumReadFileStatus.Error);
                        return;
                      }

                      onChange(result);
                      setFileName(file.name);
                      setFileStatus(EnumReadFileStatus.Success);
                    };

                    reader.onerror = () => {
                      onChange("");
                      setFileStatus(EnumReadFileStatus.Error);
                    };

                    reader.readAsDataURL(file);
                  }}
                />
              </FormControl>
              <FormDescription>The file you want to add</FormDescription>
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
              <FormDescription>
                What&apos;ll your file be called?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <SheetFooter>
        <LoadingButton
          disabled={isAdding}
          isLoading={isAdding}
          type="submit"
          form={FormIds.AddFile}
        >
          Add
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
};
