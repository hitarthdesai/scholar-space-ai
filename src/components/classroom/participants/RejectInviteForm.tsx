"use client";

import { rejectInvite } from "@/actions/rejectInvite";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoadingButton } from "@/components/ui/loading-button";
import { SheetFooter } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import {
  rejectInviteFormSchema,
  EnumRejectInviteResult,
  type RejectInviteForm as RejectInviteFormType,
} from "@/schemas/classroomSchema";
import { FormIds } from "@/utils/constants/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toastDescriptionRejectInvite } from "@/utils/constants/toast";

type RejectInviteFormProps = {
  classroomId: string;
  setIsOpen: (isOpen: boolean) => void;
};

export function RejectInviteForm({
  classroomId,
  setIsOpen,
}: RejectInviteFormProps) {
  const rejectInviteDefaultValues: RejectInviteFormType = {
    confirm: false,
    classroomId: classroomId,
  };

  const router = useRouter();
  const form = useForm<RejectInviteFormType>({
    resolver: zodResolver(rejectInviteFormSchema),
    defaultValues: rejectInviteDefaultValues,
  });

  const { executeAsync, isExecuting } = useAction(rejectInvite, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumRejectInviteResult.InviteRejected;

      toast({
        title: isErroneous
          ? "Error in inviting participant"
          : "Participant invited successfully",
        description: toastDescriptionRejectInvite[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      if (!isErroneous) {
        form.reset();
        setIsOpen(false);
        router.refresh();
      }
    },
  });

  return (
    <Form {...form}>
      <form
        id={FormIds.RejectInvite}
        onSubmit={form.handleSubmit(executeAsync)}
        className="h-full"
      >
        <FormField
          control={form.control}
          name="confirm"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center space-x-2">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel>
                  Are you sure you want to reject this invite?
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <SheetFooter>
        <LoadingButton
          disabled={isExecuting}
          isLoading={isExecuting}
          type="submit"
          form={FormIds.RejectInvite}
        >
          Reject
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
}
