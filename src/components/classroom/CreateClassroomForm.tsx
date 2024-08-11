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
import { Button } from "@/components/ui/button";
import {
  createClassroomFormSchema,
  type CreateClassroomForm,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionCreateClassroom } from "@/utils/constants/toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClassroom } from "@/actions/createClassroom";

const createClassroomFormDefaultValues: CreateClassroomForm = {
  name: "",
};

export const CreateClassroomFormComponent = () => {
  const form = useForm<CreateClassroomForm>({
    resolver: zodResolver(createClassroomFormSchema),
    defaultValues: createClassroomFormDefaultValues,
  });

  const { executeAsync } = useAction(createClassroom, {
    onSuccess({ data }) {
      if (!data?.type) return;

      toast({
        title: "Error in creating classroom",
        description: toastDescriptionCreateClassroom[data.type],
        variant: "destructive",
      });
    },
  });

  return (
    <Card className="flex max-w-72 flex-col gap-y-4 px-4 sm:max-w-96">
      <CardHeader>
        <CardTitle>Create your classroom</CardTitle>
        <CardDescription>
          Fill this form to create a classroom. You can then invite students to
          join your classroom.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id="createClassroomForm"
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
      </CardContent>
      <CardFooter>
        <Button type="submit" form="createClassroomForm">
          Create
        </Button>
      </CardFooter>
    </Card>
  );
};
