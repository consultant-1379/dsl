// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

module.exports = function(config) {
    process.env.CHROME_BIN = require('puppeteer').executablePath();
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            require('karma-jasmine'),
            require('karma-firefox-launcher'),
            require('karma-jasmine-html-reporter'),
            require('karma-coverage-istanbul-reporter'),
            require('@angular-devkit/build-angular/plugins/karma')
        ],
        client: {
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        coverageIstanbulReporter: {
            dir: require('path').join(__dirname, '../coverage'),
            reports: ['html', 'lcovonly'],
            fixWebpackSourcePaths: true
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DEBUG,
        browsers: ['FirefoxHeadless'],
        browserDisconnectTimeout: 3600000,
        captureTimeout: 3600000,
        processKillTimeout: 2000,
        browserNoActivityTimeout: 3600000,
        browserSocketTimeout: 300000,
        autoWatch: true,
        customLaunchers: {
            FirefoxHeadless: {
                base: 'Firefox',
                flags: [
                  '-headless',
                ]
            }
        },
        //browsers: ['FirefoxHeadless'],
        singleRun: false
    });
};
