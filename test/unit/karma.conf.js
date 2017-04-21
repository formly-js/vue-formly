var wsConfig = require('./webpack.test.config');

module.exports = function(config) {
    var settings = {
        // base path that will be used to resolve all patterns (eg. files, exclude)
      basePath: '',
      plugins: ['karma-mocha', 'karma-chai', 'karma-sinon-chai', 'karma-webpack', 'karma-sourcemap-loader', 'karma-spec-reporter', 'karma-coverage', 'karma-phantomjs-launcher'],

        browsers: ['PhantomJS'],

        reporters: ['spec', 'coverage'],

        frameworks: ['mocha', 'chai', 'sinon-chai'],

        files: ['./index.js'],

        exclude: [],

        preprocessors: {
            './index.js': ['webpack', 'sourcemap']
        },

        webpack: wsConfig,

        webpackMiddleware: {
            noInfo: true
        },

        port: 9876,

        colors: true,

        logLevel: config.LOG_INFO,

        autoWatch: false,

        singleRun: true,

        coverageReporter: {
            dir: './coverage',
            reporters: [
                { type: 'lcov', subdir: '.' },
                { type: 'text-summary' }
            ]
        }
    }

    config.set(settings);
}
