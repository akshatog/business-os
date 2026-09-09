import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: false,
    env: {
      JWT_SECRET: "test-secret-for-vitest-minimum-32-chars",
    },
  },
});
