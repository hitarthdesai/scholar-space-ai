import ProfileWrapper from "@/components/profile/Profile";

type PageProps = {
  params: {
    id: string;
  };
};

export default async function ProfilePage({
  params: { id: userId },
}: PageProps) {
  return (
    <main className="flex h-full flex-col justify-between p-4">
      <ProfileWrapper userId={userId} />
    </main>
  );
}
