// Thin fetch wrappers for the auth endpoints. Point AUTH_BASE_URL / the
// paths below at your real backend once it's ready — the forms already
// call these functions and handle loading/error states around them.

const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

export type LoginPayload = {
  username: string;
  password: string;
  remember: boolean;
};

export type RegisterPayload = {
  name: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

async function postJSON<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body: { message?: string } | null = await response.json().catch(() => null);
    throw new Error(body?.message ?? "درخواست ناموفق بود. دوباره تلاش کنید.");
  }

  return response.json();
}

// TODO: replace "/api/auth/login" and "/api/auth/register" with your real
// backend routes — either a Next.js Route Handler under src/app/api/, or a
// full external URL configured via the NEXT_PUBLIC_API_URL env var.
export function loginUser(payload: LoginPayload) {
  return postJSON<LoginPayload, AuthResponse>("/api/auth/login", payload);
}

export function registerUser(payload: RegisterPayload) {
  return postJSON<RegisterPayload, AuthResponse>("/api/auth/register", payload);
}

// TODO: replace the paths below with your real backend routes once ready.

export type RequestResetPayload = {
  phone: string;
};

export type VerifyResetCodePayload = {
  phone: string;
  code: string;
};

export type ResetPasswordPayload = {
  phone: string;
  code: string;
  password: string;
};

export type EmptyResponse = Record<string, never>;

export function requestPasswordReset(phone: string) {
  return postJSON<RequestResetPayload, EmptyResponse>("/api/auth/forgot-password", { phone });
}

export function verifyResetCode(payload: VerifyResetCodePayload) {
  return postJSON<VerifyResetCodePayload, EmptyResponse>("/api/auth/verify-reset-code", payload);
}

export function resetPassword(payload: ResetPasswordPayload) {
  return postJSON<ResetPasswordPayload, EmptyResponse>("/api/auth/reset-password", payload);
}