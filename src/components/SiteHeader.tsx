import { LoggedInHeader } from "./LoggedInHeader";
import { LoggedOutHeader } from "./LoggedOutHeader";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <LoggedOutHeader />
      <LoggedInHeader />
    </header>
  );
}
