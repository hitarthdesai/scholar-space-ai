"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { type UseFormReturn } from "react-hook-form";
import {
  type AddCodeQuestionForm,
  type AddMultiCorrectMCQQuestionForm,
  type AddSingleCorrectMCQQuestionForm,
  EnumQuestionType,
  type QuestionType,
} from "@/schemas/questionSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AddQuestionFormCommonFieldsProps<T extends QuestionType> = {
  type: T;
  form: T extends typeof EnumQuestionType.Code
    ? UseFormReturn<AddCodeQuestionForm>
    : T extends typeof EnumQuestionType.SingleCorrectMcq
      ? UseFormReturn<AddSingleCorrectMCQQuestionForm>
      : T extends typeof EnumQuestionType.MultiCorrectMcq
        ? UseFormReturn<AddMultiCorrectMCQQuestionForm>
        : never;
};

export const AddQuestionFormCommonFields =
  ({}: AddQuestionFormCommonFieldsProps<QuestionType>) => {
    return (
      <>
        <FormField
          // control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EnumQuestionType.Code}>Code</SelectItem>
                    <SelectItem value={EnumQuestionType.SingleCorrectMcq}>
                      Single-correct MCQ
                    </SelectItem>
                    <SelectItem value={EnumQuestionType.MultiCorrectMcq}>
                      Multi-correct MCQ
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The type of question you want to ask
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          // control={form.control}
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
          // control={form.control}
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
      </>
    );
  };
