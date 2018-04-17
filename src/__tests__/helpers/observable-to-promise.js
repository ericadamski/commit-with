/* istanbul ignore */
module.exports = function observableToPromise(source$) {
  return new Promise((resolve, reject) => {
    source$.subscribe(resolve, reject);
  });
};
