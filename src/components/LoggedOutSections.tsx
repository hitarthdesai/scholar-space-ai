import { CTASection } from "@/components/LoggedOutCTASection";
import { FeaturesSection } from "@/components/LoggedOutFeaturesSection";
import { HeroSection } from "@/components/LoggedOutHeroSection";
import { UserSections } from "@/components/LoggedOutUsersSection";

export function LoggedOutSections() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <UserSections />
      <CTASection />
    </>
  );
}
