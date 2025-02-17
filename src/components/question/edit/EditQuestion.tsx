import { getCodeQuestionById } from "@/utils/classroom/question/getCodeQuestionById";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import { type PropsWithChildren } from "react";
import { EditQuestionSheet } from "./EditQuestionSheet";

export type EditQuestionProps = {
  type: QuestionType;
  id: string;
};

export function EditQuestion({
  children,
  type,
  id,
}: PropsWithChildren<EditQuestionProps>) {
  try {
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
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
