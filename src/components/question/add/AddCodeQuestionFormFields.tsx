"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { type EnumQuestionType } from "@/schemas/questionSchema";
import { type ExtractQuestionForm } from "@/utils/types";
import { type UseFormReturn } from "react-hook-form";

type AddCodeQuestionFormProps = {
  form: UseFormReturn<ExtractQuestionForm<typeof EnumQuestionType.Code>>;
};

export function AddCodeQuestionFormFields({ form }: AddCodeQuestionFormProps) {
  return (
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
  );
}
