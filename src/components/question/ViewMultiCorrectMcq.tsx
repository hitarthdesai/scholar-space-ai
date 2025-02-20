"use client";

import { use, useEffect } from "react";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { type getMultiCorrectMcqByIdForAttempt } from "@/utils/classroom/question/getMultiCorrectMcqByIdForAttempt";
import { Checkbox } from "../ui/checkbox";
import { useDebounce } from "@uidotdev/usehooks";

type ViewSingleCorrectMcqProps = {
  questionPromise: ReturnType<typeof getMultiCorrectMcqByIdForAttempt>;
};

export function ViewMultiCorrectMcq({
  questionPromise,
}: ViewSingleCorrectMcqProps) {
  const question = use(questionPromise);

  const defaultValues: DefaultValues<SaveMcqSelectionInput> = {
    type: EnumQuestionType.MultiCorrectMcq,
    questionId: question.id,
    selectedOptions: question.selectedOptions,
  };
  const form = useForm<SaveMcqSelectionInput>({
    resolver: zodResolver(saveMcqSelectionInputSchema),
    defaultValues,
  });

  const { executeAsync } = useAction(saveMcqSelection, {
    onSettled({ result: { data } }) {
      console.log("data", data);
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

  const selectedOptions = form.watch("selectedOptions");
  const toggleSelectOption = (value: string) => {
    const newSelectedOptions = selectedOptions.includes(value)
      ? selectedOptions.filter((o) => o !== value)
      : [...selectedOptions, value];
    form.setValue("selectedOptions", newSelectedOptions);
  };

  const values = form.getValues();
  const debouncedValues = useDebounce(values, 500);
  useEffect(() => {
    void executeAsync(debouncedValues);
  }, [debouncedValues, executeAsync]);

  return (
    <div className="flex p-4">
      <Form {...form}>
        <form className="flex flex-col gap-2">
          <div className="text-lg font-semibold">{question.question}</div>
          <FormField
            control={form.control}
            name="selectedOptions"
            render={() => (
              <FormItem>
                {question.options.map(({ value, label }) => {
                  return (
                    <FormItem key={value} className="flex items-center gap-2">
                      <FormControl>
                        <Checkbox
                          value={value}
                          checked={selectedOptions.includes(value)}
                          onCheckedChange={() => toggleSelectOption(value)}
                          className="!mt-0"
                        />
                      </FormControl>
                      <FormLabel className="!m-0">{label}</FormLabel>
                    </FormItem>
                  );
                })}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
