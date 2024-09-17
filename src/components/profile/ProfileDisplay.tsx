import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProfileData } from "./Profile";
import { User } from "lucide-react";
type ProfileDisplayProps = {
  profileData: ProfileData;
  handleEditClick: () => void;
  isUserAllowedToEdit: boolean;
};

export default function ProfileDisplay({
  profileData,
  handleEditClick,
  isUserAllowedToEdit,
}: ProfileDisplayProps) {
  return (
    <div className="flex flex-col gap-8 p-8 md:flex-row">
      <div className="flex flex-col gap-3 md:w-1/3">
        <User className="mb-4 h-40 w-40 rounded-full bg-white object-cover text-slate-900" />
        <h2 className="items-center text-xl font-semibold">
          {profileData.name}
        </h2>
        <p className="flex items-center">
          <Mail className="mr-2" /> {profileData.email}
        </p>
        {isUserAllowedToEdit ? (
          <Button
            onClick={handleEditClick}
            className="w-25 rounded bg-blue-500 px-4 py-2 text-white"
          >
            Edit Profile
          </Button>
        ) : null}
      </div>

      <div className="md:w-2/3">
        <h2 className="mb-4 text-2xl font-bold">About Me</h2>
        <p>{profileData.aboutMe}</p>
      </div>
    </div>
  );
}
