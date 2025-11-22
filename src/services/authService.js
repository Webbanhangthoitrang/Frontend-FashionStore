// src/services/authService.js
import { request } from "./http";

/* ========== AUTH CƠ BẢN ========== */
export async function login(credentials) {
  const { raw } = await request("/auth/login", {
    method: "POST",
    data: credentials,
    auth: false,
  });
  return raw;
}

export async function register(payload) {
  const { raw } = await request("/auth/register", {
    method: "POST",
    data: payload,
    auth: false,
  });
  return raw;
}

export async function getProfile() {
  const { raw } = await request("/auth/me", { method: "GET", auth: true });
  return raw;
}

/* ========== QUÊN MẬT KHẨU ========== */
export async function forgotPassword(payload) {
  const { raw } = await request("/auth/forgot-password", {
    method: "POST",
    data: payload,
    auth: false,
  });
  return raw;
}

export async function verifyResetCode(payload) {
  const { raw } = await request("/auth/verify-reset-code", {
    method: "POST",
    data: payload,
    auth: false,
  });
  return raw;
}

export async function verifyResetOtp(payload) {
  return verifyResetCode(payload);
}

/* ========== ĐỔI MẬT KHẨU ========== */
// BE của bạn nhận { oldPassword, newPassword } (nếu khác, map lại ở đây)
export async function changePassword(payload) {
  const { raw } = await request("/auth/change-password", {
    method: "POST",
    data: payload,
    auth: true,
  });
  return raw;
}

/* ========== REGISTER OTP FLOW ========== */
export async function verifyRegisterOtp(payload) {
  const body = payload?.code
    ? { ...payload, otp: payload.code, code: undefined }
    : payload;

  const { raw } = await request("/auth/verify-register-otp", {
    method: "POST",
    data: body,
    auth: false,
  });
  return raw;
}

export async function resendRegisterOtp(payload) {
  const { raw } = await request("/auth/register", {
    method: "POST",
    data: payload,
    auth: false,
  });
  return raw;
}

export async function resendResetOtp(payload) {
  return forgotPassword(payload);
}

/* ========== HỒ SƠ NGƯỜI DÙNG ========== */
export async function updateProfile(payload) {
  const { raw } = await request("/users/me", {
    method: "PUT",
    data: payload,
    auth: true, // cần token
  });
  return raw;
}