const process = require('child_process');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { merge } = require('rxjs/observable/merge');
const { map, tap, filter } = require('rxjs/operators');

function getHash(buffer) {
  return buffer
    .toString()
    .split('\n')[0]
    .split(' ')[1];
}

module.exports = function getCommitHash(cwd) {
  let called = false;
  let buffer = Buffer.alloc(0);
  const args = ['log', '-n', '1'];

  const child = process.spawn('git', args, { cwd });

  fromEvent(child.stdout, 'data').subscribe(
    chunk =>
      (buffer = Buffer.concat([buffer, chunk], buffer.length + chunk.length))
  );

  return merge(
    fromEvent(child, 'exit').pipe(
      map((code, signal) => {
        if (code)
          throw Object.assign(new Error(`git exited with error code ${code}`), {
            code,
            signal
          });

        return getHash(buffer);
      })
    ),
    fromEvent(child, 'error').pipe(
      map(err => {
        throw new Error(err);
      })
    )
  ).pipe(filter(() => !called), tap(() => (called = true)));
};
