"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
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

const defaultPromptInputValues: PromptInput = {
  prompt: "",
};

export function ChatPromptInput() {
  const form = useForm<PromptInput>({
    resolver: zodResolver(promptSchema),
    defaultValues: defaultPromptInputValues,
  });

  const { sendMessage } = useActions<TypeAI>();
  const uiState = useUIState<TypeAI>();
  const setMessages = uiState[1];

  const handleSubmit = async ({ prompt }: PromptInput) => {
    let initialMessages: Message[] = [];
    setMessages((messages) => {
      initialMessages = [
        ...messages,
        { role: EnumMessageRole.User, content: prompt },
      ];

      return initialMessages;
    });

    const response = await sendMessage(prompt);

    let textContent = "";
    for await (const delta of readStreamableValue(response)) {
      textContent = `${textContent}${delta}`;

      setMessages([
        ...initialMessages,
        { role: EnumMessageRole.Assistant, content: textContent },
      ]);
    }
  };

  return (
    <Form {...form}>
      <div className="flex items-center justify-center">
        <form
          id="prompt"
          className="flex w-full max-w-xl rounded-full border-[1px] border-primary p-2 sm:max-w-2xl"
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
                      className="border-none"
                      placeholder="Ask a question"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <Button type="submit" size="icon" className="rounded-full">
            <ArrowUpIcon />
          </Button>
        </form>
      </div>
    </Form>
  );
}
