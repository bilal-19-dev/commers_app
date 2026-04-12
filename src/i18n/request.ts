import { getRequestConfig } from "next-intl/server";
import { locales } from "../app/config";
import { notFound } from "next/navigation";

export default getRequestConfig(async ({ locale, requestLocale }) => {
  let resolved =
    typeof locale === "string" && locales.includes(locale) ? locale : null;
  if (!resolved) {
    const requested = await requestLocale;
    if (typeof requested === "string" && locales.includes(requested)) {
      resolved = requested;
    }
  }
  if (!resolved) {
    notFound();
  }
  return {
    locale: resolved,
    messages: (await import(`../../messages/${resolved}.json`)).default,
  };
});
