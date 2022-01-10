module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-transform-builtin-extend',
        {
          globals: ['Error'],
        },
      ],
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
