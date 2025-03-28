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

interface LoggedInProfileSecionProps {
  name: string | null;
  description: string | null;
  profilePhoto: string | null;
}

export default function LoggedInProfileSection({
  name,
  description,
  profilePhoto,
}: LoggedInProfileSecionProps) {
  const checklist = [
    { label: "Add your name", completed: !!name },
    { label: "Write a short description", completed: !!description },
    { label: "Upload a profile photo", completed: !!profilePhoto },
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
        <Button className="w-full">Update Profile</Button>
      </CardFooter>
    </Card>
  );
}
