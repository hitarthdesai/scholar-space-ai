import { LoggedInSections } from "@/components/LoggedInSections";
import CTASection from "@/components/LoggedOutCTASection";
import { FeaturesSection } from "@/components/LoggedOutFeaturesSection";
import { HeroSection } from "@/components/LoggedOutHeroSection";
import { UserSections } from "@/components/LoggedOutUsersSection";
import { auth } from "@/utils/auth/config";
import { getUserProfileData } from "@/utils/profile/getUserProfileData";

export default async function Home() {
  const isLoggedIn = Boolean(await auth());
  const session = await auth();
  const userId = session?.user?.id;

  const userData = userId ? await getUserProfileData({ userId }) : null;
  return (
    <main className="grid h-full w-full place-items-center">
      {isLoggedIn && userData ? (
        <LoggedInSections
          name={userData.name}
          description={userData.aboutMe}
          profilePhoto={userData.image}
        />
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
