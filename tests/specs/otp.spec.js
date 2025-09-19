describe("OTP", () => {
  it("should generate a token with default options", () => {
    cy.getOTP("G5HJRA652X3NOFSE").then((otp) => {
      expect(otp).to.be.a("string");
      expect(otp).to.have.length(6);
    });
  });

  it("should generate a token with custom options", () => {
    cy.getOTP("G5HJRA652X3NOFSE", { digits: 8 }).then((otp) => {
      expect(otp).to.be.a("string");
      expect(otp).to.have.length(8);
    });
  });

  it("should generate a different token after the expiration time", () => {
    let otp = null;
    cy.getOTP("G5HJRA652X3NOFSE", { period: 3 }).then((otp1) => {
      otp = otp1;
    });

    // We need to wait for the OTP to expire before generating a new one.
    // eslint-disable-next-line cypress/no-unnecessary-waiting
    cy.wait(4000);

    cy.getOTP("G5HJRA652X3NOFSE", { period: 3 }).then((otp2) => {
      expect(otp2).to.not.equal(otp);
    });
  });
});
