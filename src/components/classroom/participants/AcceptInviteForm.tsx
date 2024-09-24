"use client";

import { acceptInvite } from "@/actions/acceptInvite";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LoadingButton } from "@/components/ui/loading-button";
import { SheetFooter } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import {
  acceptInviteFormSchema,
  EnumAcceptInviteResult,
  type AcceptInviteForm as AcceptInviteFormType,
} from "@/schemas/classroomSchema";
import { FormIds } from "@/utils/constants/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from "@radix-ui/react-checkbox";
import { useAction } from "next-safe-action/hooks";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

export function AcceptInviteForm() {
  const acceptInviteDefaultValues: AcceptInviteFormType = {
    confirm: false,
  };

  const router = useRouter();
  const form = useForm<AcceptInviteFormType>({
    resolver: zodResolver(acceptInviteFormSchema),
    defaultValues: acceptInviteDefaultValues,
  });

  const { executeAsync, isExecuting: isInviting } = useAction(acceptInvite, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous = data.type !== EnumAcceptInviteResult.InviteAccepted;

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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                The participant&apos;s email address
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
