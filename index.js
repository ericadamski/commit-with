#!/usr/bin/env node
const program = require('commander');
const { merge } = require('rxjs/observable/merge');
const { switchMap, partition } = require('rxjs/operators');

const { VERSION } = require('./src/constants');
const commit = require('./src/commit');
const {
  createCommitTemplate,
  getCommitTemplateFor
} = require('./src/create-commit-template');
const search = require('./src/search');

program
  .version(VERSION)
  .name('commit-with')
  .option('-a, --all', 'commit all changed files')
  .option(
    '-f, --force',
    'ignore cached commit templates, look up user again on githup'
  )
  .arguments('<github-username>')
  .description(
    'Searches Github for the user and auto generates a co-authored tag for your commit message'
  )
  .parse(process.argv);

const username = program.args[0];
const args = [program.all && '-a'].filter(v => v);
const cwd = process.cwd();

if (!username) {
  program.help();
  process.exit(1);
}

const [filepath$, noFilepath$] = getCommitTemplateFor(username).pipe(
  partition(filepath => filepath && !program.force)
);

merge(
  filepath$,
  noFilepath$.pipe(
    switchMap(filepath =>
      search(username).pipe(switchMap(createCommitTemplate))
    )
  )
)
  .pipe(switchMap(filepath => commit(cwd, { args, filepath })))
  .subscribe(
    (code = 0) => process.exit(code),
    ({ message, code }) => {
      console.log(message);
      process.exit(code);
    }
  );
