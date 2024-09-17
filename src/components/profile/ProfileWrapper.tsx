"use server";

import React from "react";
import { getUserInformationFromDb } from "@/utils/profile/getUserInformationFromDb";
import { getObject } from "@/utils/storage/s3/getObject";
import Profile from "./Profile";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { getAllUserInfo } from "@/utils/profile/getAllUserInfo";

type ProfileProps = {
  userId: string;
};

export default async function ProfileWrapper({ userId }: ProfileProps) {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  assert(!!sessionUserId, "User must be logged in to view this page");

  const isUserAllowedToEdit = sessionUserId === userId;

  const userData = await getAllUserInfo({ userId });

  return (
    <Profile
      userId={userId}
      userData={userData}
      isUserAllowedToEdit={isUserAllowedToEdit}
    />
  );
}
