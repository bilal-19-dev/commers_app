import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          "group": ["next/link"],
          "message": "please import from `@/navigation` instead of next/link.",
          "importNames": ["default"]
        },
        {
          "group": ["next/navigation"],
          "message": "please import from `@/navigation` instead of next/navigation.",
          "importNames": ["useRouter","redirect","permanentRedirect","usePathname"]
        }
      ],
    },
  },
];

export default eslintConfig;
