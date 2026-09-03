// Thin fetch wrappers for the auth endpoints. 
// Point AUTH_BASE_URL / the paths below at your real backend once it's ready.
const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK_AUTH === "true";
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// Login payload supports either email or phone number
export type LoginPayload = {
  emailOrPhone: string;
  password: string;
  remember: boolean;
};

// Registration payload now only requires email, phone, and password (no name)
export type RegisterPayload = {
  email: string;
  phone: string;
  password: string;
};

export type AuthResponse = {
  token: string;
  user: { email: string; phone?: string };
};

export type RequestResetPayload = {
  email: string;
};

export type VerifyResetCodePayload = {
  email: string;
  code: string;
};

export type ResetPasswordPayload = {
  email: string;
  code: string;
  password: string;
};

export type EmptyResponse = Record<string, never>;

// Helper function to handle POST requests with JSON payload
async function postJSON<TPayload, TResponse>(path: string, payload: TPayload): Promise<TResponse> {
  const response = await fetch(`${AUTH_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body: { message?: string } | null = await response.json().catch(() => null);
    throw new Error(body?.message ?? "Request failed. Please try again.");
  }

  return response.json();
}

// ==========================================
// Authentication functions with Mock support
// ==========================================

export async function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    
    if (payload.password !== "12345678") {
      throw new Error("Invalid password (in mock mode, password must be 12345678).");
    }
    
    return {
      token: "mock-jwt-token-123",
      user: { email: payload.emailOrPhone },
    };
  }
  return postJSON<LoginPayload, AuthResponse>("/api/auth/login", payload);
}

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    return {
      token: "mock-jwt-token-register-456",
      user: { email: payload.email, phone: payload.phone },
    };
  }
  return postJSON<RegisterPayload, AuthResponse>("/api/auth/register", payload);
}

// Password reset functions operate based on email
export async function requestPasswordReset(email: string): Promise<EmptyResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    return {};
  }
  return postJSON<RequestResetPayload, EmptyResponse>("/api/auth/forgot-password", { email });
}

export async function verifyResetCode(payload: VerifyResetCodePayload): Promise<EmptyResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    
    if (payload.code !== "1234") {
      throw new Error("Invalid verification code (in mock mode, code must be 1234).");
    }
    return {};
  }
  return postJSON<VerifyResetCodePayload, EmptyResponse>("/api/auth/verify-reset-code", payload);
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<EmptyResponse> {
  if (USE_MOCK) {
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate network delay
    return {};
  }
  return postJSON<ResetPasswordPayload, EmptyResponse>("/api/auth/reset-password", payload);
}