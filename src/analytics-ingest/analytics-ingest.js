module.exports = {

  /**
   * Initializes the object with an endpoint base name.
   *
   * @param endpoint: an endpoint string to base the image request
   */
  init: function (endpoint) {
    this.endpoint = endpoint;
  },

  /**
   * Sends the page information to the ingestion endpoint
   */
  sendEvent: function () {
    var cacheBuster = (new Date()).getTime();

    var url =
      this.endpoint +
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
