#!/usr/bin/env node
const program = require('commander');
const { switchMap, tap } = require('rxjs/operators');

const commit = require('./src/commit');
const amend = require('./src/commit-amend');
const search = require('./src/search');

program
  .version('0.1.0')
  .name('commit-with')
  .arguments('<github-username> -- [git-args...]')
  .description(
    'Searches Github for the user and auto generates a co-authored tag for your commit message'
  )
  .parse(process.argv);

const args = program.args.slice(1);

commit(process.cwd(), { args })
  .pipe(
    switchMap(() => {
      const username = program.args[0];

      return search(username);
    }),
    switchMap(amend)
  )
  .subscribe(
    (code = 0) => process.exit(code),
    ({ message, code }) => {
      console.log(message);
      process.exit(code);
    }
  );
