"use client";

import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormMessage } from "./ui/form";
import {
  EnumMessageRole,
  type PromptInput,
  promptSchema,
} from "@/schemas/chatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useActions, useUIState } from "ai/rsc";
import { type AI } from "./AiProvider";

const defaultPromptInputValues: PromptInput = {
  prompt: "",
};

export function ChatPromptInput() {
  const { sendMessage } = useActions<typeof AI>();
  const [_, setMessages] = useUIState<typeof AI>();

  const form = useForm<PromptInput>({
    resolver: zodResolver(promptSchema),
    defaultValues: defaultPromptInputValues,
  });

  return (
    <Form {...form}>
      <div className="flex items-center justify-center">
        <form
          id="prompt"
          className="flex w-full max-w-xl rounded-full border-[1px] border-primary p-2 sm:max-w-2xl"
          onSubmit={form.handleSubmit(async ({ prompt }) => {
            setMessages((messages) => [
              ...messages,
              { role: EnumMessageRole.User, content: prompt },
            ]);

            const response = await sendMessage(prompt);
            setMessages((messages) => [...messages, response]);
          })}
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
