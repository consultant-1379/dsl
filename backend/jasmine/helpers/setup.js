const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

jasmine.getEnv().clearReporters(); // remove default reporter logs
jasmine.getEnv().addReporter(new SpecReporter({ // add jasmine-spec-reporter
  spec: {
    displayPending: true,
  },
}));

// if we are including integration tests, start the backend
if (process.env.TEST_TYPE === 'ALL' || process.env.TEST_TYPE === 'INTEGRATION') {
  require('../../build/app.js');
}
