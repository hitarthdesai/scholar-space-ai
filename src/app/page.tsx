import LoggedInSections from "@/components/LoggedInSections";
import CTASection from "@/components/LoggedOutCTASection";
import { FeaturesSection } from "@/components/LoggedOutFeaturesSection";
import { HeroSection } from "@/components/LoggedOutHeroSection";
import { UserSections } from "@/components/LoggedOutUsersSection";
import { auth } from "@/utils/auth/config";

export default async function Home() {
  const isLoggedIn = Boolean(await auth());

  return (
    <main className="grid h-full w-full place-items-center">
      {isLoggedIn ? (
        <LoggedInSections />
      ) : (
        <>
          <HeroSection />
          <FeaturesSection />
          <UserSections />
          <CTASection />
        </>
      )}
    </main>
  );
}
