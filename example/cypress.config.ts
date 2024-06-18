import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    devServer: {
      framework: "react",
      bundler: "vite",
    },
    viewportWidth: 1200,
    viewportHeight: 800
  },
});
