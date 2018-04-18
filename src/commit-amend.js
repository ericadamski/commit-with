const process = require('child_process');
const dedent = require('dedent');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { merge } = require('rxjs/observable/merge');
const { map, tap, filter } = require('rxjs/operators');

function coauthor({ name, email }) {
  return dedent`

    Co-Authored-By: ${name} <${email}>
  `;
}

module.exports = function amend(cwd, hash, user) {
  let called = false;
  const args = ['commit', '--squash', hash, '-m', coauthor(user)];

  console.log(args);

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
