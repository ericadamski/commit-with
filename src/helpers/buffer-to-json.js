const { of } = require('rxjs/observable/of');
const { map, catchError } = require('rxjs/operators');

module.exports = function bufferToJson(source$) {
  return source$.pipe(
    map(buffer => JSON.parse(buffer.toString())),
    catchError(() => of({}))
  );
};
