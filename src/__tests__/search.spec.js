const nock = require('nock');
const observableToPromise = require('./helpers/observable-to-promise');
const { GITHUB_URL } = require('../constants');
const search = require('../search');
const searchUserFixture = require('../__fixtures__/search-user');
const userFixture = require('../__fixtures__/user');
const userEventsFixture = require('../__fixtures__/user-events');

describe('.search', () => {
  afterEach(nock.cleanAll);

  it('should be a function with arity 1', () => {
    // Assert
    expect(search).toBeInstanceOf(Function);
    expect(search).toHaveLength(1);
  });

  it('should search github for the user', () => {
    // Arrange
    const req = nock(GITHUB_URL);

    req
      .get(
        `/search/users?q=ericadamski+${encodeURIComponent(
          'in:login'
        )}&type=Users`
      )
      .reply(200, searchUserFixture);

    req.get('/users/ericadamski/events').reply(200, userEventsFixture);

    req.get('/users/ericadamski').reply(200, userFixture);

    // Assert
    return observableToPromise(search('ericadamski')).then(result =>
      expect(JSON.stringify(result)).toBe(
        JSON.stringify(
          Object.assign(userFixture, {
            email: 'er.adamski@gmail.com'
          })
        )
      )
    );
  });

  it('should return junk if cannot find person', () => {
    // Arrange
    const req = nock(GITHUB_URL);

    req
      .get(`/search/users?q=bb+${encodeURIComponent('in:login')}&type=Users`)
      .reply(200, { total_count: 0 });

    req.get('/users/bb/events').reply(200, []);

    // Assert
    return observableToPromise(search('bb')).then(result =>
      expect(JSON.stringify(result)).toBe(
        JSON.stringify({
          name: 'Name',
          email: 'bb@users.noreply.github.com'
        })
      )
    );
  });
});
