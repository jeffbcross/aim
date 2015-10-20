import {Inject, Injectable} from 'angular2/angular2';
import { Observable, Subject, BehaviorSubject } from '@reactivex/rxjs';
import { RxWebSocket } from './RxWebSocket';
import { SOCKET_URL } from '../config';

export enum ConnectionStates {
  CONNECTING,
  CONNECTED,
  CLOSED,
  RETRYING
}

export interface TickerMessage {
  symbol: string,
  price: number,
  timestamp: number
}

@Injectable()
export class TickerService {
  // connection state is a behavior subject, so anyone that
  // subscribes to it can see the most recent value it's emitted.
  connectionState = new BehaviorSubject<ConnectionStates>(ConnectionStates.CONNECTING);

  constructor(@Inject(SOCKET_URL) url: string, public socket:RxWebSocket) {
    const connectionState = this.connectionState;

    // subscribe to events from our RxWebSocket to update connection status
    socket.didOpen = () => {
      connectionState.next(ConnectionStates.CONNECTED);
    };

    socket.willOpen = () => {
      connectionState.next(ConnectionStates.CONNECTING);
    }

    socket.didClose = () => {
      connectionState.next(ConnectionStates.CLOSED);
    }
  }

  getTicker(symbol: string): Observable<TickerMessage> {
    const socket = this.socket;

    // create a custom observable to return by wrapping
    // our subscription to the socket.
    return Observable.create(subscriber => {
      // when we subscribe to this observable...

      // first subscribe to the socket, filtering out only the
      // messages we care about
      const msgSub = socket.out
        .filter(d => d.symbol === symbol)
        .subscribe(subscriber);

      // now send a message over the socket to tell the server
      // we want to subscribe to a particular stream of data
      socket.send({ symbol, type: 'sub' });

      // return an unsubscription function that, when you unsubscribe...
      return () => {
        console.log('unsub');
        // ... sends a message to the server to tell it to stop sending
        // our data for this observable.
        socket.send({ symbol, type: 'unsub' });
        // ... and then unsubscribe from the socket
        // FUN: if this is the last thing subscribed to the socket, the socket will close!
        msgSub.unsubscribe();
      };
    })
    // if this fails, let's retry. The retryWhen operator
    // gives us a stream of errors that we can transform
    // into an observable that notifies when we should retry the source
    .retryWhen(errors => errors.switchMap(err => {
      // update the connection state to let it know we're retrying
      this.connectionState.next(ConnectionStates.RETRYING);

      if(navigator.onLine) {
        // if we have a network connection, try again in 3 seconds
        return Observable.timer(3000);
      } else {
        // if we're offline, so wait for an online event.
        return Observable.fromEvent(window, 'online').take(1);
      }
    }))
    // now share it to make it "hot"
    // ... that way we don't create the data producer for this more than once.
    .share();
  }
}

interface Tick {
  price: number;
  symbol: string;
  timestamp: number;
}

export class Ticker {
  prices: Observable<string>;

  recentTicks: Observable<Tick[]>;

  maxRecentTicks = 41;

  constructor(public symbol: string, public ticks: Observable<Tick>) {
    // take each tick we're getting and scan it into an
    // observable of arrays, where each array is a list of
    // accumulated values
    this.recentTicks = this.ticks.scan((acc, tick) => {
      let result = acc.concat([tick]);
      while(result.length > this.maxRecentTicks) {
        result.shift();
      }
      return result;
    }, []);
  }
}