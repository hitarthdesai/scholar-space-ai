"use server";

import React from "react";
import { getUserInformationFromDb } from "@/utils/profile/getUserInformationFromDb";
import { getObject } from "@/utils/storage/s3/getObject";
import Profile from "./Profile";
import { auth } from "@/utils/auth/config";
import assert from "assert";

type ProfileProps = {
  userId?: string;
};

export default async function ProfileWrapper({ userId }: ProfileProps) {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  assert(!!sessionUserId, "User must be logged in to view this page");
  const profileUserId = userId || sessionUserId;
  const userInfo = await getUserInformationFromDb({ userId: profileUserId });
  const userDescription =
    (await getObject({ fileName: `users/${profileUserId}/description` })) ??
    "No information has been added yet.";
  const userProfileUrl = userId
    ? "../default-profile-photo.jpg"
    : "./default-profile-photo.jpg";

  return (
    <Profile
      userId={profileUserId}
      name={userInfo.name}
      email={userInfo.email}
      userDescription={userDescription}
      userProfileUrl={userProfileUrl}
      isUserAllowedToEdit={sessionUserId === profileUserId}
    />
  );
}
