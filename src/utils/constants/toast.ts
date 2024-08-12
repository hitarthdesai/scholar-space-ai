import {
  type CreateClassroomResult,
  DeleteClassroomResult,
  EnumCreateClassroomResult,
  EnumDeleteClassroomResult,
} from "@/schemas/classroomSchema";
import { EnumLoginResult, type LoginResult } from "@/schemas/loginSchema";
import {
  type AddStudentResult,
  EnumAddStudentResult,
} from "@/schemas/studentSchema";

export const toastDescriptionAuth: Record<LoginResult, string> = {
  [EnumLoginResult.EmailSent]: "User registered successfully.",
  [EnumLoginResult.Error]: "Failed to register user.",
};

export const toastDescriptionCreateClassroom: Record<
  CreateClassroomResult,
  string
> = {
  [EnumCreateClassroomResult.ClassroomCreated]:
    "Your classroom was created successfully.",
  [EnumCreateClassroomResult.NotAuthorized]:
    "You are not authorized to create a classroom.",
  [EnumCreateClassroomResult.Error]:
    "Unable to create your classroom. Please try again later.",
};

export const toastDescriptionAddStudent: Record<AddStudentResult, string> = {
  [EnumAddStudentResult.StudentAdded]: "The student was added successfully.",
  [EnumAddStudentResult.NotAuthorized]:
    "You are not authorized to add a student.",
  [EnumAddStudentResult.Error]:
    "Unable to add a student. Please try again later.",
};

export const toastDescriptionDeleteClassroom: Record<
  DeleteClassroomResult,
  string
> = {
  [EnumDeleteClassroomResult.ClassroomDeleted]:
    "The classroom was deleted successfully.",
  [EnumDeleteClassroomResult.NotAuthorized]:
    "You are not authorized to delete a classroom.",
  [EnumDeleteClassroomResult.Error]:
    "Unable to delete a classroom. Please try again later.",
};
