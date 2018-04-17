const process = require('child_process');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { merge } = require('rxjs/observable/merge');
const { map, tap, filter } = require('rxjs/operators');

module.exports = function commit(cwd, options) {
  let called = false;
  const args = ['commit', ...(options.args || [])];

  const child = process.spawn('git', args, { cwd, stdio: 'inherit' });

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
