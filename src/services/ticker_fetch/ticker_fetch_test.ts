import {Injector, provide} from 'angular2/angular2';
import {
  BaseResponseOptions,
  HTTP_BINDINGS,
  Http,
  MockBackend,
  MockConnection,
  Response,
  ResponseTypes
} from 'angular2/http';
import {TickerFetch} from './ticker_fetch';
import {Observable} from '@reactivex/rxjs';

describe('TickerFetch', () => {
  var backend, baseResponseOptions, connection, injector, http, tickerFetch;
  beforeEach(() => {
    injector = Injector.resolveAndCreate([
      HTTP_BINDINGS,
      MockBackend,
      BaseResponseOptions,
      provide(Http, {
        useFactory: (backend, baseResponseOptions) => {
          return new Http(backend, baseResponseOptions);
        },
        deps: [MockBackend, BaseResponseOptions]
      }),
      TickerFetch
    ]);
    backend = injector.get(MockBackend);
    baseResponseOptions = injector.get(BaseResponseOptions);
    http = injector.get(Http);
    tickerFetch = injector.get(TickerFetch);

    backend.connections.subscribe((c:MockConnection) => {
      var symbol:string[] =/.*stocks\?symbol=(.*)/.exec(c.request.url);
      switch(symbol[1]) {
        case 'a':
          c.mockRespond(new Response(baseResponseOptions.merge({
            body: [{
              "company_name":"Agilent Technologies, Inc. Common Stock","symbol":"A"
            }]
          })))
          break;
        default:
          connection = c;
      }
    });
  });


  it('should fetch and parse ticker suggestions', (done) => {
    tickerFetch.fetch('a').subscribe(val => {
      expect(val[0].symbol).toBe('A');
      done();
    });
  });

  xit('should retry if the request fails the first time', (done) => {
    // Test currently fails due to https://github.com/angular/angular/issues/4472
    tickerFetch.fetch('a404').subscribe(done);
    connection.mockError('server failed');
    connection.mockRespond(new Response(baseResponseOptions.merge({
      body: [{
        "company_name":"Agilent Technologies, Inc. Common Stock","symbol":"A"
      }]
    })));
  });
});
