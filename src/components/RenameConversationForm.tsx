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
  renameConversationFormSchema,
  EnumRenameConversationResult,
  type RenameConversationForm,
} from "@/schemas/chatSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionRenameConversation } from "@/utils/constants/toast";

import { renameConversation } from "@/actions/renameConversations";
import { FormIds } from "@/utils/constants/form";
import { type Dispatch, type SetStateAction } from "react";
import { useRouter } from "next/navigation";

type RenameConversationFormProps = {
  conversationId: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
};

export const RenameConversationFormComponent = ({
  conversationId,
  setIsOpen,
}: RenameConversationFormProps) => {
  const router = useRouter();

  const renameConversationFormDefaultValues: RenameConversationForm = {
    newName: "",
    conversationId: conversationId,
  };

  const form = useForm<RenameConversationForm>({
    resolver: zodResolver(renameConversationFormSchema),
    defaultValues: renameConversationFormDefaultValues,
  });

  const { executeAsync } = useAction(renameConversation, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumRenameConversationResult.ConversationRenamed;

      toast({
        title: isErroneous
          ? "Error in renaming conversation"
          : "Conversation renamed successfully",
        description: toastDescriptionRenameConversation[data.type],
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
        id={FormIds.RenameConversation}
        onSubmit={form.handleSubmit(executeAsync)}
      >
        <FormField
          control={form.control}
          name="newName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required {...field} />
              </FormControl>
              <FormDescription>
                What would you like to rename this conversation to?
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
