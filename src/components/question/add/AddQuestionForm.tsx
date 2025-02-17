"use client";

import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";

import { AddCodeQuestionForm } from "./AddCodeQuestionForm";

import {
  type WithCloseFormSheetMethod,
  type WithCloseQuestionTypeDialogMethod,
} from "@/utils/types";
import { AddSingleCorrectMcqForm } from "./AddSingleCorrectMcqForm";

type AddQuestionFormProps = {
  type: QuestionType;
  assignmentId: string;
};

export const AddQuestionForm = ({
  type,
  assignmentId,
  closeSheet,
  closeQuestionTypeDialog,
}: WithCloseQuestionTypeDialogMethod<
  WithCloseFormSheetMethod<AddQuestionFormProps>
>) => {
  switch (type) {
    case EnumQuestionType.Code:
      return (
        <AddCodeQuestionForm
          assignmentId={assignmentId}
          closeSheet={closeSheet}
          closeQuestionTypeDialog={closeQuestionTypeDialog}
        />
      );
    case EnumQuestionType.SingleCorrectMcq:
      return (
        <AddSingleCorrectMcqForm
          assignmentId={assignmentId}
          closeSheet={closeSheet}
          closeQuestionTypeDialog={closeQuestionTypeDialog}
        />
      );
    // case EnumQuestionType.MultiCorrectMcq:
    //   return (
    //     <AddSingleCorrectFormFields
    //       assignmentId={assignmentId}
    //       closeSheet={closeSheet}
    //       closeQuestionTypeDialog={closeQuestionTypeDialog}
    //     />
    //   );
    default:
      return null;
  }
};
