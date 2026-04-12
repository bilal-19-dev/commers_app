import { createNavigation } from "next-intl/navigation";
import { localePrefix, locales, pathnames } from "./config";

export const {
  Link,
  redirect,
  useRouter,
  usePathname
} = createNavigation({
  locales,
  localePrefix,
  pathnames
});