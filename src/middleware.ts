import { type NextRequest } from "next/server";
import { actionsMap } from "./utils/middleware/actions";

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function middleware(req: NextRequest) {
  for (const [regex, actions] of actionsMap.entries()) {
    if (!regex.test(req.nextUrl.pathname)) continue;

    for (const action of actions) {
      const response = await action(req);
      if (!response) continue;

      return response;
    }
  }
}
