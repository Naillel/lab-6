import { defineConfig } from 'vite';

export default defineConfig({
  root: "src",
  base: "/lab-6/",
  publicDir: "../public",
  plugins: [],
  server: { 
    port: 1234 
  },

  build: {
    outDir: "../dist",
    emptyOutDir: true,
  }
});