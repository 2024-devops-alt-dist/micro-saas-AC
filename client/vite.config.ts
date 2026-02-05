import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    optimizeDeps: {
      include: ['recharts'],
    },
    ssr: {
      noExternal: ['recharts'],
    },
    server: {
      host: '0.0.0.0',
      port: 3005,
      strictPort: true,
      watch: {
        usePolling: true,
      },
      hmr: {
        clientPort: 3005,
      },
      proxy: {
        '/n8n': {
          target: env.VITE_N8N_PROXY_TARGET || 'http://localhost:5678',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/n8n/, ''),
        },
      },
    },
  };
});