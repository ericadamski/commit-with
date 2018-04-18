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

function getTemplatePath(login) {
  return path.join(TEMPLATE_ROOT, `.${login}`);
}

function coauthor({ name, email }) {
  return dedent`
    # Commiting with commit-with 🤗
    
    Co-Authored-By: ${name} <${email}>
    
    # ${Date.now()}-${VERSION}
  `;
}

module.exports = {
  createCommitTemplate({ login, name, email }) {
    return access(TEMPLATE_ROOT).pipe(
      catchError(() => mkdir(TEMPLATE_ROOT)),
      switchMap(() => {
        const p = getTemplatePath(login);

        return writeFile(p, coauthor({ name, email })).pipe(mapTo(p));
      })
    );
  },
  getCommitTemplateFor(login) {
    const p = getTemplatePath(login);

    return access(p).pipe(map(() => p), catchError(() => of(false)));
  }
};
