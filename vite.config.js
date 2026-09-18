import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    watch: {
      // Windows can exclusively lock generated recordings and RAR archives.
      // These files and the Python environment are not application sources.
      ignored: ['**/entrega/**', '**/artifacts/**', '**/.venv/**'],
    },
  },
});
