const nock = require('nock');
const { GITHUB_URL } = require('../constants');
const eventsFixture = require('../__fixtures__/user-events');
const getEmail = require('../get-email');
const observableToPromise = require('./helpers/observable-to-promise');

describe('.getEmail', () => {
  afterEach(nock.cleanAll);

  it('should be a function with arity 1', () => {
    // Assert
    expect(getEmail).toBeInstanceOf(Function);
    expect(getEmail).toHaveLength(1);
  });

  it('should find an email if present', () => {
    // Arrange
    nock(GITHUB_URL)
      .get('/users/ericadamski/events')
      .reply(200, eventsFixture);

    // Assert
    return observableToPromise(getEmail('ericadamski')).then(email =>
      expect(email).toBe('er.adamski@gmail.com')
    );
  });

  it('should return a template if no email is found', () => {
    // Arrange
    nock(GITHUB_URL)
      .get('/users/ericadamski/events')
      .reply(200, []);

    // Assert
    return observableToPromise(getEmail('ericadamski')).then(email =>
      expect(email).toBe('ericadamski@users.noreply.github.com')
    );
  });
});
