"use client";

import { use } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { type DefaultValues, useForm } from "react-hook-form";
import { useAction } from "next-safe-action/hooks";
import { saveMcqSelection } from "@/actions/saveMcqSelection";
import {
  EnumQuestionType,
  EnumSaveMcqSelectionResult,
  type SaveMcqSelectionInput,
  saveMcqSelectionInputSchema,
} from "@/schemas/questionSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionSaveMcqSelection } from "@/utils/constants/toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { type getSingleCorrectMcqByIdForAttempt } from "@/utils/classroom/question/getSingleCorrectMcqByIdForAttempt";
import { CheckIcon } from "@radix-ui/react-icons";
import { zodResolver } from "@hookform/resolvers/zod";

type ViewSingleCorrectMcqProps = {
  questionPromise: ReturnType<typeof getSingleCorrectMcqByIdForAttempt>;
};

export function ViewSingleCorrectMcq({
  questionPromise,
}: ViewSingleCorrectMcqProps) {
  const question = use(questionPromise);
  const defaultValues: DefaultValues<SaveMcqSelectionInput> = {
    type: EnumQuestionType.SingleCorrectMcq,
    questionId: question.id,
    selectedOption: question.selectedOption,
  };

  const { executeAsync, isExecuting } = useAction(saveMcqSelection, {
    onSettled({ result: { data } }) {
      if (!data) return;

      const isErroneous =
        data.type !== EnumSaveMcqSelectionResult.McqSelectionSaved;
      toast({
        title: isErroneous
          ? "Error in saving selection"
          : "Selection saved successfully",
        description: toastDescriptionSaveMcqSelection[data.type],
        variant: isErroneous ? "destructive" : "default",
      });
    },
  });

  const form = useForm<SaveMcqSelectionInput>({
    resolver: zodResolver(saveMcqSelectionInputSchema),
    defaultValues,
    disabled: isExecuting,
  });

  return (
    <div className="flex p-4">
      <Form {...form}>
        <form className="flex flex-col gap-2">
          <div className="text-lg font-semibold">{question.question}</div>
          <FormField
            control={form.control}
            name="selectedOption"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      {...field}
                      name={field.name}
                      onValueChange={(newValue) => {
                        field.onChange(newValue);
                        form.handleSubmit(executeAsync)();
                      }}
                      defaultValue={field.value}
                      value={field.value}
                    >
                      {question.options.map(({ value, label }) => {
                        return (
                          <FormItem
                            key={value}
                            className="flex items-center gap-2"
                          >
                            <FormControl>
                              <RadioGroupItem
                                value={value}
                                indicator={
                                  <CheckIcon className="h-3.5 w-3.5 fill-primary" />
                                }
                                className="!m-0"
                              />
                            </FormControl>
                            <FormLabel className="!m-0">{label}</FormLabel>
                          </FormItem>
                        );
                      })}
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              );
            }}
          />
        </form>
      </Form>
    </div>
  );
}
