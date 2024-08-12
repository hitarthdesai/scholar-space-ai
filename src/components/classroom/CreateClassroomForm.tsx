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
  createClassroomFormSchema,
  EnumCreateClassroomResult,
  type CreateClassroomForm,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionCreateClassroom } from "@/utils/constants/toast";

import { createClassroom } from "@/actions/createClassroom";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";

type CreateClassroomFormProps = {
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

const createClassroomFormDefaultValues: CreateClassroomForm = {
  name: "",
};

export const CreateClassroomFormComponent = ({
  setIsOpen,
}: CreateClassroomFormProps) => {
  const router = useRouter();
  const form = useForm<CreateClassroomForm>({
    resolver: zodResolver(createClassroomFormSchema),
    defaultValues: createClassroomFormDefaultValues,
  });

  const { executeAsync } = useAction(createClassroom, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumCreateClassroomResult.ClassroomCreated;

      toast({
        title: isErroneous
          ? "Error in creating classroom"
          : "Classroom created successfully",
        description: toastDescriptionCreateClassroom[data.type],
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
        id={FormIds.CreateClassroom}
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
              <FormDescription>
                How&apos;ll your students identify this classroom?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
