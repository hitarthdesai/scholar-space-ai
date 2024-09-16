import { auth } from "@/utils/auth/config";
import assert from "assert";
import Profile from "@/components/profile/Profile";
import { getUserInformationFromDb } from "@/utils/profile/getUserInformationFromDb";
import { getObject } from "@/utils/storage/s3/getObject";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ProfilePage({
  params: { id: userId },
}: PageProps) {
  //   const session = await auth();
  //   const userId = session?.user?.id;
  //   assert(!!userId, "User must be logged in to view this page");

  const userInfo = await getUserInformationFromDb({ userId });
  const userDescription =
    (await getObject({ fileName: `users/${userId}/description` })) ??
    "No information has been added yet.";
  const userProfileUrl = "./default-profile-photo.jpg";
  return (
    <main className="flex h-full flex-col justify-between p-4">
      <Profile
        userId={userId}
        name={userInfo.name}
        email={userInfo.email}
        userDescription={userDescription}
        userProfileUrl={userProfileUrl}
      />
    </main>
  );
}
