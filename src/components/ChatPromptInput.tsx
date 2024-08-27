"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import {
  continueConversationInputSchema,
  type ContinueConversationInput,
  EnumConversationType,
  type Message,
  EnumMessageRole,
} from "@/schemas/chatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { type TypeAI } from "./AiProvider";
import { useRouter } from "next/navigation";
import { useAction } from "next-safe-action/hooks";

export type ChatPromptInputProps =
  | {
      type: "free";
      conversationId?: string;
    }
  | {
      type: "ques";
      questionId: string;
    };

export function ChatPromptInput({ type, ...props }: ChatPromptInputProps) {
  const defaultPromptInputValues: ContinueConversationInput = {
    prompt: "",
    type,
    ...props,
  };

  const router = useRouter();
  const form = useForm<ContinueConversationInput>({
    resolver: zodResolver(continueConversationInputSchema),
    defaultValues: defaultPromptInputValues,
    mode: "onChange",
  });

  const [, setUiMessages] = useUIState<TypeAI>();
  const { continueConversation } = useActions<TypeAI>();
  const { executeAsync } = useAction(continueConversation, {
    onSuccess: async ({ data }) => {
      // TODO: Show an error toast or smth here?
      if (!data) return;

      let textContent = "";
      const { stream, newConversationId } = data;
      for await (const delta of readStreamableValue(stream)) {
        textContent = `${textContent}${delta}`;
        setUiMessages((messages) => {
          if (messages.at(-1)?.role === EnumMessageRole.User) {
            return [
              ...messages,
              { role: EnumMessageRole.Assistant, content: textContent },
            ];
          }

          return [
            ...messages.slice(0, -1),
            { role: EnumMessageRole.Assistant, content: textContent },
          ];
        });
      }

      if (type === EnumConversationType.Free) {
        router.push(`/chat/${newConversationId}`);
      }
      router.refresh();
    },
  });

  const handleSubmit = async (formData: ContinueConversationInput) => {
    form.reset(defaultPromptInputValues);

    let initialMessages: Message[] = [];
    setUiMessages((messages) => {
      initialMessages = [
        ...messages,
        { role: EnumMessageRole.User, content: formData.prompt },
      ];

      return initialMessages;
    });

    await executeAsync(formData);
  };

  return (
    <Form {...form}>
      <form
        id="prompt"
        className="flex rounded-full border border-primary p-1"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          name="prompt"
          control={form.control}
          render={({ field }) => {
            return (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    {...field}
                    className="border-none focus-visible:ring-0"
                    placeholder="Ask a question"
                    autoComplete="off"
                  />
                </FormControl>
              </FormItem>
            );
          }}
        />
        <Button
          type="submit"
          size="icon"
          className="rounded-full"
          disabled={!form.formState.isValid || form.formState.isSubmitting}
        >
          <ArrowUpIcon />
        </Button>
      </form>
    </Form>
  );
}
