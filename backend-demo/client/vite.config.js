import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyTarget = env.VITE_PROXY_TARGET || 'https://127.0.0.1:34430';

  return {
    plugins: [vue()],
    server: {
      host: '0.0.0.0',
      port: 5173,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
        '/health': {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id.includes('node_modules')) {
              return undefined;
            }

            if (id.includes('echarts')) {
              return 'vendor-echarts';
            }

            if (id.includes('element-plus') || id.includes('@element-plus')) {
              return 'vendor-element-plus';
            }

            if (id.includes('vue')) {
              return 'vendor-vue';
            }

            return 'vendor-misc';
          },
        },
      },
    },
  };
});
