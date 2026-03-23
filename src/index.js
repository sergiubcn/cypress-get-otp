import * as OTPAuth from "otpauth";
import QRCode from "qrcode";

Cypress.Commands.add("getOTP", (secret, options = {}) => {
  const totp = new OTPAuth.TOTP({ secret, ...options });
  return totp.generate();
});

// Generate QR code for OTP setup
Cypress.Commands.add("getOTPQRCode", (secret, options = {}) => {
  const totp = new OTPAuth.TOTP({ secret, ...options });
  const otpauthUri = totp.toString();
  return QRCode.toDataURL(otpauthUri);
});

// Generate backup codes (common 2FA recovery codes)
Cypress.Commands.add("getBackupCodes", (count = 10, options = {}) => {
  const { digits = 8 } = options;
  const codes = [];

  for (let i = 0; i < count; i++) {
    const code = Math.random().toString().substr(2, digits);
    codes.push(code);
  }

  return cy.wrap(codes);
});

// Validate backup code format
Cypress.Commands.add("validateBackupCode", (code, options = {}) => {
  const { digits = 8 } = options;
  const isValid = /^\d+$/.test(code) && code.length === digits;
  return cy.wrap(isValid);
});

// Generate otpauth:// URI
Cypress.Commands.add("getOTPURI", (secret, options = {}) => {
  const totp = new OTPAuth.TOTP({ secret, ...options });
  return cy.wrap(totp.toString());
});
