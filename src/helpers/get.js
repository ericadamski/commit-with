const https = require('https');
const url = require('url');

const { merge } = require('rxjs/observable/merge');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { bindCallback } = require('rxjs/observable/bindCallback');
const { take, map, switchMap, tap } = require('rxjs/operators');

const bufferToJson = require('./buffer-to-json');

const _get = bindCallback(https.get);

module.exports = function get(uri) {
  const { hostname, path } = url.parse(uri);

  let buffer = Buffer.alloc(0);

  return _get({
    hostname,
    path,
    headers: { 'User-Agent': 'commit-with-cli' }
  }).pipe(
    tap(r =>
      fromEvent(r, 'data').subscribe(
        chunk =>
          (buffer = Buffer.concat(
            [buffer, chunk],
            buffer.length + chunk.length
          ))
      )
    ),
    switchMap(r =>
      merge(
        fromEvent(r, 'end').pipe(map(() => buffer), bufferToJson),
        fromEvent(r, 'error')
      ).pipe(take(1))
    )
  );
};
