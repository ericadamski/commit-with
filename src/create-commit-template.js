const fs = require('fs');
const path = require('path');
const dedent = require('dedent');
const { of } = require('rxjs/observable/of');
const { bindNodeCallback } = require('rxjs/observable/bindNodeCallback');
const { catchError, switchMap, mapTo, map } = require('rxjs/operators');

const { TEMPLATE_ROOT, VERSION } = require('./constants');

const access = bindNodeCallback(fs.access);
const mkdir = bindNodeCallback(fs.mkdir);
const writeFile = bindNodeCallback(fs.writeFile);

function getTemplatePath(logins) {
  return path.join(TEMPLATE_ROOT, `.${logins.join('-')}`);
}

function coauthor(users) {
  return dedent`
    # Commiting with commit-with 🤗
    
    ${users
      .map(({ name, email }) => `Co-Authored-By: ${name} <${email}>`)
      .join('\n')}
    
    # ${Date.now()}-${VERSION}
  `;
}

module.exports = {
  createCommitTemplate(users) {
    console.log({ users });

    return access(TEMPLATE_ROOT).pipe(
      catchError(() => mkdir(TEMPLATE_ROOT)),
      switchMap(() => {
        const logins = Object.keys(users);
        const p = getTemplatePath(logins);

        return writeFile(p, coauthor(Object.values(users))).pipe(mapTo(p));
      })
    );
  },
  getCommitTemplateFor(logins) {
    const p = getTemplatePath(logins);

    return access(p).pipe(map(() => p), catchError(() => of(false)));
  }
};
