const https = require('https');
const { tap, switchMap, zip, map } = require('rxjs/operators');

const { GITHUB_URL } = require('./constants');
const get = require('./helpers/get');
const getEmail = require('./get-email');

function findMatchingUser(username, users) {
  const filteredUsers = users.filter(({ login }) => login === username);

  return filteredUsers && filteredUsers.length > 0 ? filteredUsers[0] : {};
}

module.exports = function search(username) {
  return get(
    `${GITHUB_URL}/search/users?q=${username}+${encodeURIComponent(
      'in:login'
    )}&type=Users`
  ).pipe(
    switchMap(({ total_count, items }) =>
      getEmail(username).pipe(
        zip((total_count > 0 && [findMatchingUser(username, items)]) || [{}])
      )
    ),
    switchMap(
      ([email, { url }]) =>
        url
          ? get(url).pipe(map(user => ({ ...user, email })))
          : [{ name: 'Name', email }]
    )
  );
};
