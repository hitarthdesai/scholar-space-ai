import { type McqOption } from "@/schemas/questionSchema";

type OptionsWithCorrectness = McqOption & { isCorrect: boolean };

type UnmergeMcqOptionsAndCorrectnessProps = {
  options: OptionsWithCorrectness[];
};

type UnmergedOptions = {
  options: McqOption[];
  correctOptions: string[];
};

export const unmergeMcqOptionsAndCorrectness = ({
  options,
}: UnmergeMcqOptionsAndCorrectnessProps): UnmergedOptions => {
  const unmergedOptions: UnmergedOptions = {
    options: [],
    correctOptions: [],
  };

  options.reduce((acc, option) => {
    const { isCorrect, ...rest } = option;
    acc.options.push(rest);
    if (isCorrect) {
      acc.correctOptions.push(rest.value);
    }

    return acc;
  }, unmergedOptions);

  return unmergedOptions;
};
