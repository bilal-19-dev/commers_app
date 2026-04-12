import createMiddleware from "next-intl/middleware";
import { locales } from "./app/config";

export default createMiddleware({
  locales,
  defaultLocale: "en",
});

export const config = {
  matcher: ["/", "/(en|ar|fr|de|es)/:path*"],
};
