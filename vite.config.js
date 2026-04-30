import { defineConfig } from 'vite';

export default defineConfig({
  root: "/",                   /* index.html fuera de src/ */
  publicDir: "public",
  plugins: [],
  server: { port: 1234 },
  build: {
    outDir: "dist",
  }
});