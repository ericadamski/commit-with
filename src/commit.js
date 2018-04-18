const process = require('child_process');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { merge } = require('rxjs/observable/merge');
const { map, tap, filter } = require('rxjs/operators');

module.exports = function commit(cwd, { args = [], filepath }) {
  let called = false;

  const child = process.spawn('git', ['commit', ...args, '-t', filepath], {
    cwd,
    stdio: 'inherit'
  });

  return merge(
    fromEvent(child, 'exit').pipe(
      map((code, signal) => {
        if (code)
          throw Object.assign(new Error(`git exited with error code ${code}`), {
            code,
            signal
          });
      })
    ),
    fromEvent(child, 'error').pipe(
      map(err => {
        throw new Error(err);
      })
    )
  ).pipe(filter(() => !called), tap(() => (called = true)));
};
