export const EnumPageErrorType = {
  UserNotLoggedIn: "user-not-logged-in",
} as const;

export type PageError =
  (typeof EnumPageErrorType)[keyof typeof EnumPageErrorType];
