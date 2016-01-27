var Ingest = require('./analytics-ingest/analytics-ingest');

var _AnalyticsManagerError = function (message) {
  this.name = 'AnalyticsManagerError';
  this.message = message || '';

  var error = new Error(this.message);
  error.name = this.name;
  this.stack = error.stack;
};
_AnalyticsManagerError.prototype = Object.create(Error.prototype);

var AnalyticsManager = {

  init: function(options) {
    this._settings = $.extend({
      site: '',
      ingestUrl: '',
      searchQueryParam: 'q',
    }, options);

    if (!this._settings.site) {
      throw new _AnalyticsManagerError('Site name must be specified!');
    }

    this.trackedPaths = [];
    var body = document.getElementsByTagName('body');
    body[0].addEventListener('click', this.trackClick);
  },

  getWindowLocation: function () {
    return window.location;
  },

  trackClick: function(event) {
    var trackedElement = $(event.target).closest('[data-track-category]');
    var category = trackedElement.data('track-category');

    if (!category) {
      return;
    } else {
      if (AnalyticsManager.debugMode()) {
        event.preventDefault();
      }
      var trackedEvent = AnalyticsManager.trackedEvent($(event.target));
      AnalyticsManager.sendEvent(trackedEvent);
    }
  },

  debugMode: function() {
    return window.analyticsTest || false;
  },

  dataAttribute: function(element, dataAttrKey) {
    return element.data(dataAttrKey) || element.closest('[data-' + dataAttrKey + ']').data(dataAttrKey);
  },

  trackedEvent: function(trackedElement) {
    return {
      eventCategory: AnalyticsManager.dataAttribute(trackedElement, 'track-category'),
      eventAction: AnalyticsManager.dataAttribute(trackedElement, 'track-action'),
      eventLabel: AnalyticsManager.dataAttribute(trackedElement, 'track-label')
    };
  },

  comscoreBeacon: function() {
    if (window.COMSCORE) {
      COMSCORE.beacon({ c1: 2, c2: 6036328, c3: "", c4: "", c5: "", c6: "", c15: "" });
    } else {
      console.warn('COMSCORE not available');
    }
  },

  sendComscorePixel: function(freshPage, title) {
    if(freshPage) {
      this.comscoreBeacon();
    } else {
      $.get("/t/pageview_candidate.xml?title=" + encodeURIComponent( title ) + "&rand=" + Math.round(Math.random() * 10000000));
      this.comscoreBeacon();
    }
  },

  sendQuantcastPixel: function(freshPage) {
    if (!freshPage) {
      if (window._qevents) {
        _qevents.push({ qacct:"p-39FYaAGOYli_-", 'event': "refresh" });
      } else {
        console.warn('_qevents not available');
      }
    }
  },

  sendChartbeatEvent: function(title) {
    var path = this.getWindowLocation().pathname;
    if (window.pSUPERFLY) {
      window.pSUPERFLY.virtualPage(path, title);
    } else {
      console.warn('pSUPERFLY not available');
    }
  },

  getParameterByName: function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(this.getWindowLocation().search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  },

  getNodeHash: function(hash) {
    if (hash) {
      var re = RegExp('#\[A-Za-z0-9-]+');
      var results = hash.match(re);
      if (results && hash.search(re) === 0) {
        return results[0];
      }
    }
  },

  pathInfo: function () {
    var pathInfo;
    var windowLocation = this.getWindowLocation();
    var path = windowLocation.pathname;
    var hash = this.getNodeHash(windowLocation.hash);
    if (hash) {
      path += hash;
    }
    var searchQuery = this.getParameterByName(this._settings.searchQueryParam);
    if (searchQuery.length) {
      pathInfo = path + '?' + this._settings.searchQueryParam + '=' + searchQuery;
    } else {
      pathInfo = path;
    }
    return pathInfo;
  },

  trackPageView: function(freshPage, optionalTitle) {
    var path = this.pathInfo();
    if (this.trackedPaths.indexOf(path) < 0) {
      ga('send', 'pageview', path);
      ga('adTracker.send', 'pageview', this._settings.site + path);

      this.sendQuantcastPixel(freshPage);
      this.sendComscorePixel(freshPage, optionalTitle);

      Ingest.sendEvent(this._settings.ingestUrl);

      if (!freshPage) {
        this.sendChartbeatEvent(optionalTitle);
      }
      this.trackedPaths.push(path);
    }
  },

  sendEvent: function(trackedEvent) {
    if ((typeof(trackedEvent.eventCategory) === 'undefined') ||
      (typeof(trackedEvent.eventAction) === 'undefined') ||
      (typeof(trackedEvent.eventLabel) === 'undefined')) {
      return;
    }

    if (AnalyticsManager.debugMode()) {
      console.log(trackedEvent);
    } else {
      ga('send', 'event', trackedEvent);
    }
  }
};

module.exports = AnalyticsManager;
