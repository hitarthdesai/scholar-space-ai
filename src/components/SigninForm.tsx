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
import { Toaster } from "@/components/ui/toaster";
import {
  type SigninForm,
  signinFormSchema,
  EnumAuthResult,
} from "@/schemas/formSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAuth } from "@/utils/constants/toast";
import { signin } from "@/actions/signin";

const signinFormDefaultValues: SigninForm = {
  email: "",
};

export const SigninFormComponent = () => {
  const form = useForm<SigninForm>({
    resolver: zodResolver(signinFormSchema),
    defaultValues: signinFormDefaultValues,
  });

  const { executeAsync } = useAction(signin, {
    onSuccess({ data }) {
      if (!data?.type) return;
      const isError = data.type !== EnumAuthResult.EmailSent;

      toast({
        title: isError ? "Error during signin" : "No errors during signin",
        description: toastDescriptionAuth[data.type],
        variant: isError ? "destructive" : "default",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(executeAsync)}
        className="flex flex-col gap-y-4"
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
                The email associated with your account
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Sign in</Button>
        <Toaster />
      </form>
    </Form>
  );
};
