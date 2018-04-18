const https = require('https');
const url = require('url');

const { merge } = require('rxjs/observable/merge');
const { fromEvent } = require('rxjs/observable/fromEvent');
const { bindCallback } = require('rxjs/observable/bindCallback');
const { switchMap } = require('rxjs/operators');

const bufferToJson = require('./buffer-to-json');

const _get = bindCallback(https.get);

module.exports = function get(uri) {
  console.log(url.parse(uri));

  // return _get({ path, headers: { 'User-Agent': 'commit-with-cli' } }).pipe(
  //   switchMap(r =>
  //     merge(fromEvent(r, 'data').pipe(bufferToJson), fromEvent(r, 'error'))
  //   )
  // );
};
