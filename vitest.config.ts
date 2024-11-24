import solidPlugin from "vite-plugin-solid"
import { defineConfig } from "vitest/config"
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  plugins: [solidPlugin()],
  resolve: {
    conditions: ["development", "browser"],
  },

})
