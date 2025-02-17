"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EnumQuestionType } from "@/schemas/questionSchema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const QuestionFormCommonFields = () => {
  return (
    <>
      <FormField
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Type</FormLabel>
            <FormControl>
              <Select {...field} disabled>
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
