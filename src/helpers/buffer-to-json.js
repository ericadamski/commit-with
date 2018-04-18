const { of } = require('rxjs/observable/of');
const { map, catchError, tap } = require('rxjs/operators');

module.exports = function bufferToJson(source$) {
  return source$.pipe(
    map(b => JSON.parse(b.toString())),
    tap(console.log),
    catchError(err => (console.log(err), of({})))
  );
};
