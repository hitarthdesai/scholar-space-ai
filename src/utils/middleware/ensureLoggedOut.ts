import { auth } from "../auth/config";
import { type NextRequest, NextResponse } from "next/server";

/**
 * Redirects the user to the home page if they are logged in
 *
 * @param req Incoming network request
 * @returns undefined if the user is not logged in, a redirect response otherwise
 */
export async function ensureLoggedOut(req: NextRequest) {
  const isValidSession = Boolean(await auth());
  if (!isValidSession) {
    return undefined;
  }

  const url = req.nextUrl.clone();
  url.pathname = "/";

  return NextResponse.redirect(url);
}
