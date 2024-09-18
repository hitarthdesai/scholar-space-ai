"use server";

import React from "react";
import { auth } from "@/utils/auth/config";
import assert from "assert";
import { getAllUserInfo } from "@/utils/profile/getAllUserInfo";
import ProfileForm from "./ProfileForm";

type ProfileProps = {
  userId: string;
};

export default async function Profile({ userId }: ProfileProps) {
  const session = await auth();
  const sessionUserId = session?.user?.id;
  assert(!!sessionUserId, "User must be logged in to view this page");

  const isUserAllowedToEdit = sessionUserId === userId;

  const userData = await getAllUserInfo({ userId });

  return (
    <ProfileForm
      userId={userId}
      initialProfileData={userData}
      isUserAllowedToEdit={isUserAllowedToEdit}
    />
  );
}
