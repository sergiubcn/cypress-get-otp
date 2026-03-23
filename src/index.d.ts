import * as OTPAuth from "otpauth";

interface TOTPOptions {
  secret?: string | OTPAuth.Secret;
  issuer?: string;
  label?: string;
  algorithm?: string;
  digits?: number;
  period?: number;
  window?: number;
  timestamp?: number;
}

declare namespace Cypress {
  interface Chainable {
    /**
     * Generate an OTP token.
     * @example
     * cy.getOTP('G5HJRA652X3NOFSE').then((otp) => {
     *   // do something with the OTP token
     * });
     * @param secret - The secret key for the OTP.
     * @param options - The options for the OTP. For more information on the available options, see https://github.com/hectorm/otpauth?tab=readme-ov-file#nodejs--bun.
     * @returns The OTP token.
     */
    getOTP(secret: string, options?: TOTPOptions): Cypress.Chainable;

    /**
     * Generate a QR code for OTP setup.
     * @example
     * cy.getOTPQRCode('G5HJRA652X3NOFSE').then((qrCode) => {
     *   // qrCode contains base64 image data
     * });
     * @param secret - The secret key for the OTP.
     * @param options - The options for the OTP configuration.
     * @returns Base64 encoded QR code image data.
     */
    getOTPQRCode(secret: string, options?: TOTPOptions): Cypress.Chainable;

    /**
     * Generate backup codes for 2FA recovery.
     * @example
     * cy.getBackupCodes(10, { digits: 8 }).then((codes) => {
     *   // codes is an array of backup code strings
     * });
     * @param count - Number of backup codes to generate (default: 10).
     * @param options - Configuration options for backup codes.
     * @returns Array of backup code strings.
     */
    getBackupCodes(
      count?: number,
      options?: { digits?: number },
    ): Cypress.Chainable;

    /**
     * Validate backup code format.
     * @example
     * cy.validateBackupCode('12345678', { digits: 8 }).then((isValid) => {
     *   // isValid is true if the code format is correct
     * });
     * @param code - The backup code to validate.
     * @param options - Validation options.
     * @returns True if the code format is valid, false otherwise.
     */
    validateBackupCode(
      code: string,
      options?: { digits?: number },
    ): Cypress.Chainable;

    /**
     * Generate otpauth:// URI for OTP configuration.
     * @example
     * cy.getOTPURI('G5HJRA652X3NOFSE').then((uri) => {
     *   // uri contains the otpauth:// URI string
     * });
     * @param secret - The secret key for the OTP.
     * @param options - The options for the OTP configuration.
     * @returns The otpauth:// URI string.
     */
    getOTPURI(secret: string, options?: TOTPOptions): Cypress.Chainable;
  }
}
