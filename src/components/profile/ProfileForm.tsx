"use client";

import React from "react";
import { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { LoadingButton } from "../ui/loading-button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
} from "@/components/ui/form";
import {
  updateUserInformationFormSchema,
  EnumUpdateUserInformationResult,
  type UpdateUserInformationForm as EditProfileFormType,
} from "@/schemas/userSchema";
import { updateUserInformation } from "@/actions/updateUserInformation";
import { Textarea } from "@/components/ui/textarea";
import { User } from "lucide-react";
import { toastDescriptionUpdateUserInformation } from "@/utils/constants/toast";
import { cn } from "@/utils/cn";

export type ProfileData = {
  email: string;
  name: string;
  aboutMe: string;
};

type ProfileFormProps = {
  initialProfileData: ProfileData;
  userId: string;
  isUserAllowedToEdit: boolean;
};

export default function ProfileForm({
  initialProfileData,
  userId,
  isUserAllowedToEdit,
}: ProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [clickedButton, setClickedButton] = useState<"save" | "cancel" | null>(
    null
  );
  const updateUserInformationDefaultValues: EditProfileFormType = {
    email: initialProfileData.email,
    userId: userId,
    userDescription: initialProfileData.aboutMe,
    newName: initialProfileData.name,
  };

  const form = useForm<EditProfileFormType>({
    resolver: zodResolver(updateUserInformationFormSchema),
    defaultValues: updateUserInformationDefaultValues,
  });

  const { executeAsync, isExecuting } = useAction(updateUserInformation, {
    onSuccess({ data }) {
      if (!data?.type) return;

      const isErroneous =
        data.type !== EnumUpdateUserInformationResult.UserInformationUpdated;
      toast({
        title: isErroneous
          ? "Error in editing profile"
          : "Profile edited successfully",
        description: toastDescriptionUpdateUserInformation[data.type],
        variant: isErroneous ? "destructive" : "default",
      });

      if (!isErroneous) {
        router.refresh();
        setIsEditing(false);
        setClickedButton(null);
      }
    },
  });

  const handleSave = form.handleSubmit((data) => {
    setClickedButton("save");
    executeAsync(data);
  });

  const handleCancel = () => {
    setClickedButton("cancel");
    setIsEditing(false);
    form.reset(updateUserInformationDefaultValues);
    setClickedButton(null);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSave}
        className="flex flex-col gap-8 p-8 md:flex-row"
      >
        <div className="flex flex-col gap-3 md:w-1/3">
          <User className="mb-4 h-40 w-40 rounded-full bg-white object-cover text-slate-900" />

          <FormField
            control={form.control}
            name="newName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name:</FormLabel>
                <FormControl>
                  <Input
                    autoComplete="off"
                    {...field}
                    className="bg-slate-900 text-white disabled:cursor-default disabled:opacity-100"
                    disabled={!isEditing}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email:</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className={cn(
                      "disabled:cursor-default disabled:bg-slate-900 disabled:opacity-100",
                      isEditing &&
                        "disabled:cursor-not-allowed disabled:opacity-50"
                    )}
                    disabled
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {isEditing && (
            <div className="flex flex-row gap-2">
              <LoadingButton
                type="submit"
                className="w-20 rounded bg-green-800 text-white"
                isLoading={isExecuting && clickedButton === "save"}
                disabled={isExecuting && clickedButton === "cancel"}
              >
                Save
              </LoadingButton>
              <LoadingButton
                type="button"
                className="w-20 rounded bg-red-800 text-white"
                isLoading={isExecuting && clickedButton === "cancel"}
                disabled={isExecuting && clickedButton === "save"}
                onClick={handleCancel}
              >
                Cancel
              </LoadingButton>
            </div>
          )}

          {!isEditing && isUserAllowedToEdit && (
            <LoadingButton
              type="button"
              className="w-20 rounded bg-blue-500 text-white"
              isLoading={isExecuting}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </LoadingButton>
          )}
        </div>

        <div className="md:w-2/3">
          <FormField
            control={form.control}
            name="userDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About Me:</FormLabel>
                <FormControl>
                  <Textarea
                    autoComplete="off"
                    {...field}
                    className="w-full rounded border bg-slate-900 text-white disabled:cursor-default disabled:opacity-100"
                    disabled={!isEditing}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
}
