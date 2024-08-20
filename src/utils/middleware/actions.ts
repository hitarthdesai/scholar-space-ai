import { type NextRequest, type NextResponse } from "next/server";
import { ensureLoggedOut } from "./ensureLoggedOut";
import { pathnameToRegex } from "./pathnameToRegex";
import { ensureLoggedIn } from "./ensureLoggedIn";

export type MiddlwareAction = (
  req: NextRequest
) => undefined | Promise<undefined | NextResponse> | NextResponse;

type MiddlewareActionMap = Map<RegExp, MiddlwareAction[]>;

export const actionsMap: MiddlewareActionMap = new Map();
actionsMap.set(pathnameToRegex("/login"), [ensureLoggedOut]);
actionsMap.set(pathnameToRegex("/assignments"), [ensureLoggedIn]);
actionsMap.set(pathnameToRegex("/assignments/:id"), [ensureLoggedIn]);
actionsMap.set(pathnameToRegex("/classrooms"), [ensureLoggedIn]);
actionsMap.set(pathnameToRegex("/classrooms/:id"), [ensureLoggedIn]);
actionsMap.set(pathnameToRegex("/chat"), [ensureLoggedIn]);
actionsMap.set(pathnameToRegex("/chat/:id"), [ensureLoggedIn]);
