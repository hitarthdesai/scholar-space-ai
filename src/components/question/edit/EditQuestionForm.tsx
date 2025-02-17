"use client";

import { EditCodeQuestionForm } from "./EditCodeQuestionForm";
import { type EditPromise, EnumQuestionType } from "@/schemas/questionSchema";
import { type WithCloseFormSheetMethod } from "@/utils/types";
import { use } from "react";

type EditQuestionFormProps = {
  editPromise: EditPromise;
};

export function EditQuestionForm({
  editPromise,
  closeSheet,
}: WithCloseFormSheetMethod<EditQuestionFormProps>) {
  const data = use(editPromise);
  if (!data) return null;

  switch (data.type) {
    case EnumQuestionType.Code: {
      return <EditCodeQuestionForm {...data} closeSheet={closeSheet} />;
    }
    default:
      return null;
  }
}
