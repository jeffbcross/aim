module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    files: [
      'node_modules/reflect-metadata/Reflect.js',
      'src/*_test.ts',
      'src/**/*_test.ts'
    ],
    preprocessors: {
        'src/*_test.ts': ['webpack'],
        'src/**/*_test.ts': ['webpack']
    },
    webpack: require('./webpack.config.js'),
    webpackMiddleware: {
        noInfo: true
    },
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  })
};
