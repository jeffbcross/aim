import {Observable, Subject} from '@reactivex/rxjs';
import {Server} from 'ws';

//creates a new server socket Subject
const createRxSocket = (connection) => {
  let messages = Observable.fromEvent(connection, 'message', null);
  let messageObserver:any = {
    next(message){
      connection.send(message);
    }
  }
  return Subject.create(messages, messageObserver);
}

//creates an instance of the websocket server;
const createRxServer = (options) => {
  return new Observable(serverObserver => {
    console.info('started server...');
    let wss = new Server(options);
    wss.on('connection', connection => serverObserver.next(connection));
    return () => {
      wss.close();
    }
  });
}

const server = createRxServer({port: 8081});
const connections = server.map(createRxSocket);

let messageEvents$ = connections$.flatMap(connection => {
  return connection.map(message => ({connection, message}));
});

messageEvents$.subscribe(msg => console.log(msg))
