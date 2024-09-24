import { getUserInformationFromDb } from "./getUserInformationFromDb";
import { getObject } from "../storage/s3/getObject";
import { type ProfileData } from "@/components/profile/ProfileForm";

type GetUserProfileDataProps = {
  userId: string;
};

export async function getUserProfileData({ userId }: GetUserProfileDataProps) {
  const [userInfoFromDb, userDescription] = await Promise.all([
    getUserInformationFromDb({ userId: userId }),
    getObject({ fileName: `users/${userId}/description` }).then(
      (description) => description ?? "No information has been added yet."
    ),
  ]);

  const profileData: ProfileData = {
    name: userInfoFromDb.name ?? "Username",
    email: userInfoFromDb.email,
    aboutMe: userDescription,
  };
  return profileData;
}
