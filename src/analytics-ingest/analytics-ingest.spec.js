describe('AnalyticsIngest', function () {
  var sandbox;
  var ingest;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
    ingest = require('./analytics-ingest');
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('sendEvent', function () {

    it('should throw an error when no endpoint is provided', function () {
      var func = sandbox.spy(ingest, 'sendEvent');
      var notDefined;

      expect(function () { func(notDefined); }).to.throw('AnalyticsIngestError');
    });
  });
});
