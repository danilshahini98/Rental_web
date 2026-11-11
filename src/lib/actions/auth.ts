"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { getOwnerByEmail } from "@/lib/data/owners";
import { verifyPassword } from "@/lib/auth/password";
import { createSessionCookie, clearSessionCookie } from "@/lib/auth/session";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export type LoginState = {
  error?: string;
  fieldErrors?: Partial<Record<"email" | "password", string>>;
};

export async function loginAction(
  _prevState: LoginState,
  formData: FormData
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    const fieldErrors: LoginState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (key === "email" || key === "password") fieldErrors[key] = issue.message;
    }
    return { fieldErrors };
  }

  const owner = await getOwnerByEmail(parsed.data.email);
  if (!owner) {
    return { error: "No account found with that email and password." };
  }

  const valid = await verifyPassword(parsed.data.password, owner.passwordHash);
  if (!valid) {
    return { error: "No account found with that email and password." };
  }

  await createSessionCookie({ ownerId: owner.id, email: owner.email });

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/dashboard") ? next : "/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/");
}
