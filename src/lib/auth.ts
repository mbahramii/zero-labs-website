// Thin fetch wrappers for the real backend auth endpoints.
// Requests go to the same origin (/api/v1/...) and Next.js rewrites
// proxy them to the backend (see next.config.ts).

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";
const API_BASE = "/api/v1";

//  Payload types (match backend schemas) 

export type LoginPayload = {
  phone: string;
  password: string;
};

export type RegisterVerifyPayload = {
  phone: string;
  code: string;
  password: string;
  display_name?: string;
};

export type ResetConfirmPayload = {
  phone: string;
  code: string;
  new_password: string;
};

// ---------- Response types (match backend schemas) ----------

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type OtpResponse = {
  message: string;
  dev_otp_code?: string | null;
};

export type MessageResponse = {
  message: string;
};

export type UserOut = {
  id: number;
  phone_number: string;
  display_name: string | null;
  is_verified: boolean;
  is_owner: boolean;
  actions: string[];
  scope: Record<string, unknown>[];
};

// ---------- Helpers ----------

async function request<TResponse>(path: string, options: RequestInit = {}): Promise<TResponse> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const detail = (body as { detail?: unknown; message?: string } | null)?.detail;
    const message =
      (body as { message?: string } | null)?.message ??
      (typeof detail === "string" ? detail : "Request failed. Please try again.");
    throw new Error(message);
  }

  return response.json();
}

function postJSON<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse> {
  return request<TResponse>(path, { method: "POST", body: JSON.stringify(payload) });
}

// ---------- Token storage ----------

export function saveTokens(tokens: TokenResponse): void {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("access_token");
}

export function clearTokens(): void {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

// ---------- Auth flows ----------

// Registration step 1: send OTP code to the phone number.
export async function requestRegisterOtp(phone: string): Promise<OtpResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "OTP sent.", dev_otp_code: "123456" };
  }
  return postJSON<{ phone: string }, OtpResponse>("/auth/register/request", { phone });
}

// Registration step 2: verify OTP and create the account.
export async function verifyRegister(payload: RegisterVerifyPayload): Promise<TokenResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { access_token: "mock-jwt", refresh_token: "mock-refresh", token_type: "bearer" };
  }
  return postJSON<RegisterVerifyPayload, TokenResponse>("/auth/register/verify", payload);
}

// Login with phone number and password.
export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    if (payload.password !== "12345678") throw new Error("Invalid password (mock).");
    return { access_token: "mock-jwt", refresh_token: "mock-refresh", token_type: "bearer" };
  }
  return postJSON<LoginPayload, TokenResponse>("/auth/login", payload);
}

// Password reset step 1: send OTP code.
export async function requestPasswordReset(phone: string): Promise<OtpResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "If the phone is registered, a code was sent.", dev_otp_code: "123456" };
  }
  return postJSON<{ phone: string }, OtpResponse>("/auth/password-reset/request", { phone });
}

// Password reset step 2: set a new password with the OTP code.
export async function confirmPasswordReset(payload: ResetConfirmPayload): Promise<MessageResponse> {
  if (USE_MOCK) {
    await new Promise((r) => setTimeout(r, 800));
    return { message: "Password changed; please log in again." };
  }
  return postJSON<ResetConfirmPayload, MessageResponse>("/auth/password-reset/confirm", payload);
}

// Logout (revokes the refresh token).
export async function logoutUser(): Promise<MessageResponse> {
  const refreshToken = typeof window !== "undefined" ? localStorage.getItem("refresh_token") : null;
  const result = await postJSON<{ refresh_token: string }, MessageResponse>("/auth/logout", {
    refresh_token: refreshToken ?? "",
  });
  clearTokens();
  return result;
}

// Get the current authenticated user profile.
export async function getCurrentUser(): Promise<UserOut> {
  const token = getAccessToken();
  return request<UserOut>("/auth/me", {
    headers: { Authorization: `Bearer ${token ?? ""}` },
  });
}