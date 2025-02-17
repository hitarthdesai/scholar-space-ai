import { type McqOption } from "@/schemas/questionSchema";

type OptionsWithCorrectness = McqOption & { isCorrect: boolean };

type MergeMcqOptionsAndCorrectnessProps = {
  options: McqOption[];
  correctOptions: string[];
};

export const mergeMcqOptionsAndCorrectness = ({
  options,
  correctOptions,
}: MergeMcqOptionsAndCorrectnessProps): OptionsWithCorrectness[] => {
  return options.map((option) => ({
    ...option,
    isCorrect: correctOptions.includes(option.value),
  }));
};
