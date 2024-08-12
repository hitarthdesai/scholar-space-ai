import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from "lucide-react";
import { AddStudentFormComponent as AddStudentForm } from "./AddStudentForm";
import { FormIds } from "@/utils/constants/form";

export type AddStudentDialogProps = {
  classroomId: string;
};

export function AddStudentDialog({ classroomId }: AddStudentDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="h-16 w-16 rounded-full border-dashed p-4 sm:h-24 sm:w-24"
          variant="outline"
        >
          <UserPlus className="h-full w-full" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-72 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add student</DialogTitle>
          <DialogDescription>
            Enter your student&apos;s email here. Then, click add to add this
            student to your classroom.
          </DialogDescription>
        </DialogHeader>
        <AddStudentForm classroomId={classroomId} />
        <DialogFooter>
          <Button type="submit" form={FormIds.AddStudent}>
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
