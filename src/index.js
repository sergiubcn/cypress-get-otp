import * as OTPAuth from "otpauth";

Cypress.Commands.add("getOTP", (secret, options = {}) => {
  const totp = new OTPAuth.TOTP({ secret, ...options });
  return totp.generate();
});
