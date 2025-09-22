import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    downloadsFolder: "tests/downloads",
    setupNodeEvents() {},
    specPattern: "tests/specs/**/*.spec.js",
    supportFile: "tests/support/e2e.js",
  },
});
