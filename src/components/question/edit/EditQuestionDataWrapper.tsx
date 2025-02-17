import { getCodeQuestionById } from "@/utils/classroom/question/getCodeQuestionById";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import { type PropsWithChildren } from "react";
import { EditQuestionSheet } from "./EditQuestionSheet";
import { getSingleCorrectMcqByIdForEdit } from "@/utils/classroom/question/getSingleCorrectMcqByIdForEdit";
import { getMultiCorrectMcqById } from "@/utils/classroom/question/getMultiCorrectMcqById";

export type EditQuestionDataWrapperProps = {
  type: QuestionType;
  id: string;
};

export function EditQuestionDataWrapper({
  children,
  type,
  id,
}: PropsWithChildren<EditQuestionDataWrapperProps>) {
  switch (type) {
    case EnumQuestionType.Code: {
      const editPromise = getCodeQuestionById({ id });
      return (
        <EditQuestionSheet
          type={EnumQuestionType.Code}
          editPromise={editPromise}
        >
          {children}
        </EditQuestionSheet>
      );
    }

    case EnumQuestionType.SingleCorrectMcq: {
      const editPromise = getSingleCorrectMcqByIdForEdit({
        id,
      });
      return (
        <EditQuestionSheet
          type={EnumQuestionType.SingleCorrectMcq}
          editPromise={editPromise}
        >
          {children}
        </EditQuestionSheet>
      );
    }

    case EnumQuestionType.MultiCorrectMcq: {
      const editPromise = getMultiCorrectMcqById({ id });
      return (
        <EditQuestionSheet
          type={EnumQuestionType.MultiCorrectMcq}
          editPromise={editPromise}
        >
          {children}
        </EditQuestionSheet>
      );
    }
  }
}
