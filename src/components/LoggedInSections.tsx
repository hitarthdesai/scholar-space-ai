import LoggedInProfileSection from "./LoggedInProfileSection";
import LoggedInClassroomSection from "./LoggedInClassroomCards";
import LoggedInBlogSection from "./LoggedInBlogSection";

export function LoggedInSections() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Logged-in User Content</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <LoggedInClassroomSection />
        <LoggedInProfileSection
          name={null}
          description={null}
          profilePhoto={null}
        />
        <LoggedInBlogSection />
      </div>
    </div>
  );
}
