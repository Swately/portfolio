/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base = GitHub Pages project path, matching climx's convention. TOUCHPOINT:
// revisit if this ends up deployed at the swately.github.io root instead.
export default defineConfig({
  base: '/portfolio/',
  server: { port: 5174 }, // climx-dev already owns 5173 (see .claude/launch.json)
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**'],
      exclude: ['src/main.tsx', 'src/test/**'],
      // No hard threshold yet, unlike climx's data-layer gate: there is no
      // data/logic layer here worth gating on. Revisit if one appears.
    },
  },
});

// Made with my soul - Swately <3
