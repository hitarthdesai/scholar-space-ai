import { redirect, RedirectType } from "next/navigation";
import { auth } from "./auth/config";

export async function redirectLoggedInUserToHome() {
  const session = await auth();
  const isValidSession = Boolean(session);
  if (!isValidSession) return;

  redirect("/", RedirectType.replace);
}
