"use client";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  MCQ_OPTIONS_MAX_LENGTH,
  MCQ_OPTIONS_MIN_LENGTH,
  type McqOption,
  type EnumQuestionType,
} from "@/schemas/questionSchema";
import { XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { type UseFormReturn } from "react-hook-form";
import { CheckIcon } from "@radix-ui/react-icons";
import { type ExtractQuestionForm } from "@/utils/types";

type AddSingleCorrectMcqFormProps = {
  form: UseFormReturn<
    ExtractQuestionForm<typeof EnumQuestionType.SingleCorrectMcq>
  >;
};

const defaultOptions: McqOption[] = [
  { value: "1", label: "" },
  { value: "2", label: "" },
];

export function AddSingleCorrectFormFields({
  form,
}: AddSingleCorrectMcqFormProps) {
  const [options, setOptions] = useState<McqOption[]>(defaultOptions);

  useEffect(() => {
    form.setValue("options", options);
  }, [form, options]);

  const addOption = () => {
    setOptions((prev) => [
      ...prev,
      { value: new Date().getTime().toString(), label: "" },
    ]);
  };

  const removeOption = (value: string) => {
    setOptions((prev) => {
      return prev.filter((o) => o.value !== value);
    });
  };

  console.log("errors", form.formState.errors);

  return (
    <div className="border-t-2 border-border pt-4">
      <FormField
        control={form.control}
        name="correctOption"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="mb-4 flex items-center justify-between">
              Options
              <Button
                type="button"
                size="sm"
                disabled={options.length >= MCQ_OPTIONS_MAX_LENGTH}
                onClick={addOption}
              >
                Add more
              </Button>
            </FormLabel>
            <FormControl>
              <RadioGroup
                {...field}
                onValueChange={field.onChange}
                defaultValue={defaultOptions[0].value}
              >
                {options.map(({ value, label }, i) => {
                  return (
                    <div className="flex items-center gap-4" key={i}>
                      <FormItem className="flex items-center gap-4">
                        <FormLabel className="min-w-3 text-right">
                          {i + 1}.
                        </FormLabel>
                        <FormControl>
                          <RadioGroupItem
                            value={value}
                            indicator={
                              <CheckIcon className="h-3.5 w-3.5 fill-primary" />
                            }
                            className="!m-0"
                          />
                        </FormControl>
                      </FormItem>
                      <Input
                        required
                        value={label}
                        onChange={(e) => {
                          setOptions((prev) => {
                            return prev.map((o) => {
                              if (o.value === value) {
                                return { ...o, label: e.target.value };
                              }
                              return o;
                            });
                          });
                        }}
                      />
                      <Button
                        className="ml-6"
                        type="button"
                        size="icon"
                        variant="ghost"
                        disabled={options.length === MCQ_OPTIONS_MIN_LENGTH}
                        onClick={() => removeOption(value)}
                      >
                        <XIcon size={16} />
                      </Button>
                    </div>
                  );
                })}
              </RadioGroup>
            </FormControl>
            <FormDescription>
              Options for the multiple choice question
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
