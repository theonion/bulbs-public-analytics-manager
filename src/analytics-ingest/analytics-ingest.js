module.exports = {
  /**
   * Sends the page information to the ingestion endpoint
   */
  sendEvent: function (endpoint) {
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
