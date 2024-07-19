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
  type LoginForm,
} from "@/schemas/formSchema";
import { toast } from "@/components/ui/use-toast";
import { toastDescriptionAuth } from "@/utils/constants/toast";
import { login } from "@/actions/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
    <Card className="flex max-w-96 flex-col gap-y-4 px-4">
      <CardHeader>
        <CardTitle>Login to ScholarSpace AI</CardTitle>
        <CardDescription>
          Fill this form to login to the platform, or automatically create an
          account with us if you haven&apos;t already.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form id="loginform" onSubmit={form.handleSubmit(executeAsync)}>
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
                    We will send a magic link to this email. Clicking on it will
                    securely sign you in ✨
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
      <CardFooter>
        <Button type="submit" form="loginform">
          Login
        </Button>
      </CardFooter>
    </Card>
  );
};
