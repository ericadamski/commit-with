const { of } = require('rxjs/observable/of');
const { map, catchError } = require('rxjs/operators');

module.exports = function bufferToJson(source$) {
  return source$.pipe(
    map(b => JSON.parse(b.toString())),
    catchError(err => of({}))
  );
};
