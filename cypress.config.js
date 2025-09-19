import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents() {},
    specPattern: "tests/specs/**/*.spec.js",
    supportFile: "tests/support/e2e.js",
  },
});
