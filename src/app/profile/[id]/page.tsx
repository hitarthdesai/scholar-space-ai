import Profile from "@/components/profile/Profile";

type PageProps = {
  params: {
    id: string;
  };
};

export default function ProfilePage({ params: { id: userId } }: PageProps) {
  return (
    <main className="flex h-full flex-col justify-between p-4">
      <Profile userId={userId} />
    </main>
  );
}
