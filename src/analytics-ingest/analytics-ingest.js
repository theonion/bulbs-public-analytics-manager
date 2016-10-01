var _AnalyticsIngestError = function (message) {
  this.name = 'AnalyticsIngestError';
  this.message = message || '';

  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
};
_AnalyticsIngestError.prototype = Object.create(Error.prototype);

var eventQueue;

var AnalyticsIngest = function (options) {
  var settings = $.extend({
    debugMode: false
  }, options);

  eventQueue = [];

  if (typeof(settings.ingestUrl) !== 'string') {
    throw new _AnalyticsIngestError('Ingest endpoint must be set!');
  }

  this.endpoint = settings.ingestUrl;

  if (!settings.debugMode) {
    setInterval(this.processEventQueue, 100);
  }
};

AnalyticsIngest.prototype.processEventQueue = function () {
  var processedUrl = eventQueue.pop();

  if (processedUrl) {
    var img = new Image();
    img.src = processedUrl;
  }

  return processedUrl;
};

AnalyticsIngest.prototype.queueSize = function () {
  return eventQueue.length;
};

AnalyticsIngest.prototype.enqueueUrl = function (url) {
  eventQueue.push(url);
};

/**
* Sends the page information to the ingestion endpoint
*/
AnalyticsIngest.prototype.sendEvent = function () {
  var cacheBuster = (new Date()).getTime();

  var url =
    this.endpoint +
    '?' + cacheBuster +
    '&hostname=' + window.location.hostname +
    '&pathname=' + window.location.pathname +
    '&search=' + window.location.search;

  this.enqueueUrl(url);
};

module.exports = {
  init: function (options) {
    return new AnalyticsIngest(options);
  }
};
