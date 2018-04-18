const https = require('https');

const { merge } = require('rxjs/observable/merge');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { bindCallback } = require('rxjs/observable/bindCallback');
const { switchMap } = require('rxjs/operators');

const bufferToJson = require('./buffer-to-json');

const _get = bindCallback(https.get);

module.exports = function get(path) {
  return _get({ path, headers: { 'User-Agent': 'commit-with-cli' } }).pipe(
    switchMap(r =>
      merge(fromEvent(r, 'data').pipe(bufferToJson), fromEvent(r, 'error'))
    )
  );
};
