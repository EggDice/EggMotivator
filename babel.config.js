module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@core': './core',
            '@app': './app',
            '@notification': './notification',
            '@schedule': './schedule',
          },
        },
      ],
    ],
  };
};
