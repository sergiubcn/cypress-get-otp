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
    getOTP(
      secret: string,
      options?: OTPAuth.TOTP.GenerateOpts,
    ): Cypress.Chainable<string>;
  }
}
