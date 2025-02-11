"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { type AddQuestionForm } from "@/schemas/questionSchema";
import { MinusCircleIcon } from "lucide-react";
import { useState } from "react";
import { type UseFormReturn } from "react-hook-form";

type AddSingleCorrectMcqFormProps = {
  form: UseFormReturn<AddQuestionForm>;
};

type SingleCorrectMcqOption = {
  label: string;
  isCorrect: boolean;
};

const defaultOptions: SingleCorrectMcqOption[] = [
  { label: "", isCorrect: true },
  { label: "", isCorrect: false },
];

export function AddSingleCorrectFormFields({
  form,
}: AddSingleCorrectMcqFormProps) {
  const [options, setOptions] =
    useState<SingleCorrectMcqOption[]>(defaultOptions);

  const addOption = () => {
    setOptions((prev) => [...prev, { label: "", isCorrect: false }]);
  };

  const removeOption = (id: number) => {
    setOptions((prev) => {
      const isCorrect = prev[id].isCorrect;
      const newOptions = prev.slice(0, id).concat(prev.slice(id + 1));
      if (isCorrect) {
        newOptions[0].isCorrect = true;
      }

      return newOptions;
    });
  };

  const markOptionAsCorrect = (i: number) => {
    setOptions((prev) => {
      const newOptions = [...prev];
      newOptions.forEach((o) => {
        o.isCorrect = false;
      });
      newOptions[i].isCorrect = true;
      return newOptions;
    });
  };

  return (
    <div className="flex h-full w-full flex-col gap-4 border-t-2 border-border pt-4">
      <div className="flex items-center justify-between">
        <FormLabel>Options</FormLabel>
        <Button
          type="button"
          size="sm"
          disabled={options.length >= 5}
          onClick={addOption}
        >
          Add more
        </Button>
      </div>

      {options.map((_, i) => {
        return (
          <div className="flex items-center gap-4" key={i}>
            <label className="text-xs">{i + 1}.</label>
            <Input />
            <Checkbox
              checked={options[i].isCorrect}
              disabled={options.length === 1}
              onCheckedChange={(newChecked) => {
                if (!newChecked) return;

                markOptionAsCorrect(i);
              }}
            />
            <Button
              className="ml-6"
              type="button"
              size="icon"
              variant="ghost"
              disabled={options.length === 1}
              onClick={() => removeOption(i)}
            >
              <MinusCircleIcon />
            </Button>
          </div>
        );
      })}
    </div>
  );
}
