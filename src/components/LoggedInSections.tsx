import LoggedInProfileSection from "./LoggedInProfileSection";
import LoggedInClassroomSection from "./LoggedInClassroomSection";
import LoggedInBlogSection from "./LoggedInBlogSection";

export function LoggedInSections() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LoggedInClassroomSection />
        <LoggedInProfileSection />
        <LoggedInBlogSection />
      </div>
    </div>
  );
}
