module.exports = {
  apps: [
    {
      name: 'atecc-teletrabalho',
      script: 'server/index.ts',
      interpreter: './node_modules/.bin/tsx',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
