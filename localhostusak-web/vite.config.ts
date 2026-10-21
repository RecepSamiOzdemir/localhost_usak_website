import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy'sinin CMS adresi. CMS 3000'de değilse (port doluysa) .env.development.local'da
// CMS_PROXY_TARGET ile değiştirilir. VITE_ öneki yok: tarayıcı paketine girmez, yalnızca dev sunucusu okur.
const DEFAULT_CMS_PROXY_TARGET = 'http://localhost:3000';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Üçüncü parametre '' → VITE_ önekli olmayan değişkenler de yüklenir; ortamda verilen değer .env'i ezer
  const env = loadEnv(mode, process.cwd(), '');
  const cmsProxyTarget = env.CMS_PROXY_TARGET || DEFAULT_CMS_PROXY_TARGET;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: cmsProxyTarget,
          changeOrigin: true,
        },
        '/media': {
          target: cmsProxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
