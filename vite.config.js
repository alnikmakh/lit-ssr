import { defineConfig } from 'vite';
// Remove path import if no longer needed by alias
// import path from 'node:path';

// https://vitejs.dev/config/
export default defineConfig({
  // Remove optimizeDeps
  /*
  optimizeDeps: {
    include: [
      'lit',
      'lit-html',
      '@lit/reactive-element'
    ]
  },
  */
  resolve: {
    // Remove the alias configuration
    /*
    alias: {
      // Ensure consistent resolution for Lit core packages
      'lit': path.resolve(__dirname, 'node_modules/lit'),
      'lit-html': path.resolve(__dirname, 'node_modules/lit-html'),
      'lit-element': path.resolve(__dirname, 'node_modules/lit-element'),
      '@lit/reactive-element': path.resolve(__dirname, 'node_modules/@lit/reactive-element'),
    }
    */
    // Remove dedupe array
    /*
    dedupe: [
      'lit',
      'lit-html',
      '@lit/reactive-element' // lit-element is part of this/lit
    ]
    */
  },
  ssr: {
    // Reintroduce ssr.noExternal for core Lit, keep ssr external
    noExternal: [
      'lit',
      '@lit/reactive-element',
      'lit-html'
    ],
    // Keep @lit-labs/ssr external
    external: [
      '@lit-labs/ssr'
    ],
    // Add other SSR options if needed, e.g., external: [...] for node built-ins
  },
  build: {
    // Generate SSR manifest for production builds (optional but recommended)
    ssrManifest: true,
  }
}); 