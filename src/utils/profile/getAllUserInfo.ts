import { getUserInformationFromDb } from "./getUserInformationFromDb";
import { getObject } from "../storage/s3/getObject";
import { ProfileData } from "@/components/profile/ProfileForm";

type GetAllUserInfoProps = {
  userId: string;
};

export async function getAllUserInfo({ userId }: GetAllUserInfoProps) {
  console.log("userId", userId);
  const userInfoFromDb = await getUserInformationFromDb({ userId: userId });
  const userDescription =
    (await getObject({ fileName: `users/${userId}/description` })) ??
    "No information has been added yet.";

  const profileData: ProfileData = {
    name: userInfoFromDb.name || "Username",
    email: userInfoFromDb.email,
    aboutMe: userDescription,
  };
  return profileData;
}
