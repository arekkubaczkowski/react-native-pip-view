module.exports = function (api) {
  api.cache(true);

  return {
    // NOTE: SDK 56 metro computes the babel cache key without a filename,
    // which crashes on react-native-builder-bob's getConfig() path-based
    // `overrides` ("Configuration contains string/RegExp pattern, but no
    // filename was passed to Babel"). The library source is still aliased
    // via builder-bob's metro-config and compiled by babel-preset-expo.
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'babel-plugin-react-compiler',
        {
          target: '19',
          panicThreshold: 'all_errors',
        },
      ],
      'react-native-worklets/plugin',
    ],
  };
};
