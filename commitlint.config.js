// sample commit message:
// CHORE: Write whatever here
// Feat: Add a new feature
// fix: resolve login bug
module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'chore',
        'style',
        'refactor',
        'ci',
        'test',
        'perf',
        'revert',
        'vercel',
      ],
    ],
    'type-case': [0],
    'type-empty': [2, 'never'],
    'scope-case': [0],
    'subject-case': [0],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [0],
    'header-max-length': [0],
  },
};