const scanner = require('sonarqube-scanner');

scanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: process.env.SONAR_TOKEN, // Use the GitHub secret for the token
    options: {
      'sonar.organization': 'abdelh17',
      'sonar.projectKey': 'abdelh17_Quolance_ui',
      'sonar.sources': 'src',
      'sonar.tests': 'cypress/e2e',
      'sonar.javascript.lcov.reportPaths': 'coverage/lcov.info',
      'sonar.exclusions': '**/node_modules/**',
      'sonar.verbose': 'true', // Enable verbose logging
    },
  },
  () => {
    console.log('SonarScanner analysis completed.');
  }
);
