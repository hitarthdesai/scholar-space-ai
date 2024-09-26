"use client";

import { acceptInvite } from "@/actions/acceptInvite";
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
  acceptInviteFormSchema,
  EnumAcceptInviteResult,
  type AcceptInviteForm as AcceptInviteFormType,
} from "@/schemas/classroomSchema";
import { FormIds } from "@/utils/constants/form";
import { toastDescriptionAcceptInvite } from "@/utils/constants/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@/components/ui/checkbox";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

type AcceptInviteFormProps = {
  classroomId: string;
  setIsOpen: (isOpen: boolean) => void;
};

export function AcceptInviteForm({
  classroomId,
  setIsOpen,
}: AcceptInviteFormProps) {
  const acceptInviteDefaultValues: AcceptInviteFormType = {
    confirm: false,
    classroomId: classroomId,
  };

  const router = useRouter();
  const form = useForm<AcceptInviteFormType>({
    resolver: zodResolver(acceptInviteFormSchema),
    defaultValues: acceptInviteDefaultValues,
  });

  const { executeAsync, isExecuting } = useAction(acceptInvite, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAcceptInviteResult.InviteAccepted;

      toast({
        title: isErroneous ? "Error in accepting invite" : "Invite accepted",
        description: toastDescriptionAcceptInvite[data.type],
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
        id={FormIds.AcceptInvite}
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
                  Are you sure you want to accept this invite?
                </FormLabel>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
      <SheetFooter>
        <LoadingButton
          isLoading={isExecuting}
          type="submit"
          form={FormIds.AcceptInvite}
          className="disabled:cursor-not-allowed disabled:opacity-50"
        >
          Accept
        </LoadingButton>
      </SheetFooter>
    </Form>
  );
}
