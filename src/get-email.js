const https = require('https');
const { map, filter, switchAll } = require('rxjs/operators');

const { GITHUB_URL } = require('./constants');
const get = require('./helpers/get');

function getPushEvents(source$) {
  return source$.pipe(
    map(events => {
      console.log(events);
      const filterdEvents = (events || []).filter(
        ({ type }) => type === 'PushEvent'
      );

      return filterdEvents.length > 0
        ? filterdEvents
        : [{ payload: { commits: [{ author: {} }] } }];
    }),
    switchAll()
  );
}

function mapToEmail(username) {
  return source$ =>
    source$.pipe(
      map(e => {
        const {
          payload: { commits }
        } = e;

        return commits.map(({ author }) => author.email);
      }),
      switchAll(),
      map(email => (email ? email : `${username}@users.noreply.github.com`))
    );
}

function findEmail(username) {
  return source$ => source$.pipe(getPushEvents, mapToEmail(username));
}

module.exports = function getEmail(username) {
  return get(`${GITHUB_URL}/users/${username}/events`).pipe(
    findEmail(username)
  );
};
