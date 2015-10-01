var _AnalyticsIngestError = function (message) {
  this.name = 'AnalyticsIngestError';
  this.message = message || '';

  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
};
AnalyticsManagerError.prototype = Object.create(Error.prototype);

var AnalyticsIngest = {
  /**
   * Sends the page information to the ingestion endpoint
   */
  sendEvent: function (endpoint) {

    if (typeof(endpoint) !== 'string') {
      throw new _AnalyticsIngestError('Ingest endpoint must be set!');
    }

    var cacheBuster = (new Date()).getTime();

    var url =
      endpoint +
      '?' + cacheBuster +
      '&hostname=' + window.location.hostname +
      '&pathname=' + window.location.pathname +
      '&search=' + window.location.search;

    setTimeout(function () {
      var img = new Image();
      img.src = url;
    });
  }
};

module.exports = AnalyticsIngest;
