import { redirect, RedirectType } from "next/navigation";
import { auth } from "./auth/config";

export async function redirectLoggedInUserToHome() {
  const isValidSession = Boolean(await auth());
  if (!isValidSession) return;

  redirect("/", RedirectType.replace);
}
