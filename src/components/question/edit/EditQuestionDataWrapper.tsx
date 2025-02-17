import { getCodeQuestionById } from "@/utils/classroom/question/getCodeQuestionById";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import { type PropsWithChildren } from "react";
import { EditQuestionSheet } from "./EditQuestionSheet";
import { getSingleCorrectMcqById } from "@/utils/classroom/question/getSingleCorrectMcqById";

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
      const editPromise = getSingleCorrectMcqById({ id });
      return (
        <EditQuestionSheet
          type={EnumQuestionType.SingleCorrectMcq}
          editPromise={editPromise}
        >
          {children}
        </EditQuestionSheet>
      );
    }
  }
}
