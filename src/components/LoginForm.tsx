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
import { Button } from "@/components/ui/button";
import {
  loginFormSchema,
  EnumLoginResult,
  LoginForm,
} from "@/schemas/formSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAuth } from "@/utils/constants/toast";
import { login } from "@/actions/login";

const loginFormDefaultValues: LoginForm = {
  email: "",
};

export const LoginFormComponent = () => {
  const form = useForm<LoginForm>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: loginFormDefaultValues,
  });

  const { executeAsync } = useAction(login, {
    onSuccess({ data }) {
      if (!data?.type) return;
      const isError = data.type !== EnumLoginResult.EmailSent;

      toast({
        title: isError ? "Error during login" : "No errors during login",
        description: toastDescriptionAuth[data.type],
        variant: isError ? "destructive" : "default",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex w-96 flex-col gap-y-4 px-4"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input required type="email" {...field} />
              </FormControl>
              <FormDescription>
                We will send a magic link to this email to verify your identity.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
};
