import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Construction, Lock } from "lucide-react";

export default function LoggedInBlogSection() {
  return (
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
          <p className="text-muted-foreground">Blog content will appear here</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" disabled className="w-full">
          Coming Soon
        </Button>
      </CardFooter>
    </Card>
  );
}
