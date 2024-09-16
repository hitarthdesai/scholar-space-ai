"use client";

import React, { useState } from "react";
import ProfileDisplay from "./ProfileDisplay";
import ProfileEditForm from "./ProfileEditForm";
import { updateUserInformation } from "@/actions/updateUserInformation";
import { is } from "drizzle-orm";

// Define the types for the profile data
export type ProfileData = {
  name: string;
  email: string;
  aboutMe: string;
  profileUrl: string;
};

type ProfileProps = {
  userId: string;
  name: string | null;
  email: string;
  userDescription: string;
  userProfileUrl: string;
  isUserAllowedToEdit: boolean;
};

export default function Profile({
  userId,
  name,
  email,
  userDescription,
  userProfileUrl,
  isUserAllowedToEdit,
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: name || "Username",
    email: email,
    aboutMe: userDescription,
    profileUrl: userProfileUrl,
  });

  function handleSave(updatedProfileData: ProfileData) {
    setIsEditing(false);
    updateUserInformation({
      userId,
      newName: updatedProfileData.name,
      userDescription: updatedProfileData.aboutMe,
    });
  }

  return isEditing ? (
    <ProfileEditForm
      profileData={profileData}
      setProfileData={setProfileData}
      handleSave={handleSave}
    />
  ) : (
    <ProfileDisplay
      profileData={profileData}
      handleEditClick={() => setIsEditing(true)}
      isUserAllowedToEdit={isUserAllowedToEdit}
    />
  );
}
