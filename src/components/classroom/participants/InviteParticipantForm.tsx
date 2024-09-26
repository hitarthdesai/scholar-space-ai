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
  inviteParticipantFormSchema,
  EnumInviteParticipantResult,
  EnumClassroomRole,
  type InviteParticipantForm as InviteParticipantFormType,
} from "@/schemas/classroomSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionInviteParticipant } from "@/utils/constants/toast";

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
import { inviteParticipant } from "@/actions/inviteParticipant";

type AddParticipantFormProps = {
  classroomId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export function InviteParticipantForm({
  classroomId,
  setIsOpen,
}: AddParticipantFormProps) {
  const inviteParticipantDefaultValues: InviteParticipantFormType = {
    classroomId,
    email: "",
    role: EnumClassroomRole.Student,
  };

  const router = useRouter();
  const form = useForm<InviteParticipantFormType>({
    resolver: zodResolver(inviteParticipantFormSchema),
    defaultValues: inviteParticipantDefaultValues,
  });

  const { executeAsync, isExecuting: isInviting } = useAction(
    inviteParticipant,
    {
      onSuccess({ data }) {
        if (!data?.type) return;

        const isErroneous =
          data.type !== EnumInviteParticipantResult.ParticpantInvited;

        toast({
          title: isErroneous
            ? "Error in inviting participant"
            : "Participant invited successfully",
          description: toastDescriptionInviteParticipant[data.type],
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

  return (
    <Form {...form}>
      <form
        id={FormIds.InviteParticipant}
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex h-full flex-col gap-2"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormDescription>
                The participant&apos;s email address
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
      <SheetFooter>
        <LoadingButton
          disabled={isInviting}
          isLoading={isInviting}
          type="submit"
          form={FormIds.InviteParticipant}
        >
          Invite
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
}
