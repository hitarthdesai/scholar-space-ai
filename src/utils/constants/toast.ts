import {
  type AddAssignmentResult,
  type AddQuestionResult,
  type DeleteAssignmentResult,
  EnumAddAssignmentResult,
  EnumAddQuestionResult,
  EnumDeleteAssignmentResult,
} from "@/schemas/assignmentSchema";
import {
  type CreateClassroomResult,
  type DeleteClassroomResult,
  type RenameClassroomResult,
  EnumCreateClassroomResult,
  EnumDeleteClassroomResult,
  EnumRenameClassroomResult,
} from "@/schemas/classroomSchema";
import { EnumLoginResult, type LoginResult } from "@/schemas/loginSchema";
import {
  type AddStudentResult,
  EnumAddStudentResult,
} from "@/schemas/studentSchema";
import {
  type RenameConversationResult,
  type DeleteConversationResult,
  EnumRenameConversationResult,
  EnumDeleteConversationResult,
} from "@/schemas/chatSchema";

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

export const toastDescriptionRenameClassroom: Record<
  RenameClassroomResult,
  string
> = {
  [EnumRenameClassroomResult.ClassroomRenamed]:
    "Your classroom was renamed successfully.",
  [EnumRenameClassroomResult.NotAuthorized]:
    "You are not authorized to rename this classroom.",
  [EnumRenameClassroomResult.Error]:
    "Unable to rename this classroom. Please try again later.",
};

export const toastDescriptionDeleteAssignment: Record<
  DeleteAssignmentResult,
  string
> = {
  [EnumDeleteAssignmentResult.AssignmentDeleted]:
    "The assignment was deleted successfully.",
  [EnumDeleteAssignmentResult.NotAuthorized]:
    "You are not authorized to delete an assignment.",
  [EnumDeleteAssignmentResult.Error]:
    "Unable to delete this assignment. Please try again later.",
};

export const toastDescriptionAddAssignment: Record<
  AddAssignmentResult,
  string
> = {
  [EnumAddAssignmentResult.AssignmentAdded]:
    "The assignment was created successfully.",
  [EnumAddAssignmentResult.NotAuthorized]:
    "You are not authorized to create an assignment.",
  [EnumAddAssignmentResult.Error]:
    "Unable to create an assignment. Please try again later.",
};

export const toastDescriptionAddQuestion: Record<AddQuestionResult, string> = {
  [EnumAddQuestionResult.QuestionAdded]: "The question was added successfully.",
  [EnumAddQuestionResult.NotAuthorized]:
    "You are not authorized to add a question.",
  [EnumAddQuestionResult.NotUploaded]: "Unable to upload your question.",
  [EnumAddQuestionResult.Error]:
    "Unable to add a question. Please try again later.",
};

export const toastDescriptionRenameConversation: Record<
  RenameConversationResult,
  string
> = {
  [EnumRenameConversationResult.ConversationRenamed]:
    "Your conversation was renamed successfully.",
  [EnumRenameConversationResult.NotAuthorized]:
    "You are not authorized to rename this conversation.",
  [EnumRenameConversationResult.Error]:
    "Unable to rename this conversation. Please try again later.",
};

export const toastDescriptionDeleteConversation: Record<
  DeleteConversationResult,
  string
> = {
  [EnumDeleteConversationResult.ConversationDeleted]:
    "The conversation was deleted successfully.",
  [EnumDeleteConversationResult.NotAuthorized]:
    "You are not authorized to delete this conversation.",
  [EnumDeleteConversationResult.Error]:
    "Unable to delete conversation. Please try again later.",
};
