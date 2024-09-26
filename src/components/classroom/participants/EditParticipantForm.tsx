"use client";

import { useAction } from "next-safe-action/hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  EnumClassroomRole,
  type EditParticipantForm as EditParticipantFormType,
  editParticipantFormSchema,
  EnumEditParticipantResult,
  type ClassroomParticipant,
  EnumRemoveParticipantResult,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import {
  toastDescriptionEditParticipant,
  toastDescriptionRemoveParticipant,
} from "@/utils/constants/toast";

import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";
import { SheetFooter } from "../../ui/sheet";
import { LoadingButton } from "../../ui/loading-button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { editParticipant } from "@/actions/editParticipant";
import { removeParticipant } from "@/actions/removeParticipant";

type EditParticipantFormProps = {
  classroomId: string;
  participant: ClassroomParticipant;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function EditParticipantForm({
  classroomId,
  participant,
  setIsOpen,
}: EditParticipantFormProps) {
  const editParticipantDefaultValues: EditParticipantFormType = {
    classroomId,
    participantId: participant.id,
    role: participant.role,
  };

  const router = useRouter();
  const form = useForm<EditParticipantFormType>({
    resolver: zodResolver(editParticipantFormSchema),
    defaultValues: editParticipantDefaultValues,
  });

  const { executeAsync: executeEdit, isExecuting: isEditing } = useAction(
    editParticipant,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumEditParticipantResult.ParticpantEdited;

        toast({
          title: isErroneous
            ? "Error in editing participant"
            : "Participant edited successfully",
          description: toastDescriptionEditParticipant[data.type],
          variant: isErroneous ? "destructive" : "default",
        });

        if (!isErroneous) {
          form.reset();
          setIsOpen(false);
          router.refresh();
        }
      },
    }
  );

  const { executeAsync: executeRemove, isExecuting: isRemoving } = useAction(
    removeParticipant,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumRemoveParticipantResult.ParticpantRemoved;

        toast({
          title: isErroneous
            ? "Error in removing participant"
            : "Participant removed successfully",
          description: toastDescriptionRemoveParticipant[data.type],
          variant: isErroneous ? "destructive" : "default",
        });

        if (!isErroneous) {
          form.reset();
          setIsOpen(false);
          router.refresh();
        }
      },
    }
  );

  const disableActions = isEditing || isRemoving;

  return (
    <Form {...form}>
      <form
        id={FormIds.EditParticipant}
        onSubmit={form.handleSubmit(executeEdit)}
        className="flex h-full flex-col gap-2"
      >
        <FormItem>
          <FormLabel>Name</FormLabel>
          <FormControl>
            <Input disabled defaultValue={participant.name ?? ""} />
          </FormControl>
          <FormDescription>The participant&apos;s name</FormDescription>
          <FormMessage />
        </FormItem>

        <FormItem>
          <FormLabel>Email</FormLabel>
          <FormControl>
            <Input disabled defaultValue={participant.email} />
          </FormControl>
          <FormDescription>
            The participant&apos;s email address
          </FormDescription>
          <FormMessage />
        </FormItem>

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Select {...field} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={EnumClassroomRole.Student}>
                      Student
                    </SelectItem>
                    <SelectItem value={EnumClassroomRole.TeachingAssistant}>
                      Teaching Assistant
                    </SelectItem>
                    <SelectItem value={EnumClassroomRole.Teacher}>
                      Teacher
                    </SelectItem>
                    <SelectItem value={EnumClassroomRole.Admin}>
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormDescription>
                The participant&apos;s role in the classroom
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <SheetFooter className="flex w-full items-center justify-between">
        <LoadingButton
          disabled={disableActions}
          isLoading={isRemoving}
          variant="destructive"
          onClick={async () =>
            executeRemove({
              classroomId,
              participantId: participant.id,
            })
          }
        >
          Remove
        </LoadingButton>
        <LoadingButton
          disabled={isEditing}
          isLoading={isEditing}
          type="submit"
          form={FormIds.EditParticipant}
        >
          Edit
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
}
