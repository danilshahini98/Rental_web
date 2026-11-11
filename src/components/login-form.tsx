"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction, type LoginState } from "@/lib/actions/auth";

const initialState: LoginState = {};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-5 flex h-12 w-full items-center justify-center rounded-[10px] bg-[var(--brand)] text-[15px] font-bold text-white disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="surface-card mt-6 p-6">
      {next && <input type="hidden" name="next" value={next} />}
      {state.error && (
        <div
          className="mb-4 rounded-lg px-3.5 py-2.5 text-sm font-medium"
          style={{ background: "var(--danger-bg)", color: "var(--danger)" }}
        >
          {state.error}
        </div>
      )}
      <label className="mb-1.5 block text-[13px] font-bold">Email</label>
      <input type="email" name="email" required className="input-field" placeholder="owner@example.com" />
      {state.fieldErrors?.email && (
        <p className="mt-1 text-[12px] font-medium text-[var(--danger)]">{state.fieldErrors.email}</p>
      )}

      <label className="mb-1.5 mt-4 block text-[13px] font-bold">Password</label>
      <input type="password" name="password" required className="input-field" placeholder="••••••••" />
      {state.fieldErrors?.password && (
        <p className="mt-1 text-[12px] font-medium text-[var(--danger)]">{state.fieldErrors.password}</p>
      )}

      <SubmitButton />
    </form>
  );
}
