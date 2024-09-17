"use client";

import React, { useState } from "react";
import ProfileDisplay from "./ProfileDisplay";
import ProfileEditForm from "./ProfileEditForm";
import { updateUserInformation } from "@/actions/updateUserInformation";

export type ProfileData = {
  name: string;
  email: string;
  aboutMe: string;
};

type ProfileProps = {
  userId: string;
  userData: ProfileData;
  isUserAllowedToEdit: boolean;
};

export default function Profile({
  userId,
  userData,
  isUserAllowedToEdit,
}: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    name: userData.name,
    email: userData.email,
    aboutMe: userData.aboutMe,
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
