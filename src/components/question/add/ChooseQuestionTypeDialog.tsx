"use client";

import React, { type PropsWithChildren, useState } from "react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { z } from "zod";
import { EnumQuestionType, type QuestionType } from "@/schemas/questionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  ArrowRightCircleIcon,
  Code2Icon,
  ListCheckIcon,
  ListChecksIcon,
} from "lucide-react";
import { CheckIcon } from "@radix-ui/react-icons";
import { cn } from "@/utils/cn";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { addQuestionSheetConfigByQuestionType } from "@/utils/constants/question";
import { AddQuestionForm } from "./AddQuestionForm";

const questionTypeSchema = z.object({
  type: z.enum([
    EnumQuestionType.Code,
    EnumQuestionType.SingleCorrectMcq,
    EnumQuestionType.MultiCorrectMcq,
  ]),
});

type _QuestionType = z.infer<typeof questionTypeSchema>;

const getUiConfigByQuestionType = (type: QuestionType) => {
  switch (type) {
    case EnumQuestionType.Code:
      return {
        type,
        title: "Code ",
        icon: <Code2Icon />,
      };
    case EnumQuestionType.SingleCorrectMcq:
      return {
        type,
        title: "Single Correct",
        icon: <ListCheckIcon />,
      };
    case EnumQuestionType.MultiCorrectMcq:
      return {
        type,
        title: "Multi Correct",
        icon: <ListChecksIcon />,
      };
  }
};

type ChooseQuestionTypeDialogProps = {
  assignmentId: string;
};

const ChooseQuestionTypeDialog = ({
  children,
  assignmentId,
}: PropsWithChildren<ChooseQuestionTypeDialogProps>) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const form = useForm<_QuestionType>({
    resolver: zodResolver(questionTypeSchema),
    defaultValues: { type: EnumQuestionType.Code },
  });

  const questionType = form.watch("type");
  const questionSheetConfig =
    addQuestionSheetConfigByQuestionType[questionType];

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent>
          <DialogTitle>Choose Question Type</DialogTitle>
          <DialogDescription>
            Select the type of question you want to add.
          </DialogDescription>
          <Form {...form}>
            <div className="flex flex-row items-center justify-between gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        {...field}
                        onValueChange={field.onChange}
                        className="flex flex-row items-center gap-4"
                      >
                        {Object.values(EnumQuestionType)
                          .map(getUiConfigByQuestionType)
                          .map(({ type, title, icon }) => {
                            const isSelected = field.value === type;

                            return (
                              <FormItem
                                className={cn(
                                  isSelected
                                    ? "bg-green-700"
                                    : "hover:bg-muted",
                                  "flex flex-col rounded-lg border-2 border-border pb-4"
                                )}
                                key={type}
                              >
                                <FormLabel className="flex h-20 w-20 flex-col items-center justify-center gap-2">
                                  {icon}
                                  <p className="text-center">{title}</p>
                                </FormLabel>
                                <div className="flex w-full items-center justify-center">
                                  <FormControl>
                                    <RadioGroupItem
                                      value={type}
                                      indicator={<CheckIcon className="!m-0" />}
                                      className="!m-0 flex items-center"
                                    />
                                  </FormControl>
                                </div>
                              </FormItem>
                            );
                          })}
                      </RadioGroup>
                    </FormControl>
                  </FormItem>
                )}
              />
              <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                <SheetTrigger asChild>
                  <Button className="flex h-full flex-col gap-2">
                    <ArrowRightCircleIcon />
                    Next
                  </Button>
                </SheetTrigger>
                <SheetContent className="flex h-full max-w-72 flex-col sm:max-w-[425px]">
                  <SheetHeader>
                    <SheetTitle>{questionSheetConfig.title}</SheetTitle>
                    <SheetDescription>
                      {questionSheetConfig.description}
                    </SheetDescription>
                  </SheetHeader>
                  <AddQuestionForm
                    type={questionType}
                    assignmentId={assignmentId}
                    closeSheet={() => setIsSheetOpen(false)}
                    closeQuestionTypeDialog={() => setIsDialogOpen(false)}
                  />
                </SheetContent>
              </Sheet>
            </div>
          </Form>
          <DialogClose asChild>
            <Button variant="destructive">Cancel</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ChooseQuestionTypeDialog;
