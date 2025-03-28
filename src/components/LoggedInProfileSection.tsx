import { CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { getUserProfileData } from "@/utils/profile/getUserProfileData";
import Link from "next/link";

export default async function LoggedInProfileSection() {
  const session = await auth();
  const userId = session?.user?.id;
  assert(!!userId, "User must be logged in to view this page");

  const userData = userId ? await getUserProfileData({ userId }) : null;

  const isDescriptionIncomplete = (value: string | undefined) =>
    !value || value === "No information has been added yet.";
  const isValidUsername = (value: string | undefined) =>
    !value || value === "Username";

  const checklist = [
    { label: "Add your name", completed: !isValidUsername(userData?.name) },
    {
      label: "Write a short description",
      completed: !isDescriptionIncomplete(userData?.aboutMe),
    },
    { label: "Upload a profile photo", completed: !!userData?.image },
  ];

  return (
    <Card className="bg-card transition-colors hover:bg-card/90">
      <CardHeader>
        <CardTitle>Complete Your Profile</CardTitle>
        <CardDescription>Enhance your learning experience</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="bg-dark flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-md">
          <ul className="space-y-2">
            {checklist.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                {item.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span>{item.label}</span>
              </li>
            ))}
          </ul>
          <p className="text-center text-muted-foreground">
            Fill out your profile to get personalized learning recommendations.
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" asChild>
          <Link href="/profile">Update Profile</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
