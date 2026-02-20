module.exports = {
  apps: [
    {
      name: 'gads-life-cms',
      script: 'npm',
      args: 'run preview -- --port 3002 --host',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
