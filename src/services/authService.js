// src/services/authService.js
import { request } from "./http";

/**
 * =========================
 * AUTH CƠ BẢN
 * =========================
 */

/** Đăng nhập
 * @param {{email:string, password:string}} credentials
 */
export async function login(credentials) {
  const { raw } = await request("/auth/login", {
    method: "POST",
    data: credentials, // ✅ Đổi body -> data
    auth: false,
  });
  return raw;
}

/** Bước 1 đăng ký: gửi thông tin để hệ thống gửi OTP về email
 *  Backend của bạn cần đủ trường như: name, email, password, phoneNumber, dateOfBirth, ...
 *  @param {object} payload
 */
export async function register(payload) {
  const { raw } = await request("/auth/register", {
    method: "POST",
    data: payload, // ✅ Đổi body -> data
    auth: false,
  });
  return raw;
}

/** Lấy hồ sơ người dùng đang đăng nhập */
export async function getProfile() {
  const { raw } = await request("/auth/me", { method: "GET", auth: true });
  return raw;
}

/**
 * =========================
 * QUÊN MẬT KHẨU (RESET FLOW)
 * =========================
 */

/** Gửi OTP reset về email
 * @param {{email:string}} payload
 */
export async function forgotPassword(payload) {
  const { raw } = await request("/auth/forgot-password", {
    method: "POST",
    data: payload, // ✅
    auth: false,
  });
  return raw;
}

/** Xác minh OTP reset (API của bạn dùng trường `code`)
 * @param {{email:string, code:string}} payload
 */
export async function verifyResetCode(payload) {
  const { raw } = await request("/auth/verify-reset-code", {
    method: "POST",
    data: payload, // ✅
    auth: false,
  });
  return raw;
}

/** Alias để màn VerifyCode có thể import verifyResetOtp nếu trước đó đã dùng tên này */
export async function verifyResetOtp(payload) {
  return verifyResetCode(payload);
}

/** Đặt lại mật khẩu
 * @param {{email:string, newPassword:string, resetToken?:string}} payload
 */
export async function resetPassword(payload) {
  const { raw } = await request("/auth/reset-password", {
    method: "POST",
    data: payload, // ✅
    auth: false,
  });
  return raw;
}

/**
 * =========================
 * ĐĂNG KÝ (REGISTER OTP FLOW)
 * =========================
 */

/** Bước 2 đăng ký: xác minh OTP đăng ký (API yêu cầu `otp`, KHÔNG phải `code`)
 * @param {{email:string, otp:string, verificationId?:string}} payload
 */
export async function verifyRegisterOtp(payload) {
  // Linh hoạt: nếu ai đó lỡ truyền {code}, đổi sang {otp} để tránh vỡ luồng
  const body = payload?.code
    ? { ...payload, otp: payload.code, code: undefined }
    : payload;

  const { raw } = await request("/auth/verify-register-otp", {
    method: "POST",
    data: body, // ✅
    auth: false,
  });
  return raw;
}

/** Gửi lại OTP đăng ký.
 *  Lưu ý: nếu BE KHÔNG có endpoint resend riêng, bạn đang “gọi lại /auth/register”.
 *  Khi đó cần truyền lại đầy đủ payload như lúc đăng ký (name, email, password, phoneNumber, dateOfBirth, ...).
 *  @param {object} payload
 */
export async function resendRegisterOtp(payload) {
  const { raw } = await request("/auth/register", {
    method: "POST",
    data: payload, // ✅
    auth: false,
  });
  return raw;
}

/** Gửi lại OTP cho reset (dùng lại forgot-password)
 * @param {{email:string}} payload
 */
export async function resendResetOtp(payload) {
  return forgotPassword(payload);
}

/**
 * =========================
 * HỒ SƠ NGƯỜI DÙNG
 * =========================
 */

/** Cập nhật hồ sơ */
export async function updateProfile(payload) {
  const { raw } = await request("/users/me", {
    method: "PUT",
    data: payload, // ✅
  });
  return raw;
}
