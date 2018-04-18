const { of } = require('rxjs/observable/of');
const { map, catchError, tap } = require('rxjs/operators');

module.exports = function bufferToJson(source$) {
  return source$.pipe(
    tap(console.log),
    map(buffer => JSON.parse(buffer.toString())),
    catchError(() => of({}))
  );
};
