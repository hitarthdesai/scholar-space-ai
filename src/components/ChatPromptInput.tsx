"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { PromptInput, promptSchema } from "@/schemas/chatSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "./ui/input";
import { ArrowUpIcon, UpdateIcon, UploadIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

const defaultPromptInputValues: PromptInput = {
  prompt: "",
};

export function ChatPromptInput() {
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
