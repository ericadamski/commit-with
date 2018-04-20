const { join } = require('path');
const { homedir } = require('os');

module.exports = {
  GITHUB_URL: 'https://api.github.com',
  TEMPLATE_ROOT: join(homedir(), '.co-author-commit-templates'),
  VERSION: 'v0.4.0'
};
