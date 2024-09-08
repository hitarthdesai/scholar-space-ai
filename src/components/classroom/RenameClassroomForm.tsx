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
  renameClassroomFormSchema,
  EnumRenameClassroomResult,
  type RenameClassroomForm,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionRenameClassroom } from "@/utils/constants/toast";

import { renameClassroom } from "@/actions/renameClassroom";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";

type RenameClassroomFormProps = {
  classroomId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const RenameClassroomFormComponent = ({
  classroomId,
  setIsOpen,
}: RenameClassroomFormProps) => {
  const router = useRouter();

  const renameClassroomFormDefaultValues: RenameClassroomForm = {
    newName: "",
    classroomId: classroomId,
  };

  const form = useForm<RenameClassroomForm>({
    resolver: zodResolver(renameClassroomFormSchema),
    defaultValues: renameClassroomFormDefaultValues,
  });

  const { executeAsync } = useAction(renameClassroom, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumRenameClassroomResult.ClassroomRenamed;

      toast({
        title: isErroneous
          ? "Error in renaming classroom"
          : "Classroom renamed successfully",
        description: toastDescriptionRenameClassroom[data.type],
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
        id={FormIds.RenameClassroom}
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
                What would you like to rename this classroom to?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
