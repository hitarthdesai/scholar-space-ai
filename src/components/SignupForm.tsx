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
  type SignupForm,
  signupFormSchema,
  EnumAuthResult,
} from "@/schemas/formSchema";
import { signup } from "@/actions/signup";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAuth } from "@/utils/constants/toast";

const signupFormDefaultValues: SignupForm = {
  name: "",
  email: "",
};

export const SignupFormComponent = () => {
  const form = useForm<SignupForm>({
    resolver: zodResolver(signupFormSchema),
    defaultValues: signupFormDefaultValues,
  });

  const { executeAsync } = useAction(signup, {
    onSuccess({ data }) {
      if (!data?.type) return;
      const isError = data.type !== EnumAuthResult.EmailSent;

      toast({
        title: isError ? "Error during signup" : "No errors during signup",
        description: toastDescriptionAuth[data.type],
        variant: isError ? "destructive" : "default",
      });
      data?.type;
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input required type="text" {...field} />
              </FormControl>
              <FormDescription>
                This will be your display name. Choose wisely.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
                This is the email associated with your account. Keep it handy at
                all times.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Sign up</Button>
        <Toaster />
      </form>
    </Form>
  );
};
