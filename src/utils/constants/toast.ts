import {
  type AddAssignmentResult,
  type DeleteAssignmentResult,
  type EditAssignmentResult,
  EnumAddAssignmentResult,
  EnumDeleteAssignmentResult,
  EnumEditAssignmentResult,
} from "@/schemas/assignmentSchema";
import {
  type AcceptInviteResult,
  type RejectInviteResult,
  type CreateClassroomResult,
  type DeleteClassroomResult,
  type EditClassroomResult,
  type EditParticipantResult,
  EnumAcceptInviteResult,
  EnumRejectInviteResult,
  EnumAddClassroomResult,
  EnumDeleteClassroomResult,
  EnumEditClassroomResult,
  EnumInviteParticipantResult,
  EnumEditParticipantResult,
  type InviteParticipantResult,
  type RemoveParticipantResult,
  EnumRemoveParticipantResult,
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
import {
  type UpdateUserInformationResult,
  EnumUpdateUserInformationResult,
} from "@/schemas/userSchema";
import {
  AddFileResult,
  DeleteFileResult,
  EditFileResult,
  EnumAddFileResult,
  EnumDeleteFileResult,
  EnumEditFileResult,
} from "@/schemas/fileSchema";

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

export const toastDescriptionUpdateUserInformation: Record<
  UpdateUserInformationResult,
  string
> = {
  [EnumUpdateUserInformationResult.UserInformationUpdated]:
    "Profile edited successfully",
  [EnumUpdateUserInformationResult.NotAuthorized]:
    "You are not authorized to edit this profile.",
  [EnumUpdateUserInformationResult.Error]:
    "Unable to edit this profile. Please try again later.",
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

export const toastDescriptionEditParticipant: Record<
  EditParticipantResult,
  string
> = {
  [EnumEditParticipantResult.ParticpantEdited]:
    "The participant has been edited successfully.",
  [EnumEditParticipantResult.LastAdmin]:
    "You cannot change the role of the last admin of a classroom.",
  [EnumEditParticipantResult.NotAParticipant]:
    "This user is not a participant of this classroom.",
  [EnumEditParticipantResult.NotAuthorized]:
    "You are not authorized to edit participants of this classroom.",
  [EnumEditParticipantResult.Error]:
    "Unable to edit this participant. Please try again later.",
};

export const toastDescriptionRemoveParticipant: Record<
  RemoveParticipantResult,
  string
> = {
  [EnumRemoveParticipantResult.ParticpantRemoved]:
    "The participant has been removed successfully.",
  [EnumRemoveParticipantResult.LastAdmin]:
    "You cannot remove the last admin of a classroom.",
  [EnumRemoveParticipantResult.NotAParticipant]:
    "This user is not a participant of this classroom.",
  [EnumRemoveParticipantResult.NotAuthorized]:
    "You are not authorized to remove participants of this classroom.",
  [EnumRemoveParticipantResult.Error]:
    "Unable to remove this participant. Please try again later.",
};

export const toastDescriptionAcceptInvite: Record<AcceptInviteResult, string> =
  {
    [EnumAcceptInviteResult.InviteAccepted]:
      "You have successfully accepted the invite.",
    [EnumAcceptInviteResult.NotAuthorized]:
      "You are not authorized to accept this invite.",
    [EnumAcceptInviteResult.Error]:
      "Unable to accept this invite. Please try again later.",
    [EnumAcceptInviteResult.NotConfirmed]:
      "You must confirm the invite to accept it.",
  };

export const toastDescriptionRejectInvite: Record<RejectInviteResult, string> =
  {
    [EnumRejectInviteResult.InviteRejected]:
      "You have successfully rejected the invite.",
    [EnumRejectInviteResult.NotAuthorized]:
      "You are not authorized to reject this invite.",
    [EnumRejectInviteResult.Error]:
      "Unable to reject this invite. Please try again later.",
    [EnumRejectInviteResult.NotConfirmed]:
      "You must confirm the rejection of the invite.",
  };

export const toastDescriptionAddFile: Record<AddFileResult, string> = {
  [EnumAddFileResult.Error]: "Error adding file",
  [EnumAddFileResult.NotAuthorized]:
    "You are not authorized to add files to this classroom",
  [EnumAddFileResult.NotUploaded]: "Your file could not be uploaded",
  [EnumAddFileResult.FileAdded]: "Your file has been added successfully",
};

export const toastDescriptionEditFile: Record<EditFileResult, string> = {
  [EnumEditFileResult.Error]: "Error editing file",
  [EnumEditFileResult.NotAuthorized]:
    "You are not authorized to edit files in this classroom",
  [EnumEditFileResult.FileEdited]: "Your file has been edited successfully",
};

export const toastDescriptionDeleteFile: Record<DeleteFileResult, string> = {
  [EnumDeleteFileResult.Error]: "Error deleting file",
  [EnumDeleteFileResult.NotAuthorized]:
    "You are not authorized to delete files in this classroom",
  [EnumDeleteFileResult.FileDeleted]: "Your file has been deleted successfully",
};
