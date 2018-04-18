#!/usr/bin/env node
const program = require('commander');
const { switchMap, tap, zip } = require('rxjs/operators');

const commit = require('./src/commit');
const amend = require('./src/commit-amend');
const getCommitHash = require('./src/get-commit-hash');
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
const cwd = process.cwd();

commit(cwd, { args })
  .pipe(
    switchMap(() => search(program.args[0]).pipe(zip(getCommitHash(cwd)))),
    tap(console.log),
    switchMap(([user, hash]) => amend(cwd, hash, user))
  )
  .subscribe(
    (code = 0) => process.exit(code),
    ({ message, code }) => {
      console.log(message);
      process.exit(code);
    }
  );
