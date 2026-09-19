// ==============================================================================
// localhostusak — PM2 Production Process Konfigürasyonu
// Çalıştırma: pm2 start deploy/ecosystem.config.cjs
// ==============================================================================

module.exports = {
  apps: [
    {
      name: 'localhostusak-cms',
      cwd: '/var/www/localhostusak/localhostusak-cms',
      script: 'npm',
      args: 'start',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        NEXT_TELEMETRY_DISABLED: '1',
      },
      error_file: '/var/log/pm2/localhostusak-cms-err.log',
      out_file: '/var/log/pm2/localhostusak-cms-out.log',
      time: true,
    },
  ],
};
