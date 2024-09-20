import {
  type AddAssignmentResult,
  type DeleteAssignmentResult,
  type EditAssignmentResult,
  EnumAddAssignmentResult,
  EnumDeleteAssignmentResult,
  EnumEditAssignmentResult,
} from "@/schemas/assignmentSchema";
import {
  type CreateClassroomResult,
  type DeleteClassroomResult,
  type EditClassroomResult,
  EnumAddClassroomResult,
  EnumDeleteClassroomResult,
  EnumEditClassroomResult,
  EnumInviteParticipantResult,
  type InviteParticipantResult,
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
import {
  type AddQuestionResult,
  type DeleteQuestionResult,
  type EditQuestionResult,
  type ResetCodeResult,
  EnumAddQuestionResult,
  EnumDeleteQuestionResult,
  EnumEditQuestionResult,
  EnumResetCodeResult,
} from "@/schemas/questionSchema";

export const toastDescriptionAuth: Record<LoginResult, string> = {
  [EnumLoginResult.EmailSent]: "User registered successfully.",
  [EnumLoginResult.Error]: "Failed to register user.",
};

export const toastDescriptionAddClassroom: Record<
  CreateClassroomResult,
  string
> = {
  [EnumAddClassroomResult.ClassroomAdded]:
    "Your classroom was created successfully.",
  [EnumAddClassroomResult.NotAuthorized]:
    "You are not authorized to create a classroom.",
  [EnumAddClassroomResult.Error]:
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

export const toastDescriptionEditClassroom: Record<
  EditClassroomResult,
  string
> = {
  [EnumEditClassroomResult.ClassroomEdited]:
    "Your classroom was edited successfully.",
  [EnumEditClassroomResult.NotAuthorized]:
    "You are not authorized to edit this classroom.",
  [EnumEditClassroomResult.Error]:
    "Unable to edit this classroom. Please try again later.",
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

export const toastDescriptionEditAssignment: Record<
  EditAssignmentResult,
  string
> = {
  [EnumEditAssignmentResult.AssignmentEdited]:
    "Your assignment was edited successfully.",
  [EnumEditAssignmentResult.NotAuthorized]:
    "You are not authorized to edit this assignment.",
  [EnumEditAssignmentResult.Error]:
    "Unable to edit this assignment. Please try again later.",
};

export const toastDescriptionAddQuestion: Record<AddQuestionResult, string> = {
  [EnumAddQuestionResult.QuestionAdded]: "The question was added successfully.",
  [EnumAddQuestionResult.NotAuthorized]:
    "You are not authorized to add a question.",
  [EnumAddQuestionResult.NotUploaded]: "Unable to upload your question.",
  [EnumAddQuestionResult.Error]:
    "Unable to add a question. Please try again later.",
};

export const toastDescriptionEditQuestion: Record<EditQuestionResult, string> =
  {
    [EnumEditQuestionResult.QuestionEdited]:
      "The question was edited successfully.",
    [EnumEditQuestionResult.NotAuthorized]:
      "You are not authorized to edit this question.",
    [EnumEditQuestionResult.NotUploaded]:
      "Unable to upload your updated question.",
    [EnumEditQuestionResult.Error]:
      "Unable to edit this question. Please try again later.",
  };

export const toastDescriptionDeleteQuestion: Record<
  DeleteQuestionResult,
  string
> = {
  [EnumDeleteQuestionResult.QuestionDeleted]:
    "The question was deleted successfully.",
  [EnumDeleteQuestionResult.NotAuthorized]:
    "You are not authorized to delete this question.",
  [EnumDeleteQuestionResult.Error]:
    "Unable to delete this question. Please try again later.",
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

export const toastDescriptionResetCode: Record<ResetCodeResult, string> = {
  [EnumResetCodeResult.CodeReset]: "The code was reset successfully.",
  [EnumResetCodeResult.NotAuthorized]: "You are not authorized to reset code.",
  [EnumResetCodeResult.Error]: "Unable to reset code. Please try again later.",
};

export const toastDescriptionInviteParticipant: Record<
  InviteParticipantResult,
  string
> = {
  [EnumInviteParticipantResult.ParticpantInvited]:
    "The participant has been invited successfully.",
  [EnumInviteParticipantResult.ParticipantAlreadyAdded]:
    "A user with thie email is already added to this classroom.",
  [EnumInviteParticipantResult.InviteeNotRegistered]:
    "The invitee is not registered to the platform.",
  [EnumInviteParticipantResult.NotAuthorized]:
    "You are not authorized to invite participants to this classroom.",
  [EnumInviteParticipantResult.Error]:
    "Unable to invite the participant to this classroom. Please try again later.",
};
