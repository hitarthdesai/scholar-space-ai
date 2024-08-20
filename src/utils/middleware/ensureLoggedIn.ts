import { auth } from "../auth/config";
import { type NextRequest, NextResponse } from "next/server";
import { EnumPageErrorType } from "../constants/error";

/**
 * Redirects the user to a 404 page if they are not logged in
 *
 * @param req Incoming network request
 * @returns undefined if the user is logged in, a redirect response otherwise
 */
export async function ensureLoggedIn(req: NextRequest) {
  const isValidSession = Boolean(await auth());
  if (isValidSession) {
    return undefined;
  }

  const url = req.nextUrl.clone();
  url.pathname = `/err/${EnumPageErrorType.UserNotLoggedIn}`;
  url.searchParams.set("redirect", req.nextUrl.pathname);

  return NextResponse.redirect(url);
}
