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
  addClassroomFormSchema,
  EnumAddClassroomResult,
  type AddClassroomForm as AddClassroomFormType,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAddClassroom } from "@/utils/constants/toast";

import { addClassroom } from "@/actions/addClassroom";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { SheetFooter } from "../ui/sheet";
import { LoadingButton } from "../ui/loading-button";

type AddClassroomFormProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const addClassroomFormDefaultValues: AddClassroomFormType = {
  name: "",
};

export const AddClassroomForm = ({ setIsOpen }: AddClassroomFormProps) => {
  const router = useRouter();
  const form = useForm<AddClassroomFormType>({
    resolver: zodResolver(addClassroomFormSchema),
    defaultValues: addClassroomFormDefaultValues,
  });

  const { executeAsync, isExecuting: isAdding } = useAction(addClassroom, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAddClassroomResult.ClassroomAdded;

      toast({
        title: isErroneous
          ? "Error in adding classroom"
          : "Classroom added successfully",
        description: toastDescriptionAddClassroom[data.type],
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
        id={FormIds.AddClassroom}
        onSubmit={form.handleSubmit(executeAsync)}
        className="h-full"
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
              <FormDescription>
                How&apos;ll your students identify this classroom?
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
          form={FormIds.AddClassroom}
        >
          Add
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
};
