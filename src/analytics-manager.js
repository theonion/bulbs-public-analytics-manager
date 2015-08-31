var AnalyticsManager = {

  init: function() {
    this.trackedPaths = [];
    var body = document.getElementsByTagName('body');
    body[0].addEventListener('click', this.trackClick);
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
    COMSCORE.beacon({ c1: 2, c2: 6036328, c3: "", c4: "", c5: "", c6: "", c15: "" });
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
      _qevents.push({ qacct:"p-39FYaAGOYli_-", 'event': "refresh" });
    }
  },

  sendChartbeatEvent: function(title) {
    var path = window.location.pathname;
    if (window.pSUPERFLY) {
      window.pSUPERFLY.virtualPage(path, title);
    } else {
      console.warn('pSUPERFLY not available');
    }
  },

  trackPageView: function(freshPage, optionalTitle) {
    var path = window.location.pathname;
    if (this.trackedPaths.indexOf(path) < 0) {
      ga('send', 'pageview', path);
      ga('adTracker.send', 'pageview', 'theonion' + path);
      this.sendQuantcastPixel(freshPage);
      this.sendComscorePixel(freshPage, optionalTitle);
      Ingest.sendEvent();
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
