"use client";

import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";

import { AddCodeQuestionForm } from "./AddCodeQuestionForm";

import { AddSingleCorrectFormFields } from "./AddSingleCorrectMcqFormFields";
import { type WithSheetOpenStateSetter } from "@/utils/types";

type AddQuestionFormProps = {
  type: QuestionType;
  assignmentId: string;
};

export const AddQuestionForm = ({
  type,
  ...rest
}: WithSheetOpenStateSetter<AddQuestionFormProps>) => {
  switch (type) {
    case EnumQuestionType.Code:
      return <AddCodeQuestionForm {...rest} />;
    case EnumQuestionType.SingleCorrectMcq:
      return <AddSingleCorrectFormFields {...rest} />;
    case EnumQuestionType.MultiCorrectMcq:
      return <AddSingleCorrectFormFields {...rest} />;
  }
};
