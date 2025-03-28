import Link from "next/link";
import { Construction, Lock } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LoggedInClassroomCards from "./LoggedInClassroomCards";

export default function DashboardGrid() {
  // Mock profile completion percentage - in a real app, this would come from your user data
  const profileCompletionPercentage = 65;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Logged-in User Content</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* First row - Classrooms (spans both columns) */}
        <Card className="col-span-1 bg-card transition-colors hover:bg-card/90 md:col-span-2">
          <CardHeader>
            <CardTitle>Your Classrooms</CardTitle>
            <CardDescription>
              Access your enrolled classrooms and learning materials
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <LoggedInClassroomCards />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild>
              <Link href="/classrooms">View All Classrooms</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="bg-card transition-colors hover:bg-card/90">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>Enhance your learning experience</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <div className="relative mb-4 h-32 w-32">
              {/* Circular progress indicator */}
              <svg className="h-full w-full" viewBox="0 0 100 100">
                {/* Background circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  className="stroke-[5] text-muted"
                />
                {/* Progress circle - stroke-dasharray is the circumference of the circle (2πr) */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  className="origin-center -rotate-90 stroke-[5] text-primary"
                  strokeDasharray="283"
                  strokeDashoffset={
                    283 - (283 * profileCompletionPercentage) / 100
                  }
                />
                {/* Percentage text */}
                <text
                  x="50"
                  y="50"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-lg font-bold"
                >
                  {profileCompletionPercentage}%
                </text>
              </svg>
            </div>
            <p className="mb-4 text-center">
              Complete your profile to get personalized learning recommendations
            </p>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Update Profile</Button>
          </CardFooter>
        </Card>

        {/* Second row, second column - Blogs (Under Construction) */}
        <Card className="relative overflow-hidden bg-card/50">
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="flex flex-col items-center p-6 text-center">
              <Construction size={48} className="mb-4 text-muted-foreground" />
              <h3 className="mb-2 text-xl font-medium">Under Construction</h3>
              <p className="text-muted-foreground">
                Our blog feature is coming soon!
              </p>
            </div>
          </div>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              View Blogs <Lock size={16} />
            </CardTitle>
            <CardDescription>
              Explore educational articles and insights
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-40 items-center justify-center">
              <p className="text-muted-foreground">
                Blog content will appear here
              </p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" disabled className="w-full">
              Coming Soon
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
