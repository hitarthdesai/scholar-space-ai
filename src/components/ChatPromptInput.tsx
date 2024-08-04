"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "./ui/form";
import {
  EnumMessageRole,
  type Message,
  type PromptInput,
  promptSchema,
} from "@/schemas/chatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { readStreamableValue, useActions, useUIState } from "ai/rsc";
import { type TypeAI } from "./AiProvider";
import { useRouter } from "next/navigation";

type ChatPromptInputProps = {
  conversationId?: string;
};

const defaultPromptInputValues: PromptInput = {
  prompt: "",
};

export function ChatPromptInput({ conversationId }: ChatPromptInputProps) {
  const router = useRouter();
  const form = useForm<PromptInput>({
    resolver: zodResolver(promptSchema),
    defaultValues: defaultPromptInputValues,
    mode: "onChange",
  });

  const { continueConversation } = useActions<TypeAI>();
  const uiState = useUIState<TypeAI>();
  const setMessages = uiState[1];

  const handleSubmit = async ({ prompt }: PromptInput) => {
    form.reset(defaultPromptInputValues);

    let initialMessages: Message[] = [];
    setMessages((messages) => {
      initialMessages = [
        ...messages,
        { role: EnumMessageRole.User, content: prompt },
      ];

      return initialMessages;
    });

    const { stream, newConversationId } = await continueConversation({
      prompt,
      conversationId,
    });

    let textContent = "";
    for await (const delta of readStreamableValue(stream)) {
      textContent = `${textContent}${delta}`;

      setMessages([
        ...initialMessages,
        { role: EnumMessageRole.Assistant, content: textContent },
      ]);
    }

    router.push(`/chat/${newConversationId}`);
    router.refresh();
  };

  return (
    <Form {...form}>
      <form
        id="prompt"
        className="flex rounded-full border-[1px] border-primary p-1"
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
