"use client";
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
  FormMessage,
} from "@/components/ui/form";
import {
  updateUserInformationFormSchema,
  EnumUpdateUserInformationResult,
  type UpdateUserInformationForm as EditProfileFormType,
} from "@/schemas/userSchema";
import { updateUserInformation } from "@/actions/updateUserInformation";
import { Textarea } from "@/components/ui/textarea";
import { User, Mail, FileText, Save, X, Edit } from "lucide-react";
import { toastDescriptionUpdateUserInformation } from "@/utils/constants/toast";
import { cn } from "@/utils/cn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type ProfileData = {
  email: string;
  name: string;
  aboutMe: string;
  image: string;
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

  const handleSave = form.handleSubmit(async (data) => {
    setClickedButton("save");
    try {
      await executeAsync(data);
    } catch (error) {
      console.error(error);
    }
  });

  const handleCancel = () => {
    setClickedButton("cancel");
    setIsEditing(false);
    form.reset(updateUserInformationDefaultValues);
    setClickedButton(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="container max-w-5xl py-8">
      <Card className="border-border bg-card text-card-foreground shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6">
          <CardTitle className="text-2xl font-bold">
            Profile Information
          </CardTitle>
          {!isEditing && isUserAllowedToEdit && (
            <LoadingButton
              type="button"
              variant="outline"
              className="flex items-center gap-2"
              isLoading={isExecuting}
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4" />
              Edit Profile
            </LoadingButton>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          <Form {...form}>
            <form onSubmit={handleSave} className="space-y-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="flex flex-col items-center space-y-6 md:items-start">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border-4 border-primary/10 bg-primary/10 text-2xl font-bold text-primary">
                    {getInitials(initialProfileData.name)}
                  </div>

                  <div className="w-full space-y-4">
                    <FormField
                      control={form.control}
                      name="newName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              autoComplete="off"
                              {...field}
                              className="bg-background disabled:cursor-default disabled:opacity-100"
                              disabled={!isEditing}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            Email
                          </FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              className={cn(
                                "bg-background disabled:cursor-default disabled:opacity-100",
                                isEditing &&
                                  "disabled:cursor-not-allowed disabled:opacity-50"
                              )}
                              disabled
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="userDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          About Me
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            autoComplete="off"
                            {...field}
                            className="min-h-[200px] resize-none bg-background disabled:cursor-default disabled:opacity-100"
                            disabled={!isEditing}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-4">
                  <LoadingButton
                    type="button"
                    variant="outline"
                    className="flex items-center gap-2"
                    isLoading={isExecuting && clickedButton === "cancel"}
                    disabled={isExecuting && clickedButton === "save"}
                    onClick={handleCancel}
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </LoadingButton>
                  <LoadingButton
                    type="submit"
                    variant="default"
                    className="flex items-center gap-2"
                    isLoading={isExecuting && clickedButton === "save"}
                    disabled={isExecuting && clickedButton === "cancel"}
                  >
                    <Save className="h-4 w-4" />
                    Save Changes
                  </LoadingButton>
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
