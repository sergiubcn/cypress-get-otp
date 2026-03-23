# cypress-get-otp

A Cypress custom command for generating OTP (One-Time Password) codes in your tests. This package provides a simple and reliable way to generate TOTP (Time-based One-Time Password) codes during automated testing.

## Features

- 🔐 Generate TOTP codes using secret keys
- 📱 Generate QR codes for OTP setup flows
- 🔑 Generate and validate backup codes for 2FA recovery
- 🔗 Generate otpauth:// URIs for third-party integrations
- ⚙️ Customizable options (digits, period, algorithm, etc.)
- 🧪 TypeScript support with full type definitions
- 📦 Lightweight with minimal dependencies. Based on https://github.com/hectorm/otpauth, which looks well maintained - kudos to the author and contributors.
- 🚀 Easy integration with existing Cypress tests

## Installation

```bash
npm install cypress-get-otp
```

## Setup

### 1. Import the command

Add the following import to your Cypress support file (usually `cypress/support/e2e.js`):

```javascript
import "cypress-get-otp";
```

### 2. TypeScript support (optional)

If you're using TypeScript, the package includes type definitions that will be automatically picked up by your IDE.

## Usage

### Basic Usage

```javascript
describe("Login with OTP", () => {
  it("should login with a valid OTP code", () => {
    const secret = "G5HJRA652X3NOFSE"; // Your OTP secret

    cy.getOTP(secret).then((otp) => {
      cy.visit("/login");
      cy.get('[data-cy="otp-input"]').type(otp);
      cy.get('[data-cy="login-button"]').click();
    });
  });
});
```

### Advanced Usage with Custom Options

```javascript
describe("OTP with custom settings", () => {
  it("should generate 8-digit OTP with custom period", () => {
    const secret = "G5HJRA652X3NOFSE";

    cy.getOTP(secret, {
      digits: 8, // 8-digit code instead of default 6
      period: 30, // 30-second period instead of default 30
      algorithm: "sha1", // Use SHA-1 algorithm
    }).then((otp) => {
      expect(otp).to.have.length(8);
      // Use the OTP in your test...
    });
  });
});
```

## API Reference

### `cy.getOTP(secret, options?)`

Generates a TOTP code using the provided secret and options.

**Parameters:**

- `secret` (string): The secret key for generating the OTP
- `options` (object, optional): Configuration options for the OTP generation

**Returns:**

A Cypress chainable that resolves to the generated OTP string.

---

### `cy.getOTPQRCode(secret, options?)`

Generates a QR code for OTP setup flows. Returns base64 encoded image data.

**Parameters:**

- `secret` (string): The secret key for the OTP
- `options` (object, optional): Configuration options including label and issuer

**Returns:**

A Cypress chainable that resolves to base64 encoded PNG image data.

---

### `cy.getBackupCodes(count?, options?)`

Generates backup codes for 2FA recovery scenarios.

**Parameters:**

- `count` (number, optional): Number of backup codes to generate (default: 10)
- `options` (object, optional): Configuration options for backup codes

**Returns:**

A Cypress chainable that resolves to an array of backup code strings.

---

### `cy.validateBackupCode(code, options?)`

Validates the format of a backup code.

**Parameters:**

- `code` (string): The backup code to validate
- `options` (object, optional): Validation options including digit length

**Returns:**

A Cypress chainable that resolves to a boolean indicating validity.

---

### `cy.getOTPURI(secret, options?)`

Generates an otpauth:// URI for third-party authenticator integrations.

**Parameters:**

- `secret` (string): The secret key for the OTP
- `options` (object, optional): Configuration options for the OTP

**Returns:**

A Cypress chainable that resolves to the otpauth:// URI string.

## Examples

### Testing 2FA Login Flow

```javascript
describe("Two-Factor Authentication", () => {
  it("should complete 2FA login process", () => {
    const userSecret = "G5HJRA652X3NOFSE";

    // Step 1: Login with username/password
    cy.visit("/login");
    cy.get('[data-cy="username"]').type("testuser");
    cy.get('[data-cy="password"]').type("password123");
    cy.get('[data-cy="login-button"]').click();

    // Step 2: Generate and enter OTP
    cy.getOTP(userSecret).then((otp) => {
      cy.get('[data-cy="otp-input"]').type(otp);
      cy.get('[data-cy="verify-otp"]').click();
    });

    // Step 3: Verify successful login
    cy.url().should("include", "/dashboard");
    cy.get('[data-cy="welcome-message"]').should("be.visible");
  });
});
```

### Testing OTP Setup with QR Code

```javascript
describe("OTP Setup Flow", () => {
  it("should display QR code for OTP setup", () => {
    const secret = "G5HJRA652X3NOFSE";

    // Generate QR code for user to scan
    cy.getOTPQRCode(secret, {
      label: "user@example.com",
      issuer: "MyApp",
    }).then((qrCode) => {
      // Test that QR code is displayed correctly
      cy.get('[data-cy="qr-code"]').should("have.attr", "src", qrCode);
    });

    // Test that manual entry option shows the secret
    cy.get('[data-cy="manual-secret"]').should("contain", secret);
  });
});
```

### Testing Backup Code Recovery

```javascript
describe("Backup Code Recovery", () => {
  it("should generate and validate backup codes", () => {
    // Generate backup codes for testing
    cy.getBackupCodes(5, { digits: 8 }).then((backupCodes) => {
      expect(backupCodes).to.have.length(5);

      // Test backup code validation
      cy.validateBackupCode(backupCodes[0]).then((isValid) => {
        expect(isValid).to.be.true;
      });

      // Test using backup code for login
      cy.visit("/login");
      cy.get('[data-cy="username"]').type("testuser");
      cy.get('[data-cy="password"]').type("password123");
      cy.get('[data-cy="login-button"]').click();

      // Use backup code instead of OTP
      cy.get('[data-cy="backup-code-input"]').type(backupCodes[0]);
      cy.get('[data-cy="verify-backup-code"]').click();

      cy.url().should("include", "/dashboard");
    });
  });
});
```

### Testing Third-Party Authenticator Integration

```javascript
describe("Authenticator App Integration", () => {
  it("should generate proper otpauth:// URI", () => {
    const secret = "G5HJRA652X3NOFSE";

    cy.getOTPURI(secret, {
      label: "user@example.com",
      issuer: "MyApp",
      digits: 6,
      period: 30,
    }).then((uri) => {
      // Test URI format
      expect(uri).to.startWith("otpauth://totp/");
      expect(uri).to.include("user@example.com");
      expect(uri).to.include("MyApp");
      expect(uri).to.include("digits=6");
      expect(uri).to.include("period=30");

      // Test that URI can be used to generate same OTP
      cy.getOTP(secret).then((otp) => {
        // Verify OTP from URI matches direct generation
        // (This would typically be done by the authenticator app)
        expect(otp).to.be.a("string");
        expect(otp).to.have.length(6);
      });
    });
  });
});
```

### Testing OTP Expiration

```javascript
describe("OTP Expiration", () => {
  it("should handle OTP expiration correctly", () => {
    const secret = "G5HJRA652X3NOFSE";

    // Generate first OTP
    cy.getOTP(secret, { period: 3 }).then((otp1) => {
      cy.get('[data-cy="otp-input"]').type(otp1);
    });

    // Wait for OTP to expire
    cy.wait(4000);

    // Generate new OTP (should be different)
    cy.getOTP(secret, { period: 3 }).then((otp2) => {
      expect(otp2).to.not.equal(otp1);
    });
  });
});
```

## Development

### Running Tests

```bash
# Open Cypress Test Runner
npm run cy:open

# Run tests headlessly
npm run cy:run
```

### Code Formatting

```bash
npm run style
```

## Dependencies

- [cypress](https://www.cypress.io/) - End-to-end testing framework
- [otpauth](https://github.com/hectorm/otpauth) - OTP generation library.

## License

MIT

## Author

Sergiu Bacanu

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
