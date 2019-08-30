/* eslint-disable func-names */
module.exports = function(api) {
  const babelEnv = api.env();
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
        corejs: '3.0.0',
        useBuiltIns: 'usage',
      },
    ],
    '@babel/preset-react',
  ];
  const plugins = [
    '@babel/plugin-proposal-optional-chaining',
    '@babel/transform-react-constant-elements',
    'transform-react-pure-class-to-function',
    '@babel/plugin-transform-runtime',
    'react-hot-loader/babel',
    'console-source',
    'lodash',
    'react-directive',

    // Stage 2 https://github.com/babel/babel/tree/master/packages/babel-preset-stage-2
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-function-sent',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-numeric-separator',
    '@babel/plugin-proposal-throw-expressions',

    // Stage 3
    '@babel/plugin-syntax-dynamic-import',
    '@babel/plugin-syntax-import-meta',
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    '@babel/plugin-proposal-json-strings',
  ];

  if (babelEnv === 'production') {
    plugins.push(['@babel/plugin-transform-react-inline-elements']);
    plugins.push(['transform-react-remove-prop-types']);
    plugins.push(['babel-plugin-groundskeeper-willie']);
  }

  return {
    presets,
    plugins,
  };
};
