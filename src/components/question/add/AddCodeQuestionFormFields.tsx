"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { type AddQuestionForm } from "@/schemas/questionSchema";
import { type UseFormReturn } from "react-hook-form";

type AddCodeQuestionFormProps = {
  form: UseFormReturn<AddQuestionForm>;
};

export function AddCodeQuestionFormFields({ form }: AddCodeQuestionFormProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Name</FormLabel>
            <FormControl>
              <Input required {...field} />
            </FormControl>
            <FormDescription>Name of the question</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="question"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Question</FormLabel>
            <FormControl>
              <Textarea required {...field} />
            </FormControl>
            <FormDescription>The question text</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="starterCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Starter code</FormLabel>
            <FormControl>
              <Textarea required {...field} />
            </FormControl>
            <FormDescription>
              Stubbed code to assist the user in solving questions
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
