const { Observable } = require('rxjs');
const observableToPromise = require('../../__tests__/helpers/observable-to-promise');
const bufferToJson = require('../buffer-to-json');

describe('.bufferToJson', () => {
  it('should return an Observable', () => {
    // Assert
    expect(
      bufferToJson(Observable.of(new Buffer(JSON.stringify({ key: 'value' }))))
    ).toBeInstanceOf(Observable);
  });

  it('should be an Observable of json data', () => {
    // Assert
    return observableToPromise(
      bufferToJson(Observable.of(new Buffer(JSON.stringify({ key: 'value' }))))
    ).then(data => expect(data).toBeInstanceOf(Object));
  });

  it('should be an Observable of json data, if data is invalid', () => {
    // Assert
    return observableToPromise(
      bufferToJson(Observable.of(new Buffer('a string value')))
    ).then(data => expect(data).toBeInstanceOf(Object));
  });
});
