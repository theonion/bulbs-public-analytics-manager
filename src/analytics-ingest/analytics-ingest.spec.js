describe('AnalyticsIngest', function () {
  var sandbox;
  var ingest;

  beforeEach(function () {
    sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
    sandbox.restore();
  });

  context('with endpoint', function() {
    beforeEach(function() {
      var Ingest = require('./analytics-ingest');
      ingest = Ingest.init({ debugMode: true, ingestUrl: 'http://ingest.onion.com/ingest.gif' });
    });

    describe('#processFirstEvent', function() {
      it('processes the first item in the queue if present', function () {
        ingest.enqueueUrl('http://ingest.onion.com/ingest.gif');
        var processedItem = ingest.processFirstEvent();
        expect(processedItem).to.equal('http://ingest.onion.com/ingest.gif');
      });

      it('does nothing if no items in queue', function() {
        var processedItem = ingest.processFirstEvent();
        expect(processedItem).to.be.undefined;
      });
    });

    describe('#enqueueUrl', function () {
      it('enqueues a url', function() {
        ingest.enqueueUrl('http://ingest.onion.com/ingest.gif');
        expect(ingest.queueSize()).to.eql(1);
      });
    });

    describe('#sendEvent', function () {
      it('should enqueue an event', function() {
        sandbox.stub(ingest, 'enqueueUrl');
        ingest.sendEvent('http://ingest.onion.com/ingest.gif');
        expect(ingest.enqueueUrl.called).to.be.true;
      });
    });
  });

  context('without endpoint', function() {
    var Ingest;

    beforeEach(function() {
      Ingest = require('./analytics-ingest');
    });

    it('should throw an error when no endpoint is provided', function () {
        expect(Ingest.init).to.throw('AnalyticsIngestError');
      });
  });
});
