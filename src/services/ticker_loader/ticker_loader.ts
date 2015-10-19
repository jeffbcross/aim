import {Injectable} from 'angular2/angular2';
import {Http,Response} from 'angular2/http';
import {Observable} from '@reactivex/rxjs';
import {TICKER_SEARCH_URL} from '../../config';

@Injectable()
/**
 * This service is a thin wrapper around Http, used to fetch a
 * list of ticker suggestions, given a search string.
 *
 * The service will automatically unwrap the response and return
 * an array of ticker objects.
 *
 * If the request fails once, the service will indiscriminately
 * retry the request with the same value.
 */
export class TickerLoader {
  constructor(private _http:Http) {}

  load(val:string):Observable<any[]> {
    return this._http
      .request(`http://localhost:3000/stocks?symbol=${val}`)
      .retry(2)
      .map((res:Response) => <any[]>res.json());
  }
}
