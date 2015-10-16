import { Observable, Subject, BehaviorSubject } from '@reactivex/rxjs';
import { RxWebSocket } from './RxWebSocket';

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

export class TickerService {
  socket: RxWebSocket;

  // connection state is a behavior subject, so anyone that
  // subscribes to it can see the most recent value it's emitted.
  connectionState = new BehaviorSubject<ConnectionStates>(ConnectionStates.CONNECTING);

  constructor(url: string, RxWebSocketCtor: { new(url:string): RxWebSocket } = RxWebSocket) {
    let socket = this.socket = new RxWebSocketCtor(url);
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
    // now share it to make it "hot"
    // ... that way we don't create the data producer for this more than once.
    .share();
  }
}
