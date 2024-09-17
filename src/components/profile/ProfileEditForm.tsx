import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProfileData } from "./Profile";
import { User } from "lucide-react";
type ProfileEditFormProps = {
  profileData: ProfileData;
  setProfileData: (data: ProfileData) => void;
  handleSave: (updatedProfileData: ProfileData) => void;
};

export default function ProfileEditForm({
  profileData,
  setProfileData,
  handleSave,
}: ProfileEditFormProps) {
  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    handleSave(profileData);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-8 p-8 md:flex-row"
    >
      <div className="flex flex-col gap-3 md:w-1/3">
        <User className="mb-4 h-40 w-40 rounded-full bg-white object-cover text-slate-900" />

        <div className="mb-2">
          <label htmlFor="name" className="font-semibold text-white">
            Name:
          </label>
          <Input
            id="name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            placeholder="Name"
            className="bg-gray-900 text-white"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="email" className="block font-semibold text-white">
            Email:
          </label>
          <Input
            id="email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            className="bg-gray-900 text-white"
            disabled
          />
        </div>

        <Button type="submit" className="w-20 rounded bg-green-500 text-white">
          Save
        </Button>
      </div>

      <div className="md:w-2/3">
        <h2 className="mb-4 text-2xl font-bold">About Me</h2>
        <textarea
          id="aboutMe"
          name="aboutMe"
          value={profileData.aboutMe}
          onChange={handleChange}
          className="w-full rounded border bg-gray-900 p-2 text-white"
        />
      </div>
    </form>
  );
}
