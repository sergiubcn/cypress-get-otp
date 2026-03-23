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

  // New Phase 1 tests
  describe("QR Code Generation", () => {
    it("should generate a QR code for OTP setup", () => {
      cy.getOTPQRCode("G5HJRA652X3NOFSE").then((qrCode) => {
        expect(qrCode).to.be.a("string");
        expect(qrCode).to.contain("data:image/png;base64,");
      });
    });

    it("should generate a QR code with custom options", () => {
      cy.getOTPQRCode("G5HJRA652X3NOFSE", {
        label: "Test Account",
        issuer: "Test App",
      }).then((qrCode) => {
        expect(qrCode).to.be.a("string");
        expect(qrCode).to.contain("data:image/png;base64,");
      });
    });
  });

  describe("Backup Codes", () => {
    it("should generate default number of backup codes", () => {
      cy.getBackupCodes().then((codes) => {
        expect(codes).to.be.an("array");
        expect(codes).to.have.length(10);
        codes.forEach((code) => {
          expect(code).to.be.a("string");
          expect(code).to.have.length(8);
          expect(/^\d+$/.test(code)).to.be.true;
        });
      });
    });

    it("should generate custom number of backup codes", () => {
      cy.getBackupCodes(5).then((codes) => {
        expect(codes).to.be.an("array");
        expect(codes).to.have.length(5);
      });
    });

    it("should generate backup codes with custom digit length", () => {
      cy.getBackupCodes(3, { digits: 6 }).then((codes) => {
        expect(codes).to.be.an("array");
        expect(codes).to.have.length(3);
        codes.forEach((code) => {
          expect(code).to.have.length(6);
        });
      });
    });

    it("should validate correct backup code format", () => {
      cy.validateBackupCode("12345678").then((isValid) => {
        expect(isValid).to.be.true;
      });
    });

    it("should validate backup code with custom digits", () => {
      cy.validateBackupCode("123456", { digits: 6 }).then((isValid) => {
        expect(isValid).to.be.true;
      });
    });

    it("should reject invalid backup code format", () => {
      cy.validateBackupCode("abc12345").then((isValid) => {
        expect(isValid).to.be.false;
      });
    });

    it("should reject backup code with wrong length", () => {
      cy.validateBackupCode("1234567").then((isValid) => {
        expect(isValid).to.be.false;
      });
    });
  });

  describe("OTP URI Generation", () => {
    it("should generate otpauth:// URI", () => {
      cy.getOTPURI("G5HJRA652X3NOFSE").then((uri) => {
        expect(uri).to.be.a("string");
        expect(uri).to.contain("otpauth://totp/");
        expect(uri).to.include("G5HJRA652X3NOFSE");
      });
    });

    it("should generate otpauth:// URI with custom options", () => {
      cy.getOTPURI("G5HJRA652X3NOFSE", {
        label: "Test Account",
        issuer: "Test App",
        digits: 8,
      }).then((uri) => {
        expect(uri).to.be.a("string");
        expect(uri).to.include(encodeURIComponent("Test Account"));
        expect(uri).to.include(encodeURIComponent("Test App"));
        expect(uri).to.include("digits=8");
      });
    });
  });
});
