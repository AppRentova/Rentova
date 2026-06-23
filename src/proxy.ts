import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["tr", "en"];
const defaultLocale = "tr";

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isApiRoute = pathname.startsWith("/api/");
  const isStaticFile = pathname.match(/\.(png|jpg|jpeg|svg|ico|css|js)$/);

  if (isApiRoute || isStaticFile) {
    return NextResponse.next();
  }

  const pathLocale = locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathLocale) {
    const response = NextResponse.next();
    response.cookies.set("rentova_locale", pathLocale, {
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
    return response;
  }

  const cookieLocale = request.cookies.get("rentova_locale")?.value;
  const locale = cookieLocale && locales.includes(cookieLocale) ? cookieLocale : defaultLocale;

  return NextResponse.redirect(
    new URL(`/${locale}${pathname === "/" ? "" : pathname}`, request.url)
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
