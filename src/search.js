const https = require('https');
const { switchMap, zip, map, tap } = require('rxjs/operators');

const { GITHUB_URL } = require('./constants');
const get = require('./helpers/get');
const getEmail = require('./get-email');

module.exports = function search(username) {
  return get(
    `${GITHUB_URL}/search/users?q=${username}+${encodeURIComponent(
      'in:login'
    )}&type=Users`
  ).pipe(
    tap(console.log),
    switchMap(({ total_count, items }) =>
      getEmail(username).pipe(zip((total_count > 0 && [items[0]]) || [{}]))
    ),
    switchMap(
      ([email, { url }]) =>
        url
          ? get(url).pipe(map(user => ({ ...user, email })))
          : [{ name: 'Name', email }]
    )
  );
};
